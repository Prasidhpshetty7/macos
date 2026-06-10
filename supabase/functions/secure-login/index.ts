import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: Store failed attempts in memory (simple version)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, password } = await req.json()

    // Input validation
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const attemptData = loginAttempts.get(clientIp)

    if (attemptData) {
      // Reset counter if last attempt was > 1 minute ago
      if (now - attemptData.lastAttempt > 60000) {
        loginAttempts.delete(clientIp)
      } else if (attemptData.count >= 5) {
        return new Response(
          JSON.stringify({ error: 'Too many login attempts. Please wait 1 minute.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Sanitize username to prevent SQL injection (Supabase does this automatically, but extra safety)
    const sanitizedUsername = username.trim().substring(0, 100)

    // Query user with parameterized query (safe from SQL injection)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password_hash, display_name')
      .eq('username', sanitizedUsername)
      .single()

    if (error || !user) {
      // Record failed attempt
      const attempts = loginAttempts.get(clientIp)
      loginAttempts.set(clientIp, {
        count: (attempts?.count || 0) + 1,
        lastAttempt: now
      })

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      // Record failed attempt
      const attempts = loginAttempts.get(clientIp)
      loginAttempts.set(clientIp, {
        count: (attempts?.count || 0) + 1,
        lastAttempt: now
      })

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Success! Clear failed attempts
    loginAttempts.delete(clientIp)

    // Return user data (WITHOUT password hash!)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

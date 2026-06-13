# 🔧 Fix CrimeChat 404 Error - Step by Step

## ❌ Current Problem:
Login fails with 404 error when calling Edge Function:
```
Failed to load resource: the server responded with a status of 404 ()
URL: https://jmzyuophywnbshmsqvox.supabase.co/functions/v1/secure-login
```

This means the Edge Function `secure-login` doesn't exist or has a different name.

---

## ✅ **SOLUTION - Check and Create Edge Function**

Follow these steps **EXACTLY**:

---

### **STEP 1: Go to Supabase Dashboard**

Open this link:
👉 https://supabase.com/dashboard/project/jmzyuophywnbshmsqvox/functions

---

### **STEP 2: Check If Function Exists**

Look at the list of Edge Functions. Do you see **`secure-login`** in the list?

**Case A: Function exists but different name**
- If you see a function with a different name (like `login`, `auth`, `secure_login`), note that name down

**Case B: No function exists**
- The list is empty - we need to create it

---

### **STEP 3A: If Function Exists (Different Name)**

Tell me the exact function name you see, and I'll update the SecureChat.svelte file to use that name.

For example, if the function is called `login`, the URL should be:
```
https://jmzyuophywnbshmsqvox.supabase.co/functions/v1/login
```

---

### **STEP 3B: If Function Doesn't Exist - Create It Now**

Click **"Create a new function"** button

**Function Name:** `secure-login` (exactly this, lowercase with hyphen)

**Copy-paste this code:**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const rateLimit = rateLimitMap.get(clientIP)

    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= 5) {
          return new Response(
            JSON.stringify({ success: false, error: 'Too many login attempts. Try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        rateLimit.count++
      } else {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + 60000 })
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + 60000 })
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash, display_name')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid username or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid username or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Success - return user data (without password hash)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

**Click "Deploy function"** button at the bottom

**Wait for it to say "Successfully deployed"**

---

### **STEP 4: Verify Function is Active**

After deployment:

1. You should see `secure-login` in the functions list
2. Status should show a green dot and say **"Active"** (not "Paused")
3. Click on the function name to see details

---

### **STEP 5: Test the Function**

After it's deployed, go back to CrimeChat and try logging in with:

**Username:** `Hacker9435`  
**Password:** `H@ck3r$ecur3!2024`

Open browser console (F12) to see logs.

---

## 🆘 **What to Tell Me:**

After you complete the steps above, tell me:

1. ✅ "Function exists" - and tell me the exact name
   OR
   ✅ "Function created successfully" - after following Step 3B

2. Show me any error messages if it still doesn't work

3. Take a screenshot of the Edge Functions page if you're stuck

---

## 🎯 **Expected Result:**

When the function is properly deployed, logging in should:
- ✅ Show "Authenticating..." button loading state
- ✅ Verify password securely on server
- ✅ Login successfully with correct password
- ✅ Show "Invalid credentials" with wrong password
- ✅ No 404 errors in console

---

## 📝 **Quick Checklist:**

- [ ] Opened Supabase Dashboard Edge Functions page
- [ ] Checked if `secure-login` function exists
- [ ] If missing, created function with exact code above
- [ ] Function shows "Active" status
- [ ] Tested login in CrimeChat
- [ ] Checked browser console for errors

---

**Follow these steps and let me know what you find!** 🚀

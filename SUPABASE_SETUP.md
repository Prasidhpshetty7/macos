# SecureChat - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com/
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Name: `SecureChat`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait for project to initialize (2-3 minutes)

## 2. Get Your Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## 3. Add Credentials to Your App

Open `src/components/apps/SecureChat/SecureChat.svelte` and replace:

```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values.

## 4. Run This SQL in Supabase

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Paste and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (who can chat with who)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, contact_user_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Index for faster queries
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_expires ON messages(expires_at);
CREATE INDEX idx_contacts_user ON contacts(user_id);

-- Auto-delete messages older than 24 hours (runs every hour)
CREATE OR REPLACE FUNCTION delete_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM messages WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- RLS Policies for contacts
CREATE POLICY "Users can read their contacts" ON contacts
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- RLS Policies for messages
CREATE POLICY "Users can read their messages" ON messages
  FOR SELECT USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = receiver_id::text
  );

CREATE POLICY "Users can send messages to contacts" ON messages
  FOR INSERT WITH CHECK (
    auth.uid()::text = sender_id::text AND
    EXISTS (
      SELECT 1 FROM contacts 
      WHERE user_id = sender_id AND contact_user_id = receiver_id
    )
  );
```

## 5. Add Users (Admin Only)

You need to manually add users via Supabase dashboard:

1. Click "Table Editor"
2. Click "users" table
3. Click "Insert" → "Insert row"
4. Fill in:
   - `username`: enter username
   - `password_hash`: **Use this tool to hash password**: https://bcrypt-generator.com/
     - Enter password → Copy the bcrypt hash → Paste in password_hash field
5. Repeat for each user

## 6. Link Contacts (Who Can Chat)

1. In Table Editor, open "contacts" table
2. For each user pair that should chat:
   - Insert row:
     - `user_id`: User 1's UUID (from users table)
     - `contact_user_id`: User 2's UUID
   - **Important**: Insert reverse too!
     - `user_id`: User 2's UUID
     - `contact_user_id`: User 1's UUID

## 7. Enable Realtime (Optional)

For instant message updates:

1. Go to "Database" → "Replication"
2. Find "messages" table
3. Toggle ON "Realtime"

## 8. Set Up Auto-Delete Cron Job

1. Go to "Database" → "Functions"
2. Create new function:
   - Name: `auto_delete_messages`
   - Schedule: `0 * * * *` (runs every hour)
   - SQL:
   ```sql
   SELECT delete_old_messages();
   ```

## Security Notes

- Passwords are hashed with bcrypt (never stored plain text)
- Row Level Security prevents users from accessing others' data
- Messages auto-delete after 24 hours
- No SQL injection possible (uses parameterized queries)
- F12 DevTools blocked when app is open
- Screenshot detection and blocking enabled

## Example Users Setup

User 1:
- username: `alice`
- password: `SecurePass123!` → hash with bcrypt-generator.com

User 2:
- username: `bob`  
- password: `BobSecret456!` → hash with bcrypt-generator.com

Then in contacts table:
- Row 1: user_id=alice_uuid, contact_user_id=bob_uuid
- Row 2: user_id=bob_uuid, contact_user_id=alice_uuid

Now Alice and Bob can chat!

## Troubleshooting

- **Login fails**: Check username spelling and password hash
- **Can't send messages**: Verify both users exist in contacts table (bidirectional)
- **Messages don't appear**: Check Supabase API settings and RLS policies
- **App shows errors**: Open browser console (before app loads) and check for Supabase connection errors

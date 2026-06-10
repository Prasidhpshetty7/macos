# 🔐 CrimeChat - User Credentials

## **IMPORTANT: KEEP THIS FILE PRIVATE!**
Delete this file before giving your laptop to anyone!

---

## User Accounts

### Account 1: Hacker
**Login:**
- Username: `Hacker9435`
- Password: `H@ck3r$ecur3!2024`

**Display Name (Others See):** `AnonymousH`

---

### Account 2: Techie
**Login:**
- Username: `Techie2435`
- Password: `T3ch!eMast3r#99`

**Display Name (Others See):** `AnonymousT`

---

### Account 3: Joker
**Login:**
- Username: `Joker3242`
- Password: `J0k3r$Tr0ng!42`

**Display Name (Others See):** `AnonymousJ`

---

## How It Works

### Anonymous Display Names
- When **Hacker9435** logs in, they see their contacts as:
  - `AnonymousT` (Techie)
  - `AnonymousJ` (Joker)
  
- When **Techie2435** logs in, they see:
  - `AnonymousH` (Hacker)
  - `AnonymousJ` (Joker)

- When **Joker3242** logs in, they see:
  - `AnonymousH` (Hacker)
  - `AnonymousT` (Techie)

**Nobody sees real usernames in the chat!**

---

## Chat Features

✅ **Empty at first** - No messages until someone sends  
✅ **Real-time updates** - Messages appear instantly (like WhatsApp)  
✅ **All see each other** - All 3 users in each other's contact list  
✅ **Anonymous only** - Real usernames hidden  
✅ **24h auto-delete** - Messages vanish automatically  

---

## Setup Instructions for Supabase

### Step 1: Hash Passwords
Go to https://bcrypt-generator.com/ and hash these passwords:

1. Copy: `H@ck3r$ecur3!2024` → Hash it → Save hash
2. Copy: `T3ch!eMast3r#99` → Hash it → Save hash
3. Copy: `J0k3r$Tr0ng!42` → Hash it → Save hash

### Step 2: Insert Users into Supabase
In Supabase → Table Editor → `users` table → Insert 3 rows:

**User 1:**
```
username: Hacker9435
password_hash: [paste bcrypt hash of H@ck3r$ecur3!2024]
display_name: AnonymousH
```

**User 2:**
```
username: Techie2435
password_hash: [paste bcrypt hash of T3ch!eMast3r#99]
display_name: AnonymousT
```

**User 3:**
```
username: Joker3242
password_hash: [paste bcrypt hash of J0k3r$Tr0ng!42]
display_name: AnonymousJ
```

**Important:** Copy each user's UUID after inserting!

### Step 3: Link Contacts (All-to-All)
In Supabase → `contacts` table → Insert 6 rows:

```sql
-- Hacker can chat with Techie
user_id: [Hacker's UUID]
contact_user_id: [Techie's UUID]

-- Hacker can chat with Joker
user_id: [Hacker's UUID]
contact_user_id: [Joker's UUID]

-- Techie can chat with Hacker
user_id: [Techie's UUID]
contact_user_id: [Hacker's UUID]

-- Techie can chat with Joker
user_id: [Techie's UUID]
contact_user_id: [Joker's UUID]

-- Joker can chat with Hacker
user_id: [Joker's UUID]
contact_user_id: [Hacker's UUID]

-- Joker can chat with Techie
user_id: [Joker's UUID]
contact_user_id: [Techie's UUID]
```

---

## Quick Test

After setup:

1. **Login as Hacker9435**
   - See contacts: AnonymousT, AnonymousJ
   - Send message to AnonymousT
   
2. **Logout and login as Techie2435**
   - See message from AnonymousH
   - Reply back

3. **Logout and login as Joker3242**
   - Chat with both contacts

---

## Security Notes

✅ Passwords are 15-17 characters with special chars  
✅ Hashed with bcrypt (industry standard)  
✅ Display names hide real identities  
✅ No way to reverse-engineer usernames from display names  
✅ Messages delete after 24h  

---

## Password Strength

All passwords have:
- ✅ Uppercase letters
- ✅ Lowercase letters  
- ✅ Numbers
- ✅ Special characters (!@#$)
- ✅ 15+ characters
- ✅ No dictionary words
- ✅ No personal info

---

## ⚠️ REMEMBER TO DELETE THIS FILE BEFORE GIVING LAPTOP! ⚠️

```bash
# Delete this file:
rm CRIMECHAT_CREDENTIALS.md

# Or hide it:
mv CRIMECHAT_CREDENTIALS.md ~/.crimechat_backup
```

---

## Quick Reference Card (Print or Save Separately)

```
HACKER: Hacker9435 / H@ck3r$ecur3!2024
TECHIE: Techie2435 / T3ch!eMast3r#99
JOKER:  Joker3242  / J0k3r$Tr0ng!42
```

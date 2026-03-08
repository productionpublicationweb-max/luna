# Supabase Setup Guide for Luna Monétis

This guide will help you set up Supabase for data persistence in your Luna Monétis application.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Your Supabase project URL and anon/public key

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project" 
3. Fill in your project details:
   - Name: `luna-monetis` (or your preferred name)
   - Database Password: (generate a strong password)
   - Region: Choose the closest to your users
4. Click "Create new project" and wait for it to be ready (usually 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Environment Variables

Create or update your `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to version control! It's already in `.gitignore`.

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/sql/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

This will create:
- `users` table - User accounts and profiles
- `chat_logs` table - Chat conversation history
- `tarot_readings` table - Tarot reading records
- `rune_readings` table - Rune reading records
- `referrals` table - Referral tracking
- `broadcast_messages` table - Admin broadcast messages
- Necessary indexes and RLS policies

## Step 5: Configure Authentication (Optional)

For production use, you may want to enable additional auth providers:

1. Go to **Authentication** → **Providers**
2. Enable Email provider (enabled by default)
3. Optionally enable Google, Facebook, or other providers
4. Configure your site URL in **Authentication** → **URL Configuration**

## Step 6: Verify Setup

1. Start your development server: `npm run dev`
2. Sign up for a new account in the app
3. Check your Supabase dashboard:
   - Go to **Table Editor** → **users**
   - You should see your new user record

## Database Schema Overview

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | User email (unique) |
| name | TEXT | Display name |
| crystals | INTEGER | Crystal points balance |
| level | INTEGER | User level |
| visits | INTEGER | Total visits count |
| is_admin | BOOLEAN | Admin flag |
| referral_code | TEXT | Unique referral code |
| referred_by | UUID | Referrer's user ID |
| created_at | TIMESTAMPTZ | Account creation date |
| last_visit | TIMESTAMPTZ | Last visit timestamp |

### Chat Logs Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| message | TEXT | User message |
| response | TEXT | AI response |
| created_at | TIMESTAMPTZ | Timestamp |

### Tarot Readings Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| cards | JSONB | Cards drawn (JSON) |
| interpretation | TEXT | AI interpretation |
| created_at | TIMESTAMPTZ | Timestamp |

### Rune Readings Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| runes | JSONB | Runes drawn (JSON) |
| interpretation | TEXT | AI interpretation |
| created_at | TIMESTAMPTZ | Timestamp |

### Referrals Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| referrer_id | UUID | Referrer's user ID |
| referred_id | UUID | Referred user's ID |
| reward_given | BOOLEAN | Whether reward was given |
| created_at | TIMESTAMPTZ | Timestamp |

### Broadcast Messages Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| admin_id | UUID | Admin's user ID |
| message | TEXT | Broadcast message |
| sent_at | TIMESTAMPTZ | Timestamp |

## Features Enabled by Supabase

### Referral System
- Each user gets a unique referral code (format: `LUNA-XXXXXXXX`)
- Referrer receives 50 crystals when someone signs up with their code
- New user receives 25 bonus crystals
- Share via Facebook, Twitter, WhatsApp, or Email

### Loyalty Program
- Track user visits over time
- Five loyalty tiers:
  - **Bronze** (0-100 visits): 5% bonus
  - **Argent** (101-250 visits): 10% bonus
  - **Or** (251-500 visits): 15% bonus
  - **Platine** (501-1000 visits): 20% bonus
  - **Diamant** (1000+ visits): 25% bonus

### Data Persistence
- Chat history saved across sessions
- Tarot and rune readings history
- Crystal balance synced across devices
- Visit tracking for loyalty program

## Troubleshooting

### "Failed to fetch user"
- Check that your Supabase URL and key are correct in `.env.local`
- Verify your internet connection
- Check Supabase status page

### "Permission denied" errors
- Make sure you ran the complete SQL schema
- Verify RLS policies are correctly set up
- Check that the anon key has proper permissions

### Data not persisting
- Verify Supabase is configured: `isSupabaseConfigured()` returns true
- Check browser console for errors
- Verify tables exist in Supabase dashboard

## Local Development Without Supabase

The app will work in "fallback mode" using localStorage when Supabase is not configured. This is fine for development, but data won't persist across devices or sessions.

## Production Checklist

- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Set environment variables in production
- [ ] Configure auth providers
- [ ] Set up email templates
- [ ] Configure CORS settings
- [ ] Enable Row Level Security (RLS) - already done in schema
- [ ] Set up database backups

## Support

For issues with:
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **Luna Monétis**: Contact support at support@oznya.com

---

*Created for Luna Monétis by Diane Boyer • [Oznya.com](https://oznya.com)*

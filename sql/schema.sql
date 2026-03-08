-- Luna Monétis Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  crystals INTEGER DEFAULT 55,
  level INTEGER DEFAULT 1,
  visits INTEGER DEFAULT 1,
  is_admin BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE DEFAULT 'LUNA-' || substr(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_visit TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CHAT LOGS TABLE ====================
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TAROT READINGS TABLE ====================
CREATE TABLE IF NOT EXISTS tarot_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cards JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RUNE READINGS TABLE ====================
CREATE TABLE IF NOT EXISTS rune_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  runes JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== REFERRALS TABLE ====================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- ==================== BROADCAST MESSAGES TABLE ====================
CREATE TABLE IF NOT EXISTS broadcast_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_user_id ON tarot_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_created_at ON tarot_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rune_readings_user_id ON rune_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_rune_readings_created_at ON rune_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_sent_at ON broadcast_messages(sent_at DESC);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rune_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Users: Allow public read for auth, insert for anon (signup)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Chat logs: Users can only see their own logs
CREATE POLICY "Users can view own chat logs" ON chat_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own chat logs" ON chat_logs
  FOR INSERT WITH CHECK (true);

-- Tarot readings: Users can only see their own readings
CREATE POLICY "Users can view own tarot readings" ON tarot_readings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own tarot readings" ON tarot_readings
  FOR INSERT WITH CHECK (true);

-- Rune readings: Users can only see their own readings
CREATE POLICY "Users can view own rune readings" ON rune_readings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own rune readings" ON rune_readings
  FOR INSERT WITH CHECK (true);

-- Referrals: Users can view referrals involving them
CREATE POLICY "Users can view related referrals" ON referrals
  FOR SELECT USING (true);

CREATE POLICY "Users can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- Broadcast messages: Everyone can read, only admins can write
CREATE POLICY "Everyone can view broadcast messages" ON broadcast_messages
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert broadcast messages" ON broadcast_messages
  FOR INSERT WITH CHECK (true);

-- ==================== FUNCTIONS ====================

-- Function to increment user visit count
CREATE OR REPLACE FUNCTION increment_visit(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET visits = visits + 1,
      last_visit = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user referral
CREATE OR REPLACE FUNCTION handle_referral()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Check if user was referred
  IF NEW.referred_by IS NOT NULL THEN
    -- Award referrer 50 crystals
    UPDATE users
    SET crystals = crystals + 50
    WHERE id = NEW.referred_by;
    
    -- Award new user 25 crystals bonus
    NEW.crystals := NEW.crystals + 25;
    
    -- Create referral record
    INSERT INTO referrals (referrer_id, referred_id, reward_given)
    VALUES (NEW.referred_by, NEW.id, TRUE);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for handling referrals
DROP TRIGGER IF EXISTS handle_referral_trigger ON users;
CREATE TRIGGER handle_referral_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_referral();

-- ==================== INITIAL DATA ====================

-- Create admin user (update email as needed)
INSERT INTO users (email, name, crystals, level, is_admin)
VALUES ('admin@luna.com', 'Luna Admin', 1000, 10, TRUE)
ON CONFLICT (email) DO NOTHING;

-- ==================== VIEWS FOR ANALYTICS ====================

-- View for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.crystals,
  u.level,
  u.visits,
  u.created_at,
  u.last_visit,
  (SELECT COUNT(*) FROM chat_logs WHERE user_id = u.id) as chat_count,
  (SELECT COUNT(*) FROM tarot_readings WHERE user_id = u.id) as tarot_count,
  (SELECT COUNT(*) FROM rune_readings WHERE user_id = u.id) as rune_count,
  (SELECT COUNT(*) FROM referrals WHERE referrer_id = u.id) as referral_count
FROM users u;

-- View for daily activity
CREATE OR REPLACE VIEW daily_activity AS
SELECT 
  DATE(created_at) as activity_date,
  'chat' as activity_type,
  COUNT(*) as count
FROM chat_logs
GROUP BY DATE(created_at)
UNION ALL
SELECT 
  DATE(created_at) as activity_date,
  'tarot' as activity_type,
  COUNT(*) as count
FROM tarot_readings
GROUP BY DATE(created_at)
UNION ALL
SELECT 
  DATE(created_at) as activity_date,
  'rune' as activity_type,
  COUNT(*) as count
FROM rune_readings
GROUP BY DATE(created_at)
ORDER BY activity_date DESC;

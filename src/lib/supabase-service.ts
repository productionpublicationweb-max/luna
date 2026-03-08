import { supabase, isSupabaseConfigured } from './supabase';
import type { SupabaseUser, ReferralStats } from '@/types/database';

// Re-export for convenience
export { isSupabaseConfigured };

// Generate a unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'LUNA-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ==================== USER FUNCTIONS ====================

export async function getUserByEmail(email: string): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using localStorage fallback');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching user:', error);
      return null;
    }

    return data as SupabaseUser;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }

    return data as SupabaseUser;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}

export async function createUser(
  email: string,
  name?: string,
  referralCode?: string
): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const newUser = {
      email,
      name: name || email.split('@')[0],
      crystals: 55, // Welcome bonus (50) + 5 crystals
      level: 1,
      visits: 1,
      is_admin: email === 'admin@luna.com',
      referral_code: referralCode || generateReferralCode()
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data as SupabaseUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
}

export async function updateUserCrystals(userId: string, crystals: number): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ crystals })
      .eq('id', userId);

    if (error) {
      console.error('Error updating crystals:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserCrystals:', error);
    return false;
  }
}

export async function addCrystalsToUser(userId: string, amount: number): Promise<number | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    // First get current crystals
    const user = await getUserById(userId);
    if (!user) return null;

    const newCrystals = user.crystals + amount;
    const success = await updateUserCrystals(userId, newCrystals);

    return success ? newCrystals : null;
  } catch (error) {
    console.error('Error in addCrystalsToUser:', error);
    return null;
  }
}

export async function recordUserVisit(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase.rpc('increment_visit', { user_id: userId });
    
    // If RPC doesn't exist, do it manually
    if (error) {
      const user = await getUserById(userId);
      if (!user) return false;

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          visits: user.visits + 1,
          last_visit: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error recording visit:', updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in recordUserVisit:', error);
    return false;
  }
}

// ==================== CHAT LOG FUNCTIONS ====================

export async function logChat(
  userId: string,
  message: string,
  response: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('chat_logs')
      .insert([{
        user_id: userId,
        message,
        response
      }]);

    if (error) {
      console.error('Error logging chat:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logChat:', error);
    return false;
  }
}

export async function getChatHistory(userId: string, limit: number = 50): Promise<Array<{
  id: string;
  message: string;
  response: string;
  created_at: string;
}>> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
}

// ==================== TAROT READING FUNCTIONS ====================

export async function logTarotReading(
  userId: string,
  cards: Array<{ name: string; reversed: boolean }>,
  interpretation: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('tarot_readings')
      .insert([{
        user_id: userId,
        cards: JSON.stringify(cards),
        interpretation
      }]);

    if (error) {
      console.error('Error logging tarot reading:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logTarotReading:', error);
    return false;
  }
}

export async function getTarotHistory(userId: string, limit: number = 20): Promise<Array<{
  id: string;
  cards: string;
  interpretation: string;
  created_at: string;
}>> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tarot_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching tarot history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTarotHistory:', error);
    return [];
  }
}

// ==================== RUNE READING FUNCTIONS ====================

export async function logRuneReading(
  userId: string,
  runes: Array<{ name: string; symbol: string; reversed: boolean }>,
  interpretation: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('rune_readings')
      .insert([{
        user_id: userId,
        runes: JSON.stringify(runes),
        interpretation
      }]);

    if (error) {
      console.error('Error logging rune reading:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logRuneReading:', error);
    return false;
  }
}

export async function getRuneHistory(userId: string, limit: number = 20): Promise<Array<{
  id: string;
  runes: string;
  interpretation: string;
  created_at: string;
}>> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('rune_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching rune history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRuneHistory:', error);
    return [];
  }
}

// ==================== REFERRAL FUNCTIONS ====================

export async function getReferrals(userId: string): Promise<ReferralStats> {
  const defaultStats: ReferralStats = {
    totalReferrals: 0,
    crystalsEarned: 0,
    recentReferrals: []
  };

  if (!isSupabaseConfigured()) {
    return defaultStats;
  }

  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return defaultStats;
    }

    const referrals = data || [];
    const crystalsEarned = referrals.filter(r => r.reward_given).length * 50;

    return {
      totalReferrals: referrals.length,
      crystalsEarned,
      recentReferrals: referrals.slice(0, 10).map(r => ({
        id: r.id,
        created_at: r.created_at,
        reward_given: r.reward_given
      }))
    };
  } catch (error) {
    console.error('Error in getReferrals:', error);
    return defaultStats;
  }
}

export async function createReferral(
  referrerId: string,
  referredId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    // Check if referral already exists
    const { data: existing } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', referrerId)
      .eq('referred_id', referredId)
      .single();

    if (existing) {
      return true; // Already referred
    }

    // Create referral
    const { error } = await supabase
      .from('referrals')
      .insert([{
        referrer_id: referrerId,
        referred_id: referredId,
        reward_given: true
      }]);

    if (error) {
      console.error('Error creating referral:', error);
      return false;
    }

    // Award crystals to referrer (50 crystals)
    await addCrystalsToUser(referrerId, 50);

    // Award bonus to referred user (25 crystals)
    await addCrystalsToUser(referredId, 25);

    return true;
  } catch (error) {
    console.error('Error in createReferral:', error);
    return false;
  }
}

export async function getUserByReferralCode(code: string): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referral_code', code)
      .single();

    if (error) {
      console.error('Error fetching user by referral code:', error);
      return null;
    }

    return data as SupabaseUser;
  } catch (error) {
    console.error('Error in getUserByReferralCode:', error);
    return null;
  }
}

// ==================== BROADCAST MESSAGE FUNCTIONS ====================

export async function getBroadcastMessages(limit: number = 10): Promise<Array<{
  id: string;
  admin_id: string;
  message: string;
  sent_at: string;
}>> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('broadcast_messages')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching broadcast messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBroadcastMessages:', error);
    return [];
  }
}

export async function sendBroadcastMessage(
  adminId: string,
  message: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('broadcast_messages')
      .insert([{
        admin_id: adminId,
        message
      }]);

    if (error) {
      console.error('Error sending broadcast message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendBroadcastMessage:', error);
    return false;
  }
}

// ==================== ADMIN FUNCTIONS ====================

export async function getAllUsers(limit: number = 100): Promise<SupabaseUser[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }

    return (data || []) as SupabaseUser[];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

export async function getStats(): Promise<{
  totalUsers: number;
  totalCrystals: number;
  totalReadings: number;
  totalChats: number;
}> {
  const defaultStats = {
    totalUsers: 0,
    totalCrystals: 0,
    totalReadings: 0,
    totalChats: 0
  };

  if (!isSupabaseConfigured()) {
    return defaultStats;
  }

  try {
    // Get user count and total crystals
    const { data: users } = await supabase
      .from('users')
      .select('crystals');

    // Get readings count
    const { count: tarotCount } = await supabase
      .from('tarot_readings')
      .select('*', { count: 'exact', head: true });

    const { count: runeCount } = await supabase
      .from('rune_readings')
      .select('*', { count: 'exact', head: true });

    // Get chats count
    const { count: chatCount } = await supabase
      .from('chat_logs')
      .select('*', { count: 'exact', head: true });

    return {
      totalUsers: users?.length || 0,
      totalCrystals: users?.reduce((sum, u) => sum + (u.crystals || 0), 0) || 0,
      totalReadings: (tarotCount || 0) + (runeCount || 0),
      totalChats: chatCount || 0
    };
  } catch (error) {
    console.error('Error in getStats:', error);
    return defaultStats;
  }
}

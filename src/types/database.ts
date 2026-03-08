// Database types for Supabase

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          crystals: number;
          level: number;
          visits: number;
          is_admin: boolean;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
          last_visit: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          crystals?: number;
          level?: number;
          visits?: number;
          is_admin?: boolean;
          referral_code?: string;
          referred_by?: string | null;
          created_at?: string;
          last_visit?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          crystals?: number;
          level?: number;
          visits?: number;
          is_admin?: boolean;
          referral_code?: string;
          referred_by?: string | null;
          created_at?: string;
          last_visit?: string;
        };
      };
      chat_logs: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          response: string;
          created_at?: string;
        };
      };
      tarot_readings: {
        Row: {
          id: string;
          user_id: string;
          cards: string; // JSON string of cards
          interpretation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cards: string;
          interpretation: string;
          created_at?: string;
        };
      };
      rune_readings: {
        Row: {
          id: string;
          user_id: string;
          runes: string; // JSON string of runes
          interpretation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          runes: string;
          interpretation: string;
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          reward_given: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          reward_given?: boolean;
          created_at?: string;
        };
      };
      broadcast_messages: {
        Row: {
          id: string;
          admin_id: string;
          message: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          message: string;
          sent_at?: string;
        };
      };
    };
  };
}

// User type for application use
export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  crystals: number;
  level: number;
  visits: number;
  is_admin: boolean;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  last_visit: string;
}

// Referral stats
export interface ReferralStats {
  totalReferrals: number;
  crystalsEarned: number;
  recentReferrals: Array<{
    id: string;
    created_at: string;
    reward_given: boolean;
  }>;
}

// Loyalty tier
export interface LoyaltyTier {
  name: string;
  nameFr: string;
  minVisits: number;
  maxVisits: number;
  bonusPercent: number;
  color: string;
  icon: string;
  benefits: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    nameFr: 'Bronze',
    minVisits: 0,
    maxVisits: 100,
    bonusPercent: 5,
    color: '#CD7F32',
    icon: '🥉',
    benefits: ['5% bonus crystals on purchases', 'Basic access to features']
  },
  {
    name: 'Argent',
    nameFr: 'Argent',
    minVisits: 101,
    maxVisits: 250,
    bonusPercent: 10,
    color: '#C0C0C0',
    icon: '🥈',
    benefits: ['10% bonus crystals on purchases', 'Priority support', 'Monthly horoscope']
  },
  {
    name: 'Or',
    nameFr: 'Or',
    minVisits: 251,
    maxVisits: 500,
    bonusPercent: 15,
    color: '#FFD700',
    icon: '🥇',
    benefits: ['15% bonus crystals on purchases', 'Exclusive content', 'Priority support', 'Monthly horoscope', 'Birthday gift']
  },
  {
    name: 'Platine',
    nameFr: 'Platine',
    minVisits: 501,
    maxVisits: 1000,
    bonusPercent: 20,
    color: '#E5E4E2',
    icon: '💎',
    benefits: ['20% bonus crystals on purchases', 'VIP access', 'Exclusive content', 'Priority support', 'Monthly horoscope', 'Birthday gift', 'Early access to features']
  },
  {
    name: 'Diamant',
    nameFr: 'Diamant',
    minVisits: 1001,
    maxVisits: Infinity,
    bonusPercent: 25,
    color: '#B9F2FF',
    icon: '💠',
    benefits: ['25% bonus crystals on purchases', 'VIP access', 'Exclusive content', 'Priority support', 'Monthly horoscope', 'Birthday gift', 'Early access to features', 'Personal consultations']
  }
];

export function getLoyaltyTier(visits: number): LoyaltyTier {
  for (const tier of LOYALTY_TIERS) {
    if (visits >= tier.minVisits && visits <= tier.maxVisits) {
      return tier;
    }
  }
  return LOYALTY_TIERS[LOYALTY_TIERS.length - 1]; // Diamant
}

export function getNextTier(visits: number): LoyaltyTier | null {
  for (const tier of LOYALTY_TIERS) {
    if (visits < tier.minVisits) {
      return tier;
    }
  }
  return null; // Already at max tier
}

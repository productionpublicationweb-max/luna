'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLevel } from '@/lib/luna-personality';
import { getLevel as getDbLevel } from '@/types/database';
import {
  getUserByEmail,
  createUser,
  updateUserCrystals,
  getUserByReferralCode,
  createReferral,
  recordUserVisit,
  isSupabaseConfigured
} from '@/lib/supabase-service';
import type { SupabaseUser } from '@/types/database';

export interface User {
  id: string;
  email: string;
  name: string;
  crystals: number;
  level: number;
  visits: number;
  isAdmin: boolean;
  createdAt: Date;
  lastVisit?: Date;
  referralCode?: string;
  referredBy?: string | null;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  updateCrystals: (amount: number) => void;
  addCrystals: (amount: number) => void;
  setUserAsAdmin: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'luna_user';
const ADMIN_EMAIL = 'admin@luna.com'; // Mock admin email

// Convert Supabase user to app user
function supabaseToAppUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.name,
    crystals: supabaseUser.crystals,
    level: supabaseUser.level,
    visits: supabaseUser.visits,
    isAdmin: supabaseUser.is_admin,
    createdAt: new Date(supabaseUser.created_at),
    lastVisit: new Date(supabaseUser.last_visit),
    referralCode: supabaseUser.referral_code,
    referredBy: supabaseUser.referred_by
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedUser = JSON.parse(stored);
          parsedUser.createdAt = new Date(parsedUser.createdAt);
          parsedUser.lastVisit = parsedUser.lastVisit ? new Date(parsedUser.lastVisit) : undefined;
          setUser(parsedUser);
        }
      } catch {
        // Ignore errors
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Sync crystals with Supabase (when configured)
  const syncCrystalsWithSupabase = useCallback(async (userId: string, crystals: number) => {
    if (isSupabaseConfigured()) {
      await updateUserCrystals(userId, crystals);
    }
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        const supabaseUser = await getUserByEmail(email);
        
        if (supabaseUser) {
          // Record visit
          await recordUserVisit(supabaseUser.id);
          
          const appUser = supabaseToAppUser({
            ...supabaseUser,
            visits: supabaseUser.visits + 1,
            last_visit: new Date().toISOString()
          });
          setUser(appUser);
          setIsLoading(false);
          return true;
        }
      }
      
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      let existingUser: User | null = null;
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === email) {
          existingUser = parsed;
        }
      }
      
      if (existingUser) {
        existingUser.lastVisit = new Date();
        existingUser.visits += 1;
        setUser(existingUser);
      } else {
        // Create new user from login (treat as existing user logging in)
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
          crystals: 50, // Welcome bonus
          level: 1,
          visits: 1,
          isAdmin: email === ADMIN_EMAIL,
          createdAt: new Date(),
          lastVisit: new Date()
        };
        setUser(newUser);
      }
      
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, _password: string, name: string, referralCode?: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      let referrerId: string | null = null;
      
      // Check referral code if provided
      if (referralCode && isSupabaseConfigured()) {
        const referrer = await getUserByReferralCode(referralCode);
        if (referrer) {
          referrerId = referrer.id;
        }
      }

      // Try Supabase if configured
      if (isSupabaseConfigured()) {
        const supabaseUser = await createUser(email, name, referralCode);
        
        if (supabaseUser) {
          // If referred, create referral record
          if (referrerId) {
            await createReferral(referrerId, supabaseUser.id);
          }
          
          const appUser = supabaseToAppUser(supabaseUser);
          setUser(appUser);
          setIsLoading(false);
          return true;
        }
      }
      
      // Fallback to localStorage
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        crystals: referralCode ? 80 : 55, // Welcome bonus (50) + 5 crystals + 25 if referred
        level: 1,
        visits: 1,
        isAdmin: email === ADMIN_EMAIL,
        createdAt: new Date(),
        lastVisit: new Date(),
        referralCode: `LUNA-${Date.now().toString(36).toUpperCase()}`,
        referredBy: referrerId
      };
      
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateCrystals = useCallback((amount: number) => {
    if (user) {
      const newCrystals = Math.max(0, amount);
      const levelInfo = getLevel(newCrystals);
      setUser(prev => prev ? { 
        ...prev, 
        crystals: newCrystals,
        level: levelInfo.level
      } : null);
      
      // Sync with Supabase
      syncCrystalsWithSupabase(user.id, newCrystals);
    }
  }, [user, syncCrystalsWithSupabase]);

  const addCrystals = useCallback((amount: number) => {
    if (user) {
      const newCrystals = user.crystals + amount;
      const levelInfo = getLevel(newCrystals);
      setUser(prev => prev ? { 
        ...prev, 
        crystals: newCrystals,
        level: levelInfo.level
      } : null);
      
      // Sync with Supabase
      syncCrystalsWithSupabase(user.id, newCrystals);
    }
  }, [user, syncCrystalsWithSupabase]);

  const setUserAsAdmin = useCallback(() => {
    if (user) {
      setUser(prev => prev ? { ...prev, isAdmin: true } : null);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateCrystals,
      addCrystals,
      setUserAsAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;

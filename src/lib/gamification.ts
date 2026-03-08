import { getLevel, getNextLevelThreshold } from './luna-personality';

export interface GamificationState {
  crystalPoints: number;
  visitCount: number;
  lastVisitDate: string | null;
  hasSeenBonneLune: boolean;
  streak: number;
}

const STORAGE_KEY = 'luna_gamification';

export function getDefaultState(): GamificationState {
  return {
    crystalPoints: 0,
    visitCount: 0,
    lastVisitDate: null,
    hasSeenBonneLune: false,
    streak: 0
  };
}

export function loadGamificationState(): GamificationState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  
  return getDefaultState();
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore errors
  }
}

export function recordVisit(state: GamificationState): { 
  newState: GamificationState; 
  showBonneLune: boolean;
  pointsEarned: number;
} {
  const today = new Date().toDateString();
  let pointsEarned = 0;
  let showBonneLune = false;
  
  const newState = { ...state };
  newState.visitCount += 1;
  
  // Check if it's a new day for streak
  if (state.lastVisitDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (state.lastVisitDate === yesterday.toDateString()) {
      // Continuing streak
      newState.streak += 1;
      pointsEarned = 10 + Math.min(newState.streak, 10); // Bonus for streak
    } else if (state.lastVisitDate) {
      // Streak broken
      newState.streak = 1;
      pointsEarned = 5;
    } else {
      // First visit
      newState.streak = 1;
      pointsEarned = 15; // Welcome bonus
    }
    
    newState.lastVisitDate = today;
    newState.crystalPoints += pointsEarned;
    
    // Check for Bonne Lune popup (30 visits)
    if (newState.visitCount === 30 && !state.hasSeenBonneLune) {
      showBonneLune = true;
      newState.hasSeenBonneLune = true;
      newState.crystalPoints += 100; // Bonus for Bonne Lune
    }
  }
  
  saveGamificationState(newState);
  
  return { newState, showBonneLune, pointsEarned };
}

export function addPoints(state: GamificationState, points: number): GamificationState {
  const newState = {
    ...state,
    crystalPoints: state.crystalPoints + points
  };
  saveGamificationState(newState);
  return newState;
}

export function getProgressPercentage(state: GamificationState): number {
  const nextThreshold = getNextLevelThreshold(state.crystalPoints);
  const currentLevel = getLevel(state.crystalPoints);
  const currentLevelMin = MYSTICAL_LEVELS[currentLevel.level - 1]?.minPoints || 0;
  
  const progress = ((state.crystalPoints - currentLevelMin) / (nextThreshold - currentLevelMin)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export const MYSTICAL_LEVELS = [
  { name: "Âme Nouvelle", minPoints: 0, maxPoints: 99 },
  { name: "Chercheuse de Lune", minPoints: 100, maxPoints: 249 },
  { name: "Voyageuse des Étoiles", minPoints: 250, maxPoints: 499 },
  { name: "Gardienne du Cristal", minPoints: 500, maxPoints: 999 },
  { name: "Oracle Éveillée", minPoints: 1000, maxPoints: 1999 },
  { name: "Maîtresse des Arcanes", minPoints: 2000, maxPoints: 4999 },
  { name: "Souveraine Céleste", minPoints: 5000, maxPoints: Infinity }
];

export { getLevel, getNextLevelThreshold };

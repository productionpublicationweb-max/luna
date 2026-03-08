'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { getLevel, getNextLevelThreshold, MYSTICAL_LEVELS } from '@/lib/luna-personality';
import { Sparkles, Moon } from 'lucide-react';

interface CrystalDisplayProps {
  points: number;
  className?: string;
  compact?: boolean;
}

export function CrystalDisplay({ points, className, compact = false }: CrystalDisplayProps) {
  const levelInfo = getLevel(points);
  const nextThreshold = getNextLevelThreshold(points);
  const currentLevelData = MYSTICAL_LEVELS[levelInfo.level - 1];
  const progress = currentLevelData 
    ? ((points - currentLevelData.minPoints) / (nextThreshold - currentLevelData.minPoints)) * 100
    : 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-gold">
          <Sparkles className="w-3.5 h-3.5 text-gold-signature" />
          <span className="text-sm font-medium text-gold-light">{points}</span>
        </div>
        <span className="text-xs text-muted-foreground">{levelInfo.name}</span>
      </div>
    );
  }

  return (
    <div className={cn('glass rounded-xl p-4 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Moon className="w-5 h-5 text-gold-signature" />
            <Sparkles className="w-3 h-3 text-gold-light absolute -top-1 -right-1" />
          </div>
          <span className="text-sm font-medium text-golden-ivory">Énergie Cristalline</span>
        </div>
        <span className="text-lg font-bold gradient-text-gold">{points}</span>
      </div>

      {/* Level */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-light-lavender font-medium">{levelInfo.name}</span>
        <span className="text-muted-foreground">
          Niveau {levelInfo.level}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <Progress 
          value={Math.min(100, Math.max(0, progress))} 
          className="h-2 bg-cosmic-blue/50"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{points} pts</span>
          <span>{nextThreshold} pts</span>
        </div>
      </div>

      {/* Crystals visualization */}
      <div className="flex justify-center gap-1 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-4 h-6 transition-all duration-300',
              i < Math.min(5, Math.floor(levelInfo.level / 2) + 1)
                ? 'opacity-100'
                : 'opacity-30'
            )}
          >
            <svg viewBox="0 0 16 24" className="w-full h-full">
              <polygon
                points="8,0 14,8 12,24 4,24 2,8"
                fill={i < Math.min(5, Math.floor(levelInfo.level / 2) + 1) ? '#D6A73D' : '#2B2A6B'}
                stroke="#F1D37A"
                strokeWidth="0.5"
                style={{
                  filter: i < Math.min(5, Math.floor(levelInfo.level / 2) + 1)
                    ? 'drop-shadow(0 0 4px rgba(214, 167, 61, 0.6))'
                    : 'none'
                }}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrystalDisplay;

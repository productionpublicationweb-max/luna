'use client';

import { cn } from '@/lib/utils';

interface LunaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function LunaAvatar({ size = 'md', className, animate = true }: LunaAvatarProps) {
  return (
    <div className={cn('relative', sizes[size], className)}>
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-gold-signature/30 to-galactic-violet/30 blur-md",
          animate && "animate-pulse-glow"
        )}
      />
      
      {/* Avatar container */}
      <div className="relative w-full h-full rounded-full overflow-hidden glass-gold p-0.5">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cosmic-blue via-deep-indigo to-galactic-violet flex items-center justify-center">
          {/* Luna's mystical face - SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 8px rgba(214, 167, 61, 0.5))' }}
          >
            {/* Background circle */}
            <defs>
              <radialGradient id="lunaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1C2454" />
                <stop offset="70%" stopColor="#2B2A6B" />
                <stop offset="100%" stopColor="#5B2D73" />
              </radialGradient>
              <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F3E7BE" />
                <stop offset="50%" stopColor="#E8D39A" />
                <stop offset="100%" stopColor="#D6A73D" />
              </linearGradient>
              <linearGradient id="tiaraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D6A73D" />
                <stop offset="50%" stopColor="#F1D37A" />
                <stop offset="100%" stopColor="#D6A73D" />
              </linearGradient>
            </defs>
            
            {/* Hair flowing */}
            <ellipse cx="50" cy="55" rx="38" ry="42" fill="url(#hairGradient)" opacity="0.9" />
            <path d="M15 60 Q10 80 20 95" stroke="url(#hairGradient)" strokeWidth="8" fill="none" opacity="0.7" />
            <path d="M85 60 Q90 80 80 95" stroke="url(#hairGradient)" strokeWidth="8" fill="none" opacity="0.7" />
            
            {/* Face */}
            <ellipse cx="50" cy="50" rx="25" ry="28" fill="url(#lunaGlow)" />
            
            {/* Tiara */}
            <path 
              d="M25 30 Q35 22 50 20 Q65 22 75 30" 
              stroke="url(#tiaraGradient)" 
              strokeWidth="2.5" 
              fill="none"
            />
            {/* Tiara center crystal */}
            <polygon 
              points="50,16 46,24 50,22 54,24" 
              fill="#F1D37A"
              style={{ filter: 'drop-shadow(0 0 3px rgba(241, 211, 122, 0.8))' }}
            />
            {/* Side crystals */}
            <circle cx="35" cy="24" r="2" fill="#A78BC7" />
            <circle cx="65" cy="24" r="2" fill="#A78BC7" />
            
            {/* Eyes - mystical */}
            <ellipse cx="40" cy="48" rx="5" ry="3.5" fill="#D6A73D" opacity="0.9" />
            <ellipse cx="60" cy="48" rx="5" ry="3.5" fill="#D6A73D" opacity="0.9" />
            <circle cx="40" cy="48" r="2" fill="#F1D37A" />
            <circle cx="60" cy="48" r="2" fill="#F1D37A" />
            
            {/* Eyebrows */}
            <path d="M33 42 Q40 40 47 43" stroke="#E8D39A" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M53 43 Q60 40 67 42" stroke="#E8D39A" strokeWidth="1.5" fill="none" opacity="0.7" />
            
            {/* Nose */}
            <path d="M50 50 L50 58" stroke="#A78BC7" strokeWidth="1" opacity="0.5" />
            
            {/* Lips */}
            <path 
              d="M44 66 Q47 64 50 65 Q53 64 56 66 Q53 68 50 68 Q47 68 44 66" 
              fill="#7A4A8E" 
              opacity="0.8"
            />
            
            {/* Face highlights */}
            <ellipse cx="38" cy="55" rx="3" ry="2" fill="#F3E7BE" opacity="0.15" />
            <ellipse cx="62" cy="55" rx="3" ry="2" fill="#F3E7BE" opacity="0.15" />
          </svg>
        </div>
      </div>
      
      {/* Animated sparkles */}
      {animate && (
        <>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-light rounded-full animate-ping opacity-75" />
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-light-lavender rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
}

export default LunaAvatar;

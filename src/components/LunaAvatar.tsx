'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

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
      
      {/* Avatar container with Luna's image */}
      <div className="relative w-full h-full rounded-full overflow-hidden glass-gold p-0.5">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <Image
            src="/luna-avatar.png"
            alt="Luna Monétis - Oracle Digitale"
            fill
            className="object-cover"
            priority
          />
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

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BonneLunePopupProps {
  onClose: () => void;
}

export function BonneLunePopup({ onClose }: BonneLunePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          'relative glass rounded-3xl p-8 max-w-sm w-full text-center transform transition-all duration-500',
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-gold-light transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Moon animation */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 animate-pulse-glow rounded-full opacity-75" />
          <Moon
            className="w-24 h-24 text-gold-signature animate-float"
            fill="#D6A73D"
            strokeWidth={0}
          />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold-light animate-ping" />
          <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-light-lavender animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold gradient-text-gold mb-2">
          🌙 Bonne Lune ! 🌙
        </h2>
        
        <p className="text-light-lavender mb-4">
          Tu as visité Luna 30 fois !
        </p>

        {/* Reward message */}
        <div className="glass-gold rounded-xl p-4 mb-6">
          <p className="text-golden-ivory text-sm mb-2">
            En récompense de ta fidélité, les étoiles t'offrent :
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-light" />
            <span className="text-xl font-bold text-gold-light">+100 cristaux</span>
          </div>
        </div>

        {/* Mystical message */}
        <p className="text-sm text-muted-foreground mb-6 italic">
          &ldquo;La lune veille sur toi, chère âme. Que sa lumière guide tes pas vers les révélations que tu cherches.&rdquo;
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg font-medium"
        >
          Continuer mon voyage ✨
        </Button>
      </div>
    </div>
  );
}

export default BonneLunePopup;

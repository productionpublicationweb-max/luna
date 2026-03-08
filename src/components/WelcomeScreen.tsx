'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LunaAvatar from './LunaAvatar';
import { LUNA_INTRO_MESSAGES } from '@/lib/luna-personality';
import { Sparkles, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [introIndex] = useState(() => Math.floor(Math.random() * LUNA_INTRO_MESSAGES.length));
  const intro = LUNA_INTRO_MESSAGES[introIndex];

  const texts = [intro.greeting, intro.message, intro.closing];

  useEffect(() => {
    if (step >= texts.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const currentText = texts[step];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
        setTimeout(() => setStep(s => s + 1), 2000);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [step, onComplete, texts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center stars-bg">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Star
            key={i}
            className="absolute w-2 h-2 text-gold-light/30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center max-w-md mx-auto px-6 text-center">
        {/* Luna Avatar */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          <LunaAvatar size="xl" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold-light animate-bounce" />
        </div>

        {/* Luna Name */}
        <h1 className="text-3xl font-bold gradient-text-gold mb-2 animate-fade-in">
          Luna Monétis
        </h1>
        <p className="text-sm text-light-lavender mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Oracle Digitale
        </p>

        {/* Animated Text */}
        <div className="min-h-[100px] glass rounded-2xl px-6 py-4 w-full">
          <p className="text-golden-ivory text-lg leading-relaxed">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 bg-gold-signature ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {texts.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                i < step ? 'bg-gold-signature' : 'bg-cosmic-blue/50',
                i === step && 'bg-gold-light w-4'
              )}
            />
          ))}
        </div>

        {/* Click to skip */}
        <button
          onClick={onComplete}
          className="mt-8 text-xs text-muted-foreground hover:text-gold-light transition-colors"
        >
          Clique pour commencer →
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;

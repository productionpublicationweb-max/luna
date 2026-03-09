'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { LUNA_INTRO_MESSAGES } from '@/lib/luna-personality';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [introIndex] = useState(() => Math.floor(Math.random() * LUNA_INTRO_MESSAGES.length));
  const intro = LUNA_INTRO_MESSAGES[introIndex];
  const texts = [intro, '', ''];

  // Typing effect
  useEffect(() => {
    if (step === 0) {
      const fullText = texts[0];
      let index = 0;
      setIsTyping(true);
      
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 40);

      return () => clearInterval(timer);
    }
  }, [step]);

  const handleClick = () => {
    if (step < texts.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center aurora-bg">
      {/* Pulsar stars */}
      <div className="pulsar-star w-2 h-2" style={{ top: '15%', left: '20%', animationDelay: '0s' }} />
      <div className="pulsar-star w-3 h-3" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
      <div className="pulsar-star w-2 h-2" style={{ top: '80%', left: '30%', animationDelay: '2s' }} />
      <div className="pulsar-star w-1.5 h-1.5" style={{ top: '25%', left: '70%', animationDelay: '0.5s' }} />
      <div className="pulsar-star w-2.5 h-2.5" style={{ top: '45%', left: '15%', animationDelay: '1.5s' }} />
      
      <div className="relative flex flex-col items-center max-w-md mx-auto px-6 text-center">
        {/* Luna Avatar */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-signature/30 to-galactic-violet/30 blur-md animate-pulse-glow" />
            <div className="relative w-full h-full rounded-full overflow-hidden glass-gold p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-br from-cosmic-blue via-deep-indigo to-galactic-violet">
                <Image
                  src="/luna-avatar.png"
                  alt="Luna Monétis - Oracle Digitale"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-light rounded-full animate-ping opacity-75" />
            <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-light-lavender rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-gold-light animate-bounce" />
        </div>

        {/* Name and title */}
        <h1 className="text-3xl font-bold gradient-text-gold mb-2 animate-fade-in">Luna Monétis</h1>
        <p className="text-sm text-light-lavender mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>Oracle Digitale</p>

        {/* Message box */}
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
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i < step ? 'bg-gold-light w-4' : 'w-2 bg-cosmic-blue/50',
                i === step && 'bg-gold-light w-4'
              )}
            />
          ))}
        </div>

        {/* Click to start button */}
        <button
          onClick={handleClick}
          className="btn-luna-vitreux mt-8"
        >
          Clique pour commencer →
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;

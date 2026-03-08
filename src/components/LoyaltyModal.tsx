'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Crown,
  Sparkles,
  Star,
  Gift,
  Check,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LOYALTY_TIERS, getLoyaltyTier, getNextTier } from '@/types/database';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoyaltyModal({ isOpen, onClose }: LoyaltyModalProps) {
  const { user, isAuthenticated } = useUser();

  // Calculate all derived values using useMemo
  const loyaltyData = useMemo(() => {
    const userVisits = user?.visits || 1;
    const tier = getLoyaltyTier(userVisits);
    const next = getNextTier(userVisits);

    // Calculate progress to next tier
    let progressPercent = 100;
    if (next) {
      const progressInTier = userVisits - tier.minVisits;
      const tierRange = next.minVisits - tier.minVisits;
      progressPercent = Math.min(100, (progressInTier / tierRange) * 100);
    }

    return {
      visits: userVisits,
      currentTier: tier,
      nextTier: next,
      progress: progressPercent
    };
  }, [user?.visits]);

  if (!isOpen) return null;

  const { visits, currentTier, nextTier, progress } = loyaltyData;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Decorative stars */}
        <div className="absolute top-4 left-4 text-gold-signature/30 animate-pulse">✦</div>
        <div className="absolute top-8 right-6 text-gold-signature/20 animate-pulse delay-300">✧</div>
        <div className="absolute bottom-20 left-8 text-gold-signature/20 animate-pulse delay-500">✦</div>

        {/* Header */}
        <div className="relative p-6 border-b border-light-lavender/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <Crown className="w-6 h-6 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-golden-ivory">Programme Fidélité</h2>
                <p className="text-sm text-muted-foreground">Tes visites sont récompensées!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:glass-gold"
            >
              <X className="w-5 h-5 text-light-lavender" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-galactic-violet/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-light-lavender" />
              </div>
              <p className="text-golden-ivory mb-4">Connecte-toi pour suivre ta progression fidélité</p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg"
              >
                Se connecter
              </Button>
            </div>
          ) : (
            <>
              {/* Current Tier Display */}
              <div className="glass rounded-2xl p-6 text-center relative overflow-hidden">
                {/* Background glow */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(circle at center, ${currentTier.color} 0%, transparent 70%)` }}
                />
                
                <div className="relative">
                  <div
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: `linear-gradient(135deg, ${currentTier.color}40, ${currentTier.color}20)` }}
                  >
                    {currentTier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-golden-ivory mb-1">{currentTier.nameFr}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Niveau actuel • {currentTier.bonusPercent}% de bonus
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-gold-signature" />
                    <span className="text-lg font-medium text-gold-light">{visits} visites</span>
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {nextTier && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression vers {nextTier.nameFr}</span>
                    <span className="text-gold-light">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3 bg-cosmic-blue/30" />
                    <div
                      className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{currentTier.minVisits} visites</span>
                    <span>{nextTier.minVisits} visites</span>
                  </div>
                  <p className="text-center text-sm text-light-lavender/70">
                    Plus que <span className="text-gold-light font-medium">{nextTier.minVisits - visits} visites</span> pour atteindre {nextTier.nameFr}!
                  </p>
                </div>
              )}

              {/* Current Benefits */}
              <div className="glass rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-medium text-golden-ivory flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold-signature" />
                  Tes avantages {currentTier.nameFr}
                </h3>
                <ul className="space-y-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-light-lavender/80">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Tiers */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-golden-ivory">Tous les niveaux</h3>
                <div className="space-y-2">
                  {LOYALTY_TIERS.map((tier) => (
                    <div
                      key={tier.name}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl transition-all',
                        tier.name === currentTier.name
                          ? 'glass-gold'
                          : 'glass opacity-60 hover:opacity-100'
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ background: `${tier.color}30` }}
                      >
                        {tier.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-golden-ivory">{tier.nameFr}</span>
                          <span className="text-sm text-gold-light">+{tier.bonusPercent}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {tier.maxVisits === Infinity 
                            ? `${tier.minVisits}+ visites`
                            : `${tier.minVisits}-${tier.maxVisits} visites`
                          }
                        </span>
                      </div>
                      {tier.name === currentTier.name && (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                      {nextTier && tier.name === nextTier.name && (
                        <ChevronRight className="w-5 h-5 text-gold-signature" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Crystal Bonus Preview */}
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Bonus actuel sur les achats</p>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-signature" />
                  <span className="text-2xl font-bold text-gold-light">{currentTier.bonusPercent}%</span>
                  <span className="text-light-lavender/70">de cristaux bonus</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-light-lavender/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-light-lavender/20 text-light-lavender hover:glass-gold hover:text-gold-light"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoyaltyModal;

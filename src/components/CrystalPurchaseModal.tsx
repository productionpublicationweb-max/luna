'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Crown, Star, Zap, Check } from 'lucide-react';

interface CrystalPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const crystalPackages = [
  {
    crystals: 100,
    price: 4.99,
    icon: Sparkles,
    popular: false,
    bonus: null
  },
  {
    crystals: 250,
    price: 9.99,
    icon: Star,
    popular: true,
    bonus: "+25 Bonus"
  },
  {
    crystals: 500,
    price: 17.99,
    icon: Crown,
    popular: false,
    bonus: "+75 Bonus"
  },
  {
    crystals: 1000,
    price: 29.99,
    icon: Zap,
    popular: false,
    bonus: "+200 Bonus"
  }
];

export function CrystalPurchaseModal({ isOpen, onClose, onPurchase }: CrystalPurchaseModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg transform transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        <div className="glass-dark rounded-3xl overflow-hidden shadow-2xl border border-light-lavender/20">
          {/* Decorative stars */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-gold-light rounded-full animate-pulse" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-light-lavender rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-gold-signature rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Header */}
          <div className="relative p-6 border-b border-light-lavender/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:glass-gold transition-all"
            >
              <X className="w-5 h-5 text-light-lavender" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-7 h-7 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold gradient-text-gold">Acheter des Cristaux</h2>
                <p className="text-sm text-muted-foreground">Débloquez plus de secrets mystiques</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Banner */}
            <div className="mb-6 p-4 rounded-xl glass-gold">
              <p className="text-sm text-center text-golden-ivory">
                💎 Les cristaux vous permettent d&apos;accéder aux tirages premium et consultations spéciales
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid gap-4">
              {crystalPackages.map((pkg, index) => (
                <button
                  key={index}
                  onClick={() => onPurchase(pkg.crystals)}
                  className={cn(
                    'relative w-full p-4 rounded-xl transition-all group text-left',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    pkg.popular 
                      ? 'glass-gold border-2 border-gold-signature/50 hover:border-gold-light' 
                      : 'glass hover:glass-gold'
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 right-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-gold-signature to-gold-deep text-dark-space-bg rounded-full">
                        Meilleure Valeur
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        pkg.popular 
                          ? 'bg-gradient-to-br from-gold-signature to-gold-deep' 
                          : 'bg-cosmic-blue/50'
                      )}>
                        <pkg.icon className={cn(
                          'w-6 h-6',
                          pkg.popular ? 'text-dark-space-bg' : 'text-light-lavender'
                        )} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-golden-ivory group-hover:text-gold-light transition-colors">
                          {pkg.crystals.toLocaleString()} Cristaux
                        </p>
                        {pkg.bonus && (
                          <p className="text-sm text-gold-signature">{pkg.bonus}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-gold-light">€{pkg.price}</p>
                      <p className="text-xs text-muted-foreground">
                        €{(pkg.price / pkg.crystals).toFixed(3)}/cristal
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Features List */}
            <div className="mt-6 p-4 rounded-xl glass">
              <p className="text-sm font-medium text-golden-ivory mb-3">Avantages Premium :</p>
              <div className="space-y-2">
                {[
                  'Tirages de Tarot illimités',
                  'Interprétations détaillées',
                  'Consultations prioritaires',
                  'Badges exclusifs'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold-signature" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-light-lavender/10">
            <p className="text-xs text-center text-muted-foreground">
              Paiement sécurisé • Satisfaction garantie •{' '}
              <a 
                href="https://oznya.com/support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-signature hover:text-gold-light transition-colors"
              >
                Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CrystalPurchaseModal;

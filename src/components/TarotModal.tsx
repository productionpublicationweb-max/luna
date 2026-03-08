'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, X } from 'lucide-react';

// 22 Major Arcana Cards
const TAROT_CARDS: TarotCard[] = [
  { id: 0, name: 'The Fool', nameFr: 'Le Mat', meaning: 'Nouveaux départs, innocence, spontanéité, foi en l\'avenir', reversedMeaning: 'Imprudence, risque, naïveté, refus de changer', symbol: '🎭' },
  { id: 1, name: 'The Magician', nameFr: 'Le Bateleur', meaning: 'Manifestation, créativité, volonté, nouveaux départs', reversedMeaning: 'Manipulation, tromperie, talent gâché', symbol: '🎩' },
  { id: 2, name: 'The High Priestess', nameFr: 'La Papesse', meaning: 'Intuition, mystère, sagesse intérieure, inconscient', reversedMeaning: 'Secrets, déconnexion de l\'intuition', symbol: '🌙' },
  { id: 3, name: 'The Empress', nameFr: 'L\'Impératrice', meaning: 'Féminité, fertilité, nature, abondance', reversedMeaning: 'Dépendance, étouffement, vide créatif', symbol: '👑' },
  { id: 4, name: 'The Emperor', nameFr: 'L\'Empereur', meaning: 'Autorité, structure, stabilité, père', reversedMeaning: 'Tyrannie, rigidité, contrôle excessif', symbol: '🦁' },
  { id: 5, name: 'The Hierophant', nameFr: 'Le Pape', meaning: 'Tradition, spiritualité, enseignement, conformité', reversedMeaning: 'Rébellion, non-conformité, nouvelles approches', symbol: '⛪' },
  { id: 6, name: 'The Lovers', nameFr: 'L\'Amoureux', meaning: 'Amour, harmonie, choix, relations', reversedMeaning: 'Déséquilibre, mauvais choix, conflit', symbol: '💕' },
  { id: 7, name: 'The Chariot', nameFr: 'Le Chariot', meaning: 'Victoire, volonté, détermination, succès', reversedMeaning: 'Manque de direction, agressivité', symbol: '⚔️' },
  { id: 8, name: 'Justice', nameFr: 'La Justice', meaning: 'Équilibre, vérité, justice, cause et effet', reversedMeaning: 'Injustice, déni de vérité', symbol: '⚖️' },
  { id: 9, name: 'The Hermit', nameFr: 'L\'Hermite', meaning: 'Introspection, solitude, sagesse, guidance', reversedMeaning: 'Isolation, retrait excessif', symbol: '🏮' },
  { id: 10, name: 'Wheel of Fortune', nameFr: 'La Roue de Fortune', meaning: 'Chance, destin, cycles, changement', reversedMeaning: 'Mauvaise chance, résistance au changement', symbol: '🎡' },
  { id: 11, name: 'Strength', nameFr: 'La Force', meaning: 'Courage, patience, contrôle, force intérieure', reversedMeaning: 'Faiblesse, manque de confiance', symbol: '🦋' },
  { id: 12, name: 'The Hanged Man', nameFr: 'Le Pendu', meaning: 'Pause, sacrifice, nouvelle perspective, lâcher-prise', reversedMeaning: 'Indécision, retard, sacrifice inutile', symbol: '🔮' },
  { id: 13, name: 'Death', nameFr: 'Arcane sans Nom', meaning: 'Transformation, fin, changement profond, renaissance', reversedMeaning: 'Résistance au changement, stagnation', symbol: '🦋' },
  { id: 14, name: 'Temperance', nameFr: 'Tempérance', meaning: 'Équilibre, modération, patience, harmonie', reversedMeaning: 'Déséquilibre, excès, impatience', symbol: '🌈' },
  { id: 15, name: 'The Devil', nameFr: 'Le Diable', meaning: 'Attachement, addiction, matérialisme, ombre', reversedMeaning: 'Libération, briser les chaînes', symbol: '⛓️' },
  { id: 16, name: 'The Tower', nameFr: 'La Maison Dieu', meaning: 'Bouleversement, révélation, destruction nécessaire', reversedMeaning: 'Transformation évitée, peur du changement', symbol: '⚡' },
  { id: 17, name: 'The Star', nameFr: 'L\'Étoile', meaning: 'Espoir, inspiration, renouveau, sérénité', reversedMeaning: 'Désespoir, perte de foi', symbol: '⭐' },
  { id: 18, name: 'The Moon', nameFr: 'La Lune', meaning: 'Illusion, intuition, inconscient, rêves', reversedMeaning: 'Confusion, peur, déception', symbol: '🌙' },
  { id: 19, name: 'The Sun', nameFr: 'Le Soleil', meaning: 'Joie, succès, vitalité, positivité', reversedMeaning: 'Optimisme excessif, absence de joie', symbol: '☀️' },
  { id: 20, name: 'Judgement', nameFr: 'Le Jugement', meaning: 'Réveil, renaissance, appel intérieur, rédemption', reversedMeaning: 'Doute de soi, refus de l\'appel', symbol: '📯' },
  { id: 21, name: 'The World', nameFr: 'Le Monde', meaning: 'Accomplissement, intégration, voyage, réussite', reversedMeaning: 'Inachèvement, absence de clôture', symbol: '🌍' },
];

interface TarotCard {
  id: number;
  name: string;
  nameFr: string;
  meaning: string;
  reversedMeaning: string;
  symbol: string;
}

interface DrawnCard extends TarotCard {
  isReversed: boolean;
}

interface TarotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
}

type SpreadType = 'single' | 'three';

export function TarotModal({ isOpen, onClose, onAwardPoints }: TarotModalProps) {
  const [phase, setPhase] = useState<'select' | 'draw' | 'reveal' | 'interpretation'>('select');
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [availableCards, setAvailableCards] = useState<TarotCard[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetReading();
    }
  }, [isOpen]);

  const resetReading = useCallback(() => {
    setPhase('select');
    setSelectedCards([]);
    setAvailableCards([...TAROT_CARDS]);
    setInterpretation('');
    setIsLoading(false);
  }, []);

  const shuffleCards = useCallback(() => {
    setShuffling(true);
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      setAvailableCards(shuffled);
      setShuffling(false);
    }, 800);
  }, []);

  const selectCard = useCallback((card: TarotCard) => {
    if (phase !== 'draw') return;
    if (selectedCards.find(c => c.id === card.id)) return;

    const isReversed = Math.random() > 0.7;
    const drawnCard: DrawnCard = { ...card, isReversed };
    
    const newSelected = [...selectedCards, drawnCard];
    setSelectedCards(newSelected);

    // Remove from available
    setAvailableCards(prev => prev.filter(c => c.id !== card.id));

    // Check if selection complete
    const maxCards = spreadType === 'three' ? 3 : 1;
    if (newSelected.length >= maxCards) {
      setTimeout(() => {
        setPhase('reveal');
      }, 500);
    }
  }, [phase, selectedCards, spreadType]);

  const startDrawing = useCallback((type: SpreadType) => {
    setSpreadType(type);
    setPhase('draw');
    shuffleCards();
  }, [shuffleCards]);

  const getInterpretation = useCallback(async () => {
    if (selectedCards.length === 0) return;

    setIsLoading(true);
    setPhase('interpretation');

    try {
      const cardsInfo = selectedCards.map((card, index) => {
        const position = spreadType === 'three' 
          ? ['Passé', 'Présent', 'Futur'][index] 
          : 'Votre carte';
        return `${position}: ${card.nameFr} (${card.name}) ${card.isReversed ? '(Inversée)' : ''} - ${card.isReversed ? card.reversedMeaning : card.meaning}`;
      }).join('\n');

      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: cardsInfo,
          spreadType
        })
      });

      const data = await response.json();
      setInterpretation(data.interpretation || data.error || 'Les étoiles gardent leur mystère...');

      // Award crystals
      const points = spreadType === 'three' ? 50 : 25;
      onAwardPoints(points);

    } catch (error) {
      console.error('Error getting interpretation:', error);
      setInterpretation('Une perturbation cosmique a eu lieu... Les arcanes restent silencieux.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCards, spreadType, onAwardPoints]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Glassmorphism container */}
        <div className="glass rounded-3xl p-6 shadow-2xl border border-gold-signature/20">
          {/* Stars decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gold-light rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.3 + Math.random() * 0.5
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-light-lavender" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text-gold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Tarot Divinatoire
            </h2>
            <p className="text-light-lavender/70 text-sm mt-1">
              Laisse les arcanes révéler ton destin
            </p>
          </div>

          {/* Content based on phase */}
          {phase === 'select' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-soft-champagne">
                Choisis ton tirage, âme curieuse :
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => startDrawing('single')}
                  className={cn(
                    "glass-gold text-gold-signature hover:bg-gold-signature/20",
                    "px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🎴</span>
                    <span>Tirage Simple</span>
                    <span className="text-xs opacity-70">1 carte</span>
                  </div>
                </Button>
                <Button
                  onClick={() => startDrawing('three')}
                  className={cn(
                    "glass-gold text-gold-signature hover:bg-gold-signature/20",
                    "px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🎴🎴🎴</span>
                    <span>Tirage Triple</span>
                    <span className="text-xs opacity-70">Passé • Présent • Futur</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {phase === 'draw' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-center text-soft-champagne mb-4">
                {spreadType === 'three' 
                  ? `Sélectionne ${3 - selectedCards.length} carte${selectedCards.length < 2 ? 's' : ''}...`
                  : 'Sélectionne une carte...'}
              </p>

              {/* Selected cards */}
              {selectedCards.length > 0 && (
                <div className="flex justify-center gap-2 mb-4">
                  {selectedCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="w-16 h-24 glass-gold rounded-lg flex items-center justify-center animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="text-2xl">{card.symbol}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Card spread */}
              <div className={cn(
                "grid gap-2 transition-all duration-500",
                shuffling ? "opacity-0 scale-95" : "opacity-100 scale-100",
                "grid-cols-6 sm:grid-cols-8"
              )}>
                {availableCards.slice(0, 22).map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => selectCard(card)}
                    disabled={phase !== 'draw'}
                    className={cn(
                      "aspect-[2/3] rounded-lg transition-all duration-300",
                      "glass hover:glass-gold cursor-pointer",
                      "hover:scale-110 hover:-translate-y-1",
                      "flex items-center justify-center",
                      "border border-gold-signature/30",
                      "group"
                    )}
                    style={{ 
                      animationDelay: `${index * 0.02}s`,
                      transform: `rotate(${(Math.random() - 0.5) * 10}deg)`
                    }}
                  >
                    <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">
                      ✧
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-gold-light">
                ✨ Tes cartes sont révélées ✨
              </p>

              {/* Revealed cards */}
              <div className="flex justify-center gap-4 flex-wrap">
                {selectedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={cn(
                      "w-28 h-44 rounded-xl p-3 flex flex-col items-center justify-center",
                      "glass-gold border border-gold-signature/40",
                      card.isReversed && "rotate-180"
                    )}>
                      <span className="text-3xl mb-2" style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}>
                        {card.symbol}
                      </span>
                      <span className={cn(
                        "text-xs text-center font-medium",
                        card.isReversed && "rotate-180"
                      )} style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}>
                        {card.nameFr}
                      </span>
                      {card.isReversed && (
                        <span className="absolute top-2 right-2 text-xs text-stellar-mauve rotate-0">
                          ↺
                        </span>
                      )}
                    </div>
                    {spreadType === 'three' && (
                      <p className="text-center text-xs text-light-lavender mt-2">
                        {['Passé', 'Présent', 'Futur'][index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Card meanings */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {selectedCards.map((card, index) => (
                  <div key={card.id} className="glass rounded-lg p-3">
                    <p className="font-medium text-gold-light">
                      {spreadType === 'three' && <span className="text-stellar-mauve">[{['Passé', 'Présent', 'Futur'][index]}]</span>} {card.nameFr}
                      {card.isReversed && <span className="text-stellar-mauve"> (Inversée)</span>}
                    </p>
                    <p className="text-sm text-soft-champagne/80 mt-1">
                      {card.isReversed ? card.reversedMeaning : card.meaning}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={getInterpretation}
                  disabled={isLoading}
                  className="glass-gold text-gold-signature hover:bg-gold-signature/30 px-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">✧</span>
                      Interprétation...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Interprétation Divine
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {phase === 'interpretation' && (
            <div className="space-y-4 animate-fade-in">
              {/* Cards reminder */}
              <div className="flex justify-center gap-2">
                {selectedCards.map((card) => (
                  <div key={card.id} className="w-12 h-18 glass-gold rounded-lg flex items-center justify-center">
                    <span className="text-lg">{card.symbol}</span>
                  </div>
                ))}
              </div>

              {/* Interpretation */}
              <div className="glass rounded-xl p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : (
                  <p className="text-soft-champagne whitespace-pre-line leading-relaxed">
                    {interpretation}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={resetReading}
                  variant="outline"
                  className="border-gold-signature/30 text-gold-light hover:bg-gold-signature/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nouveau Tirage
                </Button>
                <Button
                  onClick={onClose}
                  className="glass-gold text-gold-signature"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarotModal;

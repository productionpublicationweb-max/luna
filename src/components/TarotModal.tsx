'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, X } from 'lucide-react';

// 22 Major Arcana Cards with Roman numerals
const TAROT_CARDS: TarotCard[] = [
  { id: 0, numeral: '0', name: 'The Fool', nameFr: 'Le Mat', meaning: 'Nouveaux départs, innocence, spontanéité, foi en l\'avenir', reversedMeaning: 'Imprudence, risque, naïveté, refus de changer' },
  { id: 1, numeral: 'I', name: 'The Magician', nameFr: 'Le Bateleur', meaning: 'Manifestation, créativité, volonté, nouveaux départs', reversedMeaning: 'Manipulation, tromperie, talent gâché' },
  { id: 2, numeral: 'II', name: 'The High Priestess', nameFr: 'La Papesse', meaning: 'Intuition, mystère, sagesse intérieure, inconscient', reversedMeaning: 'Secrets, déconnexion de l\'intuition' },
  { id: 3, numeral: 'III', name: 'The Empress', nameFr: 'L\'Impératrice', meaning: 'Féminité, fertilité, nature, abondance', reversedMeaning: 'Dépendance, étouffement, vide créatif' },
  { id: 4, numeral: 'IV', name: 'The Emperor', nameFr: 'L\'Empereur', meaning: 'Autorité, structure, stabilité, père', reversedMeaning: 'Tyrannie, rigidité, contrôle excessif' },
  { id: 5, numeral: 'V', name: 'The Hierophant', nameFr: 'Le Pape', meaning: 'Tradition, spiritualité, enseignement, conformité', reversedMeaning: 'Rébellion, non-conformité, nouvelles approches' },
  { id: 6, numeral: 'VI', name: 'The Lovers', nameFr: 'L\'Amoureux', meaning: 'Amour, harmonie, choix, relations', reversedMeaning: 'Déséquilibre, mauvais choix, conflit' },
  { id: 7, numeral: 'VII', name: 'The Chariot', nameFr: 'Le Chariot', meaning: 'Victoire, volonté, détermination, succès', reversedMeaning: 'Manque de direction, agressivité' },
  { id: 8, numeral: 'VIII', name: 'Justice', nameFr: 'La Justice', meaning: 'Équilibre, vérité, justice, cause et effet', reversedMeaning: 'Injustice, déni de vérité' },
  { id: 9, numeral: 'IX', name: 'The Hermit', nameFr: 'L\'Hermite', meaning: 'Introspection, solitude, sagesse, guidance', reversedMeaning: 'Isolation, retrait excessif' },
  { id: 10, numeral: 'X', name: 'Wheel of Fortune', nameFr: 'La Roue de Fortune', meaning: 'Chance, destin, cycles, changement', reversedMeaning: 'Mauvaise chance, résistance au changement' },
  { id: 11, numeral: 'XI', name: 'Strength', nameFr: 'La Force', meaning: 'Courage, patience, contrôle, force intérieure', reversedMeaning: 'Faiblesse, manque de confiance' },
  { id: 12, numeral: 'XII', name: 'The Hanged Man', nameFr: 'Le Pendu', meaning: 'Pause, sacrifice, nouvelle perspective, lâcher-prise', reversedMeaning: 'Indécision, retard, sacrifice inutile' },
  { id: 13, numeral: 'XIII', name: 'Death', nameFr: 'Arcane sans Nom', meaning: 'Transformation, fin, changement profond, renaissance', reversedMeaning: 'Résistance au changement, stagnation' },
  { id: 14, numeral: 'XIV', name: 'Temperance', nameFr: 'Tempérance', meaning: 'Équilibre, modération, patience, harmonie', reversedMeaning: 'Déséquilibre, excès, impatience' },
  { id: 15, numeral: 'XV', name: 'The Devil', nameFr: 'Le Diable', meaning: 'Attachement, addiction, matérialisme, ombre', reversedMeaning: 'Libération, briser les chaînes' },
  { id: 16, numeral: 'XVI', name: 'The Tower', nameFr: 'La Maison Dieu', meaning: 'Bouleversement, révélation, destruction nécessaire', reversedMeaning: 'Transformation évitée, peur du changement' },
  { id: 17, numeral: 'XVII', name: 'The Star', nameFr: 'L\'Étoile', meaning: 'Espoir, inspiration, renouveau, sérénité', reversedMeaning: 'Désespoir, perte de foi' },
  { id: 18, numeral: 'XVIII', name: 'The Moon', nameFr: 'La Lune', meaning: 'Illusion, intuition, inconscient, rêves', reversedMeaning: 'Confusion, peur, déception' },
  { id: 19, numeral: 'XIX', name: 'The Sun', nameFr: 'Le Soleil', meaning: 'Joie, succès, vitalité, positivité', reversedMeaning: 'Optimisme excessif, absence de joie' },
  { id: 20, numeral: 'XX', name: 'Judgement', nameFr: 'Le Jugement', meaning: 'Réveil, renaissance, appel intérieur, rédemption', reversedMeaning: 'Doute de soi, refus de l\'appel' },
  { id: 21, numeral: 'XXI', name: 'The World', nameFr: 'Le Monde', meaning: 'Accomplissement, intégration, voyage, réussite', reversedMeaning: 'Inachèvement, absence de clôture' },
];

interface TarotCard {
  id: number;
  numeral: string;
  name: string;
  nameFr: string;
  meaning: string;
  reversedMeaning: string;
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

// Beautiful Tarot Card Component
function TarotCardDisplay({ card, isReversed, size = 'md', showDetails = false }: { 
  card: TarotCard | null; 
  isReversed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-12 h-18 text-xs',
    md: 'w-28 h-44 text-sm',
    lg: 'w-32 h-48 text-base'
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden transition-all duration-500",
      sizeClasses[size],
      isReversed && "rotate-180"
    )}>
      {/* Card Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-blue via-deep-indigo to-galactic-violet" />
      
      {/* Gold border frame */}
      <div className="absolute inset-0 border-2 border-gold-signature/60 rounded-xl" />
      
      {/* Inner decorative frame */}
      <div className="absolute inset-2 border border-gold-light/30 rounded-lg" />
      
      {/* Corner ornaments */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-gold-light/50" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-gold-light/50" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-gold-light/50" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-gold-light/50" />
      
      {card && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-2" style={{ transform: isReversed ? 'rotate(180deg)' : 'none' }}>
          {/* Roman Numeral */}
          <div className="text-gold-light font-serif text-lg md:text-2xl font-bold tracking-wider">
            {card.numeral}
          </div>
          
          {/* Mystical symbol - decorative lines */}
          <div className="my-2 md:my-3 w-6 md:w-10 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
          
          {/* Card Name */}
          <div className="text-center">
            <p className="text-golden-ivory text-xs md:text-sm font-medium leading-tight">
              {card.nameFr}
            </p>
          </div>
          
          {/* Decorative star */}
          <div className="mt-2 md:mt-3 text-gold-light/70 text-xs">
            ✦
          </div>
        </div>
      )}
      
      {/* Reversed indicator */}
      {isReversed && (
        <div className="absolute top-2 right-2 text-stellar-mauve text-lg z-20" style={{ transform: 'rotate(180deg)' }}>
          ↺
        </div>
      )}
    </div>
  );
}

// Card Back Component
function TarotCardBack({ onClick, selected }: { onClick?: () => void; selected?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300",
        "hover:scale-105 hover:-translate-y-2",
        "border border-gold-signature/30",
        selected && "ring-2 ring-gold-light scale-105"
      )}
    >
      {/* Card Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-blue via-deep-indigo to-galactic-violet" />
      
      {/* Mystical pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          {/* Central eye pattern */}
          <circle cx="50" cy="75" r="30" fill="none" stroke="#D6A73D" strokeWidth="1" />
          <circle cx="50" cy="75" r="20" fill="none" stroke="#F1D37A" strokeWidth="0.5" />
          <circle cx="50" cy="75" r="10" fill="none" stroke="#D6A73D" strokeWidth="0.5" />
          
          {/* Star pattern */}
          <path d="M50 20 L53 30 L63 30 L55 37 L58 47 L50 40 L42 47 L45 37 L37 30 L47 30 Z" fill="none" stroke="#F1D37A" strokeWidth="0.5" />
          <path d="M50 130 L53 120 L63 120 L55 113 L58 103 L50 110 L42 103 L45 113 L37 120 L47 120 Z" fill="none" stroke="#F1D37A" strokeWidth="0.5" />
          
          {/* Corner decorations */}
          <path d="M10 10 L20 10 L10 20 Z" fill="none" stroke="#D6A73D" strokeWidth="0.5" />
          <path d="M90 10 L80 10 L90 20 Z" fill="none" stroke="#D6A73D" strokeWidth="0.5" />
          <path d="M10 140 L20 140 L10 130 Z" fill="none" stroke="#D6A73D" strokeWidth="0.5" />
          <path d="M90 140 L80 140 L90 130 Z" fill="none" stroke="#D6A73D" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Border frame */}
      <div className="absolute inset-0 border-2 border-gold-signature/40 rounded-xl" />
      <div className="absolute inset-1.5 border border-gold-light/20 rounded-lg" />
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gold-light/60 text-2xl">✧</span>
      </div>
    </button>
  );
}

export function TarotModal({ isOpen, onClose, onAwardPoints }: TarotModalProps) {
  const [phase, setPhase] = useState<'select' | 'draw' | 'reveal' | 'interpretation'>('select');
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [availableCards, setAvailableCards] = useState<TarotCard[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
    setAvailableCards(prev => prev.filter(c => c.id !== card.id));

    const maxCards = spreadType === 'three' ? 3 : 1;
    if (newSelected.length >= maxCards) {
      setTimeout(() => setPhase('reveal'), 500);
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
        body: JSON.stringify({ cards: cardsInfo, spreadType })
      });

      const data = await response.json();
      setInterpretation(data.interpretation || data.error || 'Les étoiles gardent leur mystère...');

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
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

          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-light-lavender" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text-gold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Tarot Divinatoire
            </h2>
            <p className="text-light-lavender/70 text-sm mt-1">
              Laisse les arcanes révéler ton destin
            </p>
          </div>

          {phase === 'select' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-soft-champagne">Choisis ton tirage, âme curieuse :</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => startDrawing('single')}
                  className="btn-luna-vitreux px-8 py-6 text-lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center">
                      <TarotCardDisplay card={null} size="sm" />
                    </div>
                    <span>Tirage Simple</span>
                    <span className="text-xs opacity-70">1 carte</span>
                  </div>
                </Button>
                <Button
                  onClick={() => startDrawing('three')}
                  className="btn-luna-vitreux px-8 py-6 text-lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1 justify-center">
                      <TarotCardDisplay card={null} size="sm" />
                      <TarotCardDisplay card={null} size="sm" />
                      <TarotCardDisplay card={null} size="sm" />
                    </div>
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

              {selectedCards.length > 0 && (
                <div className="flex justify-center gap-2 mb-4">
                  {selectedCards.map((card) => (
                    <TarotCardDisplay key={card.id} card={card} isReversed={card.isReversed} size="sm" />
                  ))}
                </div>
              )}

              <div className={cn(
                "grid gap-2 transition-all duration-500",
                shuffling ? "opacity-0 scale-95" : "opacity-100 scale-100",
                "grid-cols-6 sm:grid-cols-8"
              )}>
                {availableCards.slice(0, 22).map((card, index) => (
                  <TarotCardBack 
                    key={card.id} 
                    onClick={() => selectCard(card)}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-gold-light">✨ Tes cartes sont révélées ✨</p>

              <div className="flex justify-center gap-4 flex-wrap">
                {selectedCards.map((card, index) => (
                  <div key={card.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <TarotCardDisplay card={card} isReversed={card.isReversed} size="lg" />
                    {spreadType === 'three' && (
                      <p className="text-center text-xs text-light-lavender mt-2">
                        {['Passé', 'Présent', 'Futur'][index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

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

              <div className="flex justify-center">
                <Button
                  onClick={getInterpretation}
                  disabled={isLoading}
                  className="btn-luna-vitreux px-6"
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
              <div className="flex justify-center gap-2">
                {selectedCards.map((card) => (
                  <TarotCardDisplay key={card.id} card={card} isReversed={card.isReversed} size="sm" />
                ))}
              </div>

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

              <div className="flex justify-center gap-3">
                <Button onClick={resetReading} className="btn-luna-vitreux-sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nouveau Tirage
                </Button>
                <Button onClick={onClose} className="btn-luna-vitreux-sm">
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

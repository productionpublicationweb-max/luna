'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Star, RotateCcw, X } from 'lucide-react';

// 24 Elder Futhark Runes + Blank
const ELDER_FUTHARK_RUNES: Rune[] = [
  { id: 1, name: 'Fehu', symbol: 'ᚠ', meaning: 'Richesse, abondance, prospérité matérielle', keyword: 'Richesse' },
  { id: 2, name: 'Uruz', symbol: 'ᚢ', meaning: 'Force vitale, santé, courage, énergie primitive', keyword: 'Force' },
  { id: 3, name: 'Thurisaz', symbol: 'ᚦ', meaning: 'Protection, défense, force destructrice contrôlée', keyword: 'Protection' },
  { id: 4, name: 'Ansuz', symbol: 'ᚨ', meaning: 'Communication divine, sagesse, messages des dieux', keyword: 'Communication divine' },
  { id: 5, name: 'Raido', symbol: 'ᚱ', meaning: 'Voyage, mouvement, évolution spirituelle', keyword: 'Voyage' },
  { id: 6, name: 'Kenaz', symbol: 'ᚲ', meaning: 'Créativité, illumination, connaissance, feu créateur', keyword: 'Créativité' },
  { id: 7, name: 'Gebo', symbol: 'ᚷ', meaning: 'Don, générosité, partenariat, équilibre dans les échanges', keyword: 'Don' },
  { id: 8, name: 'Wunjo', symbol: 'ᚹ', meaning: 'Joie, harmonie, bien-être, plaisir', keyword: 'Joie' },
  { id: 9, name: 'Hagalaz', symbol: 'ᚺ', meaning: 'Transformation, changement radical, forces de la nature', keyword: 'Transformation' },
  { id: 10, name: 'Nauthiz', symbol: 'ᚾ', meaning: 'Besoin, contrainte, résistance, leçons de vie', keyword: 'Besoin' },
  { id: 11, name: 'Isa', symbol: 'ᛁ', meaning: 'Glace, pause, introspection, concentration', keyword: 'Pause' },
  { id: 12, name: 'Jera', symbol: 'ᛃ', meaning: 'Récolte, cycles, récompense du travail', keyword: 'Récolte' },
  { id: 13, name: 'Eihwaz', symbol: 'ᛇ', meaning: 'Endurance, stabilité, protection, axe du monde', keyword: 'Endurance' },
  { id: 14, name: 'Perthro', symbol: 'ᛈ', meaning: 'Mystère, destin, secrets, magie cachée', keyword: 'Mystère' },
  { id: 15, name: 'Algiz', symbol: 'ᛉ', meaning: 'Protection divine, gardien, connexion spirituelle', keyword: 'Protection' },
  { id: 16, name: 'Sowilo', symbol: 'ᛊ', meaning: 'Soleil, succès, victoire, lumière', keyword: 'Succès' },
  { id: 17, name: 'Tiwaz', symbol: 'ᛏ', meaning: 'Victoire, justice, sacrifice, honneur', keyword: 'Victoire' },
  { id: 18, name: 'Berkano', symbol: 'ᛒ', meaning: 'Croissance, fertilité, renaissance, mère nourricière', keyword: 'Croissance' },
  { id: 19, name: 'Ehwaz', symbol: 'ᛖ', meaning: 'Mouvement, partenariat, cheval, voyage', keyword: 'Mouvement' },
  { id: 20, name: 'Mannaz', symbol: 'ᛗ', meaning: 'Humanité, soi, communauté, conscience', keyword: 'Humanité' },
  { id: 21, name: 'Laguz', symbol: 'ᛚ', meaning: 'Intuition, eau, flux, inconscient', keyword: 'Intuition' },
  { id: 22, name: 'Ingwaz', symbol: 'ᛜ', meaning: 'Fertilité, potentiel, croissance interne', keyword: 'Fertilité' },
  { id: 23, name: 'Othala', symbol: 'ᛟ', meaning: 'Héritage, maison, ancêtres, propriété', keyword: 'Héritage' },
  { id: 24, name: 'Dagaz', symbol: 'ᛞ', meaning: 'Aube, révélation, éveil, transformation', keyword: 'Révélation' },
  { id: 25, name: 'Wyrd', symbol: '◌', meaning: 'Le vide, le destin inconnu, les possibilités infinies', keyword: 'Destin' },
];

interface Rune {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  keyword: string;
}

interface DrawnRune extends Rune {
  isReversed: boolean;
}

interface RunesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
}

type SpreadType = 'single' | 'three';

export function RunesModal({ isOpen, onClose, onAwardPoints }: RunesModalProps) {
  const [phase, setPhase] = useState<'select' | 'cast' | 'reveal' | 'interpretation'>('select');
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [selectedRunes, setSelectedRunes] = useState<DrawnRune[]>([]);
  const [casting, setCasting] = useState(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [fallingRunes, setFallingRunes] = useState<{ id: number; x: number; delay: number }[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetReading();
    }
  }, [isOpen]);

  const resetReading = useCallback(() => {
    setPhase('select');
    setSelectedRunes([]);
    setInterpretation('');
    setIsLoading(false);
    setFallingRunes([]);
  }, []);

  const castRunes = useCallback((type: SpreadType) => {
    setSpreadType(type);
    setCasting(true);
    setPhase('cast');

    // Generate falling rune positions
    const numRunes = type === 'three' ? 5 : 3;
    const positions = Array.from({ length: numRunes }).map((_, i) => ({
      id: i,
      x: 20 + (i * 20),
      delay: i * 0.15
    }));
    setFallingRunes(positions);

    // After casting animation, reveal selected runes
    setTimeout(() => {
      const shuffled = [...ELDER_FUTHARK_RUNES].sort(() => Math.random() - 0.5);
      const numToDraw = type === 'three' ? 3 : 1;
      const drawn = shuffled.slice(0, numToDraw).map(rune => ({
        ...rune,
        isReversed: Math.random() > 0.65
      }));
      setSelectedRunes(drawn);
      setCasting(false);
      setPhase('reveal');
    }, 1500);
  }, []);

  const getInterpretation = useCallback(async () => {
    if (selectedRunes.length === 0) return;

    setIsLoading(true);
    setPhase('interpretation');

    try {
      const runesInfo = selectedRunes.map((rune, index) => {
        const position = spreadType === 'three' 
          ? ['Situation', 'Défi', 'Guidance'][index] 
          : 'Ta rune';
        return `${position}: ${rune.name} (${rune.symbol}) ${rune.isReversed ? '(Inversée)' : ''} - ${rune.meaning}`;
      }).join('\n');

      const response = await fetch('/api/runes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runes: runesInfo,
          spreadType
        })
      });

      const data = await response.json();
      setInterpretation(data.interpretation || data.error || 'Les runes gardent leur silence...');

      // Award crystals
      const points = spreadType === 'three' ? 40 : 20;
      onAwardPoints(points);

    } catch (error) {
      console.error('Error getting interpretation:', error);
      setInterpretation('Les anciens dieux gardent leur silence... Réessaie dans un moment.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRunes, spreadType, onAwardPoints]);

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
        <div className="glass rounded-3xl p-6 shadow-2xl border border-mystic-turquoise/30">
          {/* Nordic pattern decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-mystic-turquoise/20 text-lg animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              >
                {ELDER_FUTHARK_RUNES[Math.floor(Math.random() * 24)].symbol}
              </div>
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
            <h2 className="text-2xl font-bold gradient-text-mystic flex items-center justify-center gap-2">
              <Star className="w-6 h-6" />
              Runes Anciennes
            </h2>
            <p className="text-light-lavender/70 text-sm mt-1">
              Les symboles des anciens Nordiques
            </p>
          </div>

          {/* Content based on phase */}
          {phase === 'select' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-soft-champagne">
                Choisis ton tirage, voyageuse des étoiles :
              </p>
              
              {/* Rune display */}
              <div className="flex justify-center gap-2 py-4">
                {ELDER_FUTHARK_RUNES.slice(0, 12).map((rune) => (
                  <span 
                    key={rune.id} 
                    className="text-mystic-turquoise/40 text-lg hover:text-mist-turquoise transition-colors cursor-default"
                  >
                    {rune.symbol}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => castRunes('single')}
                  className={cn(
                    "glass border border-mystic-turquoise/30 text-mist-turquoise hover:bg-mystic-turquoise/20",
                    "px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">ᚠ</span>
                    <span>Rune Unique</span>
                    <span className="text-xs opacity-70">1 rune</span>
                  </div>
                </Button>
                <Button
                  onClick={() => castRunes('three')}
                  className={cn(
                    "glass border border-mystic-turquoise/30 text-mist-turquoise hover:bg-mystic-turquoise/20",
                    "px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">ᚠ ᛊ ᛉ</span>
                    <span>Tirage Triple</span>
                    <span className="text-xs opacity-70">Situation • Défi • Guidance</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {phase === 'cast' && (
            <div className="space-y-6 animate-fade-in min-h-[300px] relative">
              <p className="text-center text-mist-turquoise">
                ✦ Les runes tombent... ✦
              </p>

              {/* Casting animation */}
              <div className="relative h-64">
                {fallingRunes.map((rune) => (
                  <div
                    key={rune.id}
                    className="absolute animate-fall"
                    style={{
                      left: `${rune.x}%`,
                      animationDelay: `${rune.delay}s`,
                    }}
                  >
                    <div className="w-12 h-16 rounded-lg glass border border-mystic-turquoise/50 flex items-center justify-center">
                      <span className="text-2xl text-mist-turquoise">
                        {ELDER_FUTHARK_RUNES[Math.floor(Math.random() * 24)].symbol}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-mist-turquoise">
                ✦ Les runes sont révélées ✦
              </p>

              {/* Revealed runes */}
              <div className="flex justify-center gap-6 flex-wrap">
                {selectedRunes.map((rune, index) => (
                  <div
                    key={rune.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={cn(
                      "w-24 h-32 rounded-xl flex flex-col items-center justify-center",
                      "glass border-2 border-mystic-turquoise/50",
                      "hover:scale-105 transition-transform",
                      rune.isReversed && "rotate-180"
                    )}>
                      <span 
                        className="text-4xl text-mist-turquoise"
                        style={{ transform: rune.isReversed ? 'rotate(180deg)' : 'none' }}
                      >
                        {rune.symbol}
                      </span>
                      <span 
                        className="text-sm text-light-lavender mt-2"
                        style={{ transform: rune.isReversed ? 'rotate(180deg)' : 'none' }}
                      >
                        {rune.name}
                      </span>
                    </div>
                    {spreadType === 'three' && (
                      <p className="text-center text-xs text-light-lavender/70 mt-2">
                        {['Situation', 'Défi', 'Guidance'][index]}
                      </p>
                    )}
                    {rune.isReversed && (
                      <p className="text-center text-xs text-stellar-mauve mt-1">
                        (Inversée)
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Rune meanings */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {selectedRunes.map((rune, index) => (
                  <div key={rune.id} className="glass rounded-lg p-3">
                    <p className="font-medium text-mist-turquoise">
                      {spreadType === 'three' && <span className="text-stellar-mauve">[{['Situation', 'Défi', 'Guidance'][index]}]</span>} {rune.name}
                      {rune.isReversed && <span className="text-stellar-mauve"> (Inversée)</span>}
                    </p>
                    <p className="text-xs text-gold-light mt-1">
                      Mot-clé: {rune.keyword}
                    </p>
                    <p className="text-sm text-soft-champagne/80 mt-1">
                      {rune.meaning}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={getInterpretation}
                  disabled={isLoading}
                  className="glass border border-mystic-turquoise/30 text-mist-turquoise hover:bg-mystic-turquoise/20 px-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">ᚠ</span>
                      Interprétation...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Sagesse des Anciens
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {phase === 'interpretation' && (
            <div className="space-y-4 animate-fade-in">
              {/* Runes reminder */}
              <div className="flex justify-center gap-2">
                {selectedRunes.map((rune) => (
                  <div key={rune.id} className="w-10 h-12 glass border border-mystic-turquoise/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg text-mist-turquoise">{rune.symbol}</span>
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
                  className="border-mystic-turquoise/30 text-mist-turquoise hover:bg-mystic-turquoise/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nouveau Tirage
                </Button>
                <Button
                  onClick={onClose}
                  className="glass border border-mystic-turquoise/30 text-mist-turquoise hover:bg-mystic-turquoise/20"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 1.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

export default RunesModal;

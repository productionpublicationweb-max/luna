'use client';

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Moon, X, Sparkles } from 'lucide-react';

// 8 Lunar Phases
const LUNAR_PHASES: LunarPhase[] = [
  {
    id: 1,
    name: 'Nouvelle Lune',
    nameEn: 'New Moon',
    emoji: '🌑',
    energy: 'Nouveaux départs, intentions, semer les graines',
    description: 'La lune est invisible, plongeant le ciel dans l\'obscurité. C\'est le moment idéal pour poser des intentions et commencer de nouveaux projets. L\'énergie est celle du potentiel pur.',
    activities: ['Méditation', 'Fixer des intentions', 'Planification', 'Repos']
  },
  {
    id: 2,
    name: 'Croissant',
    nameEn: 'Waxing Crescent',
    emoji: '🌒',
    energy: 'Croissance, espoir, premiers pas',
    description: 'Une fine lueur apparaît dans le ciel nocturne. L\'énergie monte, c\'est le moment d\'agir sur vos intentions et de faire les premiers pas vers vos objectifs.',
    activities: ['Action', 'Visualisation', 'Affirmations', 'Networking']
  },
  {
    id: 3,
    name: 'Premier Quartier',
    nameEn: 'First Quarter',
    emoji: '🌓',
    energy: 'Décision, action, défis à surmonter',
    description: 'La lune est à moitié illuminée. C\'est un moment de décision et d\'action. Des obstacles peuvent apparaître, mais ils sont là pour vous renforcer.',
    activities: ['Prise de décision', 'Résolution de problèmes', 'Détermination', 'Courage']
  },
  {
    id: 4,
    name: 'Gibbeuse Croissante',
    nameEn: 'Waxing Gibbous',
    emoji: '🌔',
    energy: 'Raffinement, patience, ajustements',
    description: 'La lune grandit vers la plénitude. C\'est le moment de peaufiner vos projets, d\'ajuster le tir et de préparer la récolte à venir.',
    activities: ['Raffinement', 'Détails', 'Patience', 'Préparation']
  },
  {
    id: 5,
    name: 'Pleine Lune',
    nameEn: 'Full Moon',
    emoji: '🌕',
    energy: 'Accomplissement, révélation, énergie maximale',
    description: 'La lune brille de tout son éclat. C\'est le pic énergétique du cycle lunaire, un moment de célébration, de révélation et d\'accomplissement.',
    activities: ['Célébration', 'Gratitude', 'Manifestation', 'Lâcher-prise']
  },
  {
    id: 6,
    name: 'Gibbeuse Décroissante',
    nameEn: 'Waning Gibbous',
    emoji: '🌖',
    energy: 'Partage, introspection, gratitude',
    description: 'La lune commence à décroître. C\'est le temps du partage, de la distribution de vos réalisations et de la réflexion sur ce qui a été accompli.',
    activities: ['Partage', 'Enseignement', 'Gratitude', 'Réflexion']
  },
  {
    id: 7,
    name: 'Dernier Quartier',
    nameEn: 'Last Quarter',
    emoji: '🌗',
    energy: 'Lâcher-prise, pardon, nettoyage',
    description: 'La lune est à nouveau à moitié illuminée, mais dans l\'autre sens. C\'est le moment de laisser partir ce qui ne vous sert plus, de pardonner et de nettoyer.',
    activities: ['Lâcher-prise', 'Pardon', 'Nettoyage', 'Libération']
  },
  {
    id: 8,
    name: 'Décroissant',
    nameEn: 'Waning Crescent',
    emoji: '🌘',
    energy: 'Repos, guérison, préparation au nouveau',
    description: 'La dernière lueur avant l\'obscurité. C\'est un temps de repos, de guérison profonde et de préparation pour le prochain cycle.',
    activities: ['Repos', 'Guérison', 'Rêves', 'Introspection']
  }
];

interface LunarPhase {
  id: number;
  name: string;
  nameEn: string;
  emoji: string;
  energy: string;
  description: string;
  activities: string[];
}

interface LunarPhasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
}

// Moon phase calculation
const SYNODIC_MONTH = 29.53058867; // Average length of lunar cycle in days
const KNOWN_NEW_MOON = new Date('2024-01-11T11:57:00Z'); // Known new moon date

function getCurrentMoonPhase(date: Date = new Date()): { phaseIndex: number; phase: LunarPhase; illumination: number; daysToNext: number } {
  const daysSinceKnownNew = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const currentCycleDay = ((daysSinceKnownNew % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  
  // Calculate phase index (0-7)
  const phaseIndex = Math.floor((currentCycleDay / SYNODIC_MONTH) * 8) % 8;
  
  // Calculate illumination percentage
  const angle = (currentCycleDay / SYNODIC_MONTH) * 2 * Math.PI;
  const illumination = (1 - Math.cos(angle)) / 2 * 100;
  
  // Days to next new moon
  const daysToNext = SYNODIC_MONTH - currentCycleDay;
  
  return {
    phaseIndex,
    phase: LUNAR_PHASES[phaseIndex],
    illumination: Math.round(illumination),
    daysToNext: Math.round(daysToNext)
  };
}

export function LunarPhasesModal({ isOpen, onClose, onAwardPoints }: LunarPhasesModalProps) {
  const [selectedPhase, setSelectedPhase] = useState<LunarPhase | null>(null);
  const [currentPhase, setCurrentPhase] = useState<ReturnType<typeof getCurrentMoonPhase> | null>(null);
  const [showIntention, setShowIntention] = useState(false);
  const [intention, setIntention] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate current phase
  useEffect(() => {
    if (isOpen) {
      const phase = getCurrentMoonPhase();
      setCurrentPhase(phase);
      setSelectedPhase(null);
      setShowIntention(false);
      setIntention('');
    }
  }, [isOpen]);

  const handleSetIntention = useCallback(async () => {
    if (!intention.trim() || !currentPhase) return;

    setIsSaving(true);
    
    // Save intention to localStorage
    try {
      const intentions = JSON.parse(localStorage.getItem('luna_intentions') || '[]');
      intentions.push({
        date: new Date().toISOString(),
        phase: currentPhase.phase.name,
        intention: intention.trim()
      });
      localStorage.setItem('luna_intentions', JSON.stringify(intentions));
      
      // Award crystals
      onAwardPoints(15);
      
      setShowIntention(false);
      setIntention('');
    } catch (error) {
      console.error('Error saving intention:', error);
    } finally {
      setIsSaving(false);
    }
  }, [intention, currentPhase, onAwardPoints]);

  if (!isOpen || !currentPhase) return null;

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
        <div className="glass rounded-3xl p-6 shadow-2xl border border-light-lavender/20">
          {/* Moon glow effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, rgba(241, 211, 122, ${currentPhase.illumination / 200}) 0%, transparent 70%)`
              }}
            />
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
              <Moon className="w-6 h-6" />
              Phases Lunaires
            </h2>
            <p className="text-light-lavender/70 text-sm mt-1">
              L\'éternelle danse de la Lune
            </p>
          </div>

          {/* Current Phase Display */}
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-flex flex-col items-center glass-gold rounded-2xl p-6 mb-4">
              <span className="text-6xl mb-3 animate-pulse-glow">
                {currentPhase.phase.emoji}
              </span>
              <h3 className="text-xl font-bold text-gold-light">
                {currentPhase.phase.name}
              </h3>
              <p className="text-sm text-soft-champagne/70">
                {currentPhase.phase.nameEn}
              </p>
              <div className="flex gap-4 mt-3 text-xs text-light-lavender">
                <span>✦ Illumination: {currentPhase.illumination}%</span>
                <span>✦ Prochaine NL: {currentPhase.daysToNext}j</span>
              </div>
            </div>

            <p className="text-soft-champagne max-w-md mx-auto">
              {currentPhase.phase.description}
            </p>

            {/* Energy */}
            <div className="mt-4 glass rounded-xl p-3 max-w-md mx-auto">
              <p className="text-gold-light font-medium mb-2">Énergie du moment :</p>
              <p className="text-light-lavender text-sm">{currentPhase.phase.energy}</p>
            </div>

            {/* Activities */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {currentPhase.phase.activities.map((activity, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-xs glass rounded-full text-light-lavender border border-light-lavender/20"
                >
                  {activity}
                </span>
              ))}
            </div>

            {/* Set Intention Button */}
            {!showIntention && (
              <Button
                onClick={() => setShowIntention(true)}
                className="mt-4 glass-gold text-gold-signature hover:bg-gold-signature/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Poser une Intention
              </Button>
            )}

            {/* Intention Input */}
            {showIntention && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="Que souhaites-tu manifester sous cette lune ?"
                  className={cn(
                    "w-full p-3 rounded-xl glass border border-gold-signature/30",
                    "bg-transparent text-soft-champagne placeholder:text-light-lavender/50",
                    "focus:outline-none focus:border-gold-signature/50",
                    "resize-none"
                  )}
                  rows={3}
                />
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => setShowIntention(false)}
                    variant="outline"
                    className="border-light-lavender/30 text-light-lavender hover:bg-light-lavender/10"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSetIntention}
                    disabled={!intention.trim() || isSaving}
                    className="glass-gold text-gold-signature hover:bg-gold-signature/20"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">✧</span>
                        Enregistrement...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Sceller l\'Intention
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* All Phases */}
          <div className="border-t border-light-lavender/20 pt-4">
            <p className="text-sm text-light-lavender/70 text-center mb-3">
              Le Cycle Lunaire Complet
            </p>
            <div className="grid grid-cols-4 gap-2">
              {LUNAR_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={cn(
                    "p-2 rounded-xl transition-all text-center",
                    "hover:scale-105",
                    phase.id === currentPhase.phaseIndex + 1
                      ? "glass-gold border border-gold-signature/50"
                      : "glass border border-transparent hover:border-light-lavender/20"
                  )}
                >
                  <span className="text-2xl block">{phase.emoji}</span>
                  <span className="text-[10px] text-light-lavender/70 truncate block mt-1">
                    {phase.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Phase Details */}
          {selectedPhase && selectedPhase.id !== currentPhase.phaseIndex + 1 && (
            <div className="mt-4 glass rounded-xl p-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{selectedPhase.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gold-light">
                    {selectedPhase.name}
                    <span className="text-sm font-normal text-light-lavender/50 ml-2">
                      {selectedPhase.nameEn}
                    </span>
                  </h4>
                  <p className="text-sm text-soft-champagne mt-1">
                    {selectedPhase.description}
                  </p>
                  <p className="text-xs text-light-lavender mt-2">
                    <span className="text-gold-light">Énergie:</span> {selectedPhase.energy}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPhase(null)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-4 h-4 text-light-lavender/50" />
                </button>
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-light-lavender/30 text-light-lavender hover:bg-light-lavender/10"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LunarPhasesModal;

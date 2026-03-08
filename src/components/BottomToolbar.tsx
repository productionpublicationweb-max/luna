'use client';

import { cn } from '@/lib/utils';
import { Sparkles, Star, Moon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BottomToolbarProps {
  onTarotClick: () => void;
  onRunesClick: () => void;
  onLunarClick: () => void;
  onEmailClick: () => void;
}

const toolbarActions = [
  { icon: Sparkles, label: 'Tarot', action: 'tarot', description: 'Tirage de Tarot' },
  { icon: Star, label: 'Runes', action: 'runes', description: 'Tirage de Runes' },
  { icon: Moon, label: 'Phases Lunaires', action: 'lunar', description: 'Phase actuelle' },
  { icon: Mail, label: 'Résumé', action: 'email', description: 'Résumé par email' },
];

export function BottomToolbar({ 
  onTarotClick, 
  onRunesClick, 
  onLunarClick, 
  onEmailClick 
}: BottomToolbarProps) {
  
  const handleClick = (action: string) => {
    switch (action) {
      case 'tarot':
        onTarotClick();
        break;
      case 'runes':
        onRunesClick();
        break;
      case 'lunar':
        onLunarClick();
        break;
      case 'email':
        onEmailClick();
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-2 flex items-center justify-center gap-1 sm:gap-2">
          {toolbarActions.map((item) => (
            <TooltipProvider key={item.action}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick(item.action)}
                    className={cn(
                      'flex flex-col items-center gap-1 h-auto py-2 px-3 sm:px-4',
                      'rounded-xl hover:glass-gold transition-all',
                      'text-light-lavender hover:text-gold-light'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs hidden sm:block">{item.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BottomToolbar;

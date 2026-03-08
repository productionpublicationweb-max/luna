'use client';

import { cn } from '@/lib/utils';
import { Settings, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TopToolbarProps {
  onOpenSidebar: () => void;
  onOpenShop: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TopToolbar({ onOpenSidebar, onOpenShop, soundEnabled, onToggleSound }: TopToolbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left side - Settings */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSidebar}
                className="glass rounded-full hover:glass-gold transition-all"
              >
                <Settings className="w-5 h-5 text-light-lavender hover:text-gold-light transition-colors" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Center - Luna Brand */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-blue to-galactic-violet flex items-center justify-center glass-gold p-0.5">
              <span className="text-lg">🌙</span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-signature opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-light"></span>
            </span>
          </div>
          <span className="font-medium gradient-text-gold text-lg hidden sm:block">Luna Monétis</span>
        </div>

        {/* Right side - Sound & Shop */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleSound}
                  className="glass rounded-full hover:glass-gold transition-all"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-gold-signature" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{soundEnabled ? 'Couper le son' : 'Activer le son'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenShop}
                  className="glass rounded-full hover:glass-gold transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-light-lavender hover:text-gold-light transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Boutique</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default TopToolbar;

'use client';

import { cn } from '@/lib/utils';
import { Settings, Volume2, VolumeX, ShoppingBag, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

interface TopToolbarProps {
  onOpenSidebar: () => void;
  onOpenShop: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAuth: () => void;
}

export function TopToolbar({ onOpenSidebar, onOpenShop, soundEnabled, onToggleSound, onOpenAuth }: TopToolbarProps) {
  const { user, isAuthenticated } = useUser();

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
                className="btn-luna-vitreux-icon glass rounded-full hover:glass-gold transition-all"
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
          <div className="relative w-10 h-10 rounded-full overflow-hidden glass-gold p-0.5">
            <Image
              src="/luna-avatar.png"
              alt="Luna Monétis"
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <span className="font-medium gradient-text-gold text-lg hidden sm:block">Luna Monétis</span>
        </div>

        {/* Right side - Sound, Shop & Auth */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleSound}
                  className="btn-luna-vitreux-icon glass rounded-full hover:glass-gold transition-all"
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
                  className="btn-luna-vitreux-icon glass rounded-full hover:glass-gold transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-light-lavender hover:text-gold-light transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Boutique</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Connexion Button */}
          {isAuthenticated && user ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onOpenSidebar}
                    className="btn-luna-vitreux flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-signature to-galactic-violet flex items-center justify-center text-xs font-medium text-dark-space-bg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm">{user.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mon compte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={onOpenAuth}
              className="btn-luna-vitreux flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Connexion</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopToolbar;

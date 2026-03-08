'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ShoppingBag, 
  Settings, 
  User, 
  Gift, 
  Crown, 
  Mail,
  Sparkles,
  Heart,
  ExternalLink,
  Shield,
  LogOut,
  LogIn
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShop: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenReferral?: () => void;
  onOpenLoyalty?: () => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  onOpenShop, 
  onOpenAuth, 
  onOpenAdmin,
  onOpenReferral,
  onOpenLoyalty
}: SidebarProps) {
  const { user, isAuthenticated, logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full glass-dark rounded-l-3xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-lavender/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="font-semibold text-golden-ivory">Menu Luna</h2>
                <p className="text-xs text-muted-foreground">Oznya.com</p>
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

          {/* User Info (if logged in) */}
          {isAuthenticated && user && (
            <div className="p-4 border-b border-light-lavender/10">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-signature to-galactic-violet flex items-center justify-center text-sm font-medium text-dark-space-bg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-golden-ivory truncate">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-gold-signature" />
                      <span className="text-xs text-muted-foreground">{user.crystals} cristaux</span>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <Badge className="bg-gold-signature/20 text-gold-light border-gold-signature/30 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Mini Boutique */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Mini Boutique
              </h3>
              
              <SidebarButton 
                icon={ShoppingBag} 
                label="Boutique Luna" 
                onClick={() => {
                  onOpenShop();
                  onClose();
                }}
              />
              <SidebarButton icon={Heart} label="Tirages Personnalisés" />
              <SidebarButton icon={Crown} label="Abonnement Oracle" highlight />
            </div>

            <Separator className="my-4 bg-light-lavender/10" />

            {/* Programs */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Programmes
              </h3>
              
              <SidebarButton 
                icon={Gift} 
                label="Programme de Parrainage" 
                highlight
                onClick={() => {
                  if (onOpenReferral) {
                    onOpenReferral();
                    onClose();
                  }
                }}
              />
              <SidebarButton 
                icon={Crown} 
                label="Programme Fidélité"
                onClick={() => {
                  if (onOpenLoyalty) {
                    onOpenLoyalty();
                    onClose();
                  }
                }}
              />
              <SidebarButton icon={Mail} label="Newsletter Luna" />
            </div>

            <Separator className="my-4 bg-light-lavender/10" />

            {/* Settings */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Paramètres
              </h3>
              
              <SidebarButton icon={Settings} label="Préférences" />
              <SidebarButton 
                icon={User} 
                label="Mon Compte"
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuth();
                    onClose();
                  }
                }}
              />
            </div>

            {/* Admin Section (only for admins) */}
            {(user?.isAdmin || !isAuthenticated) && (
              <>
                <Separator className="my-4 bg-light-lavender/10" />
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    Administration
                  </h3>
                  
                  <SidebarButton 
                    icon={Shield} 
                    label="Tableau de Bord Admin"
                    highlight
                    onClick={() => {
                      onOpenAdmin();
                      onClose();
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-light-lavender/10">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-light-lavender/20 text-light-lavender hover:glass-gold hover:text-gold-light"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg font-medium"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            )}
            <p className="text-xs text-center text-muted-foreground mt-3">
              Par Diane Boyer •{' '}
              <a 
                href="https://oznya.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-signature hover:text-gold-light transition-colors inline-flex items-center gap-1"
              >
                Oznya.com <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
}

function SidebarButton({ icon: Icon, label, highlight, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
        'hover:bg-galactic-violet/20 text-left',
        highlight && 'glass-gold',
        onClick && 'cursor-pointer'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center',
        highlight ? 'bg-gold-signature/20' : 'bg-cosmic-blue/50'
      )}>
        <Icon className={cn(
          'w-4 h-4',
          highlight ? 'text-gold-light' : 'text-light-lavender'
        )} />
      </div>
      <span className={cn(
        'text-sm',
        highlight ? 'text-gold-light font-medium' : 'text-golden-ivory'
      )}>
        {label}
      </span>
    </button>
  );
}

export default Sidebar;

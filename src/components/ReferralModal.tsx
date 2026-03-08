'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  X,
  Copy,
  Gift,
  Users,
  Sparkles,
  Check,
  Facebook,
  Twitter,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const { user, isAuthenticated } = useUser();
  const [copied, setCopied] = useState(false);

  // Get referral code (use user's code or generate a mock one)
  const referralCode = useMemo(() => {
    return user?.id ? `LUNA-${user.id.slice(0, 8).toUpperCase()}` : 'LUNA-WELCOME';
  }, [user?.id]);

  const referralLink = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?ref=${referralCode}`;
    }
    return `https://luna-ometis.com?ref=${referralCode}`;
  }, [referralCode]);

  // Mock stats - in production, these would come from Supabase
  const referralStats = useMemo(() => {
    // For now, return mock data based on user
    if (user) {
      return {
        totalReferrals: user.referralCode ? Math.floor(Math.random() * 5) : 0,
        crystalsEarned: user.referralCode ? Math.floor(Math.random() * 3) * 50 : 0
      };
    }
    return {
      totalReferrals: 0,
      crystalsEarned: 0
    };
  }, [user]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'email') => {
    const text = `Découvre Luna Monétis, ton oracle digitale! Utilise mon code ${referralCode} pour obtenir 25 cristaux bonus! ✨🌙`;
    const url = referralLink;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Découvre Luna Monétis!')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Decorative stars */}
        <div className="absolute top-4 left-4 text-gold-signature/30 animate-pulse">✦</div>
        <div className="absolute top-8 right-6 text-gold-signature/20 animate-pulse delay-300">✧</div>
        <div className="absolute bottom-20 left-8 text-gold-signature/20 animate-pulse delay-500">✦</div>

        {/* Header */}
        <div className="relative p-6 border-b border-light-lavender/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <Gift className="w-6 h-6 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-golden-ivory">Programme de Parrainage</h2>
                <p className="text-sm text-muted-foreground">Invite tes amis et gagne des cristaux!</p>
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
                <Users className="w-8 h-8 text-light-lavender" />
              </div>
              <p className="text-golden-ivory mb-4">Connecte-toi pour accéder au programme de parrainage</p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg"
              >
                Se connecter
              </Button>
            </div>
          ) : (
            <>
              {/* Referral Code Section */}
              <div className="space-y-3">
                <label className="text-sm text-muted-foreground">Ton code de parrainage</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 glass rounded-xl p-4 text-center">
                    <span className="text-xl font-bold text-gold-light tracking-wider">{referralCode}</span>
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    className="glass-gold hover:scale-105 transition-transform"
                    size="icon"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gold-light" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="space-y-3">
                <label className="text-sm text-muted-foreground">Lien de parrainage</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 glass rounded-xl p-3 text-xs text-light-lavender/80 truncate">
                    {referralLink}
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="border-gold-signature/30 text-gold-light hover:glass-gold shrink-0"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copier
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <label className="text-sm text-muted-foreground">Partager sur</label>
                <div className="grid grid-cols-4 gap-2">
                  <ShareButton
                    icon={Facebook}
                    label="Facebook"
                    onClick={() => handleShare('facebook')}
                    className="bg-[#1877f2]/20 hover:bg-[#1877f2]/40 text-[#1877f2]"
                  />
                  <ShareButton
                    icon={Twitter}
                    label="Twitter"
                    onClick={() => handleShare('twitter')}
                    className="bg-[#1da1f2]/20 hover:bg-[#1da1f2]/40 text-[#1da1f2]"
                  />
                  <ShareButton
                    icon={MessageCircle}
                    label="WhatsApp"
                    onClick={() => handleShare('whatsapp')}
                    className="bg-[#25d366]/20 hover:bg-[#25d366]/40 text-[#25d366]"
                  />
                  <ShareButton
                    icon={Mail}
                    label="Email"
                    onClick={() => handleShare('email')}
                    className="bg-gold-signature/20 hover:bg-gold-signature/40 text-gold-light"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gold-light">{referralStats.totalReferrals}</div>
                  <div className="text-sm text-muted-foreground">Amis parrainés</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gold-light flex items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5" />
                    {referralStats.crystalsEarned}
                  </div>
                  <div className="text-sm text-muted-foreground">Cristaux gagnés</div>
                </div>
              </div>

              {/* Reward Structure */}
              <div className="glass rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-medium text-golden-ivory flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold-signature" />
                  Récompenses
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tu reçois</span>
                    <span className="text-gold-light font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 50 cristaux/ami
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ton ami reçoit</span>
                    <span className="text-gold-light font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 25 cristaux bonus
                    </span>
                  </div>
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

interface ShareButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}

function ShareButton({ icon: Icon, label, onClick, className }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
        'hover:scale-105',
        className
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default ReferralModal;

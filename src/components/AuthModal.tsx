'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock, 
  User,
  Eye,
  EyeOff,
  Chrome,
  Facebook,
  Gift
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  initialReferralCode?: string;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, initialReferralCode }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupReferralCode, setSignupReferralCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Error states
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // Initialize referral code from props or URL on mount
  useEffect(() => {
    let code: string | null = null;
    
    if (initialReferralCode) {
      code = initialReferralCode;
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      code = urlParams.get('ref');
    }
    
    if (code) {
      // Use setTimeout to defer state updates outside of render phase
      const timer = setTimeout(() => {
        setSignupReferralCode(code!);
        setActiveTab('signup');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialReferralCode, isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    const success = await onLogin(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (success) {
      onClose();
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Échec de la connexion. Veuillez réessayer.');
    }
  };

  const handleSignup = async () => {
    setSignupError('');
    if (!signupName || !signupEmail || !signupPassword) {
      setSignupError('Veuillez remplir tous les champs');
      return;
    }
    if (!acceptTerms) {
      setSignupError('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    
    setIsLoading(true);
    const success = await onSignup(signupEmail, signupPassword, signupName, signupReferralCode || undefined);
    setIsLoading(false);
    
    if (success) {
      onClose();
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupReferralCode('');
    } else {
      setSignupError('Échec de l\'inscription. Veuillez réessayer.');
    }
  };

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
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md transform transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        <div className="glass-dark rounded-3xl overflow-hidden shadow-2xl border border-light-lavender/20">
          {/* Decorative stars */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-gold-light rounded-full animate-pulse" />
          <div className="absolute top-16 right-6 w-1.5 h-1.5 bg-light-lavender rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Header */}
          <div className="relative p-6 border-b border-light-lavender/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:glass-gold transition-all"
            >
              <X className="w-5 h-5 text-light-lavender" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold gradient-text-gold">Bienvenue</h2>
                <p className="text-sm text-muted-foreground">Connectez-vous à Luna Monétis</p>
              </div>
            </div>
          </div>

          {/* Welcome Bonus Banner */}
          <div className="px-6 pt-4">
            <div className="p-3 rounded-xl glass-gold text-center">
              <p className="text-sm text-gold-light">
                🎁 <span className="font-medium">Bonus Bienvenue:</span> +55 Cristaux à l&apos;inscription
              </p>
              <p className="text-xs text-golden-ivory mt-1">
                Code promo: <span className="font-medium">BIENVENUE20</span> - 20% de réduction
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="w-full glass mb-6">
              <TabsTrigger value="login" className="flex-1 data-[state=active]:glass-gold">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 data-[state=active]:glass-gold">
                Inscription
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-muted-foreground">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-muted-foreground">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10 glass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold-light transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Se souvenir de moi
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-gold-signature hover:text-gold-light transition-colors"
                  >
                    Mot de passe oublié?
                  </button>
                </div>

                {loginError && (
                  <p className="text-sm text-red-400 text-center">{loginError}</p>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg font-medium"
                >
                  {isLoading ? 'Connexion...' : 'Se Connecter'}
                </Button>
              </div>

              <Separator className="bg-light-lavender/10" />

              {/* Social Login */}
              <div className="space-y-3">
                <p className="text-xs text-center text-muted-foreground">Ou continuer avec</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="glass border-light-lavender/20 hover:glass-gold">
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button variant="outline" className="glass border-light-lavender/20 hover:glass-gold">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-muted-foreground">Nom</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Votre prénom"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-muted-foreground">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-muted-foreground">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-10 pr-10 glass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold-light transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Referral Code Field */}
                <div>
                  <Label htmlFor="signup-referral" className="text-muted-foreground">
                    Code de parrainage <span className="text-xs">(optionnel)</span>
                  </Label>
                  <div className="relative mt-1">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-referral"
                      type="text"
                      placeholder="LUNA-XXXXXXXX"
                      value={signupReferralCode}
                      onChange={(e) => setSignupReferralCode(e.target.value.toUpperCase())}
                      className="pl-10 glass"
                    />
                  </div>
                  {signupReferralCode && (
                    <p className="text-xs text-gold-light mt-1 flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      +25 cristaux bonus avec ce code!
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                    J&apos;accepte les{' '}
                    <a href="#" className="text-gold-signature hover:text-gold-light transition-colors">
                      conditions d&apos;utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-gold-signature hover:text-gold-light transition-colors">
                      politique de confidentialité
                    </a>
                  </label>
                </div>

                {signupError && (
                  <p className="text-sm text-red-400 text-center">{signupError}</p>
                )}

                <Button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg font-medium"
                >
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
              </div>

              <Separator className="bg-light-lavender/10" />

              {/* Social Signup */}
              <div className="space-y-3">
                <p className="text-xs text-center text-muted-foreground">Ou s'inscrire avec</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="glass border-light-lavender/20 hover:glass-gold">
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button variant="outline" className="glass border-light-lavender/20 hover:glass-gold">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="p-4 border-t border-light-lavender/10">
            <p className="text-xs text-center text-muted-foreground">
              Par Diane Boyer •{' '}
              <a 
                href="https://oznya.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-signature hover:text-gold-light transition-colors"
              >
                Oznya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;

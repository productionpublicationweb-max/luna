'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import ChatInterface, { Message } from '@/components/ChatInterface';
import TopToolbar from '@/components/TopToolbar';
import BottomToolbar from '@/components/BottomToolbar';
import Sidebar from '@/components/Sidebar';
import CrystalDisplay from '@/components/CrystalDisplay';
import WelcomeScreen from '@/components/WelcomeScreen';
import BonneLunePopup from '@/components/BonneLunePopup';
import TarotModal from '@/components/TarotModal';
import RunesModal from '@/components/RunesModal';
import LunarPhasesModal from '@/components/LunarPhasesModal';
import ShopSidebar from '@/components/ShopSidebar';
import CrystalPurchaseModal from '@/components/CrystalPurchaseModal';
import AdminModal from '@/components/AdminModal';
import AuthModal from '@/components/AuthModal';
import ReferralModal from '@/components/ReferralModal';
import LoyaltyModal from '@/components/LoyaltyModal';
import { 
  loadGamificationState, 
  recordVisit, 
  addPoints,
  GamificationState 
} from '@/lib/gamification';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  // User context
  const { login, signup, addCrystals, user, isAuthenticated } = useUser();
  
  // State
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<GamificationState | null>(null);
  const [showBonneLune, setShowBonneLune] = useState(false);
  
  // Modal states
  const [showTarotModal, setShowTarotModal] = useState(false);
  const [showRunesModal, setShowRunesModal] = useState(false);
  const [showLunarModal, setShowLunarModal] = useState(false);
  const [showCrystalPurchase, setShowCrystalPurchase] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>();

  // Initialize gamification on mount
  useEffect(() => {
    const state = loadGamificationState();
    const { newState, showBonneLune: showPopup, pointsEarned } = recordVisit(state);
    setGameState(newState);
    
    // Sync crystals with user context if authenticated
    if (isAuthenticated && user && pointsEarned > 0) {
      addCrystals(pointsEarned);
    }
    
    if (showPopup) {
      setTimeout(() => setShowBonneLune(true), 2000);
    }
  }, []);

  // Check if user has seen welcome before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('luna_welcomed');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  // Check for referral code in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        setReferralCode(refCode);
        setShowAuthModal(true);
      }
    }
  }, []);

  // Handle welcome completion
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    localStorage.setItem('luna_welcomed', 'true');
  }, []);

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userId: user?.id // Include user ID for logging
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.error || 'Les étoiles sont silencieuses...',
        timestamp: new Date(data.timestamp || new Date())
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Award points for interaction
      if (gameState) {
        const newState = addPoints(gameState, 5);
        setGameState(newState);
        if (isAuthenticated) {
          addCrystals(5);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Une perturbation cosmique a eu lieu... Réessaie, âme curieuse.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, gameState, isAuthenticated, addCrystals, user?.id]);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Close Bonne Lune popup
  const handleCloseBonneLune = useCallback(() => {
    setShowBonneLune(false);
  }, []);

  // Award points helper
  const handleAwardPoints = useCallback((points: number) => {
    if (gameState) {
      const newState = addPoints(gameState, points);
      setGameState(newState);
      if (isAuthenticated) {
        addCrystals(points);
      }
    }
  }, [gameState, isAuthenticated, addCrystals]);

  // Email handler
  const handleEmailClick = useCallback(() => {
    sendMessage('Peux-tu me préparer un résumé de mes prédictions ?');
  }, [sendMessage]);

  // Handle login
  const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    return login(email, password);
  }, [login]);

  // Handle signup
  const handleSignup = useCallback(async (email: string, password: string, name: string, referralCode?: string): Promise<boolean> => {
    return signup(email, password, name, referralCode);
  }, [signup]);

  // Handle crystal purchase
  const handleCrystalPurchase = useCallback((amount: number) => {
    // In a real app, this would integrate with payment processing
    if (gameState) {
      const newState = addPoints(gameState, amount);
      setGameState(newState);
    }
    if (isAuthenticated) {
      addCrystals(amount);
    }
    setShowCrystalPurchase(false);
  }, [gameState, isAuthenticated, addCrystals]);

  // Get display crystals (from user context if authenticated, else from gamification)
  const displayCrystals = isAuthenticated && user ? user.crystals : (gameState?.crystalPoints || 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Borealis Animated Background */}
      <div className="aurora-bg" />
      
      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}

      {/* Main App */}
      <div className={cn(
        'flex flex-col h-screen transition-opacity duration-500',
        showWelcome ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}>
        {/* Top Toolbar */}
        <TopToolbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Main Content */}
        <div className="flex-1 flex pt-16 pb-28 overflow-hidden">
          {/* Left sidebar - Crystal Display (desktop only) */}
          <div className="hidden lg:block w-72 p-4 flex-shrink-0">
            {gameState && (
              <CrystalDisplay points={displayCrystals} className="sticky top-20" />
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-w-0 max-w-3xl mx-auto w-full">
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
          </div>

          {/* Right sidebar placeholder for balance */}
          <div className="hidden lg:block w-72 flex-shrink-0" />
        </div>

        {/* Bottom Toolbar */}
        <BottomToolbar
          onTarotClick={() => setShowTarotModal(true)}
          onRunesClick={() => setShowRunesModal(true)}
          onLunarClick={() => setShowLunarModal(true)}
          onEmailClick={handleEmailClick}
        />

        {/* Mobile Crystal Display */}
        {gameState && (
          <div className="lg:hidden fixed top-20 right-4 z-30">
            <CrystalDisplay points={displayCrystals} compact />
          </div>
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenAdmin={() => setShowAdminModal(true)}
          onOpenReferral={() => setShowReferralModal(true)}
          onOpenLoyalty={() => setShowLoyaltyModal(true)}
        />

        {/* Shop Sidebar */}
        <ShopSidebar
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          onOpenCrystalPurchase={() => {
            setIsShopOpen(false);
            setShowCrystalPurchase(true);
          }}
        />

        {/* Bonne Lune Popup */}
        {showBonneLune && (
          <BonneLunePopup onClose={handleCloseBonneLune} />
        )}

        {/* Tarot Modal */}
        <TarotModal
          isOpen={showTarotModal}
          onClose={() => setShowTarotModal(false)}
          onAwardPoints={handleAwardPoints}
        />

        {/* Runes Modal */}
        <RunesModal
          isOpen={showRunesModal}
          onClose={() => setShowRunesModal(false)}
          onAwardPoints={handleAwardPoints}
        />

        {/* Lunar Phases Modal */}
        <LunarPhasesModal
          isOpen={showLunarModal}
          onClose={() => setShowLunarModal(false)}
          onAwardPoints={handleAwardPoints}
        />

        {/* Crystal Purchase Modal */}
        <CrystalPurchaseModal
          isOpen={showCrystalPurchase}
          onClose={() => setShowCrystalPurchase(false)}
          onPurchase={handleCrystalPurchase}
        />

        {/* Admin Modal */}
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          initialReferralCode={referralCode}
        />

        {/* Referral Modal */}
        <ReferralModal
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
        />

        {/* Loyalty Modal */}
        <LoyaltyModal
          isOpen={showLoyaltyModal}
          onClose={() => setShowLoyaltyModal(false)}
        />
      </div>

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-galactic-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-signature/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

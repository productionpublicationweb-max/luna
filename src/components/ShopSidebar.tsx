'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ExternalLink,
  BookOpen,
  Gift,
  CreditCard,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
  Video,
  Sparkles,
  Star,
  Crown,
  Package
} from 'lucide-react';

interface ShopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrystalPurchase: () => void;
}

// Consultation services data
const consultations = {
  calendar: [
    { name: "30 minutes", url: "https://www.oznya.com/consultation/30minutes" },
    { name: "60 minutes", url: "https://www.oznya.com/consultation/60minutes" }
  ],
  email: [
    { name: "1 Question | 1 Réponse", url: "https://www.oznya.com/consultations/express1q1r" },
    { name: "1 Domaine précis", url: "https://www.oznya.com/consultations/domaineprecis" },
    { name: "Complète + Méditation audio", url: "https://www.oznya.com/consultations/completeavecmeditation" }
  ],
  chat: [
    { name: "10 min - €1.25/min", url: "https://premium.chat/Oznya/903857" },
    { name: "30 min - €0.95/min", url: "https://premium.chat/Oznya/903222" }
  ],
  phone: [
    { name: "10 min - €1.45/min", url: "https://premium.chat/Oznya/903845" },
    { name: "30 min - €1.15/min", url: "https://premium.chat/Oznya/903216" },
    { name: "60 min - €0.95/min", url: "https://premium.chat/Oznya/903866" }
  ],
  video: [
    { name: "15 min - €4.00/min", url: "https://premium.chat/Oznya/903863" },
    { name: "30 min - €3.50/min", url: "https://premium.chat/Oznya/903094" },
    { name: "60 min - €3.00/min", url: "https://premium.chat/Oznya/903861" }
  ]
};

// Product categories
const products = {
  formations: [
    { name: "Initiation au Tarot", price: "€149", icon: Star, popular: true },
    { name: "Runes & Symboles Nordiques", price: "€99", icon: Sparkles },
    { name: "Astrologie Lunaire", price: "€129", icon: Star },
    { name: "Développement Spirituel", price: "€179", icon: Sparkles, popular: true }
  ],
  coffrets: [
    { name: "Coffret Découverte", price: "€49", icon: Gift, popular: true },
    { name: "Coffret Bien-Être", price: "€89", icon: Gift },
    { name: "Coffret Oracle", price: "€149", icon: Crown },
    { name: "Coffret Premium", price: "€249", icon: Crown, popular: true }
  ],
  abonnements: [
    { name: "Lune Découverte", price: "€9.99/mois", icon: CreditCard },
    { name: "Lune Intuitive", price: "€19.99/mois", icon: CreditCard, popular: true },
    { name: "Lune Oracle", price: "€39.99/mois", icon: Crown }
  ],
  livres: [
    { name: "Les Secrets du Tarot", price: "€24.99", icon: BookOpen },
    { name: "L'Art des Runes", price: "€19.99", icon: BookOpen, popular: true },
    { name: "Phases Lunaires", price: "€22.99", icon: BookOpen },
    { name: "Méditations Guidées", price: "€29.99", icon: BookOpen }
  ]
};

export function ShopSidebar({ isOpen, onClose, onOpenCrystalPurchase }: ShopSidebarProps) {
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
          'fixed top-0 right-0 z-50 h-full w-96 max-w-[90vw] transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full glass-dark rounded-l-3xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-lavender/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <ShoppingBagIcon className="w-5 h-5 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="font-semibold text-golden-ivory">Boutique Luna</h2>
                <p className="text-xs text-muted-foreground">Produits & Services</p>
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

          {/* Crystal Purchase Banner */}
          <div className="p-4 border-b border-light-lavender/10">
            <button
              onClick={onOpenCrystalPurchase}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-gold-signature/20 to-galactic-violet/20 border border-gold-signature/30 hover:border-gold-light/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-dark-space-bg" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gold-light">Acheter des Cristaux</p>
                    <p className="text-xs text-muted-foreground">À partir de €4.99</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gold-signature group-hover:text-gold-light transition-colors" />
              </div>
            </button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-4 mt-2 glass">
              <TabsTrigger value="products" className="flex-1 data-[state=active]:glass-gold">
                Produits
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex-1 data-[state=active]:glass-gold">
                Consultations
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Formations */}
              <ProductSection
                title="Formations"
                icon={Star}
                products={products.formations}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Coffrets */}
              <ProductSection
                title="Coffrets"
                icon={Gift}
                products={products.coffrets}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Abonnements */}
              <ProductSection
                title="Abonnements"
                icon={CreditCard}
                products={products.abonnements}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Livres */}
              <ProductSection
                title="Livres"
                icon={BookOpen}
                products={products.livres}
              />
            </TabsContent>

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Calendar Consultations */}
              <ConsultationSection
                title="Par Calendrier"
                icon={Calendar}
                items={consultations.calendar}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Email Consultations */}
              <ConsultationSection
                title="Par Email"
                icon={Mail}
                items={consultations.email}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Chat Consultations */}
              <ConsultationSection
                title="Par Chat"
                icon={MessageCircle}
                items={consultations.chat}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Phone Consultations */}
              <ConsultationSection
                title="Par Téléphone"
                icon={Phone}
                items={consultations.phone}
              />

              <Separator className="bg-light-lavender/10" />

              {/* Video Consultations */}
              <ConsultationSection
                title="Par Vidéo"
                icon={Video}
                items={consultations.video}
              />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="p-4 border-t border-light-lavender/10">
            <p className="text-xs text-center text-muted-foreground">
              Tous les achats sont sécurisés •{' '}
              <a 
                href="https://oznya.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-signature hover:text-gold-light transition-colors"
              >
                oznya.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Shopping bag icon
function ShoppingBagIcon({ className }: { className?: string }) {
  return <Package className={className} />;
}

// Product section component
interface ProductItem {
  name: string;
  price: string;
  icon: React.ElementType;
  popular?: boolean;
}

function ProductSection({ title, icon: Icon, products }: { title: string; icon: React.ElementType; products: ProductItem[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gold-signature" />
        <h3 className="text-sm font-medium text-golden-ivory">{title}</h3>
      </div>
      <div className="grid gap-2">
        {products.map((product, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-3 rounded-xl glass hover:glass-gold transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cosmic-blue/50 flex items-center justify-center">
                <product.icon className="w-4 h-4 text-light-lavender" />
              </div>
              <div>
                <p className="text-sm text-golden-ivory group-hover:text-gold-light transition-colors">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">{product.price}</p>
              </div>
            </div>
            {product.popular && (
              <Badge className="bg-gold-signature/20 text-gold-light border-gold-signature/30 text-xs">
                Populaire
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Consultation section component
interface ConsultationItem {
  name: string;
  url: string;
}

function ConsultationSection({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: ConsultationItem[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gold-signature" />
        <h3 className="text-sm font-medium text-golden-ivory">{title}</h3>
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl glass hover:glass-gold transition-all group"
          >
            <span className="text-sm text-golden-ivory group-hover:text-gold-light transition-colors">
              {item.name}
            </span>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-gold-signature transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default ShopSidebar;

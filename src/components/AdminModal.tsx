'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  Users, 
  BarChart3, 
  Mail, 
  Settings, 
  Download,
  Search,
  Star,
  Sparkles,
  MessageCircle,
  Crown,
  Send,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  CrystalIcon
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for demonstration
const mockUsers = [
  { id: '1', name: 'Marie L.', email: 'marie@example.com', crystals: 1250, level: 4, lastVisit: '2024-01-15', visits: 45 },
  { id: '2', name: 'Sophie M.', email: 'sophie@example.com', crystals: 890, level: 3, lastVisit: '2024-01-14', visits: 32 },
  { id: '3', name: 'Jean D.', email: 'jean@example.com', crystals: 2100, level: 5, lastVisit: '2024-01-15', visits: 78 },
  { id: '4', name: 'Claire B.', email: 'claire@example.com', crystals: 450, level: 2, lastVisit: '2024-01-13', visits: 18 },
  { id: '5', name: 'Pierre R.', email: 'pierre@example.com', crystals: 3500, level: 6, lastVisit: '2024-01-15', visits: 120 },
];

const mockMessages = [
  { id: '1', subject: 'Nouvelle fonctionnalité : Tirages Express', date: '2024-01-14', sent: 1250 },
  { id: '2', subject: 'Offre spéciale Saint-Valentin', date: '2024-01-10', sent: 2100 },
  { id: '3', subject: 'Bonne année 2024 !', date: '2024-01-01', sent: 3500 },
];

const mockStats = {
  totalUsers: 3542,
  activeSessions: 128,
  totalCrystalsDistributed: 894500,
  avgSessionDuration: '12:45',
  topFeatures: [
    { name: 'Tarot', usage: 45, icon: Star },
    { name: 'Chat Luna', usage: 30, icon: MessageCircle },
    { name: 'Runes', usage: 15, icon: Sparkles },
    { name: 'Phases Lunaires', usage: 10, icon: Eye }
  ]
};

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [settings, setSettings] = useState({
    friendlyMode: true,
    detailedReadings: true,
    crystalRewards: true,
    tarotEnabled: true,
    runesEnabled: true,
    lunarEnabled: true,
    welcomeBonus: 15,
    dailyBonus: 10
  });

  if (!isOpen) return null;

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = (type: string) => {
    // Mock export function
    console.log(`Exporting ${type}...`);
    alert(`Export ${type} initié (fonctionnalité de démonstration)`);
  };

  const handleSendMessage = () => {
    if (messageSubject && messageContent) {
      alert(`Message envoyé à tous les utilisateurs (fonctionnalité de démonstration)`);
      setMessageSubject('');
      setMessageContent('');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Modal - Full screen for admin */}
      <div
        className={cn(
          'fixed inset-4 z-50 transform transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        <div className="h-full glass-dark rounded-3xl overflow-hidden border border-light-lavender/20 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-lavender/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-signature to-gold-deep flex items-center justify-center">
                <Crown className="w-6 h-6 text-dark-space-bg" />
              </div>
              <div>
                <h2 className="text-xl font-semibold gradient-text-gold">Tableau de Bord Admin</h2>
                <p className="text-sm text-muted-foreground">Luna Monétis Administration</p>
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

          {/* Tabs */}
          <Tabs defaultValue="stats" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4">
              <TabsList className="glass">
                <TabsTrigger value="stats" className="data-[state=active]:glass-gold">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistiques
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:glass-gold">
                  <Users className="w-4 h-4 mr-2" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:glass-gold">
                  <Mail className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:glass-gold">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </TabsTrigger>
                <TabsTrigger value="export" className="data-[state=active]:glass-gold">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Stats Tab */}
            <TabsContent value="stats" className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-6">
                {/* Main Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Utilisateurs Totaux"
                    value={mockStats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="+12%"
                  />
                  <StatCard
                    title="Sessions Actives"
                    value={mockStats.activeSessions.toString()}
                    icon={Eye}
                    trend="+5%"
                  />
                  <StatCard
                    title="Cristaux Distribués"
                    value={mockStats.totalCrystalsDistributed.toLocaleString()}
                    icon={Sparkles}
                    trend="+18%"
                  />
                  <StatCard
                    title="Durée Moy. Session"
                    value={mockStats.avgSessionDuration}
                    icon={Clock}
                    trend="+8%"
                  />
                </div>

                {/* Feature Usage */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Utilisation des Fonctionnalités</h3>
                  <div className="space-y-4">
                    {mockStats.topFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cosmic-blue/50 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-light-lavender" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-golden-ivory">{feature.name}</span>
                            <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                          </div>
                          <Progress value={feature.usage} className="h-2 bg-cosmic-blue/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Chart (Visual Representation) */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Activité Récente</h3>
                  <div className="flex items-end gap-2 h-40">
                    {[65, 80, 45, 90, 70, 85, 95, 75, 60, 88, 92, 78].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-gold-signature to-galactic-violet rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Fév</span>
                    <span>Mar</span>
                    <span>Avr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aoû</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Déc</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass"
                  />
                </div>

                {/* Users Table */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-light-lavender/10">
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Utilisateur</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cristaux</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Niveau</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Visites</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dernière Visite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-light-lavender/5 hover:glass-gold transition-all">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-signature to-galactic-violet flex items-center justify-center text-sm font-medium text-dark-space-bg">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-golden-ivory">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1 text-gold-signature">
                                <Sparkles className="w-4 h-4" />
                                {user.crystals.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-galactic-violet/20 text-light-lavender border-galactic-violet/30">
                                Niveau {user.level}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{user.visits}</td>
                            <td className="p-4 text-sm text-muted-foreground">{user.lastVisit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="flex-1 overflow-y-auto p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Compose Message */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Nouveau Message</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject" className="text-muted-foreground">Sujet</Label>
                      <Input
                        id="subject"
                        placeholder="Sujet du message..."
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        className="mt-1 glass"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content" className="text-muted-foreground">Message</Label>
                      <Textarea
                        id="content"
                        placeholder="Contenu du message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="mt-1 glass min-h-[150px]"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageSubject || !messageContent}
                      className="w-full bg-gradient-to-r from-gold-signature to-gold-deep hover:from-gold-light hover:to-gold-signature text-dark-space-bg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer à tous les utilisateurs
                    </Button>
                  </div>
                </div>

                {/* Message History */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Historique des Messages</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className="p-3 rounded-xl glass hover:glass-gold transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-golden-ivory">{msg.subject}</p>
                          <span className="text-xs text-muted-foreground">{msg.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {msg.sent.toLocaleString()} envoyés
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="flex-1 overflow-y-auto p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Luna Personality */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Personnalité de Luna</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-golden-ivory">Mode Amical</p>
                        <p className="text-xs text-muted-foreground">Luna utilise un ton plus chaleureux</p>
                      </div>
                      <Switch
                        checked={settings.friendlyMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, friendlyMode: checked })}
                      />
                    </div>
                    <Separator className="bg-light-lavender/10" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-golden-ivory">Lectures Détaillées</p>
                        <p className="text-xs text-muted-foreground">Interprétations plus approfondies</p>
                      </div>
                      <Switch
                        checked={settings.detailedReadings}
                        onCheckedChange={(checked) => setSettings({ ...settings, detailedReadings: checked })}
                      />
                    </div>
                    <Separator className="bg-light-lavender/10" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-golden-ivory">Récompenses Cristaux</p>
                        <p className="text-xs text-muted-foreground">Activer les bonus de cristaux</p>
                      </div>
                      <Switch
                        checked={settings.crystalRewards}
                        onCheckedChange={(checked) => setSettings({ ...settings, crystalRewards: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Features Toggle */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Fonctionnalités</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-gold-signature" />
                        <span className="text-sm text-golden-ivory">Tarot</span>
                      </div>
                      <Switch
                        checked={settings.tarotEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, tarotEnabled: checked })}
                      />
                    </div>
                    <Separator className="bg-light-lavender/10" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-gold-signature" />
                        <span className="text-sm text-golden-ivory">Runes</span>
                      </div>
                      <Switch
                        checked={settings.runesEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, runesEnabled: checked })}
                      />
                    </div>
                    <Separator className="bg-light-lavender/10" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 text-gold-signature" />
                        <span className="text-sm text-golden-ivory">Phases Lunaires</span>
                      </div>
                      <Switch
                        checked={settings.lunarEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, lunarEnabled: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Crystal Rewards */}
                <div className="glass rounded-2xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-medium text-golden-ivory mb-4">Récompenses en Cristaux</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="welcome" className="text-muted-foreground">Bonus de Bienvenue</Label>
                      <Input
                        id="welcome"
                        type="number"
                        value={settings.welcomeBonus}
                        onChange={(e) => setSettings({ ...settings, welcomeBonus: parseInt(e.target.value) || 0 })}
                        className="mt-1 glass"
                      />
                    </div>
                    <div>
                      <Label htmlFor="daily" className="text-muted-foreground">Bonus Quotidien</Label>
                      <Input
                        id="daily"
                        type="number"
                        value={settings.dailyBonus}
                        onChange={(e) => setSettings({ ...settings, dailyBonus: parseInt(e.target.value) || 0 })}
                        className="mt-1 glass"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="flex-1 overflow-y-auto p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ExportCard
                  title="Exporter Utilisateurs"
                  description="Télécharger la liste des utilisateurs au format CSV"
                  icon={Users}
                  onExport={() => handleExport('users')}
                />
                <ExportCard
                  title="Exporter Logs Chat"
                  description="Télécharger l'historique des conversations"
                  icon={MessageCircle}
                  onExport={() => handleExport('chat_logs')}
                />
                <ExportCard
                  title="Exporter Statistiques"
                  description="Télécharger les statistiques d'utilisation"
                  icon={BarChart3}
                  onExport={() => handleExport('statistics')}
                />
                <ExportCard
                  title="Exporter Cristaux"
                  description="Historique des transactions de cristaux"
                  icon={Sparkles}
                  onExport={() => handleExport('crystals')}
                />
                <ExportCard
                  title="Exporter Tirages"
                  description="Historique des tirages (Tarot, Runes)"
                  icon={Star}
                  onExport={() => handleExport('readings')}
                />
                <ExportCard
                  title="Exporter Messages"
                  description="Historique des messages broadcast"
                  icon={Mail}
                  onExport={() => handleExport('messages')}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  trend: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-lg bg-cosmic-blue/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-light-lavender" />
        </div>
        <span className="flex items-center gap-1 text-xs text-green-400">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-gold-light">{value}</p>
      <p className="text-xs text-muted-foreground">{title}</p>
    </div>
  );
}

// Export Card Component
function ExportCard({ title, description, icon: Icon, onExport }: {
  title: string;
  description: string;
  icon: React.ElementType;
  onExport: () => void;
}) {
  return (
    <div className="glass rounded-2xl p-6 hover:glass-gold transition-all">
      <div className="w-12 h-12 rounded-xl bg-cosmic-blue/50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-light-lavender" />
      </div>
      <h3 className="text-lg font-medium text-golden-ivory mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        onClick={onExport}
        variant="outline"
        className="w-full border-gold-signature/30 text-gold-signature hover:bg-gold-signature/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger CSV
      </Button>
    </div>
  );
}

export default AdminModal;

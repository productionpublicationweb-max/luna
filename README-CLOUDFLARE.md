# 🚀 Déploiement sur Cloudflare Pages - Luna Monétis

Guide complet pour déployer Luna Monétis sur Cloudflare Pages (tier gratuit).

## 📋 Prérequis

- Un compte [Cloudflare](https://dash.cloudflare.com/sign-up) (gratuit)
- Un compte [Supabase](https://supabase.com) (gratuit) pour la base de données
- Un dépôt GitHub, GitLab ou Bitbucket avec votre code

## 🆓 Avantages du Tier Gratuit Cloudflare

- **500 builds par mois**
- **Déploiements illimités**
- **CDN mondial**
- **SSL automatique**
- **Domaine personnalisé gratuit** (votre-projet.pages.dev)
- **100 000 requêtes par jour**

---

## 🚀 Méthode 1 : Déploiement via l'Interface Web (Recommandé)

### Étape 1 : Préparer le Dépôt

1. Poussez votre code sur GitHub, GitLab ou Bitbucket
2. Assurez-vous que le fichier `.env.example` est présent (pas `.env.local` !)

### Étape 2 : Créer un Projet Cloudflare Pages

1. Connectez-vous à [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Allez dans **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Sélectionnez votre dépôt Git
4. Configurez le build :

| Paramètre | Valeur |
|-----------|--------|
| **Nom du projet** | `luna-monetis` |
| **Branche de production** | `main` (ou `master`) |
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |

### Étape 3 : Configurer les Variables d'Environnement

Avant de cliquer sur "Save and Deploy", ajoutez les variables d'environnement :

1. Cliquez sur **Environment variables**
2. Ajoutez les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

3. Répétez pour les variables **Production** et **Preview**

### Étape 4 : Déployer

1. Cliquez sur **Save and Deploy**
2. Attendez la fin du build (2-3 minutes)
3. Votre site est disponible sur `https://luna-monetis.pages.dev`

---

## 🔧 Méthode 2 : Déploiement via Wrangler CLI

### Étape 1 : Installer Wrangler

```bash
npm install -g wrangler
```

### Étape 2 : Se Connecter

```bash
wrangler login
```

### Étape 3 : Configurer les Variables d'Environnement

```bash
# Définir les secrets (côté serveur uniquement)
wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL --project-name=luna-monetis
wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY --project-name=luna-monetis
```

### Étape 4 : Déployer

```bash
# Build et déploiement
npm run build
wrangler pages deploy .next --project-name=luna-monetis
```

---

## ⚙️ Configuration Avancée

### Domaine Personnalisé

1. Allez dans **Pages** > votre projet > **Custom domains**
2. Cliquez sur **Set up a custom domain**
3. Entrez votre domaine (ex: `luna.oznya.com`)
4. Suivez les instructions DNS

### Variables d'Environnement par Environnement

Pour avoir des configurations différentes pour production et preview :

1. Allez dans **Settings** > **Environment variables**
2. Utilisez les onglets **Production** et **Preview**
3. Les variables de preview sont utilisées pour les pull requests

### Redirections et Headers

Créez un fichier `public/_redirects` :

```
# Redirections personnalisées
/old-path /new-path 301
```

Créez un fichier `public/_headers` :

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

---

## 🔍 Résolution des Problèmes

### Le build échoue

**Cause possible** : Variables d'environnement manquantes

**Solution** : Vérifiez que toutes les variables de `.env.example` sont configurées

### Erreur 500 sur les API

**Cause possible** : Le SDK z-ai-web-dev-sdk n'est pas compatible avec l'environnement edge

**Solution** : Vérifiez les logs dans Cloudflare Dashboard > Pages > votre projet > Logs

### Images non affichées

**Cause possible** : Configuration `images.unoptimized: true` requise

**Solution** : Vérifiez que `next.config.ts` contient :
```typescript
images: {
  unoptimized: true,
}
```

### Base de données non connectée

**Cause possible** : Variables Supabase incorrectes

**Solution** : 
1. Vérifiez les clés dans Supabase Dashboard > Settings > API
2. Assurez-vous que l'URL commence par `https://`
3. Vérifiez que la clé anon est correcte (pas la clé service_role !)

---

## 📊 Monitoring et Logs

### Accéder aux Logs

1. Cloudflare Dashboard > Pages > votre projet
2. Onglet **Logs**
3. Les logs en temps réel sont disponibles pendant 72 heures

### Métriques Disponibles

- Requêtes par jour
- Temps de réponse moyen
- Erreurs 4xx et 5xx
- Bande passante utilisée

---

## 🔄 Déploiements Continus

### Configuration Automatique

Cloudflare Pages déploie automatiquement :
- **Production** : À chaque push sur la branche principale
- **Preview** : À chaque pull request

### Désactiver les Déploiements Automatiques

1. Settings > Builds & deployments
2. Décochez "Auto-deploy for production"

---

## 💡 Conseils d'Optimisation

### 1. Utiliser le Cache Edge

```typescript
// Dans vos API routes
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### 2. Optimiser les Images

- Utilisez des images WebP
- Préchargez les images critiques
- Utilisez le lazy loading

### 3. Réduire la Taille du Bundle

```bash
# Analyser le bundle
npm install -D @next/bundle-analyzer
```

---

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement configurées (Production)
- [ ] Variables d'environnement configurées (Preview)
- [ ] Build réussi sans erreurs
- [ ] Site accessible sur .pages.dev
- [ ] Authentification fonctionnelle
- [ ] Chat Luna fonctionnel
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL actif (automatique)

---

## 🆘 Support

- **Documentation Cloudflare** : [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Documentation Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)

---

*Guide créé pour Luna Monétis par Diane Boyer • [Oznya.com](https://oznya.com)*

---

## 🌙 À Propos de Luna Monétis

Luna Monétis est une application de voyance interactive propulsée par l'IA, offrant :

- 💬 **Chat avec Luna** - Votre guide spirituel personnel
- 🔮 **Tirages de Tarot** - Consultez les cartes
- ᚱ **Runes Mystiques** - Découvrez les runes anciennes
- 🌙 **Phases Lunaires** - Suivez les cycles de la lune
- 💎 **Programme de Fidélité** - Gagnez des cristaux
- 👥 **Parrainage** - Invitez vos amis

**Version** : 0.2.0  
**Technologies** : Next.js 16, TypeScript, Tailwind CSS, Supabase, z-ai-web-dev-sdk

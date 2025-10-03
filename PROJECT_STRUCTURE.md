# 📁 Structure du Projet - Emploi Romand

## 🏗️ Architecture Générale

```
emploi-suisse-romande/
├── 📁 .github/                 # Configuration GitHub
├── 📁 public/                  # Assets statiques
├── 📁 src/                     # Code source principal
├── 📁 supabase/               # Configuration base de données
├── 📁 examples/               # Exemples d'intégrations
├── 📄 Configuration files     # Fichiers de config
└── 📚 Documentation          # Guides et documentation
```

## 📂 Détail des Dossiers

### 🔧 `.github/` - Configuration GitHub
```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md          # Template pour signaler des bugs
│   └── feature_request.md     # Template pour demandes de fonctionnalités
├── workflows/
│   └── ci-cd.yml             # Pipeline CI/CD automatisé
└── pull_request_template.md   # Template pour Pull Requests
```

### 🌐 `public/` - Assets Statiques
```
public/
├── favicon.ico               # Icône du site
├── robots.txt               # Configuration SEO
└── placeholder.svg          # Images de placeholder
```

### 💻 `src/` - Code Source Principal
```
src/
├── components/              # Composants React réutilisables
│   ├── layout/             # Composants de mise en page
│   │   ├── Header.tsx      # En-tête avec navigation
│   │   ├── Sidebar.tsx     # Barre latérale
│   │   └── Layout.tsx      # Layout principal
│   └── ui/                 # Composants UI de base (shadcn/ui)
│       ├── button.tsx      # Composant bouton
│       ├── card.tsx        # Composant carte
│       ├── input.tsx       # Composant input
│       └── ...             # Autres composants UI
├── contexts/               # Contextes React
│   └── AuthContext.tsx     # Gestion de l'authentification
├── hooks/                  # Hooks personnalisés
│   ├── use-mobile.tsx      # Hook pour détection mobile
│   └── use-toast.ts        # Hook pour notifications
├── integrations/           # Intégrations externes
│   └── supabase/
│       └── client.ts       # Client Supabase configuré
├── lib/                    # Utilitaires et helpers
│   ├── utils.ts           # Fonctions utilitaires
│   └── react-router-dom-proxy.tsx
├── pages/                  # Pages de l'application
│   ├── LandingPage.tsx     # Page d'accueil
│   ├── LoginPage.tsx       # Page de connexion
│   ├── RegisterPage.tsx    # Page d'inscription
│   ├── DashboardPage.tsx   # Tableau de bord
│   ├── JobSearchPage.tsx   # Recherche d'emploi
│   ├── ApplicationsPage.tsx # Suivi des candidatures (Kanban)
│   ├── RiasecTestPage.tsx  # Test psychométrique RIASEC
│   ├── EnneagramTestPage.tsx # Test Ennéagramme
│   ├── InterviewPreparationPage.tsx # Préparation entretiens
│   ├── ProfilePage.tsx     # Profil utilisateur
│   └── NotFound.tsx        # Page 404
├── types/                  # Types TypeScript
│   └── database.ts         # Types pour la base de données
├── App.tsx                 # Composant racine
├── main.tsx               # Point d'entrée de l'application
├── index.css              # Styles globaux et design system
└── vite-env.d.ts          # Types pour Vite
```

### 🗄️ `supabase/` - Base de Données
```
supabase/
├── migrations/             # Migrations SQL
│   ├── create_database_structure_2025_10_03_16_01.sql
│   ├── create_rls_policies_2025_10_03_16_01.sql
│   └── insert_test_data_2025_10_03_16_01.sql
└── edge_function/         # Fonctions Edge (pour futures intégrations)
    ├── deno.json
    ├── deps.ts
    └── tests/
```

### 📚 `examples/` - Exemples d'Intégrations
```
examples/
└── third-party-integrations/
    ├── README.md
    └── stripe/            # Exemple d'intégration Stripe
        ├── CheckoutForm.tsx
        └── README.md
```

## 📄 Fichiers de Configuration

### Configuration Build & Dev
- `package.json` - Dépendances et scripts npm
- `vite.config.ts` - Configuration Vite
- `tsconfig.json` - Configuration TypeScript
- `tailwind.config.ts` - Configuration Tailwind CSS
- `postcss.config.js` - Configuration PostCSS
- `eslint.config.js` - Configuration ESLint

### Configuration Déploiement
- `vercel.json` - Configuration Vercel
- `.env.example` - Template variables d'environnement
- `.gitignore` - Fichiers à ignorer par Git

### Configuration UI
- `components.json` - Configuration shadcn/ui
- `index.html` - Template HTML principal

## 📚 Documentation

### Guides Principaux
- `README.md` - Guide complet d'utilisation
- `INSTALL.md` - Instructions d'installation
- `DEPLOYMENT.md` - Guides de déploiement
- `CONTRIBUTING.md` - Guide de contribution
- `SECURITY.md` - Politique de sécurité

### Guides Spécialisés
- `CHANGELOG.md` - Historique des versions
- `LICENSE` - Licence MIT
- `GITHUB_INTEGRATION.md` - Guide d'intégration GitHub
- `PROJECT_STRUCTURE.md` - Ce fichier

## 🎯 Conventions de Nommage

### Fichiers et Dossiers
- **Composants React :** PascalCase (ex: `JobSearchPage.tsx`)
- **Hooks :** camelCase avec préfixe "use" (ex: `useJobSearch.ts`)
- **Utilitaires :** camelCase (ex: `formatDate.ts`)
- **Types :** PascalCase (ex: `UserProfile.ts`)
- **Dossiers :** kebab-case (ex: `job-search/`)

### Code
- **Variables :** camelCase (ex: `jobOffers`)
- **Constantes :** SCREAMING_SNAKE_CASE (ex: `MAX_RESULTS`)
- **Fonctions :** camelCase (ex: `calculateMatchScore`)
- **Interfaces/Types :** PascalCase (ex: `JobOffer`)

## 🔄 Flux de Données

### Architecture Frontend
```
User Input → React Components → Hooks → Supabase Client → Database
                ↓
         Context (Auth) → Global State → UI Updates
```

### Architecture Backend
```
Frontend Request → Supabase API → Row Level Security → PostgreSQL
                                      ↓
                              Edge Functions (si nécessaire)
```

## 🛠️ Outils de Développement

### Développement
- **Vite** - Build tool et dev server
- **React 18** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI

### Base de Données
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security** - Sécurité au niveau des lignes

### Qualité de Code
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage de code
- **Husky** - Git hooks
- **lint-staged** - Linting sur les fichiers modifiés

### Tests (à implémenter)
- **Vitest** - Framework de tests
- **Testing Library** - Tests de composants React
- **Playwright** - Tests end-to-end

## 📱 Responsive Design

### Breakpoints Tailwind
- `sm:` 640px+ (Mobile large)
- `md:` 768px+ (Tablette)
- `lg:` 1024px+ (Desktop)
- `xl:` 1280px+ (Large desktop)
- `2xl:` 1536px+ (Extra large)

### Composants Adaptatifs
Tous les composants sont conçus pour être responsive :
- Navigation adaptative (sidebar → menu mobile)
- Grilles flexibles (colonnes variables selon l'écran)
- Typographie responsive
- Espacement adaptatif

## 🔒 Sécurité

### Authentification
- JWT tokens via Supabase Auth
- Sessions sécurisées avec expiration
- Refresh tokens automatiques

### Autorisation
- Row Level Security (RLS) sur toutes les tables
- Politiques de sécurité granulaires
- Validation côté client et serveur

### Protection des Données
- Chiffrement HTTPS obligatoire
- Validation et sanitisation des entrées
- Pas de données sensibles dans les logs

## 🚀 Performance

### Optimisations Implémentées
- Code splitting automatique par route
- Lazy loading des composants
- Optimisation des images
- Cache intelligent des requêtes
- Compression des assets

### Métriques Cibles
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1

## 📞 Support

Pour toute question sur la structure du projet :
- **Documentation :** Consultez les fichiers .md
- **Issues GitHub :** Pour signaler des problèmes
- **Email :** support@emploiromand.ch

---

**📁 Cette structure est conçue pour être maintenable, scalable et facile à comprendre pour tous les développeurs.**
# Guide d'Installation et Configuration

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase (gratuit)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/emploi-suisse-romande.git
cd emploi-suisse-romande
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos clés Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
```

4. **Initialiser la base de données Supabase**

Connectez-vous à votre projet Supabase et exécutez les migrations SQL dans l'ordre :

```sql
-- 1. Exécuter create_database_structure_2025_10_03_16_01.sql
-- 2. Exécuter create_rls_policies_2025_10_03_16_01.sql  
-- 3. Exécuter insert_test_data_2025_10_03_16_01.sql
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## ⚙️ Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte et un nouveau projet
3. Notez l'URL du projet et la clé anonyme

### 2. Configuration de l'authentification

Dans le dashboard Supabase :
1. Allez dans **Authentication > Settings**
2. Configurez l'URL de redirection : `http://localhost:5173`
3. Activez l'authentification par email

### 3. Exécuter les migrations

Dans l'éditeur SQL de Supabase, exécutez dans l'ordre :

1. **Structure de base :** `supabase/migrations/create_database_structure_2025_10_03_16_01.sql`
2. **Politiques de sécurité :** `supabase/migrations/create_rls_policies_2025_10_03_16_01.sql`
3. **Données de test :** `supabase/migrations/insert_test_data_2025_10_03_16_01.sql`

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Lancer en mode développement
npm run build            # Build de production
npm run preview          # Prévisualiser le build

# Qualité de code
npm run lint             # Vérifier le code
npm run lint:fix         # Corriger automatiquement
npm run type-check       # Vérifier les types TypeScript

# Tests
npm run test             # Lancer les tests
npm run test:coverage    # Tests avec coverage
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Installer Vercel CLI**
```bash
npm i -g vercel
```

2. **Déployer**
```bash
vercel --prod
```

3. **Configurer les variables d'environnement**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify

1. **Build de production**
```bash
npm run build
```

2. **Déployer le dossier dist/**
```bash
netlify deploy --prod --dir=dist
```

## 🔒 Sécurité

### Variables d'environnement

Ne jamais committer les fichiers `.env*` contenant des clés secrètes.

### Supabase RLS

Toutes les tables sont protégées par Row Level Security. Les utilisateurs ne peuvent accéder qu'à leurs propres données.

## 📞 Support

- **Documentation :** Voir le README.md principal
- **Issues :** [GitHub Issues](https://github.com/votre-username/emploi-suisse-romande/issues)
- **Email :** support@emploiromand.ch
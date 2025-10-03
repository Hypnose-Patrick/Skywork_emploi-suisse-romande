# 🚀 Guide Rapide d'Intégration GitHub

## Étapes Simples pour Intégrer dans GitHub

### 1. 📁 Télécharger les Fichiers

Téléchargez tous les fichiers du projet depuis l'environnement de développement vers votre ordinateur local.

### 2. 🌐 Créer le Repository GitHub

1. **Allez sur GitHub.com** et connectez-vous
2. **Cliquez sur "New repository"** (bouton vert)
3. **Configurez :**
   - **Nom :** `emploi-suisse-romande`
   - **Description :** `Application SaaS de recherche d'emploi automatisée en Suisse Romande`
   - **Visibilité :** Public ou Private
   - **NE PAS cocher** "Add a README file"
4. **Cliquez sur "Create repository"**

### 3. 💻 Commandes Git Locales

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# 1. Initialiser Git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le commit initial
git commit -m "feat: initial commit - Application SaaS Emploi Romand

✨ Fonctionnalités principales :
- Système d'authentification Supabase
- Recherche d'emploi automatisée
- Système Kanban drag & drop
- Tests psychométriques RIASEC et Ennéagramme
- Préparation aux entretiens avec IA
- Dashboard analytique complet
- Interface responsive avec Tailwind CSS"

# 4. Configurer la branche principale
git branch -M main

# 5. Ajouter le remote (remplacez VOTRE-USERNAME)
git remote add origin https://github.com/VOTRE-USERNAME/emploi-suisse-romande.git

# 6. Pousser vers GitHub
git push -u origin main
```

### 4. ⚙️ Configuration Post-Upload

#### Variables d'Environnement

1. **Copiez** `.env.example` vers `.env.local`
2. **Ajoutez vos clés Supabase :**
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
```

#### Base de Données Supabase

1. **Créez un projet** sur [supabase.com](https://supabase.com)
2. **Exécutez les migrations SQL** dans l'ordre :
   - `supabase/migrations/create_database_structure_2025_10_03_16_01.sql`
   - `supabase/migrations/create_rls_policies_2025_10_03_16_01.sql`
   - `supabase/migrations/insert_test_data_2025_10_03_16_01.sql`

### 5. 🏃‍♂️ Lancer l'Application

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### 6. 🚀 Déploiement (Optionnel)

#### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod

# Configurer les variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Netlify

```bash
# Build
npm run build

# Déployer le dossier dist/
netlify deploy --prod --dir=dist
```

## 📚 Documentation Complète

- **📖 README.md** - Guide complet d'utilisation
- **🛠️ INSTALL.md** - Instructions détaillées d'installation
- **🚀 DEPLOYMENT.md** - Guides de déploiement
- **🤝 CONTRIBUTING.md** - Guide de contribution

## 🆘 Support

- **Email :** support@emploiromand.ch
- **GitHub Issues :** Pour signaler des bugs
- **Documentation :** Voir les fichiers .md du projet

---

**🎉 Votre application SaaS Emploi Romand est maintenant sur GitHub !**
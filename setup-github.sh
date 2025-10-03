#!/bin/bash

# Script d'intégration GitHub pour Emploi Romand
# Usage: ./setup-github.sh [nom-du-repository]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    print_message "❌ Git n'est pas installé. Veuillez l'installer d'abord." $RED
    exit 1
fi

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_message "❌ Ce script doit être exécuté depuis la racine du projet." $RED
    exit 1
fi

print_header "🚀 Configuration GitHub pour Emploi Romand"

# Demander le nom du repository si non fourni
if [ -z "$1" ]; then
    read -p "Nom du repository GitHub (ex: emploi-suisse-romande): " REPO_NAME
else
    REPO_NAME=$1
fi

# Demander le nom d'utilisateur GitHub
read -p "Votre nom d'utilisateur GitHub: " GITHUB_USERNAME

# Initialiser Git si nécessaire
if [ ! -d ".git" ]; then
    print_message "📦 Initialisation du repository Git..." $YELLOW
    git init
    print_message "✅ Repository Git initialisé" $GREEN
fi

# Configurer les informations Git
print_message "👤 Configuration des informations Git..." $YELLOW
read -p "Votre nom complet: " GIT_NAME
read -p "Votre email: " GIT_EMAIL

git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"
print_message "✅ Informations Git configurées" $GREEN

# Ajouter tous les fichiers
print_message "📁 Ajout des fichiers au repository..." $YELLOW
git add .

# Créer le commit initial
print_message "💾 Création du commit initial..." $YELLOW
git commit -m "feat: initial commit - Application SaaS Emploi Romand

- ✨ Système d'authentification complet avec Supabase
- 🎯 Recherche d'emploi automatisée avec filtres avancés
- 📊 Système Kanban drag & drop pour suivi des candidatures
- 🧠 Tests psychométriques RIASEC et Ennéagramme
- 🎤 Préparation aux entretiens avec assistant IA
- 📈 Dashboard analytique avec statistiques
- 👤 Gestion de profil utilisateur complète
- 🏗️ Architecture Supabase avec RLS et migrations SQL
- 🎨 Design system avec Tailwind CSS et shadcn/ui
- 📱 Interface responsive optimisée

Base de données complète avec données de référence suisses (cantons, communes, secteurs NOGA).
Prêt pour déploiement en production."

print_message "✅ Commit initial créé" $GREEN

# Configurer la branche principale
print_message "🌿 Configuration de la branche principale..." $YELLOW
git branch -M main
print_message "✅ Branche main configurée" $GREEN

# Ajouter le remote origin
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
print_message "🔗 Configuration du remote origin..." $YELLOW
git remote add origin $REPO_URL
print_message "✅ Remote origin configuré: $REPO_URL" $GREEN

print_header "📋 Prochaines Étapes"

print_message "1. 🌐 Créez le repository sur GitHub:" $BLUE
print_message "   - Allez sur https://github.com/new" $NC
print_message "   - Nom: $REPO_NAME" $NC
print_message "   - Description: Application SaaS de recherche d'emploi automatisée en Suisse Romande" $NC
print_message "   - Visibilité: Public ou Private (selon vos préférences)" $NC
print_message "   - NE COCHEZ PAS 'Add a README file'" $NC
print_message "   - Cliquez sur 'Create repository'" $NC

echo ""
print_message "2. 🚀 Poussez le code vers GitHub:" $BLUE
print_message "   git push -u origin main" $YELLOW

echo ""
print_message "3. ⚙️ Configurez les variables d'environnement:" $BLUE
print_message "   - Copiez .env.example vers .env.local" $NC
print_message "   - Ajoutez vos clés Supabase" $NC
print_message "   - Voir INSTALL.md pour les détails" $NC

echo ""
print_message "4. 🗄️ Configurez Supabase:" $BLUE
print_message "   - Créez un projet sur supabase.com" $NC
print_message "   - Exécutez les migrations SQL dans l'ordre:" $NC
print_message "     1. create_database_structure_2025_10_03_16_01.sql" $NC
print_message "     2. create_rls_policies_2025_10_03_16_01.sql" $NC
print_message "     3. insert_test_data_2025_10_03_16_01.sql" $NC

echo ""
print_message "5. 🏃‍♂️ Lancez l'application:" $BLUE
print_message "   npm install" $YELLOW
print_message "   npm run dev" $YELLOW

echo ""
print_header "📚 Documentation Disponible"
print_message "📖 README.md - Guide complet d'utilisation" $NC
print_message "🛠️ INSTALL.md - Instructions d'installation détaillées" $NC
print_message "🚀 DEPLOYMENT.md - Guides de déploiement" $NC
print_message "🤝 CONTRIBUTING.md - Guide de contribution" $NC
print_message "📝 CHANGELOG.md - Historique des versions" $NC

echo ""
print_header "🎉 Configuration Terminée !"
print_message "Votre projet est prêt à être poussé vers GitHub." $GREEN
print_message "Repository configuré: $REPO_URL" $GREEN

echo ""
print_message "💡 Conseil: Après avoir créé le repository sur GitHub, exécutez:" $YELLOW
print_message "git push -u origin main" $YELLOW

echo ""
print_message "🆘 Besoin d'aide ? Consultez INSTALL.md ou contactez support@emploiromand.ch" $BLUE
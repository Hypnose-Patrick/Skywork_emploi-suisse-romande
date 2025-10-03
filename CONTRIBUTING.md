# Guide de Contribution - Emploi Romand

Merci de votre intérêt pour contribuer à Emploi Romand ! Ce guide vous aidera à contribuer efficacement au projet.

## 🤝 Comment Contribuer

### Types de Contributions Bienvenues

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- ⚡ **Optimisations de performance**
- 🔒 **Améliorations de sécurité**
- 🌍 **Traductions**
- 🧪 **Tests automatisés**

## 🚀 Processus de Contribution

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/votre-username/emploi-suisse-romande.git
cd emploi-suisse-romande

# Ajoutez le repository original comme remote
git remote add upstream https://github.com/original-username/emploi-suisse-romande.git
```

### 2. Configuration de l'Environnement

```bash
# Installez les dépendances
npm install

# Copiez les variables d'environnement
cp .env.example .env.local

# Configurez votre base de données Supabase locale
npm run db:setup

# Lancez en mode développement
npm run dev
```

### 3. Créer une Branche

```bash
# Créez une branche pour votre fonctionnalité
git checkout -b feature/nom-de-votre-fonctionnalite

# Ou pour un bug fix
git checkout -b fix/description-du-bug
```

### 4. Développement

#### Standards de Code

- **TypeScript** : Utilisez TypeScript pour tout nouveau code
- **ESLint** : Respectez les règles ESLint configurées
- **Prettier** : Formatez votre code avec Prettier
- **Commentaires** : Commentez en français pour la cohérence

#### Conventions de Nommage

```typescript
// Composants : PascalCase
const JobSearchPage = () => { ... }

// Hooks : camelCase avec préfixe "use"
const useJobSearch = () => { ... }

// Fonctions : camelCase
const calculateMatchScore = () => { ... }

// Constants : SCREAMING_SNAKE_CASE
const MAX_APPLICATIONS_PER_DAY = 50;

// Types/Interfaces : PascalCase
interface UserProfile { ... }
type ApplicationStatus = 'draft' | 'sent' | 'interview';
```

#### Structure des Fichiers

```
src/
├── components/
│   ├── ui/              # Composants UI de base
│   ├── layout/          # Composants de layout
│   └── feature/         # Composants spécifiques aux fonctionnalités
├── pages/               # Pages de l'application
├── hooks/               # Hooks personnalisés
├── contexts/            # Contextes React
├── types/               # Types TypeScript
├── lib/                 # Utilitaires et helpers
└── integrations/        # Intégrations externes
```

### 5. Tests

```bash
# Lancez les tests
npm run test

# Tests avec coverage
npm run test:coverage

# Tests des Edge Functions
npm run test:edge-functions
```

#### Écriture de Tests

```typescript
// Exemple de test de composant
import { render, screen } from '@testing-library/react';
import { JobCard } from './JobCard';

describe('JobCard', () => {
  it('should display job title and company', () => {
    const job = {
      title: 'Développeur React',
      company_name: 'TechCorp',
      location: 'Genève'
    };

    render(<JobCard job={job} />);
    
    expect(screen.getByText('Développeur React')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });
});
```

### 6. Commit et Push

#### Messages de Commit

Utilisez les [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Nouvelles fonctionnalités
git commit -m "feat: ajouter filtre par salaire dans la recherche d'emploi"

# Corrections de bugs
git commit -m "fix: corriger l'affichage des dates dans le Kanban"

# Documentation
git commit -m "docs: mettre à jour le guide d'installation"

# Refactoring
git commit -m "refactor: simplifier la logique de matching des emplois"

# Tests
git commit -m "test: ajouter tests pour le composant ApplicationCard"

# Style/Formatting
git commit -m "style: corriger l'indentation dans JobSearchPage"
```

#### Types de Commits

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactoring du code
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances, etc.
- `perf`: Amélioration des performances
- `ci`: Configuration CI/CD
- `build`: Système de build

### 7. Pull Request

1. **Poussez votre branche**
```bash
git push origin feature/nom-de-votre-fonctionnalite
```

2. **Créez une Pull Request** sur GitHub avec :
   - **Titre descriptif** suivant les conventions
   - **Description détaillée** des changements
   - **Screenshots** pour les changements UI
   - **Tests** ajoutés ou modifiés
   - **Breaking changes** si applicable

#### Template de Pull Request

```markdown
## 📝 Description
Brève description des changements apportés.

## 🎯 Type de Changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] Documentation (changements de documentation uniquement)

## 🧪 Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## 📸 Screenshots (si applicable)
Ajoutez des screenshots pour les changements UI.

## ✅ Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles
- [ ] J'ai fait les changements correspondants à la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que mon fix est efficace ou que ma fonctionnalité marche
- [ ] Les tests unitaires nouveaux et existants passent localement
```

## 🐛 Signaler des Bugs

### Avant de Signaler

1. **Vérifiez** que le bug n'a pas déjà été signalé
2. **Testez** avec la dernière version
3. **Reproduisez** le bug de manière consistante

### Template de Bug Report

```markdown
## 🐛 Description du Bug
Description claire et concise du bug.

## 🔄 Étapes pour Reproduire
1. Allez à '...'
2. Cliquez sur '...'
3. Scrollez jusqu'à '...'
4. Voyez l'erreur

## ✅ Comportement Attendu
Description claire de ce qui devrait se passer.

## 📸 Screenshots
Si applicable, ajoutez des screenshots pour expliquer le problème.

## 🖥️ Environnement
- OS: [ex: macOS 14.0]
- Navigateur: [ex: Chrome 118.0]
- Version: [ex: 1.0.0]
- Device: [ex: iPhone 15, Desktop]

## 📝 Contexte Additionnel
Ajoutez tout autre contexte sur le problème ici.
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request

```markdown
## 🚀 Fonctionnalité Proposée
Description claire et concise de la fonctionnalité souhaitée.

## 🎯 Problème Résolu
Quel problème cette fonctionnalité résout-elle ?

## 💭 Solution Proposée
Description claire de ce que vous voulez qui se passe.

## 🔄 Alternatives Considérées
Description des solutions alternatives que vous avez considérées.

## 📈 Impact Utilisateur
Comment cette fonctionnalité améliore-t-elle l'expérience utilisateur ?

## 🛠️ Complexité Technique
Estimation de la complexité d'implémentation (Faible/Moyenne/Élevée).
```

## 📚 Ressources Utiles

### Documentation Technique

- **React :** [reactjs.org](https://reactjs.org/)
- **TypeScript :** [typescriptlang.org](https://www.typescriptlang.org/)
- **Supabase :** [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS :** [tailwindcss.com](https://tailwindcss.com/)
- **shadcn/ui :** [ui.shadcn.com](https://ui.shadcn.com/)

### Outils de Développement

- **VS Code Extensions :**
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

### Standards Suisses

- **Classification NOGA :** [bfs.admin.ch](https://www.bfs.admin.ch/bfs/fr/home/statistiques/industrie-services/nomenclatures/noga.html)
- **Données géographiques :** [geo.admin.ch](https://www.geo.admin.ch/)
- **Réglementation emploi :** [seco.admin.ch](https://www.seco.admin.ch/)

## 🏆 Reconnaissance

Les contributeurs seront reconnus dans :
- **README.md** - Section contributeurs
- **CHANGELOG.md** - Crédits des versions
- **Page About** de l'application
- **Newsletter** mensuelle du projet

## 📞 Support

### Canaux de Communication

- **GitHub Issues :** Questions techniques et bugs
- **GitHub Discussions :** Discussions générales et idées
- **Email :** contribute@emploiromand.ch
- **Discord :** [Rejoindre la communauté](https://discord.gg/emploiromand)

### Temps de Réponse

- **Issues critiques :** 24h
- **Pull Requests :** 48-72h
- **Questions générales :** 1 semaine

## 📋 Code de Conduite

### Notre Engagement

Nous nous engageons à faire de la participation à notre projet une expérience sans harcèlement pour tous, indépendamment de l'âge, de la taille corporelle, du handicap visible ou invisible, de l'ethnicité, des caractéristiques sexuelles, de l'identité et de l'expression de genre, du niveau d'expérience, de l'éducation, du statut socio-économique, de la nationalité, de l'apparence personnelle, de la race, de la religion ou de l'identité et de l'orientation sexuelles.

### Standards

Exemples de comportements qui contribuent à créer un environnement positif :
- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres de la communauté

### Application

Les cas de comportement abusif, harcelant ou autrement inacceptable peuvent être signalés en contactant l'équipe du projet à conduct@emploiromand.ch.

---

**Merci de contribuer à Emploi Romand ! 🇨🇭✨**
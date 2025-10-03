# Guide de Déploiement - Emploi Romand

## 🚀 Options de Déploiement

### 1. Vercel (Recommandé)

**Avantages :** Intégration Git automatique, CDN global, SSL gratuit

```bash
# Installation
npm i -g vercel

# Déploiement
vercel --prod

# Configuration des variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

**Configuration vercel.json :**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

### 2. Netlify

```bash
# Build local
npm run build

# Déploiement via CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Ou via interface web : glisser-déposer le dossier dist/
```

**Configuration netlify.toml :**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Docker

**Dockerfile :**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml :**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload vers S3
aws s3 sync dist/ s3://votre-bucket --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation --distribution-id VOTRE_ID --paths "/*"
```

## 🔧 Configuration des Variables d'Environnement

### Variables Obligatoires

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
```

### Variables Optionnelles

```env
# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=HOTJAR_SITE_ID

# Monitoring
VITE_SENTRY_DSN=https://sentry.io/dsn

# APIs tierces
VITE_OPENAI_API_KEY=sk-...
VITE_RESEND_API_KEY=re_...
```

## 🔒 Configuration de Sécurité

### Headers de Sécurité

**nginx.conf :**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### CORS Configuration

Dans Supabase Dashboard > Settings > API :
```
Allowed origins: https://votre-domaine.com
```

## 📊 Monitoring et Analytics

### 1. Sentry (Monitoring d'erreurs)

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### 2. Google Analytics

```typescript
// src/lib/analytics.ts
import { gtag } from 'ga-gtag';

gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
```

### 3. Performance Monitoring

```typescript
// src/lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚀 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml :**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔄 Mise à jour et Rollback

### Stratégie de déploiement

1. **Blue-Green Deployment**
2. **Canary Releases**
3. **Feature Flags**

### Rollback rapide

```bash
# Vercel
vercel rollback

# Netlify
netlify sites:list
netlify api listSiteDeploys --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID
```

## 📈 Optimisation des Performances

### 1. Code Splitting

```typescript
// Lazy loading des pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
```

### 2. Compression

```bash
# Gzip
gzip -9 dist/**/*.{js,css,html}

# Brotli
brotli -Z dist/**/*.{js,css,html}
```

### 3. CDN Configuration

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        }
      }
    }
  }
});
```

## 🔍 Tests de Déploiement

### Checklist pré-déploiement

- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Build de production réussit
- [ ] Variables d'environnement configurées
- [ ] SSL/TLS configuré
- [ ] Monitoring activé
- [ ] Backup de la base de données

### Tests post-déploiement

```bash
# Test de santé
curl -f https://votre-domaine.com/health || exit 1

# Test des APIs critiques
curl -f https://votre-domaine.com/api/health || exit 1

# Test de performance
lighthouse https://votre-domaine.com --output=json
```

## 📞 Support Déploiement

En cas de problème :
1. Vérifiez les logs de build
2. Validez les variables d'environnement
3. Testez localement avec `npm run build && npm run preview`
4. Contactez le support : deploy@emploiromand.ch
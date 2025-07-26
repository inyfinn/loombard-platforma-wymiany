# Loombard - Platforma Wymiany Walut

Platforma do wymiany walut z nowoczesnym interfejsem użytkownika.

## 🚀 Deployment

### Opcja 1: Vercel (Zalecane)

1. **Przygotuj repozytorium GitHub:**
   - Wypchnij kod do repozytorium GitHub
   - Upewnij się, że branch główny to `main` lub `master`

2. **Dodaj sekrety do GitHub:**
   - Przejdź do Settings > Secrets and variables > Actions
   - Dodaj następujące sekrety:
     - `VERCEL_TOKEN` - token z Vercel CLI
     - `VERCEL_ORG_ID` - ID organizacji Vercel
     - `VERCEL_PROJECT_ID` - ID projektu Vercel

3. **Automatyczny deployment:**
   - Każdy push do branch głównego automatycznie wdroży aplikację
   - Pull requesty będą tworzyć preview deployments

### Opcja 2: Netlify

1. **Połącz z Netlify:**
   - Przejdź do [netlify.com](https://netlify.com)
   - Wybierz "New site from Git"
   - Połącz z repozytorium GitHub

2. **Konfiguracja build:**
   - Build command: `npm run build`
   - Publish directory: `dist`

### Opcja 3: GitHub Pages

1. **Dodaj sekret:**
   - `GH_TOKEN` - Personal Access Token z uprawnieniami do repo

2. **Workflow zostanie automatycznie uruchomiony**

## 🔧 Konfiguracja lokalna

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Build produkcyjny
npm run build

# Preview build
npm run preview
```

## 📁 Struktura projektu

```
src/
├── components/     # Komponenty UI
├── pages/         # Strony aplikacji
├── hooks/         # Custom hooks
├── lib/           # Utility functions
└── App.tsx        # Główny komponent
```

## 🛠 Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- React Query

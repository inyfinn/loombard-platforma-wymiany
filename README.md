# Loombard - Platforma Wymiany Walut

Zaawansowana platforma wymiany walut z w pełni konfigurowalnym dashboardem, drag & drop widgetami i nowoczesnym interfejsem użytkownika.

## 🚀 Funkcjonalności

### Dashboard
- **W pełni konfigurowalny pulpit** z drag & drop widgetami
- **Tryb edycji** pozwalający na dodawanie, usuwanie i przestawianie widgetów
- **Widgety**: Saldo całkowite, Kursy LIVE, Alerty cenowe, Ostatnie transakcje, AI Doradza, Wykres portfela
- **Aktualizacje w czasie rzeczywistym** co 1 sekundę

### Portfel
- **Lista wszystkich posiadanych walut** z flagami i wartościami
- **Przyciski akcji**: Kup, Sprzedaj, Wymień dla każdej waluty
- **Ukrywanie wartości** dla prywatności
- **Statystyki**: Największy zysk/strata, ostatnia wymiana

### Wymiana Walut
- **Zakładki**: Wymiana Natychmiastowa (Market) i Zlecenie z Limitem Ceny (Limit)
- **Modal potwierdzenia** z 15-sekundowym odliczaniem
- **Dynamiczne kursy** aktualizowane w czasie rzeczywistym
- **Kalkulator z opłatami** i podatkami

### Kursy LIVE
- **Pełna lista walut ISO 4217** z zaawansowanym filtrowaniem
- **Wyszukiwanie** z obsługą aliasów i wildcardów
- **Sortowanie** według pary, kursu, zmiany, wolumenu
- **Przyciski akcji** w zależności od posiadanych walut

### Historia Transakcji
- **Szczegółowe transakcje** z zyskiem/stratą
- **Filtrowanie** po typie, statusie, walucie
- **Eksport** danych
- **Statystyki** łączne

### Profil Użytkownika
- **Centrum analityczne** z wykresami zysków
- **Predykcje AI** dla posiadanych walut
- **Wiadomości ze świata** filtrowane do posiadanych walut
- **Edycja danych** profilowych

### Alerty Cenowe
- **Tworzenie alertów** z warunkami "powyżej/poniżej"
- **Różne kanały powiadomień**: Email, SMS, Push, Wszystkie
- **Historia wyzwolonych alertów**
- **Edytowanie i usuwanie** alertów

### Ustawienia Powiadomień
- **Konfiguracja kanałów**: Email, SMS, Push
- **Ciche godziny** i częstotliwość
- **Raporty zaplanowane**: Dzienny, tygodniowy, miesięczny
- **Status kanałów** i statystyki

## 🎨 Design System

- **Główny kolor akcentu**: #02c349 (zielony)
- **Tło trybu ciemnego**: Głęboka zielonkawa czerń
- **Inspiracja**: Projekt Analytics z zaokrąglonymi rogami i subtelnymi cieniami
- **W pełni responsywny** design
- **Tryb jasny i ciemny** z płynnymi przejściami

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

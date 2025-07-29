import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WelcomeContextType {
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (context === undefined) {
    throw new Error('useWelcome must be used within a WelcomeProvider');
  }
  return context;
};

interface WelcomeProviderProps {
  children: ReactNode;
}

export const WelcomeProvider = ({ children }: WelcomeProviderProps) => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Sprawdź localStorage przy ładowaniu
  useEffect(() => {
    const seen = localStorage.getItem('loombard-welcome-seen');
    if (!seen) {
      // Pokaż popup po krótkim opóźnieniu
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenWelcome(true);
    }
  }, []);

  // Zapisz do localStorage gdy użytkownik zobaczy popup
  const handleSetHasSeenWelcome = (seen: boolean) => {
    setHasSeenWelcome(seen);
    if (seen) {
      localStorage.setItem('loombard-welcome-seen', 'true');
    } else {
      localStorage.removeItem('loombard-welcome-seen');
    }
  };

  const value = {
    showWelcomePopup,
    setShowWelcomePopup,
    hasSeenWelcome,
    setHasSeenWelcome: handleSetHasSeenWelcome,
  };

  return (
    <WelcomeContext.Provider value={value}>
      {children}
    </WelcomeContext.Provider>
  );
}; 
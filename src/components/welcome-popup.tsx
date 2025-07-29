import { useState, useEffect } from "react";
import { X, CreditCard, Shield, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomePopup = ({ isOpen, onClose }: WelcomePopupProps) => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Opóźnienie animacji karty
      const timer = setTimeout(() => setShowCard(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowCard(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 p-6">
        {/* Główny kontener */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
          <CardContent className="p-8 md:p-12">
            {/* Przycisk zamknięcia */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Lewa strona - Treść */}
              <div className="space-y-6">
                {/* Badge */}
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 text-sm">
                  <Globe className="w-3 h-3 mr-2" />
                  Zaawansowana platforma wymiany walut
                </Badge>

                {/* Główny nagłówek */}
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Tu powstaje największa
                  </h1>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-emerald-400">
                    platforma do wymiany walut
                  </h2>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    w Europie
                  </h3>
                </div>

                {/* Opis */}
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                  Doświadcz płynnej wymiany walut z zaawansowanymi funkcjami, analizami 
                  w czasie rzeczywistym i bezpieczeństwem na poziomie instytucjonalnym. 
                  Rozpocznij wymianę w minuty.
                </p>

                {/* Przyciski akcji */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold"
                  >
                    Rozpocznij wymianę
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
                  >
                    Zobacz kursy →
                  </Button>
                </div>
              </div>

              {/* Prawa strona - Karta bankowa */}
              <div className="flex justify-center lg:justify-end">
                <div className={`relative transition-all duration-1000 ease-out ${
                  showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {/* Karta bankowa */}
                  <div className="relative w-80 h-52 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    {/* Chip */}
                    <div className="absolute top-6 right-6 w-12 h-8 bg-yellow-500 rounded-md"></div>
                    
                    {/* Logo karty */}
                    <div className="absolute top-6 left-6">
                      <div className="text-black font-bold text-lg">KANTOOR.pl Card</div>
                      <div className="text-black font-semibold text-sm">Premium</div>
                    </div>

                    {/* Numer karty */}
                    <div className="absolute top-20 left-6 right-6">
                      <div className="text-black font-mono text-2xl font-bold tracking-wider">
                        4521 1234 5678 9012
                      </div>
                    </div>

                    {/* Dane posiadacza */}
                    <div className="absolute bottom-6 left-6">
                      <div className="text-black text-xs font-medium uppercase tracking-wider">
                        Posiadacz karty
                      </div>
                      <div className="text-black font-bold text-lg">
                        Jan Kowalski
                      </div>
                    </div>

                    {/* Data ważności */}
                    <div className="absolute bottom-6 right-20">
                      <div className="text-black text-xs font-medium uppercase tracking-wider">
                        Ważna do
                      </div>
                      <div className="text-black font-bold text-lg">
                        12/28
                      </div>
                    </div>

                    {/* CVV */}
                    <div className="absolute bottom-6 right-6">
                      <div className="text-black text-xs font-medium uppercase tracking-wider">
                        CVV
                      </div>
                      <div className="text-black font-bold text-lg">
                        ***
                      </div>
                    </div>

                    {/* Ikony płatności */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      </div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Tekst pod kartą */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
                      Dbamy o Twoje pieniądze, z myślą o zaufaniu i transparentności z naszej strony. 
                      Zawsze będziesz mieć dostęp do swoich pieniędzy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dolne statystyki */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">99.9%</div>
                <div className="text-slate-400 text-sm">Uptime platformy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">256-bit</div>
                <div className="text-slate-400 text-sm">Szyfrowanie SSL</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">24/7</div>
                <div className="text-slate-400 text-sm">Wsparcie techniczne</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
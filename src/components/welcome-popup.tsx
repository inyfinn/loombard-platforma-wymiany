import { useContext } from "react";
import { useWelcome } from "../context/WelcomeContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";

export const WelcomePopup = () => {
  const { showWelcomePopup, setShowWelcomePopup } = useWelcome();

  if (!showWelcomePopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md welcome-popup relative">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                🚀 Witaj w KANTOOR.pl
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Tu powstaje największa platforma wymiany walut w Europie
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWelcomePopup(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Animated Card */}
          <div className="kantoor-card text-center">
            <div className="text-black font-bold text-xl mb-2">KANTOOR.pl Card</div>
            <div className="text-black text-sm mb-4">Premium</div>
            <div className="text-black font-mono text-lg mb-4">4521 1234 5678 9012</div>
            <div className="flex justify-between text-black text-sm">
              <div>
                <div>POSIADACZ KARTY</div>
                <div className="font-semibold">Jan Kowalski</div>
              </div>
              <div>
                <div>WAŻNA DO</div>
                <div className="font-semibold">12/28</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-300 text-sm">
              Zamów kartę płatniczą powiązaną z Twoim kontem i korzystaj z wymiany walut na całym świecie
            </p>
            
            <Button 
              className="w-full kantoor-button-primary"
              onClick={() => setShowWelcomePopup(false)}
            >
              Zamów Kartę
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
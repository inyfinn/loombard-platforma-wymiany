import { useState, useEffect } from "react";
import { ArrowRightLeft, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Lista głównych walut FIAT
const currencies = [
  { code: "PLN", name: "Polski Złoty", flag: "🇵🇱" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "Dolar Amerykański", flag: "🇺🇸" },
  { code: "GBP", name: "Funt Brytyjski", flag: "🇬🇧" },
  { code: "CHF", name: "Frank Szwajcarski", flag: "🇨🇭" },
  { code: "JPY", name: "Jen Japoński", flag: "🇯🇵" },
  { code: "CAD", name: "Dolar Kanadyjski", flag: "🇨🇦" },
  { code: "AUD", name: "Dolar Australijski", flag: "🇦🇺" },
  { code: "SEK", name: "Korona Szwedzka", flag: "🇸🇪" },
  { code: "NOK", name: "Korona Norweska", flag: "🇳🇴" },
];

export default function Exchange() {
  const { toast } = useToast();
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("PLN");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(4.3245);
  const [isLive, setIsLive] = useState(true);
  const [spread] = useState(0.02); // 2% spread
  const [fee] = useState(0.005); // 0.5% prowizja

  // Symulacja aktualizacji kursu co 1 sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate(prev => {
        const change = (Math.random() - 0.5) * 0.01;
        return Math.max(0.01, prev + change);
      });
      setIsLive(true);
      setTimeout(() => setIsLive(false), 200);
    }, 1000);

    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  // Przeliczanie kwot
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const rateWithSpread = exchangeRate * (1 - spread);
      const calculatedAmount = Number(fromAmount) * rateWithSpread;
      setToAmount(calculatedAmount.toFixed(2));
    } else {
      setToAmount("");
    }
  }, [fromAmount, exchangeRate, spread]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value && !isNaN(Number(value))) {
      const rateWithSpread = exchangeRate * (1 - spread);
      const calculatedAmount = Number(value) / rateWithSpread;
      setFromAmount(calculatedAmount.toFixed(2));
    } else {
      setFromAmount("");
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleExchange = () => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Błąd",
        description: "Proszę wprowadzić kwotę do wymiany",
        variant: "destructive",
      });
      return;
    }

    const finalAmount = Number(toAmount) * (1 - fee);
    
    toast({
      title: "Wymiana zakończona pomyślnie!",
      description: `Wymieniono ${fromAmount} ${fromCurrency} na ${finalAmount.toFixed(2)} ${toCurrency}`,
    });

    // Reset formularza
    setFromAmount("");
    setToAmount("");
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Kalkulator Wymiany Walut</h1>
        <p className="text-muted-foreground">
          Wymień waluty po konkurencyjnych kursach w czasie rzeczywistym
        </p>
      </div>

      {/* Główny kalkulator */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5" />
            <span>Wymiana Walut</span>
            {isLive && (
              <div className="flex items-center space-x-1 text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">LIVE</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Currency */}
          <div className="space-y-2">
            <Label>Mam</Label>
            <div className="flex space-x-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <Label>Chcę otrzymać</Label>
            <div className="flex space-x-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Rate info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Kurs wymiany:</span>
              <span className={`font-mono ${isLive ? 'animate-pulse-value' : ''}`}>
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Spread:</span>
              <span>{(spread * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Prowizja:</span>
              <span>{(fee * 100).toFixed(1)}%</span>
            </div>
            {fromAmount && toAmount && (
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                <span>Otrzymasz:</span>
                <span>
                  {formatCurrency(Number(toAmount) * (1 - fee), toCurrency)}
                </span>
              </div>
            )}
          </div>

          {/* Exchange button */}
          <Button 
            className="w-full accent-button" 
            size="lg"
            onClick={handleExchange}
            disabled={!fromAmount || !toAmount}
          >
            <Zap className="w-4 h-4 mr-2" />
            Wymień teraz
          </Button>
        </CardContent>
      </Card>

      {/* Dodatkowe informacje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Konkurencyjne kursy</h3>
            <p className="text-sm text-muted-foreground">
              Najlepsze kursy na rynku
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Błyskawiczne transakcje</h3>
            <p className="text-sm text-muted-foreground">
              Wymiana w czasie rzeczywistym
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Bez ukrytych opłat</h3>
            <p className="text-sm text-muted-foreground">
              Transparentne ceny
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
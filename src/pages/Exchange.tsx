import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRightLeft, Clock, AlertTriangle, Check, X, TrendingUp, Sparkles, Shield, Zap, Calculator, Target, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CurrencySelect } from "@/components/ui/currency-select";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useToast } from "@/hooks/use-toast";

interface Currency {
  code: string;
  name: string;
  flag: string;
  rate: number;
  available: number;
  change24h: number;
}

export default function Exchange() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balances, executeExchange, calculateExchange } = usePortfolio();
  const [activeTab, setActiveTab] = useState("market");
  
  // Exchange state
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("PLN");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(4.3245);
  const [fee, setFee] = useState(0.5);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  
  // Limit order state
  const [limitPrice, setLimitPrice] = useState("");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [expiryDate, setExpiryDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  // Wszystkie dostępne waluty ISO 4217 z aliasami
  const allCurrencies: Currency[] = [
    { code: "PLN", name: "Złoty Polski", flag: "🇵🇱", rate: 1, available: 45230.50, change24h: 0, aliases: ["złoty", "polski", "zł"] },
    { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 4.3245, available: 12500.00, change24h: 0.12, aliases: ["euro", "eu", "€"] },
    { code: "USD", name: "Dolar Amerykański", flag: "🇺🇸", rate: 3.9876, available: 8900.00, change24h: -0.08, aliases: ["dolar", "us", "$", "dollar"] },
    { code: "GBP", name: "Funt Brytyjski", flag: "🇬🇧", rate: 5.1234, available: 3200.00, change24h: 0.25, aliases: ["funt", "gb", "£", "pound"] },
    { code: "CHF", name: "Frank Szwajcarski", flag: "🇨🇭", rate: 4.5000, available: 1500.00, change24h: 0.05, aliases: ["frank", "szwajcarski", "ch"] },
    { code: "JPY", name: "Jen Japoński", flag: "🇯🇵", rate: 0.0267, available: 0, change24h: 0.03, aliases: ["jen", "japoński", "japan", "¥"] },
    { code: "CAD", name: "Dolar Kanadyjski", flag: "🇨🇦", rate: 2.9456, available: 0, change24h: -0.15, aliases: ["dolar kanadyjski", "canada", "c$"] },
    { code: "AUD", name: "Dolar Australijski", flag: "🇦🇺", rate: 2.6234, available: 0, change24h: 0.08, aliases: ["dolar australijski", "australia", "a$"] },
    { code: "CNY", name: "Juan Chiński", flag: "🇨🇳", rate: 0.5523, available: 0, change24h: 0.02, aliases: ["juan", "chiński", "china", "renminbi", "¥"] },
    { code: "SEK", name: "Korona Szwedzka", flag: "🇸🇪", rate: 0.3876, available: 0, change24h: -0.05, aliases: ["korona szwedzka", "sweden", "kr"] },
    { code: "NOK", name: "Korona Norweska", flag: "🇳🇴", rate: 0.3845, available: 0, change24h: 0.12, aliases: ["korona norweska", "norway", "kr"] },
    { code: "DKK", name: "Korona Duńska", flag: "🇩🇰", rate: 0.5802, available: 0, change24h: 0.01, aliases: ["korona duńska", "denmark", "kr"] },
    { code: "CZK", name: "Korona Czeska", flag: "🇨🇿", rate: 0.1723, available: 0, change24h: -0.08, aliases: ["korona czeska", "czech", "kč"] },
    { code: "HUF", name: "Forint", flag: "🇭🇺", rate: 0.0112, available: 0, change24h: 0.15, aliases: ["forint", "hungary", "ft"] },
    { code: "RUB", name: "Rubel Rosyjski", flag: "🇷🇺", rate: 0.0432, available: 0, change24h: -0.25, aliases: ["rubel", "rosyjski", "russia", "₽"] },
  ];

  // Filtruj waluty na podstawie sald użytkownika
  useEffect(() => {
    const userCurrencies = allCurrencies.filter(currency => {
      const balance = balances.find(b => b.code === currency.code);
      return balance && balance.amount > 0;
    });
    setAvailableCurrencies(userCurrencies);
    
    // Ustaw domyślną walutę "z" na pierwszą dostępną
    if (userCurrencies.length > 0 && !fromCurrency) {
      setFromCurrency(userCurrencies[0].code);
    }
    
    // Ustaw domyślną walutę "na" na PLN, chyba że "z" to PLN
    if (!toCurrency && fromCurrency) {
      setToCurrency(fromCurrency === "PLN" ? "EUR" : "PLN");
    }
  }, [balances, fromCurrency, toCurrency]);

  // Handle incoming navigation state
  useEffect(() => {
    if (location.state) {
      const { action, currency } = location.state;
      if (action === 'buy') {
        setToCurrency(currency);
        setFromCurrency('PLN');
      } else if (action === 'sell') {
        setFromCurrency(currency);
        setToCurrency('PLN');
      } else if (action === 'exchange') {
        setFromCurrency(currency);
      }
    }
  }, [location.state]);



  // Countdown timer for confirmation
  useEffect(() => {
    if (showConfirmation && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isConfirmed) {
      setShowConfirmation(false);
      setCountdown(15);
    }
  }, [showConfirmation, countdown, isConfirmed]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateResult = () => {
    const numAmount = parseFloat(amount) || 0;
    const feeAmount = (numAmount * fee) / 100;
    const result = (numAmount - feeAmount) * rate;
    return { result, feeAmount };
  };

  // Aktualizuj kurs gdy zmieniają się waluty
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      try {
        const newRate = calculateExchange(fromCurrency, toCurrency, 1);
        setRate(newRate);
      } catch (error) {
        console.error('Error calculating rate:', error);
        setRate(0);
      }
    }
  }, [fromCurrency, toCurrency, calculateExchange]);

  // Aktualizuj kursy co sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      if (fromCurrency && toCurrency) {
        try {
          const newRate = calculateExchange(fromCurrency, toCurrency, 1);
          setRate(newRate);
        } catch (error) {
          console.error('Error updating rate:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency, calculateExchange]);

  // Sprawdź czy użytkownik ma wystarczające środki
  const getAvailableBalance = (currencyCode: string) => {
    const balance = balances.find(b => b.code === currencyCode);
    return balance ? balance.amount : 0;
  };

  // Sprawdź czy kwota nie przekracza dostępnego salda
  const isAmountValid = () => {
    const numAmount = parseFloat(amount) || 0;
    const availableBalance = getAvailableBalance(fromCurrency);
    return numAmount > 0 && numAmount <= availableBalance;
  };

  const handleExchange = async (type: "instant" | "limit") => {
    if (!fromCurrency || !toCurrency || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Błąd walidacji",
        description: "Proszę wypełnić wszystkie wymagane pola.",
        variant: "destructive",
      });
      return;
    }

    // Sprawdź czy użytkownik ma wystarczające środki
    if (!isAmountValid()) {
      const availableBalance = getAvailableBalance(fromCurrency);
      toast({
        title: "Niewystarczające środki",
        description: `Nie masz wystarczających środków w ${fromCurrency}. Dostępne: ${formatCurrency(availableBalance, fromCurrency)}`,
        variant: "destructive",
      });
      return;
    }

    const exchangeData = {
      type,
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      rate: type === "instant" ? rate : parseFloat(limitPrice),
      estimatedAmount: type === "instant" ? 
        parseFloat(amount) * rate : 
        parseFloat(amount) * parseFloat(limitPrice),
      fee: type === "instant" ? 
        parseFloat(amount) * rate * 0.005 : 
        parseFloat(amount) * parseFloat(limitPrice) * 0.003,
      totalAmount: type === "instant" ? 
        parseFloat(amount) * rate * 1.005 : 
        parseFloat(amount) * parseFloat(limitPrice) * 1.003
    };

    setConfirmationData(exchangeData);
    setShowConfirmation(true);
  };

  const handleConfirmExchange = async () => {
    if (!confirmationData) return;

    setIsProcessing(true);
    try {
      // Symulacja procesowania transakcji
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (confirmationData.type === "instant") {
        // Wykonaj rzeczywistą wymianę
        executeExchange(
          confirmationData.fromCurrency, 
          confirmationData.toCurrency, 
          confirmationData.amount, 
          confirmationData.rate
        );
      }

      toast({
        title: confirmationData.type === "instant" ? "Wymiana wykonana" : "Zlecenie utworzone",
        description: confirmationData.type === "instant" ? 
          `Pomyślnie wymieniono ${confirmationData.amount} ${confirmationData.fromCurrency} na ${confirmationData.estimatedAmount.toFixed(2)} ${confirmationData.toCurrency}` :
          `Zlecenie limitowe utworzone dla ${confirmationData.amount} ${confirmationData.fromCurrency} po kursie ${confirmationData.rate}`,
      });

      setShowConfirmation(false);
      setConfirmationData(null);
      
      // Reset form
      setAmount("");
      setLimitPrice("");
      setExpiryDate(new Date().toISOString().split('T')[0]);
      
      // Przekieruj do historii po chwili
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      toast({
        title: "Błąd transakcji",
        description: "Nie udało się wykonać transakcji. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const { result, feeAmount } = calculateResult();
  const isCountdownCritical = countdown <= 5;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border-[#02c349]/20 hover:bg-[#02c349]/10 text-[#02c349] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
              Wymiana Walut 💱
            </h1>
            <p className="text-gray-400 mt-2">
              Wymieniaj waluty w czasie rzeczywistym
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#02c349]">Natychmiastowa wymiana</p>
                <p className="text-2xl font-bold text-white">Dostępna</p>
              </div>
              <div className="w-12 h-12 bg-[#02c349]/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#02c349]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00071c] border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Zlecenia z limitem</p>
                <p className="text-2xl font-bold text-white">Beta</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00071c] border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-400">Bezpieczeństwo</p>
                <p className="text-2xl font-bold text-white">256-bit</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#00071c] border-[#02c349]/20 p-1 rounded-xl">
          <TabsTrigger 
            value="market" 
            className="data-[state=active]:bg-[#02c349] data-[state=active]:text-white text-[#02c349] rounded-lg transition-all duration-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Wymiana Natychmiastowa
          </TabsTrigger>
          <TabsTrigger 
            value="limit"
            className="data-[state=active]:bg-[#02c349] data-[state=active]:text-white text-[#02c349] rounded-lg transition-all duration-300"
          >
            <Target className="w-4 h-4 mr-2" />
            Zlecenie z Limitem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <Card className="bg-[#00071c] border-[#02c349]/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#02c349]" />
                Wymiana Natychmiastowa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Masz</Label>
                <div className="flex space-x-3">
                  <CurrencySelect
                    currencies={availableCurrencies}
                    value={fromCurrency}
                    onValueChange={setFromCurrency}
                    placeholder="Wybierz walutę..."
                    showBalance={true}
                    getBalance={getAvailableBalance}
                    formatCurrency={formatCurrency}
                    className="w-36"
                  />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                    min="0"
                    step="0.01"
                    max={getAvailableBalance(fromCurrency)}
                  />
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-between">
                  <span>
                    Dostępne: {formatCurrency(getAvailableBalance(fromCurrency), fromCurrency)}
                    {parseFloat(amount) > getAvailableBalance(fromCurrency) && (
                      <span className="text-red-400 ml-2">Kwota przekracza dostępne saldo!</span>
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount(getAvailableBalance(fromCurrency).toString())}
                    className="text-[#02c349] hover:text-[#02c349]/80 text-xs"
                  >
                    Maksymalna kwota
                  </Button>
                </div>
              </div>

              {/* Exchange Arrow */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const tempFrom = fromCurrency;
                    const tempTo = toCurrency;
                    setFromCurrency(tempTo);
                    setToCurrency(tempFrom);
                    // Reset amount when switching currencies
                    setAmount("");
                  }}
                  className="w-12 h-12 rounded-full border-[#02c349]/20 hover:bg-[#02c349]/10 text-[#02c349] transition-all duration-300 hover:scale-110"
                  title="Zamień waluty"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Otrzymasz</Label>
                <div className="flex space-x-3">
                  <CurrencySelect
                    currencies={allCurrencies}
                    value={toCurrency}
                    onValueChange={setToCurrency}
                    placeholder="Wybierz walutę..."
                    showBalance={false}
                    className="w-36"
                  />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={result.toFixed(2)}
                    readOnly
                    className="flex-1 bg-[#00071c]/70 border-[#02c349]/10 text-white"
                  />
                </div>
              </div>

              {/* Exchange Details */}
              <div className="space-y-3 p-4 bg-[#00071c]/50 rounded-xl border border-[#02c349]/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Kurs wymiany:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-semibold text-white">
                      1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                    </span>
                    <div className="w-2 h-2 bg-[#02c349] rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Opłata:</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(feeAmount, fromCurrency)} ({fee}%)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#02c349]/10">
                  <span className="font-semibold text-white">Do otrzymania:</span>
                  <span className="text-lg font-bold text-[#02c349]">
                    {formatCurrency(result, toCurrency)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#02c349] hover:bg-[#02c349]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold" 
                size="lg"
                onClick={() => handleExchange("instant")}
                disabled={!amount || parseFloat(amount) <= 0 || !isAmountValid()}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Wymień teraz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limit" className="space-y-6">
          <Card className="bg-[#00071c] border-[#02c349]/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#02c349]" />
                Zlecenie z Limitem Ceny
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Typ zlecenia</Label>
                <div className="flex space-x-3">
                  <Button
                    variant={orderType === "buy" ? "default" : "outline"}
                    onClick={() => setOrderType("buy")}
                    className={`flex-1 h-12 transition-all duration-300 ${
                      orderType === "buy" 
                        ? "bg-[#02c349] hover:bg-[#02c349]/90 text-white shadow-lg" 
                        : "border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Kup
                  </Button>
                  <Button
                    variant={orderType === "sell" ? "default" : "outline"}
                    onClick={() => setOrderType("sell")}
                    className={`flex-1 h-12 transition-all duration-300 ${
                      orderType === "sell" 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg" 
                        : "border-red-500/20 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
                    Sprzedaj
                  </Button>
                </div>
              </div>

              {/* Currency and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-300">Waluta</Label>
                  <CurrencySelect
                    currencies={availableCurrencies}
                    value={fromCurrency}
                    onValueChange={setFromCurrency}
                    placeholder="Wybierz walutę..."
                    showBalance={true}
                    getBalance={getAvailableBalance}
                    formatCurrency={formatCurrency}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-300">Ilość</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                    min="0"
                    step="0.01"
                    max={getAvailableBalance(fromCurrency)}
                  />
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>Dostępne: {formatCurrency(getAvailableBalance(fromCurrency), fromCurrency)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAmount(getAvailableBalance(fromCurrency).toString())}
                      className="text-[#02c349] hover:text-[#02c349]/80 text-xs"
                    >
                      Maksymalna kwota
                    </Button>
                  </div>
                </div>
              </div>

              {/* Limit Price */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Cena limitu</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="0.0000"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="flex-1 bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                    step="0.0001"
                    min="0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLimitPrice(rate.toFixed(4))}
                    className="border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                  >
                    Aktualny kurs
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  Aktualny kurs: {rate.toFixed(4)}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Data ważności</Label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setExpiryDate(tomorrow.toISOString().split('T')[0]);
                    }}
                    className="border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                  >
                    Jutro
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full bg-[#02c349] hover:bg-[#02c349]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold" 
                size="lg"
                onClick={() => handleExchange("limit")}
                disabled={!amount || !limitPrice || !expiryDate || !isAmountValid()}
              >
                <Clock className="w-4 h-4 mr-2" />
                Utwórz zlecenie
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md bg-[#00071c] border-[#02c349]/20">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Potwierdź transakcję</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Sprawdź szczegóły transakcji przed potwierdzeniem
            </DialogDescription>
          </DialogHeader>
          
          {confirmationData && (
            <div className="space-y-4">
              <div className="p-4 bg-[#00071c]/50 rounded-lg border border-[#02c349]/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Typ:</span>
                    <div className="font-medium text-white">
                      {confirmationData.type === "instant" ? "Wymiana natychmiastowa" : "Zlecenie limitowe"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Kurs:</span>
                    <div className="font-medium text-white">{confirmationData.rate.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Kwota:</span>
                    <div className="font-medium text-white">
                      {confirmationData.amount} {confirmationData.fromCurrency}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Otrzymasz:</span>
                    <div className="font-medium text-white">
                      {confirmationData.estimatedAmount.toFixed(2)} {confirmationData.toCurrency}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Opłata:</span>
                    <div className="font-medium text-red-400">
                      {confirmationData.fee.toFixed(2)} {confirmationData.toCurrency}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Łącznie:</span>
                    <div className="font-medium text-[#02c349]">
                      {confirmationData.totalAmount.toFixed(2)} {confirmationData.toCurrency}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Countdown Timer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Czas na anulowanie:</span>
                  <span className={`text-lg font-bold ${isCountdownCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {countdown}s
                  </span>
                </div>
                <Progress 
                  value={(countdown / 15) * 100} 
                  className={`h-2 ${isCountdownCritical ? 'bg-red-500/20' : 'bg-[#02c349]/20'}`}
                />
                <div className="text-xs text-gray-500 text-center">
                  {countdown > 2 ? "Przez pierwsze 2 sekundy przycisk jest nieaktywny" : "Możesz teraz potwierdzić transakcję"}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              disabled={isProcessing}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Anuluj
            </Button>
            <Button 
              onClick={handleConfirmExchange}
              disabled={isProcessing || countdown > 13}
              className={`${
                isCountdownCritical 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-[#02c349] hover:bg-[#02c349]/90'
              } text-white`}
            >
              {isProcessing ? "Przetwarzanie..." : "Potwierdź"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
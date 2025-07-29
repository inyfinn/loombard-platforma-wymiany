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
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("PLN");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(4.3245);
  const [fee, setFee] = useState(0.5);
  
  // Limit order state
  const [limitPrice, setLimitPrice] = useState("");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [expiryDate, setExpiryDate] = useState("");
  
  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const currencies: Currency[] = [
    { code: "PLN", name: "Złoty Polski", flag: "🇵🇱", rate: 1, available: 45230.50, change24h: 0 },
    { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 4.3245, available: 12500.00, change24h: 0.12 },
    { code: "USD", name: "Dolar Amerykański", flag: "🇺🇸", rate: 3.9876, available: 8900.00, change24h: -0.08 },
    { code: "GBP", name: "Funt Brytyjski", flag: "🇬🇧", rate: 5.1234, available: 3200.00, change24h: 0.25 },
    { code: "CHF", name: "Frank Szwajcarski", flag: "🇨🇭", rate: 4.5000, available: 1500.00, change24h: 0.05 },
  ];

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

  // Update rate when currencies change
  useEffect(() => {
    try {
      const newRate = calculateExchange(fromCurrency, toCurrency, 1);
      setRate(newRate);
    } catch (error) {
      console.error('Error calculating rate:', error);
    }
  }, [fromCurrency, toCurrency, calculateExchange]);

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
    const fromBalance = balances.find(b => b.code === fromCurrency);
    if (!fromBalance || fromBalance.amount < parseFloat(amount)) {
      toast({
        title: "Niewystarczające środki",
        description: `Nie masz wystarczających środków w ${fromCurrency}`,
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
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
            Wymiana Walut 💱
          </h1>
          <p className="text-gray-400 mt-2">
            Wymieniaj waluty w czasie rzeczywistym
          </p>
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
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-36 bg-[#00071c]/50 border-[#02c349]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium text-white">{currency.code}</span>
                            {currency.change24h !== 0 && (
                              <Badge variant={currency.change24h > 0 ? "default" : "destructive"} className="ml-auto">
                                {currency.change24h > 0 ? "+" : ""}{currency.change24h.toFixed(2)}%
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Dostępne: {formatCurrency(currencies.find(c => c.code === fromCurrency)?.available || 0, fromCurrency)}
                </div>
              </div>

              {/* Exchange Arrow */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setFromCurrency(toCurrency);
                    setToCurrency(fromCurrency);
                  }}
                  className="w-12 h-12 rounded-full border-[#02c349]/20 hover:bg-[#02c349]/10 text-[#02c349] transition-all duration-300 hover:scale-110"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Otrzymasz</Label>
                <div className="flex space-x-3">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-36 bg-[#00071c]/50 border-[#02c349]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium text-white">{currency.code}</span>
                            {currency.change24h !== 0 && (
                              <Badge variant={currency.change24h > 0 ? "default" : "destructive"} className="ml-auto">
                                {currency.change24h > 0 ? "+" : ""}{currency.change24h.toFixed(2)}%
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <span className="font-mono font-semibold text-white">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </span>
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
                disabled={!amount || parseFloat(amount) <= 0}
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
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium text-white">{currency.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-300">Ilość</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                  />
                </div>
              </div>

              {/* Limit Price */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Cena limitu</Label>
                <Input
                  type="number"
                  placeholder="0.0000"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Data ważności</Label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                />
              </div>

              <Button 
                className="w-full bg-[#02c349] hover:bg-[#02c349]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold" 
                size="lg"
                onClick={() => handleExchange("limit")}
                disabled={!amount || !limitPrice || !expiryDate}
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
              disabled={isProcessing}
              className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
            >
              {isProcessing ? "Przetwarzanie..." : "Potwierdź"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
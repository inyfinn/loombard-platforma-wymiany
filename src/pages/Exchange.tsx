import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRightLeft, Clock, AlertTriangle, Check, X, TrendingUp, Sparkles, Shield, Zap, Calculator, Target, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";

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
    const fromCurr = currencies.find(c => c.code === fromCurrency);
    const toCurr = currencies.find(c => c.code === toCurrency);
    if (fromCurr && toCurr) {
      setRate(toCurr.rate / fromCurr.rate);
    }
  }, [fromCurrency, toCurrency]);

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

  const handleExchange = () => {
    setShowConfirmation(true);
    setCountdown(15);
    setIsConfirmed(false);
  };

  const { exchange: recordExchange } = usePortfolio();

  const handleConfirm = () => {
    setIsConfirmed(true);
    // update portfolio
    recordExchange(fromCurrency, toCurrency, parseFloat(amount), rate);
    // Here you would typically make an API call
    setTimeout(() => {
      setShowConfirmation(false);
      setCountdown(15);
      setIsConfirmed(false);
    }, 1000);
  };

  const { result, feeAmount } = calculateResult();
  const isCountdownCritical = countdown <= 5;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Wymiana Walut 💱
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Szybka i bezpieczna wymiana w czasie rzeczywistym
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">System aktywny</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/rates')}
            className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Kursy LIVE
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Wymiana natychmiastowa</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">0.5% opłata</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Zlecenia z limitem</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">0.3% opłata</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Bezpieczeństwo</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">99.9% gwarancja</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger 
            value="market" 
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100 rounded-lg transition-all duration-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Wymiana Natychmiastowa
          </TabsTrigger>
          <TabsTrigger 
            value="limit"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100 rounded-lg transition-all duration-300"
          >
            <Target className="w-4 h-4 mr-2" />
            Zlecenie z Limitem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                Wymiana Natychmiastowa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Masz</Label>
                <div className="flex space-x-3">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-36 bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
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
                    className="flex-1 bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
                  />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
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
                  className="w-12 h-12 rounded-full border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Otrzymasz</Label>
                <div className="flex space-x-3">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-36 bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
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
                    className="flex-1 bg-slate-100/50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Exchange Details */}
              <div className="space-y-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Kurs wymiany:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Opłata:</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(feeAmount, fromCurrency)} ({fee}%)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Do otrzymania:</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(result, toCurrency)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold" 
                size="lg"
                onClick={handleExchange}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Wymień teraz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limit" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-500" />
                Zlecenie z Limitem Ceny
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Typ zlecenia</Label>
                <div className="flex space-x-3">
                  <Button
                    variant={orderType === "buy" ? "default" : "outline"}
                    onClick={() => setOrderType("buy")}
                    className={`flex-1 h-12 transition-all duration-300 ${
                      orderType === "buy" 
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg" 
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
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
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg" 
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
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
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Waluta</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ilość</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Limit Price */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cena limitu</Label>
                <Input
                  type="number"
                  placeholder="0.0000"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data ważności</Label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
                />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold" 
                size="lg"
                disabled={!amount || !limitPrice || !expiryDate}
              >
                <Clock className="w-4 h-4 mr-2" />
                Utwórz zlecenie
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200 dark:bg-slate-900/95 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Potwierdź wymianę
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-slate-700 dark:text-slate-300">Wymieniasz:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(parseFloat(amount) || 0, fromCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-slate-300">Otrzymasz:</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(result, toCurrency)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Kurs:</span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Opłata:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(feeAmount, fromCurrency)}
                </span>
              </div>
            </div>

            {/* Countdown Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Czas na anulowanie:</span>
                <span className={`font-medium ${isCountdownCritical ? "animate-pulse text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`}>
                  {countdown}s
                </span>
              </div>
              <Progress 
                value={(countdown / 15) * 100} 
                className={`h-2 ${isCountdownCritical ? "animate-pulse" : ""}`}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 h-12 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300"
                onClick={() => {
                  setShowConfirmation(false);
                  setCountdown(15);
                }}
                disabled={isConfirmed}
              >
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
              <Button
                className={`flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 ${isCountdownCritical ? "animate-pulse" : ""}`}
                onClick={handleConfirm}
                disabled={countdown > 14 || isConfirmed}
              >
                {isConfirmed ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Potwierdzono
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Potwierdź
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
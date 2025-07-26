import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRightLeft, Clock, AlertTriangle, Check, X } from "lucide-react";
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
    { code: "PLN", name: "Złoty Polski", flag: "🇵🇱", rate: 1, available: 45230.50 },
    { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 4.3245, available: 12500.00 },
    { code: "USD", name: "Dolar Amerykański", flag: "🇺🇸", rate: 3.9876, available: 8900.00 },
    { code: "GBP", name: "Funt Brytyjski", flag: "🇬🇧", rate: 5.1234, available: 3200.00 },
    { code: "CHF", name: "Frank Szwajcarski", flag: "🇨🇭", rate: 4.5000, available: 1500.00 },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Wymiana Walut</h1>
          <p className="text-muted-foreground">Szybka i bezpieczna wymiana</p>
        </div>
      </div>

      {/* Exchange Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market">Wymiana Natychmiastowa</TabsTrigger>
          <TabsTrigger value="limit">Zlecenie z Limitem</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wymiana Natychmiastowa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-2">
                <Label>Masz</Label>
                <div className="flex space-x-2">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-32">
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
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
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <Label>Otrzymasz</Label>
                <div className="flex space-x-2">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-32">
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
                    value={result.toFixed(2)}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                </div>
              </div>

              {/* Exchange Details */}
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Kurs wymiany:</span>
                  <span className="font-mono">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Opłata:</span>
                  <span className="text-sm">{formatCurrency(feeAmount, fromCurrency)} ({fee}%)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Do otrzymania:</span>
                  <span>{formatCurrency(result, toCurrency)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleExchange}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Wymień teraz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zlecenie z Limitem Ceny</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Type */}
              <div className="space-y-2">
                <Label>Typ zlecenia</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={orderType === "buy" ? "default" : "outline"}
                    onClick={() => setOrderType("buy")}
                    className="flex-1"
                  >
                    Kup
                  </Button>
                  <Button
                    variant={orderType === "sell" ? "default" : "outline"}
                    onClick={() => setOrderType("sell")}
                    className="flex-1"
                  >
                    Sprzedaj
                  </Button>
                </div>
              </div>

              {/* Currency and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Waluta</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
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
                </div>
                <div className="space-y-2">
                  <Label>Ilość</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Limit Price */}
              <div className="space-y-2">
                <Label>Cena limitu</Label>
                <Input
                  type="number"
                  placeholder="0.0000"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label>Data ważności</Label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <Button 
                className="w-full" 
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Potwierdź wymianę</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Wymieniasz:</span>
                <span>{formatCurrency(parseFloat(amount) || 0, fromCurrency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Otrzymasz:</span>
                <span>{formatCurrency(result, toCurrency)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Kurs:</span>
                <span className="font-mono">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Opłata:</span>
                <span>{formatCurrency(feeAmount, fromCurrency)}</span>
              </div>
            </div>

            {/* Countdown Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Czas na anulowanie:</span>
                <span className={isCountdownCritical ? "animate-pulse font-medium" : ""}>
                  {countdown}s
                </span>
              </div>
              <Progress 
                value={(countdown / 15) * 100} 
                className={isCountdownCritical ? "animate-pulse" : ""}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
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
                className={`flex-1 ${isCountdownCritical ? "animate-pulse" : ""}`}
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
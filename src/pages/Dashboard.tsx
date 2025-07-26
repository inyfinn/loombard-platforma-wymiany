import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, History, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(125430.50);
  const [balances] = useState([
    { currency: "PLN", amount: 45230.50, code: "PLN" },
    { currency: "EUR", amount: 12500.00, code: "EUR" },
    { currency: "USD", amount: 8900.00, code: "USD" },
  ]);

  const [recentTransactions] = useState([
    {
      id: 1,
      type: "exchange",
      from: "EUR",
      to: "PLN",
      amount: 1000,
      rate: 4.32,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "deposit",
      from: "Bank",
      to: "PLN",
      amount: 5000,
      rate: 1,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [currentRates] = useState([
    { pair: "EUR/PLN", rate: 4.3245, change: 0.12 },
    { pair: "USD/PLN", rate: 3.9876, change: -0.08 },
    { pair: "GBP/PLN", rate: 5.1234, change: 0.25 },
  ]);

  // Animacja licznika dla salda
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalBalance(prev => prev + (Math.random() - 0.5) * 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Witaj ponownie! Oto podsumowanie Twojego konta.</p>
        </div>
      </div>

      {/* Główne karty sald */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Całkowite saldo */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Całkowite Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold animate-pulse-value">
                {formatCurrency(totalBalance, 'PLN')}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +2.4% od wczoraj
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Szybkie akcje */}
        <Card className="col-span-1">
          <CardContent className="p-6">
            <Button 
              className="w-full accent-button"
              onClick={() => navigate('/exchange')}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Wymień walutę
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/history')}
            >
              <History className="w-4 h-4 mr-2" />
              Historia
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Salda walut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {balances.map((balance) => (
          <Card key={balance.code} className="currency-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{balance.currency}</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(balance.amount, balance.code)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">{balance.code}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sekcja dolna - kursy i transakcje */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktualne kursy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kursy LIVE</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/rates')}
            >
              Zobacz wszystkie
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentRates.map((rate) => (
                <div key={rate.pair} className="flex items-center justify-between">
                  <span className="font-medium">{rate.pair}</span>
                  <div className="text-right">
                    <div className="font-mono">{rate.rate.toFixed(4)}</div>
                    <div className={`text-sm flex items-center ${
                      rate.change > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {rate.change > 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(rate.change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ostatnie transakcje */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ostatnie Transakcje</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
            >
              Zobacz wszystkie
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.from} → {transaction.to}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">
                      {formatCurrency(transaction.amount, transaction.to)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Kurs: {transaction.rate.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
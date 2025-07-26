import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { ArrowLeft, Plus, Minus, ArrowRightLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Balance {
  code: string;
  amount: number;
}

export default function Portfel() {
  const navigate = useNavigate();
  const [showValues, setShowValues] = useState(true);
  const [baseCurrency] = useState("PLN");

  const { balances } = usePortfolio();

  const totalValue = balances.reduce((sum, balance) => sum + balance.amount, 0);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">Mój Portfel</h1>
            <p className="text-muted-foreground">Zarządzaj swoimi walutami</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button onClick={() => navigate('/exchange')}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj walutę
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Całkowita wartość portfela</p>
              <p className="text-3xl font-bold">
                {showValues ? formatCurrency(totalValue, baseCurrency) : '••••••••'}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="default" className="mb-2">
                +2.4% dziś
              </Badge>
              <p className="text-sm text-muted-foreground">
                {balances.length} walut
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances List */}
      <Card>
        <CardHeader>
          <CardTitle>Twoje waluty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((balance) => (
              <div
                key={balance.code}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                {/* Currency Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{balance.flag}</div>
                  <div>
                    <div className="font-medium">{balance.currency}</div>
                    <div className="text-sm text-muted-foreground">{balance.code}</div>
                  </div>
                </div>

                {/* Amount and Value */}
                <div className="text-right">
                  <div className="font-medium">
                    {showValues ? formatCurrency(balance.amount, balance.code) : '••••••••'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {showValues ? formatCurrency(balance.value, baseCurrency) : '••••••••'}
                  </div>
                  {balance.change24h !== 0 && (
                    <Badge 
                      variant={balance.change24h >= 0 ? "default" : "destructive"}
                      className="mt-1"
                    >
                      {formatPercentage(balance.change24h)}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/exchange', { state: { action: 'buy', currency: balance.code } })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Kup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/exchange', { state: { action: 'sell', currency: balance.code } })}
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Sprzedaj
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/exchange', { state: { action: 'exchange', currency: balance.code } })}
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1" />
                    Wymień
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Największy zysk</p>
                <p className="font-medium">EUR +2.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Minus className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Największa strata</p>
                <p className="font-medium">USD -1.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ostatnia wymiana</p>
                <p className="font-medium">EUR → PLN</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
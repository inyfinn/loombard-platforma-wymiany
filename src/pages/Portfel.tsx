import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { ArrowLeft, Plus, Minus, ArrowRightLeft, Eye, EyeOff, Wallet, TrendingUp, TrendingDown, Sparkles, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Balance {
  code: string;
  amount: number;
  change24h?: number;
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
              Mój Portfel 💰
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Zarządzaj swoimi walutami i śledź ich wartość
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowValues(!showValues)}
            className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={() => navigate('/exchange')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj walutę
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-700/50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Całkowita wartość portfela</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {showValues ? formatCurrency(totalValue, baseCurrency) : '••••••••'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.4% dziś
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {balances.length} walut
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances List */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-blue-500" />
            Twoje waluty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((balance) => (
              <div
                key={balance.code}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300"
              >
                {/* Currency Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{balance.flag}</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{balance.currency}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{balance.code}</div>
                  </div>
                </div>

                {/* Amount and Value */}
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {showValues ? formatCurrency(balance.amount, balance.code) : '••••••••'}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {showValues ? formatCurrency(balance.amount, baseCurrency) : '••••••••'}
                  </div>
                  {balance.change24h !== 0 && (
                    <Badge 
                      variant={balance.change24h >= 0 ? "default" : "destructive"}
                      className={`mt-1 ${
                        balance.change24h >= 0 
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}
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
                    className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                  >
                    <Plus className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                    Kup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/exchange', { state: { action: 'sell', currency: balance.code } })}
                    className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Minus className="w-4 h-4 mr-1 text-red-600 dark:text-red-400" />
                    Sprzedaj
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/exchange', { state: { action: 'exchange', currency: balance.code } })}
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
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
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Największy zysk</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">EUR +2.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Największa strata</p>
                <p className="text-lg font-bold text-red-900 dark:text-red-100">USD -1.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Ostatnia wymiana</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">EUR → PLN</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Dzisiejszy wolumen</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">12 transakcji</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Bezpieczeństwo</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">99.9% gwarancja</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
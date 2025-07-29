import { useState, useEffect } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Plus, Minus, ArrowRightLeft, Activity, Globe, Clock, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface CurrencyRate {
  pair: string;
  base: string;
  quote: string;
  rate: number;
  change: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdate: string;
}

export default function Rates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("");
  const [sortBy, setSortBy] = useState<"pair" | "rate" | "change" | "volume">("pair");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pełna lista walut ISO 4217
  const allCurrencies = [
    "PLN", "EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD", "SEK", "NOK",
    "DKK", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "CNY", "KRW",
    "SGD", "HKD", "NZD", "MXN", "BRL", "ZAR", "INR", "THB", "MYR", "IDR",
    "PHP", "VND", "BDT", "PKR", "EGP", "NGN", "KES", "GHS", "UGX", "TZS"
  ];

  const [rates, setRates] = useState<CurrencyRate[]>([
    { pair: "EUR/PLN", base: "EUR", quote: "PLN", rate: 4.3245, change: 0.12, volume: 1250000, high24h: 4.3450, low24h: 4.2980, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "USD/PLN", base: "USD", quote: "PLN", rate: 3.9876, change: -0.08, volume: 890000, high24h: 4.0120, low24h: 3.9650, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "GBP/PLN", base: "GBP", quote: "PLN", rate: 5.1234, change: 0.25, volume: 450000, high24h: 5.1450, low24h: 5.0980, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "CHF/PLN", base: "CHF", quote: "PLN", rate: 4.5000, change: 0.05, volume: 320000, high24h: 4.5120, low24h: 4.4850, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "EUR/USD", base: "EUR", quote: "USD", rate: 1.0845, change: 0.05, volume: 2100000, high24h: 1.0870, low24h: 1.0810, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "GBP/USD", base: "GBP", quote: "USD", rate: 1.2845, change: 0.08, volume: 1800000, high24h: 1.2870, low24h: 1.2810, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "USD/JPY", base: "USD", quote: "JPY", rate: 148.25, change: -0.15, volume: 1500000, high24h: 148.50, low24h: 147.80, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "EUR/GBP", base: "EUR", quote: "GBP", rate: 0.8432, change: -0.03, volume: 950000, high24h: 0.8450, low24h: 0.8410, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "USD/CHF", base: "USD", quote: "CHF", rate: 0.8865, change: 0.02, volume: 750000, high24h: 0.8880, low24h: 0.8840, lastUpdate: "2024-01-15T10:30:00Z" },
    { pair: "AUD/USD", base: "AUD", quote: "USD", rate: 0.6723, change: 0.12, volume: 680000, high24h: 0.6740, low24h: 0.6700, lastUpdate: "2024-01-15T10:30:00Z" },
  ]);

  // Pobieranie kursów z API co 5 s
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=PLN");
        const data = await res.json();
        if (data && data.rates) {
          const entries: CurrencyRate[] = Object.keys(data.rates).map(code => ({
            pair: `${code}/PLN`,
            base: code,
            quote: "PLN",
            rate: parseFloat((1 / data.rates[code]).toFixed(4)),
            change: 0,
            volume: 0,
            high24h: 0,
            low24h: 0,
            lastUpdate: new Date().toISOString()
          }));
          setRates(entries);
        }
      } catch {}
    };
    fetchRates();
    const intId = setInterval(fetchRates, 5000);
    return () => clearInterval(intId);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Filtrowanie i sortowanie
  const filteredRates = rates
    .filter(rate => {
      const matchesSearch = rate.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rate.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rate.quote.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = !filterCurrency || filterCurrency === "all" || 
                           rate.base === filterCurrency || 
                           rate.quote === filterCurrency;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "pair":
          aValue = a.pair;
          bValue = b.pair;
          break;
        case "rate":
          aValue = a.rate;
          bValue = b.rate;
          break;
        case "change":
          aValue = a.change;
          bValue = b.change;
          break;
        case "volume":
          aValue = a.volume;
          bValue = b.volume;
          break;
        default:
          aValue = a.pair;
          bValue = b.pair;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const userHasCurrency = (currency: string) => {
    // Symulacja sprawdzania czy użytkownik ma daną walutę
    const userCurrencies = ["PLN", "EUR", "USD", "GBP", "CHF"];
    return userCurrencies.includes(currency);
  };

  // Statystyki
  const totalVolume = rates.reduce((sum, rate) => sum + rate.volume, 0);
  const avgChange = rates.reduce((sum, rate) => sum + rate.change, 0) / rates.length;
  const activePairs = rates.length;

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
              Kursy Walut LIVE 📈
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Aktualne kursy wszystkich walut świata w czasie rzeczywistym
            </p>
          </div>
        </div>
        
        {/* Live Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">LIVE</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/exchange')}
            className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Szybka wymiana
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Aktywne pary</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activePairs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Średnia zmiana</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{avgChange.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Całkowity wolumen</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {new Intl.NumberFormat('pl-PL', { notation: 'compact' }).format(totalVolume)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Wyszukaj</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="EUR, USD, PLN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white dark:bg-slate-800/50 dark:border-slate-700 dark:focus:bg-slate-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pokaż pary z walutą</label>
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger className="bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                  <SelectValue placeholder="Wszystkie waluty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie waluty</SelectItem>
                  {allCurrencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sortuj według</label>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [column, order] = value.split('-') as [typeof sortBy, "asc" | "desc"];
                setSortBy(column);
                setSortOrder(order);
              }}>
                <SelectTrigger className="bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pair-asc">Para (A-Z)</SelectItem>
                  <SelectItem value="pair-desc">Para (Z-A)</SelectItem>
                  <SelectItem value="rate-asc">Kurs (rosnąco)</SelectItem>
                  <SelectItem value="rate-desc">Kurs (malejąco)</SelectItem>
                  <SelectItem value="change-asc">Zmiana (rosnąco)</SelectItem>
                  <SelectItem value="change-desc">Zmiana (malejąco)</SelectItem>
                  <SelectItem value="volume-asc">Wolumen (rosnąco)</SelectItem>
                  <SelectItem value="volume-desc">Wolumen (malejąco)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rates Table */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Kursy walut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => handleSort("pair")}>
                    Para walut
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => handleSort("rate")}>
                    Kurs
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => handleSort("change")}>
                    24h
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => handleSort("volume")}>
                    Wolumen
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">
                    24h High/Low
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">
                    Ostatnia aktualizacja
                  </th>
                  <th className="text-center p-4 font-semibold text-slate-700 dark:text-slate-300">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((rate) => (
                  <tr key={rate.pair} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{rate.pair}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {rate.base} / {rate.quote}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">{rate.rate.toFixed(4)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={rate.change >= 0 ? "default" : "destructive"} className={
                        rate.change >= 0 
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }>
                        {rate.change >= 0 ? "+" : ""}{rate.change.toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {new Intl.NumberFormat('pl-PL', { notation: 'compact' }).format(rate.volume)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm">
                        <div className="text-green-600 dark:text-green-400 font-medium">{rate.high24h.toFixed(4)}</div>
                        <div className="text-red-600 dark:text-red-400 font-medium">{rate.low24h.toFixed(4)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(rate.lastUpdate)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/exchange', { state: { action: 'buy', currency: rate.base } })}
                          className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                        >
                          <Plus className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </Button>
                        {userHasCurrency(rate.base) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/exchange', { state: { action: 'sell', currency: rate.base } })}
                            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                          >
                            <Minus className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </Button>
                        )}
                        {userHasCurrency(rate.base) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/exchange', { state: { action: 'exchange', currency: rate.base } })}
                            className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
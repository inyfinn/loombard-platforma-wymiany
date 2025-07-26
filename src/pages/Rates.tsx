import { useState, useEffect } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Plus, Minus, ArrowRightLeft } from "lucide-react";
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

  // Symulacja aktualizacji kursów co 1 sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates => prevRates.map(rate => ({
        ...rate,
        rate: rate.rate + (Math.random() - 0.5) * 0.001,
        change: rate.change + (Math.random() - 0.5) * 0.01,
        lastUpdate: new Date().toISOString()
      })));
    }, 1000);

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
          <h1 className="text-3xl font-bold">Kursy Walut LIVE</h1>
          <p className="text-muted-foreground">Aktualne kursy wszystkich walut świata</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wyszukaj</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="EUR, USD, PLN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pokaż pary z walutą</label>
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">Sortuj według</label>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [column, order] = value.split('-') as [typeof sortBy, "asc" | "desc"];
                setSortBy(column);
                setSortOrder(order);
              }}>
                <SelectTrigger>
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
      <Card>
        <CardHeader>
          <CardTitle>Kursy walut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort("pair")}>
                    Para walut
                  </th>
                  <th className="text-right p-4 font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort("rate")}>
                    Kurs
                  </th>
                  <th className="text-right p-4 font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort("change")}>
                    24h
                  </th>
                  <th className="text-right p-4 font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort("volume")}>
                    Wolumen
                  </th>
                  <th className="text-right p-4 font-medium">
                    24h High/Low
                  </th>
                  <th className="text-right p-4 font-medium">
                    Ostatnia aktualizacja
                  </th>
                  <th className="text-center p-4 font-medium">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((rate) => (
                  <tr key={rate.pair} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{rate.pair}</div>
                      <div className="text-sm text-muted-foreground">
                        {rate.base} / {rate.quote}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono">{rate.rate.toFixed(4)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={rate.change >= 0 ? "default" : "destructive"}>
                        {rate.change >= 0 ? "+" : ""}{rate.change.toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm">
                        {new Intl.NumberFormat('pl-PL').format(rate.volume)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm">
                        <div className="text-green-600">{rate.high24h.toFixed(4)}</div>
                        <div className="text-red-600">{rate.low24h.toFixed(4)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatTime(rate.lastUpdate)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/exchange', { state: { action: 'buy', currency: rate.base } })}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        {userHasCurrency(rate.base) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/exchange', { state: { action: 'sell', currency: rate.base } })}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        )}
                        {userHasCurrency(rate.base) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/exchange', { state: { action: 'exchange', currency: rate.base } })}
                          >
                            <ArrowRightLeft className="w-3 h-3" />
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
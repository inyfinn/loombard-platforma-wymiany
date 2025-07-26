import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialRates = [
  { pair: "EUR/PLN", rate: 4.3245, change: 0.12, volume: "€2.4M", flag: "🇪🇺→🇵🇱" },
  { pair: "USD/PLN", rate: 3.9876, change: -0.08, volume: "$1.8M", flag: "🇺🇸→🇵🇱" },
  { pair: "GBP/PLN", rate: 5.1234, change: 0.25, volume: "£890K", flag: "🇬🇧→🇵🇱" },
  { pair: "CHF/PLN", rate: 4.4567, change: -0.05, volume: "CHF 450K", flag: "🇨🇭→🇵🇱" },
  { pair: "JPY/PLN", rate: 0.0289, change: 0.34, volume: "¥180M", flag: "🇯🇵→🇵🇱" },
  { pair: "CAD/PLN", rate: 2.9123, change: -0.15, volume: "C$720K", flag: "🇨🇦→🇵🇱" },
  { pair: "AUD/PLN", rate: 2.6789, change: 0.18, volume: "A$560K", flag: "🇦🇺→🇵🇱" },
  { pair: "SEK/PLN", rate: 0.3876, change: -0.22, volume: "SEK 2.1M", flag: "🇸🇪→🇵🇱" },
  { pair: "NOK/PLN", rate: 0.3654, change: 0.09, volume: "NOK 1.3M", flag: "🇳🇴→🇵🇱" },
  { pair: "EUR/USD", rate: 1.0845, change: 0.15, volume: "€3.2M", flag: "🇪🇺→🇺🇸" },
];

export default function Rates() {
  const [rates, setRates] = useState(initialRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("pair");
  const [filterBy, setFilterBy] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Symulacja aktualizacji kursów co 1 sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates => 
        prevRates.map(rate => ({
          ...rate,
          rate: rate.rate + (Math.random() - 0.5) * 0.01,
          change: rate.change + (Math.random() - 0.5) * 0.1,
        }))
      );
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtrowanie i sortowanie
  const filteredRates = rates
    .filter(rate => {
      const matchesSearch = rate.pair.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === "all" || 
        (filterBy === "rising" && rate.change > 0) ||
        (filterBy === "falling" && rate.change < 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "change":
          return Math.abs(b.change) - Math.abs(a.change);
        case "rate":
          return b.rate - a.rate;
        default:
          return a.pair.localeCompare(b.pair);
      }
    });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kursy Walut LIVE</h1>
          <p className="text-muted-foreground">
            Aktualizacja co sekundę • Ostatnia: {formatTime(lastUpdate)}
          </p>
        </div>
        <div className="flex items-center space-x-1 text-green-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">NA ŻYWO</span>
        </div>
      </div>

      {/* Filtry i wyszukiwanie */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj pary walutowej..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="rising">Rosnące</SelectItem>
                <SelectItem value="falling">Spadające</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pair">Nazwa</SelectItem>
                <SelectItem value="change">Zmiana</SelectItem>
                <SelectItem value="rate">Kurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela kursów */}
      <Card>
        <CardHeader>
          <CardTitle>Kursy Walutowe ({filteredRates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header tabeli */}
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
              <div>Para walutowa</div>
              <div className="text-right">Kurs</div>
              <div className="text-right">Zmiana 24h</div>
              <div className="text-right">Wolumen</div>
            </div>

            {/* Wiersze danych */}
            {filteredRates.map((rate, index) => (
              <div 
                key={rate.pair}
                className="grid grid-cols-4 gap-4 py-3 border-b border-border/50 hover:bg-muted/50 rounded-lg px-2 transition-colors"
              >
                {/* Para walutowa */}
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{rate.flag}</span>
                  <div>
                    <div className="font-semibold">{rate.pair}</div>
                    <div className="text-sm text-muted-foreground">#{index + 1}</div>
                  </div>
                </div>

                {/* Kurs */}
                <div className="text-right">
                  <div className="font-mono text-lg font-medium">
                    {rate.rate.toFixed(4)}
                  </div>
                </div>

                {/* Zmiana */}
                <div className="text-right">
                  <Badge 
                    variant={rate.change > 0 ? "default" : "destructive"}
                    className={`${
                      rate.change > 0 
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }`}
                  >
                    {rate.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(rate.change).toFixed(2)}%
                  </Badge>
                </div>

                {/* Wolumen */}
                <div className="text-right">
                  <div className="font-medium">{rate.volume}</div>
                  <div className="text-sm text-muted-foreground">24h</div>
                </div>
              </div>
            ))}

            {filteredRates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nie znaleziono par walutowych odpowiadających kryteriom wyszukiwania.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500">
              {filteredRates.filter(r => r.change > 0).length}
            </div>
            <p className="text-sm text-muted-foreground">Waluty rosnące</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-500">
              {filteredRates.filter(r => r.change < 0).length}
            </div>
            <p className="text-sm text-muted-foreground">Waluty spadające</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">
              {filteredRates.length}
            </div>
            <p className="text-sm text-muted-foreground">Łączna liczba par</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
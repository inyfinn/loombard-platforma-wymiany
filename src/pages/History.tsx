import { useState } from "react";
import { Search, Filter, Download, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

interface Transaction {
  id: string;
  type: "exchange" | "deposit" | "withdrawal";
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "exchange",
    fromCurrency: "EUR",
    toCurrency: "PLN",
    fromAmount: 1000,
    toAmount: 4324.50,
    rate: 4.3245,
    fee: 5.25,
    status: "completed",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TXN-002",
    type: "deposit",
    fromCurrency: "PLN",
    toCurrency: "PLN",
    fromAmount: 5000,
    toAmount: 5000,
    rate: 1,
    fee: 0,
    status: "completed",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TXN-003",
    type: "exchange",
    fromCurrency: "USD",
    toCurrency: "PLN",
    fromAmount: 500,
    toAmount: 1993.80,
    rate: 3.9876,
    fee: 2.15,
    status: "completed",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TXN-004",
    type: "withdrawal",
    fromCurrency: "PLN",
    toCurrency: "PLN",
    fromAmount: 2000,
    toAmount: 2000,
    rate: 1,
    fee: 10,
    status: "pending",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "TXN-005",
    type: "exchange",
    fromCurrency: "GBP",
    toCurrency: "EUR",
    fromAmount: 800,
    toAmount: 927.36,
    rate: 1.1592,
    fee: 4.85,
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function History() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Filtrowanie i sortowanie transakcji
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.toCurrency.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.fromAmount - a.fromAmount;
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exchange":
        return <ArrowRightLeft className="w-4 h-4" />;
      case "deposit":
        return <ArrowDownRight className="w-4 h-4" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "exchange":
        return "Wymiana";
      case "deposit":
        return "Wpłata";
      case "withdrawal":
        return "Wypłata";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Zakończona";
      case "pending":
        return "Oczekująca";
      case "failed":
        return "Niepowodzenie";
      default:
        return status;
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ["ID", "Typ", "Z", "Na", "Kwota", "Otrzymano", "Kurs", "Prowizja", "Status", "Data"],
      ...filteredTransactions.map(t => [
        t.id,
        getTypeLabel(t.type),
        t.fromCurrency,
        t.toCurrency,
        t.fromAmount.toString(),
        t.toAmount.toString(),
        t.rate.toString(),
        t.fee.toString(),
        getStatusLabel(t.status),
        formatDate(t.date)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historia_transakcji.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Historia Transakcji</h1>
          <p className="text-muted-foreground">
            Przegląj wszystkie swoje operacje i transakcje
          </p>
        </div>
        <Button onClick={exportTransactions} className="accent-button">
          <Download className="w-4 h-4 mr-2" />
          Eksportuj CSV
        </Button>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-sm text-muted-foreground">Łączne transakcje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500">
              {transactions.filter(t => t.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">Zakończone</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {transactions.filter(t => t.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Oczekujące</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "exchange" && t.status === "completed")
                  .reduce((sum, t) => sum + t.fee, 0),
                "PLN"
              )}
            </div>
            <p className="text-sm text-muted-foreground">Łączne prowizje</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtry */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj po ID, walucie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie typy</SelectItem>
                <SelectItem value="exchange">Wymiana</SelectItem>
                <SelectItem value="deposit">Wpłata</SelectItem>
                <SelectItem value="withdrawal">Wypłata</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="completed">Zakończona</SelectItem>
                <SelectItem value="pending">Oczekująca</SelectItem>
                <SelectItem value="failed">Niepowodzenie</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="amount">Kwota</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista transakcji */}
      <Card>
        <CardHeader>
          <CardTitle>Transakcje ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getTypeIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{transaction.id}</span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(transaction.type)} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 text-right">
                  <div className="font-semibold">
                    {transaction.type === "exchange" ? (
                      <>
                        {formatCurrency(transaction.fromAmount, transaction.fromCurrency)} →{" "}
                        {formatCurrency(transaction.toAmount, transaction.toCurrency)}
                      </>
                    ) : (
                      formatCurrency(transaction.fromAmount, transaction.fromCurrency)
                    )}
                  </div>
                  {transaction.type === "exchange" && (
                    <div className="text-sm text-muted-foreground">
                      Kurs: {transaction.rate.toFixed(4)} • Prowizja: {formatCurrency(transaction.fee, "PLN")}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nie znaleziono transakcji odpowiadających kryteriom wyszukiwania.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { ArrowLeft, Filter, Download, Search, ArrowRightLeft, Plus, Minus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  type: "exchange" | "deposit" | "withdrawal" | "limit_order";
  from: string;
  to: string;
  amount: number;
  rate: number;
  date: string;
  status: "completed" | "pending" | "cancelled" | "failed";
  profit?: number;
  fee: number;
  reference: string;
}

export default function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "exchange",
      from: "EUR",
      to: "PLN",
      amount: 1000,
      rate: 4.32,
      date: "2024-01-15T10:30:00Z",
      status: "completed",
      profit: 120,
      fee: 5.40,
      reference: "EX-2024-001"
    },
    {
      id: 2,
      type: "deposit",
      from: "Bank",
      to: "PLN",
      amount: 5000,
      rate: 1,
      date: "2024-01-15T09:15:00Z",
      status: "completed",
      fee: 0,
      reference: "DEP-2024-001"
    },
    {
      id: 3,
      type: "exchange",
      from: "USD",
      to: "EUR",
      amount: 2000,
      rate: 0.85,
      date: "2024-01-14T16:45:00Z",
      status: "completed",
      profit: -45,
      fee: 8.50,
      reference: "EX-2024-002"
    },
    {
      id: 4,
      type: "limit_order",
      from: "GBP",
      to: "PLN",
      amount: 1500,
      rate: 5.15,
      date: "2024-01-14T14:20:00Z",
      status: "completed",
      profit: 75,
      fee: 7.73,
      reference: "LO-2024-001"
    },
    {
      id: 5,
      type: "exchange",
      from: "CHF",
      to: "USD",
      amount: 800,
      rate: 1.12,
      date: "2024-01-14T11:30:00Z",
      status: "completed",
      profit: 32,
      fee: 4.48,
      reference: "EX-2024-003"
    },
    {
      id: 6,
      type: "withdrawal",
      from: "PLN",
      to: "Bank",
      amount: 2500,
      rate: 1,
      date: "2024-01-13T17:00:00Z",
      status: "completed",
      fee: 2.50,
      reference: "WTH-2024-001"
    },
    {
      id: 7,
      type: "exchange",
      from: "EUR",
      to: "USD",
      amount: 3000,
      rate: 1.08,
      date: "2024-01-13T13:45:00Z",
      status: "completed",
      profit: 90,
      fee: 16.20,
      reference: "EX-2024-004"
    },
    {
      id: 8,
      type: "limit_order",
      from: "USD",
      to: "PLN",
      amount: 1200,
      rate: 3.95,
      date: "2024-01-13T10:15:00Z",
      status: "cancelled",
      fee: 0,
      reference: "LO-2024-002"
    },
    {
      id: 9,
      type: "exchange",
      from: "PLN",
      to: "GBP",
      amount: 8000,
      rate: 0.195,
      date: "2024-01-12T15:30:00Z",
      status: "completed",
      profit: -160,
      fee: 7.80,
      reference: "EX-2024-005"
    },
    {
      id: 10,
      type: "deposit",
      from: "Bank",
      to: "EUR",
      amount: 2000,
      rate: 4.30,
      date: "2024-01-12T12:00:00Z",
      status: "completed",
      fee: 0,
      reference: "DEP-2024-002"
    },
    {
      id: 11,
      type: "exchange",
      from: "CZK",
      to: "PLN",
      amount: 50000,
      rate: 0.17,
      date: "2024-01-12T09:45:00Z",
      status: "completed",
      profit: 25,
      fee: 42.50,
      reference: "EX-2024-006"
    },
    {
      id: 12,
      type: "limit_order",
      from: "EUR",
      to: "CHF",
      amount: 2500,
      rate: 0.96,
      date: "2024-01-11T16:20:00Z",
      status: "pending",
      fee: 0,
      reference: "LO-2024-003"
    },
    {
      id: 13,
      type: "exchange",
      from: "USD",
      to: "JPY",
      amount: 1500,
      rate: 148.25,
      date: "2024-01-11T14:10:00Z",
      status: "completed",
      profit: 18,
      fee: 11.12,
      reference: "EX-2024-007"
    },
    {
      id: 14,
      type: "withdrawal",
      from: "EUR",
      to: "Bank",
      amount: 1000,
      rate: 4.32,
      date: "2024-01-11T11:30:00Z",
      status: "completed",
      fee: 4.32,
      reference: "WTH-2024-002"
    },
    {
      id: 15,
      type: "exchange",
      from: "PLN",
      to: "HUF",
      amount: 3000,
      rate: 88.50,
      date: "2024-01-10T17:45:00Z",
      status: "completed",
      profit: 45,
      fee: 13.28,
      reference: "EX-2024-008"
    }
  ];

  const formatCurrency = (amount: number, currency: string) => {
    const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "PLN";
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exchange":
        return <ArrowRightLeft className="w-4 h-4" />;
      case "deposit":
        return <Plus className="w-4 h-4" />;
      case "withdrawal":
        return <Minus className="w-4 h-4" />;
      case "limit_order":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exchange":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "deposit":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "withdrawal":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "limit_order":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Filtrowanie transakcji
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    const matchesCurrency = filterCurrency === "all" || 
                           transaction.from === filterCurrency || 
                           transaction.to === filterCurrency;
    
    return matchesSearch && matchesType && matchesStatus && matchesCurrency;
  });

  const totalProfit = filteredTransactions
    .filter(t => t.profit !== undefined)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const totalFees = filteredTransactions.reduce((sum, t) => sum + t.fee, 0);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Symulacja eksportu danych
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Przygotowanie danych do eksportu
      const exportData = {
        transactions: filteredTransactions,
        filters: {
          type: filterType,
          status: filterStatus,
          currency: filterCurrency,
          searchTerm
        },
        summary: {
          totalTransactions: filteredTransactions.length,
          totalProfit,
          totalFees,
          completedTransactions: filteredTransactions.filter(t => t.status === 'completed').length
        },
        exportDate: new Date().toISOString()
      };
      
      // Tworzenie pliku CSV
      const headers = ['ID', 'Typ', 'Z', 'Na', 'Kwota', 'Kurs', 'Zysk/Strata', 'Opłata', 'Status', 'Data', 'Referencja'];
      const csvContent = [
        headers.join(','),
        ...filteredTransactions.map(t => [
          t.id,
          t.type,
          t.from,
          t.to,
          t.amount,
          t.rate,
          t.profit || 0,
          t.fee,
          t.status,
          t.date,
          t.reference
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loombard-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dane wyeksportowane",
        description: "Historia transakcji została pobrana jako plik CSV.",
      });
      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 bg-clip-text text-transparent">
            Historia Transakcji 📋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Przegląd operacji - funkcje w fazie rozwoju
          </p>
        </div>
        <Button 
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
          onClick={() => setShowExportDialog(true)}
        >
          <Download className="w-4 h-4 mr-2" />
          Eksportuj
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <div className="text-sm text-muted-foreground">Łączne transakcje</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit, 'PLN')}
            </div>
            <div className="text-sm text-muted-foreground">Łączny zysk/strata</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalFees, 'PLN')}
            </div>
            <div className="text-sm text-muted-foreground">Łączne opłaty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {filteredTransactions.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Zakończone</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wyszukaj</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Numer referencyjny..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Typ transakcji</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie typy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  <SelectItem value="exchange">Wymiana</SelectItem>
                  <SelectItem value="deposit">Wpłata</SelectItem>
                  <SelectItem value="withdrawal">Wypłata</SelectItem>
                  <SelectItem value="limit_order">Zlecenie limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie statusy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  <SelectItem value="completed">Zakończone</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                  <SelectItem value="failed">Nieudane</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Waluta</label>
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie waluty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie waluty</SelectItem>
                  <SelectItem value="PLN">PLN</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CHF">CHF</SelectItem>
                  <SelectItem value="CZK">CZK</SelectItem>
                  <SelectItem value="HUF">HUF</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transakcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Typ</th>
                  <th className="text-left p-4 font-medium">Z</th>
                  <th className="text-left p-4 font-medium">Na</th>
                  <th className="text-right p-4 font-medium">Kwota</th>
                  <th className="text-right p-4 font-medium">Kurs</th>
                  <th className="text-right p-4 font-medium">Zysk/Strata</th>
                  <th className="text-right p-4 font-medium">Opłata</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Referencja</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type === "exchange" && "Wymiana"}
                          {transaction.type === "deposit" && "Wpłata"}
                          {transaction.type === "withdrawal" && "Wypłata"}
                          {transaction.type === "limit_order" && "Limit"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{transaction.from}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{transaction.to}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono">
                        {formatCurrency(transaction.amount, transaction.from)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono text-sm">
                        {transaction.rate.toFixed(4)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {transaction.profit !== undefined ? (
                        <div className={`font-mono ${transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.profit >= 0 ? '+' : ''}{formatCurrency(transaction.profit, 'PLN')}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono text-sm">
                        {formatCurrency(transaction.fee, 'PLN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === "completed" && "Zakończone"}
                        {transaction.status === "pending" && "Oczekujące"}
                        {transaction.status === "cancelled" && "Anulowane"}
                        {transaction.status === "failed" && "Nieudane"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-mono text-muted-foreground">
                        {transaction.reference}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eksport historii transakcji</DialogTitle>
            <DialogDescription>
              Wyeksportuj historię transakcji w formacie CSV. 
              Plik będzie zawierał wszystkie transakcje zgodnie z aktualnymi filtrami.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Podsumowanie eksportu:</h4>
              <ul className="text-sm space-y-1">
                <li>• Liczba transakcji: {filteredTransactions.length}</li>
                <li>• Łączny zysk/strata: {formatCurrency(totalProfit, 'PLN')}</li>
                <li>• Łączne opłaty: {formatCurrency(totalFees, 'PLN')}</li>
                <li>• Zakończone transakcje: {filteredTransactions.filter(t => t.status === 'completed').length}</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? "Eksportowanie..." : "Eksportuj CSV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
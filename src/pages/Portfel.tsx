import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { ArrowLeft, Plus, Minus, ArrowRightLeft, Eye, EyeOff, Wallet, TrendingUp, TrendingDown, Sparkles, Shield, BarChart3, DollarSign, CreditCard, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Portfel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balances, totalValuePLN, addTransaction, calculateExchange } = usePortfolio();
  const [showValues, setShowValues] = useState(true);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{type: string, currency: string, balance: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPLN = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleQuickAction = (type: string, currency: string, balance: number) => {
    setSelectedAction({ type, currency, balance });
    setShowActionDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAction) return;

    setIsProcessing(true);
    try {
      // Symulacja procesowania akcji
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dodaj transakcję do historii
      addTransaction({
        type: selectedAction.type as any,
        fromCurrency: selectedAction.type === 'buy' ? 'PLN' : selectedAction.currency,
        toCurrency: selectedAction.type === 'buy' ? selectedAction.currency : 'PLN',
        fromAmount: selectedAction.type === 'buy' ? 1000 : selectedAction.balance * 0.1,
        toAmount: selectedAction.type === 'buy' ? 1000 / (calculateExchange('PLN', selectedAction.currency, 1)) : selectedAction.balance * 0.1 * (calculateExchange(selectedAction.currency, 'PLN', 1)),
        rate: calculateExchange(selectedAction.type === 'buy' ? 'PLN' : selectedAction.currency, selectedAction.type === 'buy' ? selectedAction.currency : 'PLN', 1),
        status: 'completed'
      });

      const actionMessages = {
        buy: `Zakup ${selectedAction.currency} został zlecony`,
        sell: `Sprzedaż ${selectedAction.currency} została zlecona`,
        exchange: `Wymiana ${selectedAction.currency} została zlecona`,
        deposit: `Wpłata ${selectedAction.currency} została zlecona`,
        withdraw: `Wypłata ${selectedAction.currency} została zlecona`
      };

      toast({
        title: "Akcja zlecona",
        description: actionMessages[selectedAction.type as keyof typeof actionMessages],
      });

      setShowActionDialog(false);
      setSelectedAction(null);
      
      // Przekieruj do odpowiedniej strony po chwili
      setTimeout(() => {
        if (selectedAction.type === "exchange") {
          navigate('/exchange');
        } else if (selectedAction.type === "buy" || selectedAction.type === "sell") {
          navigate('/rates');
        } else {
          navigate('/history');
        }
      }, 1500);
    } catch (error) {
      toast({
        title: "Błąd akcji",
        description: "Nie udało się wykonać akcji. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
            Mój Portfel 💼
          </h1>
          <p className="text-gray-400 mt-2">
            Zarządzanie walutami i transakcjami
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowValues(!showValues)}
            className="border-[#02c349] text-[#02c349] hover:bg-[#02c349]/10"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showValues ? "Ukryj wartości" : "Pokaż wartości"}
          </Button>
          <Button
            onClick={() => navigate('/exchange')}
            className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj walutę
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-[#00071c] border-[#02c349]/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#02c349]/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-[#02c349]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Całkowite Saldo</h2>
                <p className="text-gray-400">Wartość wszystkich walut</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-[#02c349]">
                {showValues ? formatPLN(totalValuePLN) : "****"}
              </div>
              <p className="text-gray-400">W PLN</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#02c349]">Największy zysk</p>
                <p className="text-2xl font-bold text-white">+1,250 PLN</p>
              </div>
              <div className="w-12 h-12 bg-[#02c349]/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#02c349]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00071c] border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Największa strata</p>
                <p className="text-2xl font-bold text-white">-320 PLN</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#00071c] border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Ostatnia wymiana</p>
                <p className="text-2xl font-bold text-white">EUR → PLN</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currency Balances */}
      <Card className="bg-[#00071c] border-[#02c349]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#02c349]" />
            <span>Salda Walut</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((balance) => (
              <div
                key={balance.code}
                className="flex items-center justify-between p-4 bg-[#00071c]/50 border border-[#02c349]/10 rounded-lg hover:bg-[#02c349]/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#02c349]/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#02c349]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{balance.name}</div>
                    <div className="text-sm text-gray-400">{balance.code}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {showValues ? formatCurrency(balance.amount, balance.code) : "****"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {showValues ? formatPLN(calculateExchange(balance.code, 'PLN', balance.amount)) : "****"}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#02c349] text-[#02c349] hover:bg-[#02c349]/10"
                    onClick={() => handleQuickAction("buy", balance.code, balance.amount)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Kup
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleQuickAction("sell", balance.code, balance.amount)}
                  >
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Sprzedaj
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => handleQuickAction("exchange", balance.code, balance.amount)}
                  >
                    <ArrowRightLeft className="w-3 h-3 mr-1" />
                    Wymień
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    onClick={() => handleQuickAction("deposit", balance.code, balance.amount)}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Wpłać
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    onClick={() => handleQuickAction("withdraw", balance.code, balance.amount)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Wypłać
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md bg-[#00071c] border-[#02c349]/20">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              {selectedAction?.type === "buy" && <Plus className="w-5 h-5 text-[#02c349]" />}
              {selectedAction?.type === "sell" && <TrendingDown className="w-5 h-5 text-red-400" />}
              {selectedAction?.type === "exchange" && <ArrowRightLeft className="w-5 h-5 text-blue-400" />}
              {selectedAction?.type === "deposit" && <Upload className="w-5 h-5 text-purple-400" />}
              {selectedAction?.type === "withdraw" && <Download className="w-5 h-5 text-orange-400" />}
              <span>
                {selectedAction?.type === "buy" && "Zakup"}
                {selectedAction?.type === "sell" && "Sprzedaż"}
                {selectedAction?.type === "exchange" && "Wymiana"}
                {selectedAction?.type === "deposit" && "Wpłata"}
                {selectedAction?.type === "withdraw" && "Wypłata"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Potwierdź akcję dla {selectedAction?.currency}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-[#00071c]/50 rounded-lg border border-[#02c349]/10">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Waluta:</span>
                <span className="font-medium text-white">{selectedAction?.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dostępne saldo:</span>
                <span className="font-medium text-white">{selectedAction?.balance.toFixed(2)} {selectedAction?.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Typ akcji:</span>
                <span className="font-medium text-white">
                  {selectedAction?.type === "buy" && "Zakup"}
                  {selectedAction?.type === "sell" && "Sprzedaż"}
                  {selectedAction?.type === "exchange" && "Wymiana"}
                  {selectedAction?.type === "deposit" && "Wpłata"}
                  {selectedAction?.type === "withdraw" && "Wypłata"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowActionDialog(false)}
              disabled={isProcessing}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Anuluj
            </Button>
            <Button 
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
            >
              {isProcessing ? "Przetwarzanie..." : "Potwierdź akcję"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
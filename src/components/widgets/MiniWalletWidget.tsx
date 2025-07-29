import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

export const MiniWalletWidget = () => {
  const { balances, totalValuePLN } = usePortfolio();
  const [showValues, setShowValues] = useState(true);

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

  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            Mini Portfel
          </CardTitle>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-[#02c349] hover:text-[#02c349]/80"
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">
              {showValues ? formatPLN(totalValuePLN) : "••••••"}
            </div>
            <div className="flex items-center justify-center text-xs text-[#02c349]">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.3% dziś
            </div>
          </div>
          
          <div className="space-y-2">
            {balances.slice(0, 3).map((balance) => (
              <div key={balance.code} className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{balance.code}</span>
                <span className="text-sm font-medium text-white">
                  {showValues ? formatCurrency(balance.amount, balance.code) : "••••"}
                </span>
              </div>
            ))}
          </div>
          
          {balances.length > 3 && (
            <div className="text-center">
              <div className="text-xs text-gray-400">
                +{balances.length - 3} więcej walut
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 
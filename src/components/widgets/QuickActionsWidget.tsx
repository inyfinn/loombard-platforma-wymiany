import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, TrendingUp, TrendingDown, Plus, Minus, Zap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export const QuickActionsWidget = () => {
  const { balances } = usePortfolio();

  const availableCurrencies = balances.map(b => b.code);

  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Szybkie Akcje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Kup
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Sprzedaj
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Wymień
          </Button>
          
          <div className="text-xs text-gray-400 text-center">
            Dostępne waluty: {availableCurrencies.join(", ")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, Target, Clock } from "lucide-react";

const aiAdvice = {
  recommendation: "Kup EUR",
  confidence: 85,
  reason: "Silne dane gospodarcze UE i spodziewane podwyżki stóp procentowych",
  timeframe: "24-48 godzin",
  risk: "Średni",
  alternatives: ["USD", "GBP"],
};

export const AIAdviceWidget = () => {
  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          AI Doradza
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">
              {aiAdvice.recommendation}
            </div>
            <div className="text-sm text-[#02c349] mb-2">
              Pewność: {aiAdvice.confidence}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-400">
              <div className="flex items-center mb-1">
                <Target className="w-3 h-3 mr-1" />
                Powód:
              </div>
              <div className="text-white text-xs pl-4">
                {aiAdvice.reason}
              </div>
            </div>
            
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              Horyzont czasowy: {aiAdvice.timeframe}
            </div>
            
            <div className="text-xs text-gray-400">
              Ryzyko: <span className="text-yellow-400">{aiAdvice.risk}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            Alternatywy: {aiAdvice.alternatives.join(", ")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
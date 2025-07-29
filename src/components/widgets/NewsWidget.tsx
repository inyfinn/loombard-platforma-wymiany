import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, TrendingUp, TrendingDown, Clock } from "lucide-react";

const news = [
  {
    id: 1,
    title: "ECB podnosi stopy procentowe",
    impact: "positive",
    time: "1 godz. temu",
    summary: "Europejski Bank Centralny zwiększył stopy o 0.25%",
  },
  {
    id: 2,
    title: "Spadek inflacji w USA",
    impact: "negative",
    time: "3 godz. temu",
    summary: "Inflacja CPI spadła do 3.1%",
  },
  {
    id: 3,
    title: "Wzrost PKB Polski",
    impact: "positive",
    time: "5 godz. temu",
    summary: "PKB wzrósł o 2.8% w Q4 2024",
  },
];

export const NewsWidget = () => {
  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Newspaper className="w-4 h-4 mr-2" />
          Nowości
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="border-b border-[#02c349]/10 pb-2 last:border-b-0">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  {item.impact === "positive" ? (
                    <TrendingUp className="w-4 h-4 text-[#02c349]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {item.summary}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 
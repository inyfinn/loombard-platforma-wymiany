import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Play, Pause, Settings } from "lucide-react";

const strategies = [
  {
    id: 1,
    name: "DCA EUR",
    description: "Dollar Cost Averaging na EUR",
    status: "active",
    performance: "+12.5%",
  },
  {
    id: 2,
    name: "Swing Trading USD",
    description: "Handel na wahaniach USD/PLN",
    status: "paused",
    performance: "+8.2%",
  },
  {
    id: 3,
    name: "HODL GBP",
    description: "Długoterminowe trzymanie GBP",
    status: "active",
    performance: "+15.7%",
  },
];

export const StrategiesWidget = () => {
  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Strategie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{strategy.name}</div>
                <div className="text-xs text-gray-400">{strategy.description}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-xs ${strategy.performance.startsWith('+') ? 'text-[#02c349]' : 'text-red-400'}`}>
                  {strategy.performance}
                </div>
                <div className={`w-2 h-2 rounded-full ${strategy.status === 'active' ? 'bg-[#02c349]' : 'bg-yellow-400'}`} />
                {strategy.status === 'active' ? (
                  <Pause className="w-3 h-3 text-gray-400" />
                ) : (
                  <Play className="w-3 h-3 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 
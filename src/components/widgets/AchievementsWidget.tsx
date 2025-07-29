import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Target, Zap } from "lucide-react";

const achievements = [
  {
    id: 1,
    name: "Pierwsza Wymiana",
    description: "Wykonaj pierwszą transakcję",
    icon: Zap,
    unlocked: true,
    progress: 100,
  },
  {
    id: 2,
    name: "Trader Pro",
    description: "Wykonaj 50 transakcji",
    icon: Target,
    unlocked: false,
    progress: 68,
  },
  {
    id: 3,
    name: "Złoty Standard",
    description: "Zarób 1000 PLN",
    icon: Trophy,
    unlocked: false,
    progress: 45,
  },
  {
    id: 4,
    name: "Analityk",
    description: "Ustaw 10 alertów cenowych",
    icon: Star,
    unlocked: true,
    progress: 100,
  },
];

export const AchievementsWidget = () => {
  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Trophy className="w-4 h-4 mr-2" />
          Osiągnięcia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                achievement.unlocked ? 'bg-[#02c349]/20' : 'bg-gray-600/20'
              }`}>
                <achievement.icon className={`w-4 h-4 ${
                  achievement.unlocked ? 'text-[#02c349]' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{achievement.name}</div>
                <div className="text-xs text-gray-400">{achievement.description}</div>
                <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full ${
                      achievement.unlocked ? 'bg-[#02c349]' : 'bg-gray-500'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {achievement.progress}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, User, Settings } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "exchange",
    description: "Wymiana EUR → PLN",
    amount: "1000 EUR",
    time: "2 min temu",
    icon: Activity,
  },
  {
    id: 2,
    type: "login",
    description: "Logowanie do systemu",
    time: "15 min temu",
    icon: User,
  },
  {
    id: 3,
    type: "settings",
    description: "Zmiana ustawień alertów",
    time: "1 godz. temu",
    icon: Settings,
  },
  {
    id: 4,
    type: "exchange",
    description: "Wymiana USD → EUR",
    amount: "500 USD",
    time: "2 godz. temu",
    icon: Activity,
  },
];

export const ActivityLogWidget = () => {
  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Log Aktywności
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#02c349]/20 rounded-lg flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-[#02c349]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">
                  {activity.description}
                </div>
                {activity.amount && (
                  <div className="text-xs text-[#02c349]">{activity.amount}</div>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 
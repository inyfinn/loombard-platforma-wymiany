import { ArrowLeft, Plus, Bell, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function PriceAlerts() {
  const navigate = useNavigate();

  const alerts = [
    {
      id: 1,
      pair: "EUR/PLN",
      condition: "większy niż",
      targetPrice: 4.35,
      currentPrice: 4.32,
      status: "active",
      created: "2024-01-15"
    },
    {
      id: 2,
      pair: "USD/PLN", 
      condition: "mniejszy niż",
      targetPrice: 3.90,
      currentPrice: 3.99,
      status: "active",
      created: "2024-01-14"
    },
    {
      id: 3,
      pair: "GBP/PLN",
      condition: "większy niż", 
      targetPrice: 5.20,
      currentPrice: 5.12,
      status: "triggered",
      created: "2024-01-10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Alerty Cenowe</h1>
            <p className="text-muted-foreground">Zarządzaj powiadomieniami o kursach</p>
          </div>
        </div>
        
        <Button className="loombard-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nowy alert
        </Button>
      </div>

      {/* Active Alerts Count */}
      <Card className="widget-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Aktywne alerty</h3>
              <p className="text-muted-foreground">Monitorowane pary walutowe</p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {alerts.filter(alert => alert.status === 'active').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="widget-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold">{alert.pair}</div>
                  <Badge 
                    variant={alert.status === 'active' ? 'default' : 'secondary'}
                    className={alert.status === 'active' ? 'bg-primary' : 'bg-success'}
                  >
                    {alert.status === 'active' ? 'Aktywny' : 'Wyzwolony'}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Powiadom gdy kurs {alert.condition}
                  </div>
                  <div className="font-bold">{alert.targetPrice.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">
                    Aktualnie: {alert.currentPrice.toFixed(4)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Utworzony: {new Date(alert.created).toLocaleDateString('pl-PL')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Alert Card */}
      <Card className="widget-card border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-8 text-center">
          <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Dodaj nowy alert</h3>
          <p className="text-sm text-muted-foreground">
            Kliknij, aby utworzyć alert cenowy dla wybranej pary walut
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
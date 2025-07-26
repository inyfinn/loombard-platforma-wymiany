import { useState } from "react";
import { ArrowLeft, Plus, AlertTriangle, Bell, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface PriceAlert {
  id: number;
  pair: string;
  condition: "above" | "below";
  value: number;
  active: boolean;
  created: string;
  triggered?: string;
  notificationType: "email" | "sms" | "push" | "all";
}

export default function PriceAlerts() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 1,
      pair: "EUR/PLN",
      condition: "above",
      value: 4.35,
      active: true,
      created: "2024-01-15T10:30:00Z",
      notificationType: "all"
    },
    {
      id: 2,
      pair: "USD/PLN",
      condition: "below",
      value: 3.95,
      active: false,
      created: "2024-01-14T15:20:00Z",
      notificationType: "email"
    },
    {
      id: 3,
      pair: "GBP/PLN",
      condition: "above",
      value: 5.20,
      active: true,
      created: "2024-01-13T09:45:00Z",
      triggered: "2024-01-15T08:15:00Z",
      notificationType: "push"
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    pair: "",
    condition: "above" as "above" | "below",
    value: "",
    notificationType: "all" as "email" | "sms" | "push" | "all"
  });

  const currencyPairs = [
    "EUR/PLN", "USD/PLN", "GBP/PLN", "CHF/PLN", "EUR/USD", "GBP/USD", "USD/JPY", "EUR/GBP"
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddAlert = () => {
    if (!newAlert.pair || !newAlert.value) return;

    const alert: PriceAlert = {
      id: Date.now(),
      pair: newAlert.pair,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      active: true,
      created: new Date().toISOString(),
      notificationType: newAlert.notificationType
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ pair: "", condition: "above", value: "", notificationType: "all" });
    setShowAddDialog(false);
  };

  const handleEditAlert = () => {
    if (!editingAlert) return;

    setAlerts(alerts.map(alert => 
      alert.id === editingAlert.id ? editingAlert : alert
    ));
    setEditingAlert(null);
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧";
      case "sms":
        return "📱";
      case "push":
        return "🔔";
      case "all":
        return "📢";
      default:
        return "🔔";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Alerty Cenowe</h1>
          <p className="text-muted-foreground">Zarządzaj alertami cenowymi i regułami</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{alerts.length}</div>
            <div className="text-sm text-muted-foreground">Łączne alerty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.active).length}
            </div>
            <div className="text-sm text-muted-foreground">Aktywne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.triggered).length}
            </div>
            <div className="text-sm text-muted-foreground">Wyzwolone</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {alerts.filter(a => a.notificationType === "all").length}
            </div>
            <div className="text-sm text-muted-foreground">Wszystkie kanały</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Twoje alerty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{alert.pair}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition === "above" ? ">" : "<"} {alert.value.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {getNotificationIcon(alert.notificationType)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.notificationType === "all" ? "Wszystkie" : alert.notificationType}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Utworzono: {formatDate(alert.created)}
                    </div>
                    {alert.triggered && (
                      <div className="text-sm text-orange-600">
                        Wyzwolono: {formatDate(alert.triggered)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAlert(alert)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nie masz jeszcze żadnych alertów cenowych</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj pierwszy alert
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Alert Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj alert cenowy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Para walut</Label>
              <Select value={newAlert.pair} onValueChange={(value) => setNewAlert({...newAlert, pair: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz parę walut" />
                </SelectTrigger>
                <SelectContent>
                  {currencyPairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Warunek</Label>
              <Select value={newAlert.condition} onValueChange={(value: "above" | "below") => setNewAlert({...newAlert, condition: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Powyżej</SelectItem>
                  <SelectItem value="below">Poniżej</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wartość</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={newAlert.value}
                onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Typ powiadomienia</Label>
              <Select value={newAlert.notificationType} onValueChange={(value: "email" | "sms" | "push" | "all") => setNewAlert({...newAlert, notificationType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kanały</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                Anuluj
              </Button>
              <Button className="flex-1" onClick={handleAddAlert}>
                Dodaj alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj alert cenowy</DialogTitle>
          </DialogHeader>
          {editingAlert && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Para walut</Label>
                <Select value={editingAlert.pair} onValueChange={(value) => setEditingAlert({...editingAlert, pair: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map(pair => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Warunek</Label>
                <Select value={editingAlert.condition} onValueChange={(value: "above" | "below") => setEditingAlert({...editingAlert, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Powyżej</SelectItem>
                    <SelectItem value="below">Poniżej</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={editingAlert.value}
                  onChange={(e) => setEditingAlert({...editingAlert, value: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Typ powiadomienia</Label>
                <Select value={editingAlert.notificationType} onValueChange={(value: "email" | "sms" | "push" | "all") => setEditingAlert({...editingAlert, notificationType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie kanały</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditingAlert(null)}>
                  Anuluj
                </Button>
                <Button className="flex-1" onClick={handleEditAlert}>
                  Zapisz zmiany
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
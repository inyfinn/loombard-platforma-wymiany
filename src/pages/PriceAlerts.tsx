import { useState } from "react";
import { ArrowLeft, Plus, AlertTriangle, Bell, Edit3, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
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

  const handleAddAlert = async () => {
    if (!newAlert.pair || !newAlert.value) {
      toast({
        title: "Błąd walidacji",
        description: "Proszę wypełnić wszystkie wymagane pola.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Symulacja zapisywania alertu
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      
      toast({
        title: "Alert dodany",
        description: `Alert dla pary ${alert.pair} został pomyślnie utworzony.`,
      });
    } catch (error) {
      toast({
        title: "Błąd dodawania",
        description: "Nie udało się dodać alertu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAlert = async () => {
    if (!editingAlert) return;

    setIsSaving(true);
    try {
      // Symulacja zapisywania zmian
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAlerts(alerts.map(alert => 
        alert.id === editingAlert.id ? editingAlert : alert
      ));
      setEditingAlert(null);
      
      toast({
        title: "Alert zaktualizowany",
        description: `Alert dla pary ${editingAlert.pair} został pomyślnie zaktualizowany.`,
      });
    } catch (error) {
      toast({
        title: "Błąd aktualizacji",
        description: "Nie udało się zaktualizować alertu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      // Symulacja usuwania alertu
      await new Promise(resolve => setTimeout(resolve, 500));

      const alertToDelete = alerts.find(a => a.id === id);
      setAlerts(alerts.filter(alert => alert.id !== id));
      
      toast({
        title: "Alert usunięty",
        description: `Alert dla pary ${alertToDelete?.pair} został pomyślnie usunięty.`,
      });
    } catch (error) {
      toast({
        title: "Błąd usuwania",
        description: "Nie udało się usunąć alertu. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (id: number) => {
    try {
      // Symulacja przełączania alertu
      await new Promise(resolve => setTimeout(resolve, 300));

      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, active: !alert.active } : alert
      ));
      
      const alert = alerts.find(a => a.id === id);
      toast({
        title: alert?.active ? "Alert dezaktywowany" : "Alert aktywowany",
        description: `Alert dla pary ${alert?.pair} został ${alert?.active ? 'dezaktywowany' : 'aktywowany'}.`,
      });
    } catch (error) {
      toast({
        title: "Błąd przełączania",
        description: "Nie udało się przełączyć alertu. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
            Alerty Cenowe 🔔
          </h1>
          <p className="text-gray-400 mt-2">
            Zarządzaj alertami cenowymi i powiadomieniami
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">{alerts.length}</div>
            <div className="text-sm text-gray-400">Łączne alerty</div>
          </CardContent>
        </Card>
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-[#02c349]">
              {alerts.filter(a => a.active).length}
            </div>
            <div className="text-sm text-gray-400">Aktywne</div>
          </CardContent>
        </Card>
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-400">
              {alerts.filter(a => a.triggered).length}
            </div>
            <div className="text-sm text-gray-400">Wyzwolone</div>
          </CardContent>
        </Card>
        <Card className="bg-[#00071c] border-[#02c349]/20">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-400">
              {alerts.filter(a => a.notificationType === "all").length}
            </div>
            <div className="text-sm text-gray-400">Wszystkie kanały</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="bg-[#00071c] border-[#02c349]/20">
        <CardHeader>
          <CardTitle className="text-white">Twoje alerty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border border-[#02c349]/10 rounded-lg hover:bg-[#02c349]/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#02c349]/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#02c349]" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{alert.pair}</div>
                    <div className="text-sm text-gray-400">
                      {alert.condition === "above" ? "&gt;" : "&lt;"} {alert.value.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {getNotificationIcon(alert.notificationType)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {alert.notificationType === "all" ? "Wszystkie" : alert.notificationType}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      Utworzono: {formatDate(alert.created)}
                    </div>
                    {alert.triggered && (
                      <div className="text-sm text-orange-400">
                        Wyzwolono: {formatDate(alert.triggered)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                      className="data-[state=checked]:bg-[#02c349] data-[state=unchecked]:bg-gray-600"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAlert(alert)}
                      className="text-[#02c349] hover:bg-[#02c349]/10"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nie masz jeszcze żadnych alertów cenowych</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
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
        <DialogContent className="bg-[#00071c] border-[#02c349]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Dodaj alert cenowy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Para walut</Label>
              <Select value={newAlert.pair} onValueChange={(value) => setNewAlert({...newAlert, pair: value})}>
                <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                  <SelectValue placeholder="Wybierz parę walut" />
                </SelectTrigger>
                <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                  {currencyPairs.map(pair => (
                    <SelectItem key={pair} value={pair} className="text-white">{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Warunek</Label>
              <Select value={newAlert.condition} onValueChange={(value: "above" | "below") => setNewAlert({...newAlert, condition: value})}>
                <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                  <SelectItem value="above" className="text-white">Powyżej</SelectItem>
                  <SelectItem value="below" className="text-white">Poniżej</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Wartość</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={newAlert.value}
                onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
                className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Typ powiadomienia</Label>
              <Select value={newAlert.notificationType} onValueChange={(value: "email" | "sms" | "push" | "all") => setNewAlert({...newAlert, notificationType: value})}>
                <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                  <SelectItem value="all" className="text-white">Wszystkie kanały</SelectItem>
                  <SelectItem value="email" className="text-white">Email</SelectItem>
                  <SelectItem value="sms" className="text-white">SMS</SelectItem>
                  <SelectItem value="push" className="text-white">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800" onClick={() => setShowAddDialog(false)}>
                Anuluj
              </Button>
              <Button className="flex-1 bg-[#02c349] hover:bg-[#02c349]/90 text-white" onClick={handleAddAlert} disabled={isSaving}>
                {isSaving ? "Dodawanie..." : "Dodaj alert"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
        <DialogContent className="bg-[#00071c] border-[#02c349]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edytuj alert cenowy</DialogTitle>
          </DialogHeader>
          {editingAlert && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Para walut</Label>
                <Select value={editingAlert.pair} onValueChange={(value) => setEditingAlert({...editingAlert, pair: value})}>
                  <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                    {currencyPairs.map(pair => (
                      <SelectItem key={pair} value={pair} className="text-white">{pair}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Warunek</Label>
                <Select value={editingAlert.condition} onValueChange={(value: "above" | "below") => setEditingAlert({...editingAlert, condition: value})}>
                  <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                    <SelectItem value="above" className="text-white">Powyżej</SelectItem>
                    <SelectItem value="below" className="text-white">Poniżej</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Wartość</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={editingAlert.value}
                  onChange={(e) => setEditingAlert({...editingAlert, value: parseFloat(e.target.value)})}
                  className="bg-[#00071c]/50 border-[#02c349]/20 text-white focus:border-[#02c349]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Typ powiadomienia</Label>
                <Select value={editingAlert.notificationType} onValueChange={(value: "email" | "sms" | "push" | "all") => setEditingAlert({...editingAlert, notificationType: value})}>
                  <SelectTrigger className="bg-[#00071c]/50 border-[#02c349]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#00071c] border-[#02c349]/20">
                    <SelectItem value="all" className="text-white">Wszystkie kanały</SelectItem>
                    <SelectItem value="email" className="text-white">Email</SelectItem>
                    <SelectItem value="sms" className="text-white">SMS</SelectItem>
                    <SelectItem value="push" className="text-white">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800" onClick={() => setEditingAlert(null)}>
                  Anuluj
                </Button>
                <Button className="flex-1 bg-[#02c349] hover:bg-[#02c349]/90 text-white" onClick={handleEditAlert} disabled={isSaving}>
                  {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
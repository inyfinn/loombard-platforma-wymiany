import { ArrowLeft, Mail, MessageSquare, Smartphone, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function NotificationSettings() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold">Ustawienia Powiadomień</h1>
          <p className="text-muted-foreground">Zarządzaj sposobem otrzymywania powiadomień</p>
        </div>
      </div>

      {/* Email Notifications */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-primary" />
            <span>Powiadomienia Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-alerts">Alerty cenowe</Label>
              <p className="text-sm text-muted-foreground">Otrzymuj email gdy kurs osiągnie zadaną wartość</p>
            </div>
            <Switch id="email-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-transactions">Potwierdzenia transakcji</Label>
              <p className="text-sm text-muted-foreground">Email po każdej wykonanej wymianie</p>
            </div>
            <Switch id="email-transactions" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-summary">Podsumowanie tygodniowe</Label>
              <p className="text-sm text-muted-foreground">Raport z działalności i wyników</p>
            </div>
            <Switch id="email-summary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-frequency">Częstotliwość emaili</Label>
              <p className="text-sm text-muted-foreground">Jak często otrzymywać powiadomienia</p>
            </div>
            <Select defaultValue="realtime">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Natychmiast</SelectItem>
                <SelectItem value="hourly">Co godzinę</SelectItem>
                <SelectItem value="daily">Raz dziennie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span>Powiadomienia Push</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-alerts">Alerty cenowe</Label>
              <p className="text-sm text-muted-foreground">Powiadomienia push w przeglądarce</p>
            </div>
            <Switch id="push-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-news">Ważne wiadomości rynkowe</Label>
              <p className="text-sm text-muted-foreground">Powiadomienia o wydarzeniach wpływających na kursy</p>
            </div>
            <Switch id="push-news" />
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-primary" />
            <span>Ustawienia Dźwięku</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-alerts">Dźwięki alertów</Label>
              <p className="text-sm text-muted-foreground">Odtwarzaj dźwięk przy alertach cenowych</p>
            </div>
            <Switch id="sound-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-transactions">Dźwięki transakcji</Label>
              <p className="text-sm text-muted-foreground">Dźwięk potwierdzenia przy wymianach</p>
            </div>
            <Switch id="sound-transactions" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="loombard-button-primary">
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { ArrowLeft, Bell, Mail, Smartphone, Clock, Shield, Zap, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  icon: any;
}

interface NotificationSchedule {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailFrequency, setEmailFrequency] = useState("daily");
  const [quietHours, setQuietHours] = useState("22:00-08:00");
  const [isSaving, setIsSaving] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "price-alerts",
      title: "Alerty cenowe",
      description: "Powiadomienia o zmianach kursów walut",
      email: true,
      sms: false,
      push: true,
      icon: Bell
    },
    {
      id: "transaction-confirmations",
      title: "Potwierdzenia transakcji",
      description: "Powiadomienia o wykonanych operacjach",
      email: true,
      sms: true,
      push: true,
      icon: Zap
    },
    {
      id: "security-alerts",
      title: "Alerty bezpieczeństwa",
      description: "Powiadomienia o logowaniach i zmianach konta",
      email: true,
      sms: true,
      push: false,
      icon: Shield
    },
    {
      id: "market-updates",
      title: "Aktualności rynkowe",
      description: "Wiadomości ze świata walut i ekonomii",
      email: false,
      sms: false,
      push: true,
      icon: Bell
    },
    {
      id: "account-updates",
      title: "Aktualizacje konta",
      description: "Informacje o zmianach w ustawieniach",
      email: true,
      sms: false,
      push: false,
      icon: Mail
    },
    {
      id: "promotional",
      title: "Oferty promocyjne",
      description: "Specjalne oferty i promocje",
      email: false,
      sms: false,
      push: false,
      icon: Zap
    }
  ]);

  const [schedules] = useState<NotificationSchedule[]>([
    {
      id: "daily-summary",
      title: "Dzienny raport",
      time: "18:00",
      enabled: true
    },
    {
      id: "weekly-summary",
      title: "Tygodniowy raport",
      time: "09:00",
      enabled: true
    },
    {
      id: "monthly-summary",
      title: "Miesięczny raport",
      time: "10:00",
      enabled: false
    }
  ]);

  const handleToggleNotification = (settingId: string, channel: "email" | "sms" | "push") => {
    setNotificationSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, [channel]: !setting[channel] }
        : setting
    ));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Symulacja zapisywania ustawień
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Ustawienia zapisane",
        description: "Twoje ustawienia powiadomień zostały pomyślnie zaktualizowane.",
      });
    } catch (error) {
      toast({
        title: "Błąd zapisywania",
        description: "Nie udało się zapisać ustawień. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <Smartphone className="w-4 h-4" />;
      case "push":
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "email":
        return "text-blue-600";
      case "sms":
        return "text-green-600";
      case "push":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 bg-clip-text text-transparent">
            Ustawienia Powiadomień 🔔
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Zarządzaj powiadomieniami - funkcje w fazie rozwoju
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Zapisywanie..." : "Zapisz ustawienia"}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ogólne ustawienia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Częstotliwość email</Label>
              <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Natychmiast</SelectItem>
                  <SelectItem value="hourly">Co godzinę</SelectItem>
                  <SelectItem value="daily">Dziennie</SelectItem>
                  <SelectItem value="weekly">Tygodniowo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Ciche godziny</Label>
              <Select value={quietHours} onValueChange={setQuietHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22:00-08:00">22:00 - 08:00</SelectItem>
                  <SelectItem value="23:00-07:00">23:00 - 07:00</SelectItem>
                  <SelectItem value="00:00-06:00">00:00 - 06:00</SelectItem>
                  <SelectItem value="disabled">Wyłączone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Typy powiadomień</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <setting.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{setting.title}</h3>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-14">
                  {(["email", "sms", "push"] as const).map((channel) => (
                    <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={getChannelColor(channel)}>
                          {getChannelIcon(channel)}
                        </div>
                        <span className="text-sm font-medium capitalize">{channel}</span>
                      </div>
                      <Switch
                        checked={setting[channel]}
                        onCheckedChange={() => handleToggleNotification(setting.id, channel)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Raporty zaplanowane</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{schedule.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Codziennie o {schedule.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={schedule.enabled ? "default" : "secondary"}>
                    {schedule.enabled ? "Aktywny" : "Nieaktywny"}
                  </Badge>
                  <Switch checked={schedule.enabled} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status kanałów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Email</span>
                <Badge variant="default" className="text-xs">Aktywny</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                jan.kowalski@example.com
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="font-medium">SMS</span>
                <Badge variant="secondary" className="text-xs">Nieaktywny</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                +48 123 456 789
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Push</span>
                <Badge variant="default" className="text-xs">Aktywny</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Przeglądarka
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-muted-foreground">Email dzisiaj</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-muted-foreground">SMS dzisiaj</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-muted-foreground">Push dzisiaj</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Aktywne alerty</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
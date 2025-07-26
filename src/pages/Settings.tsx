import { useState } from "react";
import { User, Shield, Bell, Palette, Globe, LogOut, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan@example.com",
    phone: "+48 123 456 789",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    priceAlerts: true,
    transactionConfirm: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    loginNotifications: true,
  });

  const [preferences, setPreferences] = useState({
    language: "pl",
    currency: "PLN",
    dateFormat: "DD/MM/YYYY",
    timezone: "Europe/Warsaw",
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profil zaktualizowany",
      description: "Twoje dane zostały pomyślnie zapisane.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Ustawienia powiadomień zapisane",
      description: "Preferencje powiadomień zostały zaktualizowane.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Ustawienia bezpieczeństwa zapisane",
      description: "Konfiguracja bezpieczeństwa została zaktualizowana.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferencje zapisane",
      description: "Ustawienia aplikacji zostały zaktualizowane.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Wylogowano",
      description: "Zostałeś pomyślnie wylogowany z aplikacji.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ustawienia</h1>
        <p className="text-muted-foreground">
          Zarządzaj swoim kontem i preferencjami aplikacji
        </p>
      </div>

      {/* Profil użytkownika */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profil użytkownika</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Imię</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nazwisko</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile} className="accent-button">
            <Save className="w-4 h-4 mr-2" />
            Zapisz profil
          </Button>
        </CardContent>
      </Card>

      {/* Bezpieczeństwo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Bezpieczeństwo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Uwierzytelnianie dwuskładnikowe</Label>
              <p className="text-sm text-muted-foreground">
                Dodatkowa warstwa bezpieczeństwa dla Twojego konta
              </p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Timeout sesji (minuty)</Label>
            <Select
              value={security.sessionTimeout}
              onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minut</SelectItem>
                <SelectItem value="30">30 minut</SelectItem>
                <SelectItem value="60">1 godzina</SelectItem>
                <SelectItem value="120">2 godziny</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Powiadomienia o logowaniu</Label>
              <p className="text-sm text-muted-foreground">
                Otrzymuj alerty o nowych logowaniach
              </p>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
            />
          </div>

          <Button onClick={handleSaveSecurity} className="accent-button">
            <Save className="w-4 h-4 mr-2" />
            Zapisz ustawienia bezpieczeństwa
          </Button>
        </CardContent>
      </Card>

      {/* Powiadomienia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Powiadomienia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Powiadomienia email</Label>
              <p className="text-sm text-muted-foreground">
                Otrzymuj powiadomienia na adres email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Powiadomienia SMS</Label>
              <p className="text-sm text-muted-foreground">
                Otrzymuj ważne powiadomienia przez SMS
              </p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Powiadomienia push</Label>
              <p className="text-sm text-muted-foreground">
                Powiadomienia w przeglądarce
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alerty cenowe</Label>
              <p className="text-sm text-muted-foreground">
                Powiadomienia o zmianach kursów
              </p>
            </div>
            <Switch
              checked={notifications.priceAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Potwierdzenia transakcji</Label>
              <p className="text-sm text-muted-foreground">
                Powiadomienia o wykonanych operacjach
              </p>
            </div>
            <Switch
              checked={notifications.transactionConfirm}
              onCheckedChange={(checked) => setNotifications({ ...notifications, transactionConfirm: checked })}
            />
          </div>

          <Button onClick={handleSaveNotifications} className="accent-button">
            <Save className="w-4 h-4 mr-2" />
            Zapisz ustawienia powiadomień
          </Button>
        </CardContent>
      </Card>

      {/* Preferencje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Preferencje aplikacji</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Motyw aplikacji</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Jasny</SelectItem>
                  <SelectItem value="dark">Ciemny</SelectItem>
                  <SelectItem value="system">Systemowy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Język</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => setPreferences({ ...preferences, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl">Polski</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Waluta główna</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) => setPreferences({ ...preferences, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLN">PLN - Polski Złoty</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="USD">USD - Dolar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format daty</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSavePreferences} className="accent-button">
            <Save className="w-4 h-4 mr-2" />
            Zapisz preferencje
          </Button>
        </CardContent>
      </Card>

      {/* Akcje konta */}
      <Card>
        <CardHeader>
          <CardTitle>Akcje konta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Weryfikacja KYC (Know Your Customer)
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Zmień hasło
            </Button>

            <Separator />

            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj się
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
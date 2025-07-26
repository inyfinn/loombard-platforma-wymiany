import { useState } from "react";
import { ArrowLeft, Bell, AlertTriangle, Shield, Palette, Globe, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  href?: string;
  badge?: string;
}

export default function Settings() {
  const navigate = useNavigate();

  const settingsSections: SettingSection[] = [
    {
      id: "profile",
      title: "Profil użytkownika",
      description: "Zarządzaj swoimi danymi osobowymi i preferencjami",
      icon: User,
      href: "/profile"
    },
    {
      id: "notifications",
      title: "Powiadomienia",
      description: "Ustawienia powiadomień email, SMS i push",
      icon: Bell,
      href: "/settings/notifications",
      badge: "Nowe"
    },
    {
      id: "price-alerts",
      title: "Alerty cenowe",
      description: "Zarządzaj alertami cenowymi i regułami",
      icon: AlertTriangle,
      href: "/settings/price-alerts"
    },
    {
      id: "security",
      title: "Bezpieczeństwo",
      description: "Hasło, uwierzytelnianie dwuskładnikowe, sesje",
      icon: Shield
    },
    {
      id: "appearance",
      title: "Wygląd",
      description: "Motyw, kolory, układ interfejsu",
      icon: Palette
    },
    {
      id: "language",
      title: "Język i region",
      description: "Język interfejsu, strefa czasowa, waluta",
      icon: Globe
    },
    {
      id: "billing",
      title: "Płatności i faktury",
      description: "Metody płatności, historia transakcji",
      icon: CreditCard
    }
  ];

  const quickSettings = [
    {
      id: "email-notifications",
      title: "Powiadomienia email",
      description: "Otrzymuj powiadomienia na email",
      enabled: true
    },
    {
      id: "sms-notifications",
      title: "Powiadomienia SMS",
      description: "Otrzymuj powiadomienia SMS",
      enabled: false
    },
    {
      id: "push-notifications",
      title: "Powiadomienia push",
      description: "Powiadomienia w przeglądarce",
      enabled: true
    },
    {
      id: "price-alerts",
      title: "Alerty cenowe",
      description: "Powiadomienia o zmianach kursów",
      enabled: true
    },
    {
      id: "news-updates",
      title: "Aktualności rynkowe",
      description: "Wiadomości ze świata walut",
      enabled: false
    }
  ];

  const handleSettingToggle = (settingId: string) => {
    // Tutaj byłaby logika zapisywania ustawień
    console.log(`Toggle setting: ${settingId}`);
  };

  const handleSectionClick = (section: SettingSection) => {
    if (section.href) {
      navigate(section.href);
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
        <div>
          <h1 className="text-3xl font-bold">Ustawienia</h1>
          <p className="text-muted-foreground">Zarządzaj swoim kontem i preferencjami</p>
        </div>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie ustawienia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{setting.title}</div>
                  <div className="text-sm text-muted-foreground">{setting.description}</div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => handleSettingToggle(setting.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <Card
            key={section.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              section.href ? 'hover:border-primary/50' : ''
            }`}
            onClick={() => handleSectionClick(section)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.badge && (
                      <Badge variant="default" className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                {section.href && (
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacje o koncie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID użytkownika</label>
                <div className="font-mono text-sm">USR-2024-001</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data utworzenia</label>
                <div className="text-sm">15 marca 2023</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ostatnie logowanie</label>
                <div className="text-sm">Dzisiaj, 10:30</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status konta</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Aktywne</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Weryfikacja</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Zweryfikowane</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Limit dzienny</label>
                <div className="text-sm">100,000 PLN</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Strefa niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Usuń konto</div>
                <div className="text-sm text-muted-foreground">
                  Trwale usuń swoje konto i wszystkie dane
                </div>
              </div>
              <Button variant="destructive" size="sm">
                Usuń konto
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Eksportuj dane</div>
                <div className="text-sm text-muted-foreground">
                  Pobierz kopię wszystkich swoich danych
                </div>
              </div>
              <Button variant="outline" size="sm">
                Eksportuj
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
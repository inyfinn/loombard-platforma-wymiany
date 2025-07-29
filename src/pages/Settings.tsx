import { useState } from "react";
import { ArrowLeft, Bell, AlertTriangle, Shield, Palette, Globe, CreditCard, User, Download, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const [quickSettings, setQuickSettings] = useState([
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
  ]);

  const handleSettingToggle = (settingId: string) => {
    setQuickSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
    
    toast({
      title: "Ustawienie zaktualizowane",
      description: `Ustawienie "${settingId}" zostało zapisane.`,
    });
  };

  const handleSectionClick = (section: SettingSection) => {
    if (section.href) {
      navigate(section.href);
    } else {
      // Dla sekcji bez href, pokaż informację
      toast({
        title: "Funkcja w rozwoju",
        description: `Sekcja "${section.title}" jest w fazie rozwoju.`,
      });
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Symulacja eksportu danych
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Tworzenie pliku do pobrania
      const data = {
        userInfo: {
          id: "USR-2024-001",
          name: "Jan Kowalski",
          email: "jan.kowalski@example.com",
          joinDate: "2023-03-15"
        },
        settings: quickSettings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kantoor-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dane wyeksportowane",
        description: "Twoje dane zostały pobrane jako plik JSON.",
      });
      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Symulacja usuwania konta
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Konto usunięte",
        description: "Twoje konto zostało trwale usunięte.",
      });
      
      // Przekieruj do strony głównej
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: "Błąd usuwania",
        description: "Nie udało się usunąć konta. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
            Ustawienia ⚙️
          </h1>
          <p className="text-gray-400 mt-2">
            Zarządzaj kontem i preferencjami
          </p>
        </div>
      </div>

      {/* Quick Settings */}
      <Card className="bg-[#00071c] border-[#02c349]/20">
        <CardHeader>
          <CardTitle className="text-white">Szybkie ustawienia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium text-white">{setting.title}</div>
                  <div className="text-sm text-gray-400">{setting.description}</div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => handleSettingToggle(setting.id)}
                  className="data-[state=checked]:bg-[#02c349] data-[state=unchecked]:bg-gray-600"
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
            className={`cursor-pointer transition-all hover:shadow-md bg-[#00071c] border-[#02c349]/20 hover:border-[#02c349]/40 ${
              section.href ? 'hover:border-[#02c349]/50' : ''
            }`}
            onClick={() => handleSectionClick(section)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#02c349]/20 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-[#02c349]" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-white">{section.title}</h3>
                    {section.badge && (
                      <Badge variant="default" className="text-xs bg-[#02c349] text-white">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
                {section.href && (
                  <Button variant="ghost" size="icon" className="text-[#02c349] hover:bg-[#02c349]/10">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Info */}
      <Card className="bg-[#00071c] border-[#02c349]/20">
        <CardHeader>
          <CardTitle className="text-white">Informacje o koncie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">ID użytkownika</label>
                <div className="font-mono text-sm text-white">USR-2024-001</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Data utworzenia</label>
                <div className="text-sm text-white">15 marca 2023</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Ostatnie logowanie</label>
                <div className="text-sm text-white">Dzisiaj, 10:30</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Status konta</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#02c349] rounded-full"></div>
                  <span className="text-sm text-white">Aktywne</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Weryfikacja</label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#02c349] rounded-full"></div>
                  <span className="text-sm text-white">Zweryfikowane</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Limit dzienny</label>
                <div className="text-sm text-white">100,000 PLN</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/50 bg-[#00071c]">
        <CardHeader>
          <CardTitle className="text-red-400">Strefa niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Usuń konto</div>
                <div className="text-sm text-gray-400">
                  Trwale usuń swoje konto i wszystkie dane
                </div>
              </div>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Usuń konto
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#00071c] border-[#02c349]/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Jesteś pewien?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      Ta akcja nie może być cofnięta. To trwale usunie Twoje konto
                      i usunie wszystkie dane z naszych serwerów.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">Anuluj</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isDeleting ? "Usuwanie..." : "Tak, usuń konto"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Eksportuj dane</div>
                <div className="text-sm text-gray-400">
                  Pobierz kopię wszystkich swoich danych
                </div>
              </div>
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10">
                    <Download className="w-4 h-4 mr-2" />
                    Eksportuj
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#00071c] border-[#02c349]/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Eksport danych</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Wyeksportuj wszystkie swoje dane w formacie JSON. 
                      Plik będzie zawierał informacje o koncie, ustawieniach i preferencjach.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowExportDialog(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Anuluj
                    </Button>
                    <Button 
                      onClick={handleExportData}
                      disabled={isExporting}
                      className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
                    >
                      {isExporting ? "Eksportowanie..." : "Eksportuj dane"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
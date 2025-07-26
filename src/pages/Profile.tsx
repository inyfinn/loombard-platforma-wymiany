import { ArrowLeft, TrendingUp, TrendingDown, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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
          <h1 className="text-3xl font-bold">Profil Użytkownika</h1>
          <p className="text-muted-foreground">Analityczne centrum Twojej działalności</p>
        </div>
      </div>

      {/* User Info */}
      <Card className="widget-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">JS</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Jan Kowalski</h2>
              <p className="text-muted-foreground">Trader od 2 lat</p>
              <p className="text-sm text-muted-foreground">Ostatnia aktywność: dziś</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-lg">Wyniki 30 dni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+4.8%</div>
            <div className="text-sm text-muted-foreground">Zysk: +2,150 PLN</div>
          </CardContent>
        </Card>

        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-lg">Liczba transakcji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <div className="text-sm text-muted-foreground">W tym miesiącu</div>
          </CardContent>
        </Card>

        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-lg">Skuteczność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="text-sm text-muted-foreground">Zyskowne transakcje</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Predykcje AI dla Twojego portfela</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="font-medium">EUR/PLN - Prognoza wzrostowa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Analiza wskazuje na 68% prawdopodobieństwo wzrostu kursu w następnych 7 dniach. 
              Rekomendacja: rozważ zachowanie pozycji EUR.
            </p>
          </div>
          
          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="font-medium">USD/PLN - Sygnał ostrożności</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Model przewiduje potencjalną korektę. Rozważ częściową realizację zysków 
              z pozycji USD w najbliższych dniach.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Spersonalizowane porady</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Dywersyfikacja:</strong> Rozważ dodanie CHF do portfela - 
              użytkownicy o podobnym profilu notują dobre wyniki z tą walutą.
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Timing:</strong> Twoje najlepsze transakcje realizujesz zwykle 
              między 10:00-12:00. Rozważ koncentrację aktywności w tych godzinach.
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Zarządzanie ryzykiem:</strong> Średnia wielkość Twoich pozycji 
              jest optymalna, ale rozważ ustawienie stop-loss na poziomie 3%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
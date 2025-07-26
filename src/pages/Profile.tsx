import { useState } from "react";
import { ArrowLeft, Edit3, Save, X, TrendingUp, TrendingDown, Brain, Activity, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalTrades: number;
  successRate: number;
  totalProfit: number;
  profit7d: number;
  profit30d: number;
  profit90d: number;
}

interface AIPrediction {
  currency: string;
  prediction: "up" | "down" | "stable";
  confidence: number;
  reasoning: string;
  timeframe: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  relevance: number;
  currencies: string[];
}

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    avatar: "",
    joinDate: "2023-03-15",
    totalTrades: 127,
    successRate: 78.5,
    totalProfit: 15420.50,
    profit7d: 1250.30,
    profit30d: 3420.80,
    profit90d: 8920.45,
  });

  const [aiPredictions] = useState<AIPrediction[]>([
    {
      currency: "EUR/PLN",
      prediction: "up",
      confidence: 85,
      reasoning: "Silne wskaźniki techniczne wskazują na wzrost EUR wobec PLN w ciągu najbliższych 7 dni",
      timeframe: "7 dni"
    },
    {
      currency: "USD/PLN",
      prediction: "down",
      confidence: 72,
      reasoning: "Oczekiwane osłabienie USD na rynku globalnym",
      timeframe: "14 dni"
    },
    {
      currency: "GBP/PLN",
      prediction: "stable",
      confidence: 65,
      reasoning: "Stabilne wskaźniki makroekonomiczne",
      timeframe: "30 dni"
    }
  ]);

  const [newsItems] = useState<NewsItem[]>([
    {
      id: 1,
      title: "ECB rozważa obniżenie stóp procentowych",
      summary: "Europejski Bank Centralny może obniżyć stopy procentowe w najbliższych miesiącach, co może wpłynąć na kurs EUR.",
      source: "Reuters",
      date: "2024-01-15",
      relevance: 95,
      currencies: ["EUR", "PLN"]
    },
    {
      id: 2,
      title: "Fed utrzymuje obecną politykę monetarną",
      summary: "Federal Reserve nie wprowadza zmian w polityce monetarnej, co stabilizuje kurs USD.",
      source: "Bloomberg",
      date: "2024-01-14",
      relevance: 88,
      currencies: ["USD", "PLN"]
    },
    {
      id: 3,
      title: "Wzrost inflacji w Polsce",
      summary: "Inflacja w Polsce przekroczyła oczekiwania, co może wpłynąć na decyzje NBP.",
      source: "Rzeczpospolita",
      date: "2024-01-13",
      relevance: 92,
      currencies: ["PLN"]
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-blue-600";
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
          <h1 className="text-3xl font-bold">Mój Profil</h1>
          <p className="text-muted-foreground">Centrum analityczne i ustawienia konta</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Zapisz
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edytuj
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dane profilowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="font-medium"
                    />
                  ) : (
                    <div className="font-medium">{profile.name}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Członek od {formatDate(profile.joinDate)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                ) : (
                  <div className="text-sm">{profile.email}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Łączne transakcje</span>
                <span className="font-medium">{profile.totalTrades}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Skuteczność</span>
                <span className="font-medium">{profile.successRate}%</span>
              </div>
              <Progress value={profile.successRate} className="w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profit Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Przegląd zysków</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(profile.totalProfit)}
                  </div>
                  <div className="text-sm text-muted-foreground">Łączny zysk</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className={`text-xl font-bold ${getProfitColor(profile.profit7d)}`}>
                    {formatCurrency(profile.profit7d)}
                  </div>
                  <div className="text-sm text-muted-foreground">Ostatnie 7 dni</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className={`text-xl font-bold ${getProfitColor(profile.profit30d)}`}>
                    {formatCurrency(profile.profit30d)}
                  </div>
                  <div className="text-sm text-muted-foreground">Ostatnie 30 dni</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className={`text-xl font-bold ${getProfitColor(profile.profit90d)}`}>
                    {formatCurrency(profile.profit90d)}
                  </div>
                  <div className="text-sm text-muted-foreground">Ostatnie 90 dni</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Predykcje AI</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPredictionIcon(prediction.prediction)}
                        <span className="font-medium">{prediction.currency}</span>
                        <Badge variant="outline">{prediction.timeframe}</Badge>
                      </div>
                      <div className={`font-medium ${getPredictionColor(prediction.prediction)}`}>
                        {prediction.confidence}% pewności
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {prediction.reasoning}
                    </p>
                    <Progress value={prediction.confidence} className="w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News */}
          <Card>
            <CardHeader>
              <CardTitle>Wiadomości ze świata walut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <div key={news.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{news.title}</h3>
                      <Badge variant="outline">{news.relevance}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{formatDate(news.date)}</span>
                      </div>
                      <div className="flex space-x-1">
                        {news.currencies.map(currency => (
                          <Badge key={currency} variant="secondary" className="text-xs">
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
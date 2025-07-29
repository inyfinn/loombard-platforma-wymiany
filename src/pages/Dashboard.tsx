import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { ActivityLogWidget } from "../components/widgets/ActivityLogWidget";
import { MiniWalletWidget } from "../components/widgets/MiniWalletWidget";
import { NewsWidget } from "../components/widgets/NewsWidget";
import { QuickActionsWidget } from "../components/widgets/QuickActionsWidget";
import { AIAdviceWidget } from "../components/widgets/AIAdviceWidget";
import { StrategiesWidget } from "../components/widgets/StrategiesWidget";
import { AchievementsWidget } from "../components/widgets/AchievementsWidget";
import { FAQWidget } from "../components/widgets/FAQWidget";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  Wallet,
  BarChart3,
  Bell,
  Activity,
  Users,
  Shield,
  Zap,
  Edit3,
  X,
  Save,
  Plus,
  Brain,
  Clock,
  Target,
  Trophy,
  ArrowRightLeft,
  History,
  Settings,
  Eye,
  EyeOff,
  Move,
  GripVertical,
  Star,
  AlertTriangle,
  CheckCircle,
  Minus,
  Percent,
  Calendar,
  Mail,
  Award,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Info,
  HelpCircle,
  Euro,
  PoundSterling,
  Bitcoin,
  Coins,
  PiggyBank,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';

interface Widget {
  id: string;
  title: string;
  type: string;
  size: "1x1" | "1x2" | "2x1" | "2x2";
  position: number;
  config?: any;
}

interface SortableWidgetProps {
  widget: Widget;
  isEditing: boolean;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

const SortableWidget = ({ widget, isEditing, onRemove, children }: SortableWidgetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
    >
      {children}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balances, totalValuePLN, transactions, calculateExchange } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [originalWidgets, setOriginalWidgets] = useState<Widget[] | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  
  // Kalkulator state
  const [calculatorValue, setCalculatorValue] = useState("0");
  const [calculatorFromCurrency, setCalculatorFromCurrency] = useState("PLN");
  const [calculatorToCurrency, setCalculatorToCurrency] = useState("EUR");
  const [calculatorResult, setCalculatorResult] = useState<number | null>(null);

  // Live rates state
  const [liveRates, setLiveRates] = useState({
    EUR: 4.35,
    USD: 3.98,
    GBP: 5.12,
    CHF: 4.48,
    PLN: 1.00
  });

  // Price alerts state
  const [priceAlerts, setPriceAlerts] = useState([
    { id: 1, pair: "EUR/PLN", condition: ">", value: 4.40, active: true },
    { id: 2, pair: "USD/PLN", condition: "<", value: 3.95, active: false },
  ]);

  // AI predictions state
  const [aiPredictions, setAiPredictions] = useState([
    { pair: "EUR/PLN", prediction: "up", confidence: 85, reason: "Silne dane gospodarcze UE" },
    { pair: "USD/PLN", prediction: "down", confidence: 72, reason: "Spadek inflacji w USA" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "total-balance", title: "Saldo Całkowite", type: "balance", size: "1x1", position: 0 },
    { id: "calculator", title: "Kalkulator", type: "calculator", size: "1x1", position: 1 },
    { id: "top-currencies", title: "Moje Top 3 Waluty", type: "currencies", size: "1x1", position: 2 },
    { id: "live-rates", title: "Kursy Live", type: "rates", size: "1x1", position: 3 },
    { id: "price-alerts", title: "Alerty Cenowe", type: "alerts", size: "1x1", position: 4 },
    { id: "currency-chart", title: "Wykres Walut", type: "chart", size: "2x1", position: 5 },
    { id: "exchange-calculator", title: "Kalkulator Wymiany", type: "exchange-calc", size: "2x1", position: 6 },
    { id: "recent-transactions", title: "Ostatnie Transakcje", type: "transactions", size: "1x2", position: 7 },
    { id: "ai-predictions", title: "Predykcje AI", type: "predictions", size: "1x1", position: 8 },
    { id: "conditional-orders", title: "Zlecenia Warunkowe", type: "orders", size: "1x1", position: 9 },
    { id: "currency-ranking", title: "Ranking Walut", type: "ranking", size: "1x1", position: 10 },
    { id: "notifications", title: "Powiadomienia", type: "notifications", size: "1x1", position: 11 },
  ]);

  const availableWidgets = [
    { id: "activity-log", title: "Log Aktywności", type: "activity", size: "1x1" },
    { id: "mini-wallet", title: "Mini Portfel", type: "mini-wallet", size: "1x1" },
    { id: "news", title: "Nowości", type: "news", size: "1x1" },
    { id: "quick-actions", title: "Szybkie Akcje", type: "actions", size: "1x1" },
    { id: "ai-advice", title: "AI Doradza", type: "ai-advice", size: "1x1" },
    { id: "strategies", title: "Strategie", type: "strategies", size: "1x1" },
    { id: "exchange-history", title: "Historia Wymiany", type: "history", size: "1x1" },
    { id: "simulation", title: "Symulacja", type: "simulation", size: "1x1" },
    { id: "achievements", title: "Osiągnięcia", type: "achievements", size: "1x1" },
    { id: "email-notifications", title: "Powiadomienia Email", type: "email", size: "1x1" },
    { id: "top-currencies-today", title: "Top Waluty Dziś", type: "top-today", size: "1x1" },
    { id: "effectiveness", title: "Twoja Skuteczność", type: "effectiveness", size: "1x1" },
    { id: "faq", title: "FAQ", type: "faq", size: "1x1" },
    { id: "monthly-summary", title: "Podsumowanie Miesiąca", type: "monthly", size: "1x1" },
    { id: "settings", title: "Ustawienia", type: "settings", size: "1x1" },
  ];

  // Aktualizuj kursy co sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRates(prev => ({
        EUR: prev.EUR + (Math.random() - 0.5) * 0.002,
        USD: prev.USD + (Math.random() - 0.5) * 0.002,
        GBP: prev.GBP + (Math.random() - 0.5) * 0.003,
        CHF: prev.CHF + (Math.random() - 0.5) * 0.002,
        PLN: 1.00
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPLN = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Kalkulator funkcjonalny
  const handleCalculatorInput = (value: string) => {
    if (value === "C") {
      setCalculatorValue("0");
      setCalculatorResult(null);
    } else if (value === "=") {
      calculateExchangeResult();
    } else if (value === ".") {
      if (!calculatorValue.includes(".")) {
        setCalculatorValue(calculatorValue + ".");
      }
    } else {
      if (calculatorValue === "0") {
        setCalculatorValue(value);
      } else {
        setCalculatorValue(calculatorValue + value);
      }
    }
  };

  const calculateExchangeResult = () => {
    const amount = parseFloat(calculatorValue);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const result = calculateExchange(calculatorFromCurrency, calculatorToCurrency, amount);
      setCalculatorResult(result);
      toast({
        title: "Przeliczono",
        description: `${amount} ${calculatorFromCurrency} = ${result.toFixed(2)} ${calculatorToCurrency}`,
      });
    } catch (error) {
      toast({
        title: "Błąd kalkulacji",
        description: "Nie udało się przeliczyć waluty",
        variant: "destructive",
      });
    }
  };

  // Aktualizuj wynik kalkulatora gdy zmieniają się waluty lub wartość
  useEffect(() => {
    if (calculatorValue !== "0" && parseFloat(calculatorValue) > 0) {
      calculateExchangeResult();
    }
  }, [calculatorFromCurrency, calculatorToCurrency, calculatorValue]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditing) return;

    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalWidgets([...widgets]);
      setIsEditing(true);
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleSaveLayout = () => {
    setIsEditing(false);
    setOriginalWidgets(null);
    setShowSaveDialog(false);
    toast({
      title: "Układ zapisany",
      description: "Nowy układ dashboardu został zapisany.",
    });
  };

  const handleCancelEdit = () => {
    if (originalWidgets) {
      setWidgets(originalWidgets);
    }
    setIsEditing(false);
    setOriginalWidgets(null);
    setShowCancelDialog(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleAddWidget = (widget: any) => {
    const newWidget: Widget = {
      ...widget,
      position: widgets.length
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetSelector(false);
  };

  const renderWidget = (widget: Widget) => {
    const baseClasses = "bg-[#00071c] border-[#02c349]/20 text-white";
    const sizeClasses = {
      "1x1": "col-span-1 row-span-1",
      "1x2": "col-span-1 row-span-2",
      "2x1": "col-span-2 row-span-1",
      "2x2": "col-span-2 row-span-2"
    };

    const widgetContent = (() => {
      switch (widget.type) {
        case "balance":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Saldo Całkowite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {formatPLN(totalValuePLN)}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <TrendingUp className="w-3 h-3 mr-1 text-[#02c349]" />
                  +2.3% od wczoraj
                </div>
              </CardContent>
            </Card>
          );

        case "calculator":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  Kalkulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-[#00071c]/50 rounded p-2 text-right border border-[#02c349]/10">
                    <div className="text-lg font-mono text-white">{calculatorValue}</div>
                    {calculatorResult !== null && (
                      <div className="text-sm text-[#02c349]">
                        = {calculatorResult.toFixed(2)} {calculatorToCurrency}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={calculatorFromCurrency} onValueChange={setCalculatorFromCurrency}>
                      <SelectTrigger className="h-8 text-xs border-[#02c349]/20 text-[#02c349] bg-[#00071c]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLN">PLN</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={calculatorToCurrency} onValueChange={setCalculatorToCurrency}>
                      <SelectTrigger className="h-8 text-xs border-[#02c349]/20 text-[#02c349] bg-[#00071c]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLN">PLN</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "="].map((num) => (
                      <Button
                        key={num}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCalculatorInput(num.toString())}
                        className="h-8 text-xs border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalculatorInput("C")}
                    className="w-full h-8 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    C
                  </Button>
                </div>
              </CardContent>
            </Card>
          );

        case "currencies":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Moje Top 3 Waluty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {balances.slice(0, 3).map((balance, index) => (
                    <div key={balance.code} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">{index + 1}</span>
                        <span className="text-sm font-medium text-white">{balance.code}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {formatCurrency(balance.amount, balance.code)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatPLN(calculateExchange(balance.code, 'PLN', balance.amount))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/portfel')}
                  className="w-full mt-3 h-8 text-xs border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                >
                  Zobacz Portfel
                </Button>
              </CardContent>
            </Card>
          );

        case "rates":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Kursy Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(liveRates).filter(([code]) => code !== 'PLN').map(([code, rate]) => (
                    <div key={code} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">{code}/PLN</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{rate.toFixed(4)}</div>
                        <div className="text-xs text-[#02c349]">+0.12%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );

        case "alerts":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Alerty Cenowe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceAlerts.map((alert) => (
                    <div key={alert.id} className="flex justify-between items-center">
                      <span className="text-sm text-white">{alert.pair} {alert.condition} {alert.value}</span>
                      <Badge className={alert.active ? "bg-[#02c349]/20 text-[#02c349] text-xs" : "bg-yellow-500/20 text-yellow-400 text-xs"}>
                        {alert.active ? "Aktywny" : "Oczekuje"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings/price-alerts')}
                  className="w-full mt-3 h-8 text-xs border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                >
                  Dodaj Alert
                </Button>
              </CardContent>
            </Card>
          );

        case "chart":
          const chartData = [
            { name: 'Pon', EUR: 4.35, USD: 3.98, GBP: 5.12 },
            { name: 'Wt', EUR: 4.37, USD: 3.96, GBP: 5.14 },
            { name: 'Śr', EUR: 4.34, USD: 3.99, GBP: 5.11 },
            { name: 'Czw', EUR: 4.36, USD: 3.97, GBP: 5.13 },
            { name: 'Pt', EUR: 4.38, USD: 3.95, GBP: 5.15 },
            { name: 'Sob', EUR: 4.35, USD: 3.98, GBP: 5.12 },
            { name: 'Ndz', EUR: 4.37, USD: 3.96, GBP: 5.14 },
          ];

          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Wykres Walut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#02c349" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#02c349" />
                    <YAxis stroke="#02c349" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#00071c', 
                        border: '1px solid #02c349',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="EUR" fill="#02c349" />
                    <Bar dataKey="USD" fill="#ff6b6b" />
                    <Bar dataKey="GBP" fill="#4ecdc4" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );

        case "transactions":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  Ostatnie Transakcje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="text-white">{transaction.fromCurrency} → {transaction.toCurrency}</div>
                        <div className="text-gray-400">{transaction.timestamp.toLocaleDateString('pl-PL')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{transaction.fromAmount.toFixed(2)}</div>
                        <div className="text-[#02c349]">{transaction.rate.toFixed(4)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/history')}
                  className="w-full mt-3 h-8 text-xs border-[#02c349]/20 text-[#02c349] hover:bg-[#02c349]/10"
                >
                  Zobacz Wszystkie
                </Button>
              </CardContent>
            </Card>
          );

        case "predictions":
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Predykcje AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiPredictions.map((prediction, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-white">{prediction.pair}</div>
                        <div className="text-xs text-gray-400">{prediction.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${prediction.prediction === 'up' ? 'text-[#02c349]' : 'text-red-400'}`}>
                          {prediction.prediction === 'up' ? '↗' : '↘'}
                        </div>
                        <div className="text-xs text-gray-400">{prediction.confidence}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );

        case "activity":
          return <ActivityLogWidget />;

        case "mini-wallet":
          return <MiniWalletWidget />;

        case "news":
          return <NewsWidget />;

        case "actions":
          return <QuickActionsWidget />;

        case "ai-advice":
          return <AIAdviceWidget />;

        case "strategies":
          return <StrategiesWidget />;

        case "achievements":
          return <AchievementsWidget />;

        case "faq":
          return <FAQWidget />;

        default:
          return (
            <Card className={`${baseClasses} ${sizeClasses[widget.size]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#02c349]">
                  {widget.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-[#02c349]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <div className="w-4 h-4 bg-[#02c349] rounded"></div>
                    </div>
                    <p className="text-sm text-gray-400">Widget funkcjonalny</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
      }
    })();

    if (isEditing) {
      return (
        <SortableWidget widget={widget} isEditing={isEditing} onRemove={handleRemoveWidget}>
          <Card className={`${baseClasses} ${sizeClasses[widget.size]} relative group cursor-move hover:border-[#02c349]/40 transition-all duration-200`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
                  <GripVertical className="w-3 h-3 mr-1 text-[#02c349]/60" />
                  {widget.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="w-8 h-8 bg-[#02c349]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-4 h-4 bg-[#02c349] rounded"></div>
                </div>
                <p className="text-xs text-gray-400">Widget funkcjonalny</p>
                <p className="text-xs text-[#02c349]/60 mt-1">Przeciągnij aby przesunąć</p>
              </div>
            </CardContent>
          </Card>
        </SortableWidget>
      );
    }

    return (
      <SortableWidget widget={widget} isEditing={isEditing} onRemove={handleRemoveWidget}>
        {widgetContent}
      </SortableWidget>
    );
  };

  return (
    <div className="space-y-8 bg-[#00071c] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#02c349] bg-clip-text text-transparent">
            Dashboard 🚀
          </h1>
          <p className="text-gray-400 mt-2">
            Zarządzaj swoimi walutami i transakcjami
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={handleEditToggle}
            className={isEditing 
              ? "bg-[#02c349] hover:bg-[#02c349]/90 text-white" 
              : "border-[#02c349] text-[#02c349] hover:bg-[#02c349]/10"
            }
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Zapisz Układ
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edytuj Układ
              </>
            )}
          </Button>
          {isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowWidgetSelector(true)}
                className="border-[#02c349] text-[#02c349] hover:bg-[#02c349]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj Widget
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-6 p-6">
            {widgets.map((widget) => renderWidget(widget))}
          </div>
        </SortableContext>
        
        <DragOverlay>
          {activeId ? (
            <div className="bg-[#00071c] border-[#02c349]/40 rounded-xl p-4 shadow-lg">
              <div className="text-[#02c349] font-medium">
                {widgets.find(w => w.id === activeId)?.title}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-[#00071c] border-[#02c349]/20 p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Dodaj Widget</h3>
              <Button
                variant="ghost"
                onClick={() => setShowWidgetSelector(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {availableWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  className="bg-[#00071c]/50 border-[#02c349]/10 hover:border-[#02c349]/30 cursor-pointer transition-colors"
                  onClick={() => handleAddWidget(widget)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 bg-[#02c349]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-4 h-4 text-[#02c349]" />
                    </div>
                    <p className="text-sm font-medium text-white">{widget.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-[#00071c] border-[#02c349]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Zapisać układ?</h3>
            <p className="text-gray-400 mb-6">Czy chcesz zapisać zmiany w układzie dashboardu?</p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Anuluj
              </Button>
              <Button
                onClick={handleSaveLayout}
                className="bg-[#02c349] hover:bg-[#02c349]/90 text-white"
              >
                Zapisz
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-[#00071c] border-[#02c349]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Anulować zmiany?</h3>
            <p className="text-gray-400 mb-6">Wszystkie niezapisane zmiany zostaną utracone.</p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Kontynuuj edycję
              </Button>
              <Button
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Anuluj zmiany
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
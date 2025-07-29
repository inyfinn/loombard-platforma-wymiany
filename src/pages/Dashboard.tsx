import { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Plus, 
  History, 
  ArrowRightLeft,
  Edit3,
  Save,
  X,
  Calculator,
  AlertTriangle,
  BarChart3,
  Target,
  TrendingDown,
  DollarSign,
  Clock,
  Bell,
  Activity,
  PieChart,
  Settings,
  Eye,
  Brain,
  Trophy,
  Mail,
  Star,
  Zap,
  ChevronLeft,
  Sparkles,
  TrendingUpIcon,
  Users,
  Shield,
  Zap as ZapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { getPolishVocative } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Widget {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large";
  position: number;
  visible: boolean;
}

interface Balance {
  currency: string;
  amount: number;
  code: string;
  value: number;
}

interface Transaction {
  id: number;
  type: "exchange" | "deposit" | "withdrawal";
  from: string;
  to: string;
  amount: number;
  rate: number;
  date: string;
  profit?: number;
}

interface Rate {
  pair: string;
  rate: number;
  change: number;
  volume: number;
}

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
}

function SortableWidget({ id, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [originalWidgets, setOriginalWidgets] = useState<Widget[] | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [totalBalance, setTotalBalance] = useState(125430.50);
  const [baseCurrency, setBaseCurrency] = useState("PLN");
  const [userName, setUserName] = useState("Jan"); // Default user name - can be fetched from user profile
  
  // Example names to test declension (in a real app, this would come from user profile)
  const exampleNames = ["Jan", "Anna", "Piotr", "Katarzyna", "Michał", "Maria"];
  
  const [balances] = useState<Balance[]>([
    { currency: "PLN", amount: 45230.50, code: "PLN", value: 45230.50 },
    { currency: "EUR", amount: 12500.00, code: "EUR", value: 54050.00 },
    { currency: "USD", amount: 8900.00, code: "USD", value: 35490.00 },
    { currency: "GBP", amount: 3200.00, code: "GBP", value: 16396.80 },
  ]);

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "exchange",
      from: "EUR",
      to: "PLN",
      amount: 1000,
      rate: 4.32,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      profit: 120
    },
    {
      id: 2,
      type: "deposit",
      from: "Bank",
      to: "PLN",
      amount: 5000,
      rate: 1,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "exchange",
      from: "USD",
      to: "EUR",
      amount: 2000,
      rate: 0.85,
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      profit: -45
    },
  ]);

  const [currentRates] = useState<Rate[]>([
    { pair: "EUR/PLN", rate: 4.3245, change: 0.12, volume: 1250000 },
    { pair: "USD/PLN", rate: 3.9876, change: -0.08, volume: 890000 },
    { pair: "GBP/PLN", rate: 5.1234, change: 0.25, volume: 450000 },
    { pair: "EUR/USD", rate: 1.0845, change: 0.05, volume: 2100000 },
  ]);

  const [priceAlerts] = useState([
    { id: 1, pair: "EUR/PLN", condition: "above", value: 4.35, active: true },
    { id: 2, pair: "USD/PLN", condition: "below", value: 3.95, active: false },
  ]);

  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "total-balance", type: "total-balance", title: "Całkowite Saldo", size: "large", position: 0, visible: true },
    { id: "quick-actions", type: "quick-actions", title: "Szybkie Akcje", size: "small", position: 1, visible: true },
    { id: "top-currencies", type: "top-currencies", title: "Top 3 Waluty", size: "medium", position: 2, visible: true },
    { id: "live-rates", type: "live-rates", title: "Kursy LIVE", size: "medium", position: 3, visible: true },
    { id: "price-alerts", type: "price-alerts", title: "Alerty Cenowe", size: "small", position: 4, visible: true },
    { id: "recent-transactions", type: "recent-transactions", title: "Ostatnie Transakcje", size: "medium", position: 5, visible: true },
    { id: "ai-prediction", type: "ai-prediction", title: "AI Doradza", size: "small", position: 6, visible: true },
    { id: "portfolio-chart", type: "portfolio-chart", title: "Wykres Portfela", size: "large", position: 7, visible: true },
  ]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = widgets.findIndex(w => w.id === active.id);
    const newIndex = widgets.findIndex(w => w.id === over.id);
    const newWidgets = arrayMove(widgets, oldIndex, newIndex).map((w, idx) => ({ ...w, position: idx }));
    setWidgets(newWidgets);
  };

  // Aktualizacja w czasie rzeczywistym co 1 sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalBalance(prev => prev + (Math.random() - 0.5) * 5);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist widgets layout
  useEffect(() => {
    const saved = localStorage.getItem("loombard-widgets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWidgets(parsed);
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("loombard-widgets", JSON.stringify(widgets));
  }, [widgets]);

  const formatCurrency = (amount: number, currency: string) => {
    const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'PLN';
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const handleWidgetReorder = (fromIndex: number, toIndex: number) => {
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);

    const updatedWidgets = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setWidgets(updatedWidgets);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => {
      const updated = prev.map(w => w.id === widgetId ? { ...w, visible: false } : w);
      const removed = prev.find(w => w.id === widgetId);
      if (removed) {
        const t = toast({
          description: `${removed.title} został ukryty`,
          action: (
            <ToastAction altText="Cofnij" onClick={() => {
              setWidgets(p => p.map(w => w.id === widgetId ? { ...w, visible: true } : w));
              t.dismiss();
            }}>
              Cofnij
            </ToastAction>
          ),
        });
      }
      return updated;
    });
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null;

    switch (widget.type) {
      case "total-balance":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Całkowite Saldo</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse-value">
                  {formatCurrency(totalBalance, baseCurrency)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +2.4% od wczoraj
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                    Wzrost
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "quick-actions":
        return (
          <Card key={widget.id} className="col-span-1 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Szybkie Akcje</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={() => navigate('/exchange')}
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Wymień
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300" 
                onClick={() => navigate('/portfel')}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Portfel
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300" 
                onClick={() => navigate('/rates')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Kursy
              </Button>
            </CardContent>
          </Card>
        );

      case "top-currencies":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top 3 Waluty</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balances.slice(0, 3).map((balance, index) => (
                  <div key={balance.code} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                        'bg-gradient-to-br from-amber-600 to-amber-800'
                      }`}>
                        <span className="text-white font-bold text-sm">{balance.code}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{balance.currency}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {formatCurrency(balance.amount, balance.code)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(balance.value, baseCurrency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "live-rates":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Kursy LIVE</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentRates.map((rate) => (
                  <div key={rate.pair} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{rate.pair}</div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{rate.rate.toFixed(4)}</span>
                      <Badge variant={rate.change >= 0 ? "default" : "destructive"} className={
                        rate.change >= 0 
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }>
                        {rate.change >= 0 ? "+" : ""}{rate.change.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "price-alerts":
        return (
          <Card key={widget.id} className="col-span-1 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Alerty Cenowe</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                    <div className="text-sm">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{alert.pair}</div>
                      <div className="text-slate-500 dark:text-slate-400">
                        {alert.condition === "above" ? ">" : "<"} {alert.value}
                      </div>
                    </div>
                    <Switch checked={alert.active} />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj alert
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "recent-transactions":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ostatnie Transakcje</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {transaction.type === "exchange" ? (
                          <ArrowRightLeft className="w-4 h-4 text-white" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {transaction.from} → {transaction.to}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTime(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(transaction.amount, transaction.from)}
                      </div>
                      {transaction.profit && (
                        <div className={`text-sm font-medium ${transaction.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.profit >= 0 ? '+' : ''}{formatCurrency(transaction.profit, baseCurrency)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "ai-prediction":
        return (
          <Card key={widget.id} className="col-span-1 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Doradza</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">EUR/PLN</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg">
                  Wzrost o 0.8% w ciągu 24h. Zalecam sprzedaż części pozycji.
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300"
                >
                  Zobacz szczegóły
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "portfolio-chart":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Wykres Portfela</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">Wykres portfela</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Cześć, {getPolishVocative(userName)}! 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Witaj ponownie! Oto podsumowanie Twojego konta.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => {
              if (!editMode) {
                setOriginalWidgets(widgets);
                setEditMode(true);
              } else {
                setShowSaveDialog(true);
              }
            }}
            className={editMode 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg" 
              : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            }
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Zapisz układ
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edytuj układ
              </>
            )}
          </Button>
          {editMode && (
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Anuluj zmiany
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Dzisiejszy zysk</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">+2.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Transakcje</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Aktywni użytkownicy</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Bezpieczeństwo</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widgets Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.filter(w => w.visible).sort((a,b)=>a.position-b.position).map(w=>w.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets
              .filter(widget => widget.visible)
              .sort((a, b) => a.position - b.position)
              .map((widget) => (
                <SortableWidget key={widget.id} id={widget.id}>
                  {renderWidget(widget)}
                </SortableWidget>
              ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Widget Library (visible only in edit mode) */}
      {editMode && (
        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/50 shadow-lg dark:from-slate-800 dark:to-slate-900/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dodaj widget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "calculator", title: "Kalkulator", icon: Calculator },
                { id: "notifications", title: "Powiadomienia", icon: Bell },
                { id: "activity", title: "Aktywność", icon: Activity },
                { id: "trophy", title: "Osiągnięcia", icon: Trophy },
              ].map((widget) => (
                <Button
                  key={widget.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300"
                  onClick={() => {
                    const newWidget: Widget = {
                      id: `${widget.id}-${Date.now()}`,
                      type: widget.id,
                      title: widget.title,
                      size: "small",
                      position: widgets.length,
                      visible: true
                    };
                    setWidgets([...widgets, newWidget]);
                  }}
                >
                  <widget.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm">{widget.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    {/* Save Dialog */}
    <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Zapisz zmiany układu?</AlertDialogTitle>
          <AlertDialogDescription>
            Zastąpią one poprzedni zapisany układ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction className="bg-primary hover:bg-primary/90" onClick={() => setEditMode(false)}>Tak, zapisz</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Cancel Dialog */}
    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anulować zmiany układu?</AlertDialogTitle>
          <AlertDialogDescription>
            Przywrócony zostanie poprzedni zapisany układ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Wróć</AlertDialogCancel>
          <AlertDialogAction className="bg-primary hover:bg-primary/90" onClick={() => {
            if (originalWidgets) setWidgets(originalWidgets);
            setEditMode(false);
          }}>Tak, anuluj</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
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
  ChevronLeft
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
          <Card key={widget.id} className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Całkowite Saldo</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold animate-pulse-value">
                  {formatCurrency(totalBalance, baseCurrency)}
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2.4% od wczoraj
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "quick-actions":
        return (
          <Card key={widget.id} className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Szybkie Akcje</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => navigate('/exchange')}>
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Wymień
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/portfel')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Portfel
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/rates')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Kursy
              </Button>
            </CardContent>
          </Card>
        );

      case "top-currencies":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Top 3 Waluty</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {balances.slice(0, 3).map((balance) => (
                  <div key={balance.code} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{balance.code}</span>
                      </div>
                      <div>
                        <div className="font-medium">{balance.currency}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(balance.amount, balance.code)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
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
          <Card key={widget.id} className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Kursy LIVE</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentRates.map((rate) => (
                  <div key={rate.pair} className="flex items-center justify-between">
                    <div className="font-medium">{rate.pair}</div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{rate.rate.toFixed(4)}</span>
                      <Badge variant={rate.change >= 0 ? "default" : "destructive"}>
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
          <Card key={widget.id} className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Alerty Cenowe</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="text-sm">
                      <div className="font-medium">{alert.pair}</div>
                      <div className="text-muted-foreground">
                        {alert.condition === "above" ? ">" : "<"} {alert.value}
                      </div>
                    </div>
                    <Switch checked={alert.active} />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj alert
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "recent-transactions":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Ostatnie Transakcje</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {transaction.type === "exchange" ? (
                          <ArrowRightLeft className="w-4 h-4" />
                        ) : (
                          <DollarSign className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.from} → {transaction.to}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(transaction.amount, transaction.from)}
                      </div>
                      {transaction.profit && (
                        <div className={`text-sm ${transaction.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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
          <Card key={widget.id} className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">AI Doradza</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">EUR/PLN</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Wzrost o 0.8% w ciągu 24h. Zalecam sprzedaż części pozycji.
                </div>
                <Button size="sm" className="w-full">
                  Zobacz szczegóły
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "portfolio-chart":
        return (
          <Card key={widget.id} className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Wykres Portfela</CardTitle>
              {editMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Wykres portfela</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cześć, {getPolishVocative(userName)}</h1>
          <p className="text-muted-foreground">Witaj ponownie! Oto podsumowanie Twojego konta.</p>
        </div>
        <div className="flex items-center space-x-2">
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
            >
              <X className="w-4 h-4 mr-2" />
              Anuluj zmiany
            </Button>
          )}
        </div>
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
        <Card>
          <CardHeader>
            <CardTitle>Dodaj widget</CardTitle>
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
                  className="h-20 flex flex-col items-center justify-center"
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
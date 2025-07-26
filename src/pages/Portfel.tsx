import { ArrowLeft, Plus, Minus, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Portfel() {
  const navigate = useNavigate();

  const currencies = [
    { 
      code: "PLN", 
      name: "Polski złoty", 
      flag: "🇵🇱", 
      amount: 45230.50, 
      value: 45230.50,
      change: 0 
    },
    { 
      code: "EUR", 
      name: "Euro", 
      flag: "🇪🇺", 
      amount: 12500.00, 
      value: 54000.00,
      change: 2.4 
    },
    { 
      code: "USD", 
      name: "Dolar amerykański", 
      flag: "🇺🇸", 
      amount: 8900.00, 
      value: 35560.00,
      change: -1.2 
    },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
          <h1 className="text-3xl font-bold">Portfel</h1>
          <p className="text-muted-foreground">Zarządzaj swoimi walutami</p>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <Card className="widget-card">
        <CardHeader>
          <CardTitle>Wartość całkowita portfela</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(134790.50, 'PLN')}
          </div>
          <div className="text-sm text-success flex items-center mt-2">
            +2.8% w tym tygodniu
          </div>
        </CardContent>
      </Card>

      {/* Currency List */}
      <div className="space-y-4">
        {currencies.map((currency) => (
          <Card key={currency.code} className="widget-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{currency.flag}</div>
                  <div>
                    <div className="font-semibold">{currency.code}</div>
                    <div className="text-sm text-muted-foreground">{currency.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(currency.amount, currency.code)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ {formatCurrency(currency.value, 'PLN')}
                  </div>
                  {currency.change !== 0 && (
                    <div className={`text-xs ${currency.change > 0 ? 'text-success' : 'text-destructive'}`}>
                      {currency.change > 0 ? '+' : ''}{currency.change}%
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="loombard-button-secondary"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Kup
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="loombard-button-secondary"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Sprzedaj
                  </Button>
                  <Button 
                    size="sm"
                    className="loombard-button-primary"
                    onClick={() => navigate('/exchange')}
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1" />
                    Wymień
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyBalance {
  code: string;
  amount: number;
  name: string;
  symbol: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'exchange' | 'deposit' | 'withdrawal';
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

interface PortfolioContextType {
  balances: CurrencyBalance[];
  transactions: Transaction[];
  totalValuePLN: number;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  updateBalance: (currencyCode: string, amount: number) => void;
  getBalance: (currencyCode: string) => number;
  calculateTotalValue: () => number;
  calculateExchange: (fromCurrency: string, toCurrency: string, amount: number) => number;
  executeExchange: (fromCurrency: string, toCurrency: string, amount: number, rate: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

// Aktualne kursy walut (symulowane) - aktualizowane w czasie rzeczywistym
const getExchangeRates = () => ({
  EUR: 4.3245 + (Math.random() - 0.5) * 0.1, // Wahania ±0.05
  USD: 3.9876 + (Math.random() - 0.5) * 0.08,
  GBP: 5.1234 + (Math.random() - 0.5) * 0.12,
  CHF: 4.5000 + (Math.random() - 0.5) * 0.15,
  JPY: 0.0267 + (Math.random() - 0.5) * 0.001,
  CAD: 2.9456 + (Math.random() - 0.5) * 0.05,
  AUD: 2.6234 + (Math.random() - 0.5) * 0.04,
  CNY: 0.5523 + (Math.random() - 0.5) * 0.01,
  SEK: 0.3876 + (Math.random() - 0.5) * 0.005,
  NOK: 0.3845 + (Math.random() - 0.5) * 0.005,
  DKK: 0.5802 + (Math.random() - 0.5) * 0.008,
  CZK: 0.1723 + (Math.random() - 0.5) * 0.002,
  HUF: 0.0112 + (Math.random() - 0.5) * 0.0002,
  RUB: 0.0432 + (Math.random() - 0.5) * 0.001,
  PLN: 1.00
});

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [balances, setBalances] = useState<CurrencyBalance[]>([
    { code: 'PLN', amount: 45230.50, name: 'Złoty polski', symbol: 'zł' },
    { code: 'EUR', amount: 12500.00, name: 'Euro', symbol: '€' },
    { code: 'USD', amount: 8900.00, name: 'Dolar amerykański', symbol: '$' },
    { code: 'GBP', amount: 3200.00, name: 'Funt brytyjski', symbol: '£' },
    { code: 'CHF', amount: 1500.00, name: 'Frank szwajcarski', symbol: 'CHF' }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRates, setExchangeRates] = useState(getExchangeRates());

  // Aktualizuj kursy co 30 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates(getExchangeRates());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculateTotalValue = (): number => {
    return balances.reduce((total, balance) => {
      const rate = exchangeRates[balance.code as keyof typeof exchangeRates] || 1;
      return total + (balance.amount * rate);
    }, 0);
  };

  const totalValuePLN = calculateTotalValue();

  const calculateExchange = (fromCurrency: string, toCurrency: string, amount: number): number => {
    const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1;
    const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1;
    return (amount * fromRate) / toRate;
  };

  const executeExchange = (fromCurrency: string, toCurrency: string, amount: number, rate: number) => {
    const toAmount = calculateExchange(fromCurrency, toCurrency, amount);
    
    // Sprawdź czy użytkownik ma wystarczające środki
    const fromBalance = balances.find(b => b.code === fromCurrency);
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error(`Niewystarczające środki w ${fromCurrency}`);
    }

    // Dodaj transakcję (salda zostaną zaktualizowane w addTransaction)
    addTransaction({
      type: 'exchange',
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: toAmount,
      rate,
      status: 'completed'
    });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Aktualizuj salda po wykonaniu transakcji
    if (transactionData.status === 'completed') {
      setBalances(prev => prev.map(balance => {
        if (balance.code === transactionData.fromCurrency) {
          return { ...balance, amount: balance.amount - transactionData.fromAmount };
        }
        if (balance.code === transactionData.toCurrency) {
          return { ...balance, amount: balance.amount + transactionData.toAmount };
        }
        return balance;
      }));
    }
  };

  const updateBalance = (currencyCode: string, amount: number) => {
    setBalances(prev => prev.map(balance => 
      balance.code === currencyCode 
        ? { ...balance, amount } 
        : balance
    ));
  };

  const getBalance = (currencyCode: string): number => {
    const balance = balances.find(b => b.code === currencyCode);
    return balance ? balance.amount : 0;
  };

  // Zapisz dane do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('kantoor-portfolio-balances', JSON.stringify(balances));
    localStorage.setItem('kantoor-portfolio-transactions', JSON.stringify(transactions));
  }, [balances, transactions]);

  // Wczytaj dane z localStorage przy starcie
  useEffect(() => {
    const savedBalances = localStorage.getItem('kantoor-portfolio-balances');
    const savedTransactions = localStorage.getItem('kantoor-portfolio-transactions');
    
    if (savedBalances) {
      setBalances(JSON.parse(savedBalances));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const value = {
    balances,
    transactions,
    totalValuePLN,
    addTransaction,
    updateBalance,
    getBalance,
    calculateTotalValue,
    calculateExchange,
    executeExchange
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}; 
import React, { createContext, useContext, useEffect, useState } from "react";

interface Balance {
  code: string;
  amount: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  rate: number;
  date: string;
}

interface PortfolioContextProps {
  balances: Balance[];
  transactions: Transaction[];
  exchange: (from: string, to: string, amount: number, rate: number) => void;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

const DEFAULT_BALANCES: Balance[] = [
  { code: "PLN", amount: 5000 },
  { code: "EUR", amount: 2000 },
  { code: "USD", amount: 2000 },
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedBalances = localStorage.getItem("loombard-balances");
      const savedTx = localStorage.getItem("loombard-transactions");
      if (savedBalances) {
        setBalances(JSON.parse(savedBalances));
      } else {
        setBalances(DEFAULT_BALANCES);
      }
      if (savedTx) setTransactions(JSON.parse(savedTx));
    } catch {
      setBalances(DEFAULT_BALANCES);
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("loombard-balances", JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem("loombard-transactions", JSON.stringify(transactions));
  }, [transactions]);

  const exchange = (from: string, to: string, amount: number, rate: number) => {
    setBalances(prev => {
      const copy = [...prev];
      const fromIdx = copy.findIndex(b => b.code === from);
      const toIdx = copy.findIndex(b => b.code === to);
      const fromAmount = amount;
      const toAmount = +(amount * rate).toFixed(2);
      if (fromIdx !== -1) copy[fromIdx].amount = +(copy[fromIdx].amount - fromAmount).toFixed(2);
      if (toIdx !== -1) copy[toIdx].amount = +(copy[toIdx].amount + toAmount).toFixed(2);
      return copy;
    });
    setTransactions(prev => [
      {
        id: Date.now().toString(),
        from,
        to,
        amount,
        rate,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <PortfolioContext.Provider value={{ balances, transactions, exchange }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}; 
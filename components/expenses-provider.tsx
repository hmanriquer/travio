"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { travelExpenses as initialData, type TravelExpense } from "@/lib/data";

interface ExpensesContextValue {
  expenses: TravelExpense[];
  addExpense: (expense: Omit<TravelExpense, "id">) => void;
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<TravelExpense[]>(initialData);

  const addExpense = useCallback(
    (expense: Omit<TravelExpense, "id">) => {
      const nextNumber = expenses.length + 1;
      const id = `EXP-${String(nextNumber).padStart(3, "0")}`;
      setExpenses((prev) => [{ ...expense, id }, ...prev]);
    },
    [expenses.length]
  );

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within <ExpensesProvider>");
  }
  return ctx;
}

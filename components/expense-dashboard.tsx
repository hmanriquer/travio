"use client";

import { ExpensesProvider } from "@/components/expenses-provider";
import { SummaryCards } from "@/components/summary-cards";
import { ExpenseTable } from "@/components/expense-table";

export function ExpenseDashboard() {
  return (
    <ExpensesProvider>
      <SummaryCards />
      <ExpenseTable />
    </ExpensesProvider>
  );
}

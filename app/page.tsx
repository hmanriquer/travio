import { PageHeader } from "@/components/page-header";
import { SummaryCards } from "@/components/summary-cards";
import { ExpenseTable } from "@/components/expense-table";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <PageHeader />
        <SummaryCards />
        <ExpenseTable />
      </div>
    </main>
  );
}

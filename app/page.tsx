import { PageHeader } from "@/components/page-header";
import { ExpenseDashboard } from "@/components/expense-dashboard";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-5 sm:gap-8">
        <PageHeader />
        <ExpenseDashboard />
      </div>
    </main>
  );
}

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function calcBudgetPercentage(spent: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((spent / limit) * 100);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function getBudgetPercentage(spent: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((spent / limit) * 100);
}

export function getStatusConfig(status: ApprovalStatus) {
  switch (status) {
    case 'approved':
      return {
        label: 'Aprobado',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'pending':
      return {
        label: 'Pendiente',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'rejected':
      return {
        label: 'Rechazado',
        className: 'bg-red-50 text-red-700 border-red-200',
      };
  }
}

export type ApprovalStatus = "approved" | "pending" | "rejected";

export interface TravelExpense {
  id: string;
  travelerName: string;
  travelerRole: string;
  travelerInitials: string;
  destination: string;
  country: string;
  departureDate: string;
  returnDate: string;
  amountSpent: number;
  expenseLimit: number;
  status: ApprovalStatus;
  notes: string;
  category: string;
}

export const travelExpenses: TravelExpense[] = [
  {
    id: "EXP-001",
    travelerName: "Carlos Méndez",
    travelerRole: "Director de Ventas",
    travelerInitials: "CM",
    destination: "Ciudad de México",
    country: "México",
    departureDate: "2026-02-10",
    returnDate: "2026-02-14",
    amountSpent: 12450.0,
    expenseLimit: 15000.0,
    status: "approved",
    notes: "Reunión con clientes corporativos. Incluye hospedaje y traslados.",
    category: "Ventas",
  },
  {
    id: "EXP-002",
    travelerName: "Ana Lucía Torres",
    travelerRole: "Gerente de Proyectos",
    travelerInitials: "AT",
    destination: "Bogotá",
    country: "Colombia",
    departureDate: "2026-02-15",
    returnDate: "2026-02-19",
    amountSpent: 18200.0,
    expenseLimit: 18000.0,
    status: "pending",
    notes:
      "Supervisión de implementación de software. Gastos excedidos por cambio de vuelo de emergencia.",
    category: "Tecnología",
  },
  {
    id: "EXP-003",
    travelerName: "Roberto Salinas",
    travelerRole: "Ingeniero de Campo",
    travelerInitials: "RS",
    destination: "Lima",
    country: "Perú",
    departureDate: "2026-02-01",
    returnDate: "2026-02-05",
    amountSpent: 9800.0,
    expenseLimit: 12000.0,
    status: "approved",
    notes: "Mantenimiento de equipos en planta.",
    category: "Operaciones",
  },
  {
    id: "EXP-004",
    travelerName: "María Fernanda Ríos",
    travelerRole: "Directora de Marketing",
    travelerInitials: "MR",
    destination: "Miami",
    country: "Estados Unidos",
    departureDate: "2026-03-01",
    returnDate: "2026-03-06",
    amountSpent: 22500.0,
    expenseLimit: 20000.0,
    status: "rejected",
    notes:
      "Conferencia de marketing digital. Rechazado: excede presupuesto aprobado sin autorización previa.",
    category: "Marketing",
  },
  {
    id: "EXP-005",
    travelerName: "Javier Castillo",
    travelerRole: "Analista Financiero",
    travelerInitials: "JC",
    destination: "Santiago",
    country: "Chile",
    departureDate: "2026-02-20",
    returnDate: "2026-02-23",
    amountSpent: 8750.0,
    expenseLimit: 10000.0,
    status: "approved",
    notes: "Auditoría de filial. Todos los gastos dentro del presupuesto.",
    category: "Finanzas",
  },
  {
    id: "EXP-006",
    travelerName: "Lucía Navarro",
    travelerRole: "Coordinadora de RRHH",
    travelerInitials: "LN",
    destination: "Buenos Aires",
    country: "Argentina",
    departureDate: "2026-03-10",
    returnDate: "2026-03-13",
    amountSpent: 0,
    expenseLimit: 14000.0,
    status: "pending",
    notes: "Capacitación regional. Viaje aún no realizado, pendiente de aprobación.",
    category: "Recursos Humanos",
  },
  {
    id: "EXP-007",
    travelerName: "Diego Paredes",
    travelerRole: "Gerente de Logística",
    travelerInitials: "DP",
    destination: "São Paulo",
    country: "Brasil",
    departureDate: "2026-01-25",
    returnDate: "2026-01-30",
    amountSpent: 16300.0,
    expenseLimit: 17000.0,
    status: "approved",
    notes: "Negociación con proveedores de transporte. Incluye cenas de negocios.",
    category: "Logística",
  },
  {
    id: "EXP-008",
    travelerName: "Valentina Cruz",
    travelerRole: "Asesora Legal",
    travelerInitials: "VC",
    destination: "Panamá",
    country: "Panamá",
    departureDate: "2026-02-12",
    returnDate: "2026-02-14",
    amountSpent: 6200.0,
    expenseLimit: 8000.0,
    status: "approved",
    notes: "Revisión de contratos internacionales con firma asociada.",
    category: "Legal",
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getStatusConfig(status: ApprovalStatus) {
  switch (status) {
    case "approved":
      return {
        label: "Aprobado",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "pending":
      return {
        label: "Pendiente",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "rejected":
      return {
        label: "Rechazado",
        className: "bg-red-50 text-red-700 border-red-200",
      };
  }
}

export function getBudgetPercentage(spent: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((spent / limit) * 100);
}

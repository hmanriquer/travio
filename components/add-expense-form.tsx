"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useExpenses } from "@/components/expenses-provider";
import type { ApprovalStatus } from "@/lib/data";

const CATEGORIES = [
  "Ventas",
  "Tecnología",
  "Operaciones",
  "Marketing",
  "Finanzas",
  "Recursos Humanos",
  "Logística",
  "Legal",
  "Otro",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface AddExpenseFormProps {
  open: boolean;
  onClose: () => void;
}

export function AddExpenseForm({ open, onClose }: AddExpenseFormProps) {
  const { addExpense } = useExpenses();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [travelerName, setTravelerName] = useState("");
  const [travelerRole, setTravelerRole] = useState("");
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [expenseLimit, setExpenseLimit] = useState("");
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState("");

  function resetForm() {
    setTravelerName("");
    setTravelerRole("");
    setDestination("");
    setCountry("");
    setDepartureDate("");
    setReturnDate("");
    setAmountSpent("");
    setExpenseLimit("");
    setStatus("pending");
    setCategory(CATEGORIES[0]);
    setNotes("");
  }

  // Focus first input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 200);
    }
  }, [open]);

  // Close on Escape & prevent body scroll
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    addExpense({
      travelerName: travelerName.trim(),
      travelerRole: travelerRole.trim(),
      travelerInitials: getInitials(travelerName),
      destination: destination.trim(),
      country: country.trim(),
      departureDate,
      returnDate,
      amountSpent: Number(amountSpent) || 0,
      expenseLimit: Number(expenseLimit) || 0,
      status,
      category,
      notes: notes.trim(),
    });

    resetForm();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen on mobile, slide-over on sm+ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo registro de viático"
        className={`fixed z-50 flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out
          inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-lg
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Nuevo Viático
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Registre un nuevo gasto de viaje
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-8 sm:w-8"
            aria-label="Cerrar formulario"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
            {/* Section: Traveler */}
            <fieldset className="flex flex-col gap-3 sm:gap-4">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Viajero
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField label="Nombre completo" required>
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="Ej. Carlos Méndez"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Cargo / Puesto" required>
                  <input
                    type="text"
                    required
                    value={travelerRole}
                    onChange={(e) => setTravelerRole(e.target.value)}
                    placeholder="Ej. Director de Ventas"
                    className="form-input"
                  />
                </FormField>
              </div>
            </fieldset>

            {/* Section: Destination */}
            <fieldset className="flex flex-col gap-3 sm:gap-4">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Destino
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField label="Ciudad" required>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej. Ciudad de México"
                    className="form-input"
                  />
                </FormField>
                <FormField label="País" required>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ej. México"
                    className="form-input"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField label="Fecha de salida" required>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="form-input"
                  />
                </FormField>
                <FormField label="Fecha de regreso" required>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="form-input"
                  />
                </FormField>
              </div>
            </fieldset>

            {/* Section: Financials */}
            <fieldset className="flex flex-col gap-3 sm:gap-4">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Financiero
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField label="Monto gastado (MXN)" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={amountSpent}
                    onChange={(e) => setAmountSpent(e.target.value)}
                    placeholder="0.00"
                    className="form-input tabular-nums"
                  />
                </FormField>
                <FormField label="Límite aprobado (MXN)" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={expenseLimit}
                    onChange={(e) => setExpenseLimit(e.target.value)}
                    placeholder="0.00"
                    className="form-input tabular-nums"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <FormField label="Categoría">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Estado">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ApprovalStatus)
                    }
                    className="form-input"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </FormField>
              </div>
            </fieldset>

            {/* Section: Notes */}
            <fieldset className="flex flex-col gap-3 sm:gap-4">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notas
              </legend>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalles adicionales sobre el viaje, justificación de gastos, etc."
                className="form-input resize-none"
              />
            </fieldset>
          </div>

          {/* Fixed footer with actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="h-10 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:h-9"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:h-9 sm:px-4"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* Reusable form field wrapper */
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

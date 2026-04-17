import type { TravelRow, TravelRequestStatus } from "@/lib/types/travels.types"

// ── Localised labels ──────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TravelRequestStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  PROVEN: "Comprobado",
  COMPLETED: "Completado",
  REJECTED: "Rechazado",
}

// ── Status badge colours ──────────────────────────────────────────────────────

const STATUS_COLORS: Record<TravelRequestStatus, { bg: string; text: string }> = {
  PENDING: { bg: "#FFFBEB", text: "#92400E" },
  APPROVED: { bg: "#ECFDF5", text: "#065F46" },
  PROVEN: { bg: "#EFF6FF", text: "#1E40AF" },
  COMPLETED: { bg: "#F0FDF4", text: "#14532D" },
  REJECTED: { bg: "#FEF2F2", text: "#991B1B" },
}

// ── Formatters ────────────────────────────────────────────────────────────────

function formatMxn(value: string | null): string {
  if (!value) return "—"
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(parseFloat(value))
}

// ── HTML fragment builders ────────────────────────────────────────────────────

function buildStatusBadge(status: TravelRequestStatus): string {
  const { bg, text } = STATUS_COLORS[status]
  return `
    <span style="
      background:${bg};
      color:${text};
      padding:2px 7px;
      border-radius:3px;
      font-size:8.5px;
      font-weight:700;
      letter-spacing:0.03em;
      white-space:nowrap;
    ">${STATUS_LABELS[status]}</span>
  `
}

function buildTableRow(row: TravelRow, index: number): string {
  const rowBg = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB"
  const deptFragment = row.travelerDepartment
    ? `<span style="display:block;font-size:8px;color:#6B7280;margin-top:1px">${row.travelerDepartment}</span>`
    : ""

  return `
    <tr style="background:${rowBg}">
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle">
        <strong style="font-size:9.5px">${row.travelerName}</strong>
        ${deptFragment}
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;font-size:9.5px">
        ${row.destinationRegion}
      </td>
      <td style="
        padding:6px 8px;
        border-bottom:1px solid #E5E7EB;
        vertical-align:middle;
        font-size:9.5px;
        max-width:140px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      " title="${row.travelReason.replace(/"/g, "&quot;")}">
        ${row.travelReason}
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;font-size:9px;white-space:nowrap">
        ${row.startDate}<br>
        <span style="color:#6B7280">→ ${row.endDate}</span>
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;font-size:9.5px;text-align:center">
        ${row.days ?? "—"}
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;text-align:center">
        ${buildStatusBadge(row.status)}
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;font-size:9.5px;text-align:right;white-space:nowrap">
        ${formatMxn(row.depositAmount)}
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #E5E7EB;vertical-align:middle;font-size:9.5px;text-align:right;white-space:nowrap">
        ${formatMxn(row.provenAmount)}
      </td>
    </tr>
  `
}

function buildSummarySection(rows: TravelRow[]): string {
  const totalDeposited = rows.reduce(
    (sum, r) => sum + parseFloat(r.depositAmount ?? "0"),
    0,
  )
  const totalProven = rows.reduce(
    (sum, r) => sum + parseFloat(r.provenAmount ?? "0"),
    0,
  )
  const balance = totalDeposited - totalProven
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)

  const stats = [
    { label: "SOLICITUDES", value: String(rows.length), isMoney: false },
    { label: "TOTAL DEPOSITADO", value: fmt(totalDeposited), isMoney: true },
    { label: "TOTAL COMPROBADO", value: fmt(totalProven), isMoney: true },
    { label: "BALANCE NETO", value: fmt(balance), isMoney: true },
  ]

  const statItems = stats
    .map(
      (s) => `
      <div style="text-align:center;padding:12px 16px;border:1px solid #E5E7EB">
        <div style="font-size:7.5px;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px">
          ${s.label}
        </div>
        <div style="font-size:${s.isMoney ? "13px" : "18px"};font-weight:800;color:#111827">
          ${s.value}
        </div>
      </div>
    `,
    )
    .join("")

  return `
    <div style="margin-top:24px">
      <div style="
        background:#000;
        color:#FFF;
        padding:8px 12px;
        font-size:9px;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:0.08em;
        margin-bottom:0;
      ">RESUMEN FINANCIERO</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr)">
        ${statItems}
      </div>
    </div>
  `
}

function buildHtmlDocument(rows: TravelRow[]): string {
  const dateStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const tableRows = rows.map(buildTableRow).join("")

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Control de Viajes y Viáticos</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 1.2cm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      color: #111827;
      margin: 0;
      padding: 0;
    }

    .report-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #000;
    }

    .report-title {
      font-size: 17px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #000;
      line-height: 1.2;
    }

    .report-meta {
      text-align: right;
      font-size: 8.5px;
      color: #6B7280;
      line-height: 1.6;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr {
      background: #000;
    }

    thead th {
      padding: 7px 8px;
      color: #FFF;
      text-align: left;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    thead th.text-right {
      text-align: right;
    }

    thead th.text-center {
      text-align: center;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <div>
      <div class="report-title">Control de Solicitudes de Viaje y Viáticos</div>
    </div>
    <div class="report-meta">
      <div>Generado el ${dateStr}</div>
      <div><strong>${rows.length}</strong> solicitudes exportadas</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Viajero</th>
        <th>Destino</th>
        <th>Propósito</th>
        <th>Fechas</th>
        <th class="text-center">Días</th>
        <th class="text-center">Estado</th>
        <th class="text-right">Depositado (MXN)</th>
        <th class="text-right">Comprobado (MXN)</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  ${buildSummarySection(rows)}
</body>
</html>`
}

// ── Public export function ────────────────────────────────────────────────────

/**
 * Renders a styled HTML report in a new browser window and triggers the
 * browser's native print dialog.  Uses `window.open` + `window.print()`
 * so no external PDF library is required.
 *
 * A small `setTimeout` delay ensures the document is fully painted before
 * the print dialog is invoked.
 */
export function exportTravelsToPdf(rows: TravelRow[]): void {
  const html = buildHtmlDocument(rows)

  const printWindow = window.open("", "_blank", "width=1200,height=800")
  if (!printWindow) {
    throw new Error(
      "No se pudo abrir la ventana de impresión. Comprueba que el navegador no esté bloqueando ventanas emergentes.",
    )
  }

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
  }, 350)
}

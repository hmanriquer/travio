import { NextResponse } from "next/server"

import { TravelRequestService } from "@/lib/services/travel-request.service"

const service = new TravelRequestService()

export async function GET() {
  try {
    const data = await service.getDashboardSummary()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el resumen del panel" },
      { status: 500 }
    )
  }
}

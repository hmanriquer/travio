import { NextResponse } from "next/server"

import { TravelRequestService } from "@/lib/services/travel-request.service"

const service = new TravelRequestService()

export async function GET() {
  try {
    const data = await service.getPendingTasks()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las tareas pendientes" },
      { status: 500 }
    )
  }
}

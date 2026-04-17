import { NextResponse } from "next/server"

import { TravelRequestService } from "@/lib/services/travel-request.service"

const service = new TravelRequestService()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") ?? "5", 10)

  try {
    const data = await service.getRecentActivity(limit)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener la actividad reciente" },
      { status: 500 }
    )
  }
}

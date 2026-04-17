import { NextResponse } from "next/server"

import { TravelerService } from "@/lib/services/traveler.service"

const service = new TravelerService()

export async function GET() {
  try {
    const data = await service.getAll()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los viajeros" },
      { status: 500 }
    )
  }
}

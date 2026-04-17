import { NextResponse } from "next/server"

import { TravelRequestService } from "@/lib/services/travel-request.service"
import { createTravelSchema } from "@/lib/validations/travel.schema"

const service = new TravelRequestService()

export async function GET() {
  try {
    const data = await service.getAllWithTraveler()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los viajes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = createTravelSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      travelerId,
      destinationRegion,
      travelReason,
      startDate,
      endDate,
      depositAmount,
    } = parsed.data

    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)
    const days =
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const created = await service.create({
      travelerId,
      destinationRegion,
      travelReason,
      startDate,
      endDate,
      days,
      depositAmount: depositAmount || null,
      status: "PENDING",
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear la solicitud"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

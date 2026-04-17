import { NextResponse } from "next/server"

import { TravelRequestService } from "@/lib/services/travel-request.service"

const service = new TravelRequestService()

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await service.getByIdWithTraveler(id)
    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener el viaje"
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await service.update(id, body)
    return NextResponse.json(updated)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar el viaje"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await service.delete(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al eliminar el viaje"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

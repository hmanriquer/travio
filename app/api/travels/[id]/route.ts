import { NextResponse } from 'next/server';

import { travelSchema } from '@/schemas/travel.schema';
import { TravelService } from '@/services/travel.service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const result = await TravelService.getTravelById(id);
    if (!result)
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const body = await request.json();
    const validatedBody = travelSchema.partial().parse(body);
    const result = await TravelService.updateTravelById(id, validatedBody);
    if (!result)
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const result = await TravelService.deleteTravelById(id);
    if (!result)
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

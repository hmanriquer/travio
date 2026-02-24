import { NextResponse } from 'next/server';

import { TravelerService } from '@/services/traveler.service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const result = await TravelerService.getTravelerById(id);
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
    const result = await TravelerService.updateTravelerById(id, body);
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
    const result = await TravelerService.deleteTravelerById(id);
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

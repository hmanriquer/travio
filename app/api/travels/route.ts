import { NextResponse } from 'next/server';

import { newTravelSchema } from '@/schemas/travel.schema';
import { TravelService } from '@/services/travel.service';

export async function GET() {
  try {
    const list = await TravelService.listTravels();
    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = newTravelSchema.parse(body);
    const result = await TravelService.createTravel(validatedBody);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}

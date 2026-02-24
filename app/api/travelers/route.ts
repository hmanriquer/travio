import { NextResponse } from 'next/server';

import { TravelerService } from '@/services/traveler.service';

export async function GET() {
  try {
    const list = await TravelerService.listTravelers();
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
    const result = await TravelerService.createTraveler(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}

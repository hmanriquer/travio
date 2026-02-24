import { NextResponse } from 'next/server';

import { AuthService } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = await AuthService.registerUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}

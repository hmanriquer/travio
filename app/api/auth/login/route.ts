import { NextResponse } from 'next/server';

import { signIn } from '@/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    return NextResponse.json({ message: 'Logged in' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }
}

import { session } from '../../../lib/session';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Increment counter
  const current = (await session().get('counter')) ?? 0;
  await session().set('counter', Number(current) + 1);
  return NextResponse.json({
    counter: Number(await session().get('counter'))
  });
}

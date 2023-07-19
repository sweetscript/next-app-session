import { session } from '../../../lib/session';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const inputs = await request.json();
  await session().set('full_name', inputs?.full_name);
  return NextResponse.json('Updated');
}

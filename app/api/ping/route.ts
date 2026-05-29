import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // A simple query to wake up the database
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', message: 'Database pinged successfully' }, { status: 200 });
  } catch (error) {
    console.error('Ping failed:', error);
    return NextResponse.json({ status: 'error', message: 'Database ping failed' }, { status: 500 });
  }
}

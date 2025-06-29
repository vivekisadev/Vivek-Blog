import { generateRssFeed } from '@/lib/feed';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await generateRssFeed();
    return new NextResponse('RSS feed generated successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', {
      status: 500,
    });
  }
}

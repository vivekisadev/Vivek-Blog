import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cssPath = path.join(process.cwd(), 'public', 'styles', 'giscus-theme.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    
    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading theme', { status: 500 });
  }
}

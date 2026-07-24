import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/pending-testimonials.json', 'utf8');
    const pendingData = JSON.parse(fileContents);
    
    return NextResponse.json(pendingData);
  } catch (error) {
    console.error('Error fetching pending testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending testimonials' },
      { status: 500 }
    );
  }
}

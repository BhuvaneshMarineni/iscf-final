import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    
    const pendingContents = await fs.readFile(jsonDirectory + '/pending-testimonials.json', 'utf8');
    const pendingData = JSON.parse(pendingContents);
    
    const testimonialToApprove = pendingData.find((t: any) => t.id === id);
    if (!testimonialToApprove) {
      return NextResponse.json(
        { error: 'Pending testimonial not found' },
        { status: 404 }
      );
    }
    
    const testimonialsContents = await fs.readFile(jsonDirectory + '/testimonials.json', 'utf8');
    const testimonialsData = JSON.parse(testimonialsContents);
    
    const maxId = Math.max(...testimonialsData.map((t: any) => t.id), 0);
    testimonialToApprove.id = maxId + 1;
    
    testimonialsData.push(testimonialToApprove);
    
    const updatedPending = pendingData.filter((t: any) => t.id !== id);
    
    await Promise.all([
      fs.writeFile(
        jsonDirectory + '/testimonials.json', 
        JSON.stringify(testimonialsData, null, 2)
      ),
      fs.writeFile(
        jsonDirectory + '/pending-testimonials.json', 
        JSON.stringify(updatedPending, null, 2)
      ),
    ]);
    
    return NextResponse.json(testimonialToApprove);
  } catch (error) {
    console.error('Error approving testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to approve testimonial' },
      { status: 500 }
    );
  }
}

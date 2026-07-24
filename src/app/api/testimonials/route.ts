import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Read the JSON file from the data directory
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/testimonials.json', 'utf8');
    const testimonialsData = JSON.parse(fileContents);
    
    return NextResponse.json(testimonialsData);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const submission = await request.json();
    const name = typeof submission.name === 'string' ? submission.name.trim() : '';
    const country = typeof submission.country === 'string' ? submission.country.trim() : '';
    const program = typeof submission.program === 'string' ? submission.program.trim() : '';
    const testimonial = typeof submission.testimonial === 'string' ? submission.testimonial.trim() : '';

    if (!name || !country || !program || !testimonial) {
      return NextResponse.json(
        { error: 'Name, country, program, and story are required' },
        { status: 400 }
      );
    }
    
    // Read current pending testimonials
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/pending-testimonials.json', 'utf8');
    const pendingData = JSON.parse(fileContents);
    
    // Add new testimonial with ID
    const testimonialWithId = {
      id: Math.max(...pendingData.map((t: any) => t.id), 0) + 1,
      name,
      country,
      program,
      year: new Date().getFullYear().toString(),
      image: '',
      testimonial,
      status: 'Current Student',
      currentPosition: 'Currently at ODU',
      featured: true,
    };
    
    pendingData.push(testimonialWithId);
    
    // Write back to pending file
    await fs.writeFile(
      jsonDirectory + '/pending-testimonials.json', 
      JSON.stringify(pendingData, null, 2)
    );
    
    return NextResponse.json(testimonialWithId, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedData = await request.json();

    // Read current testimonials data
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/testimonials.json', 'utf8');
    const testimonialsData = JSON.parse(fileContents);

    // Find the testimonial
    const index = testimonialsData.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Update the testimonial
    testimonialsData[index] = {
      ...testimonialsData[index],
      ...updatedData
    };

    // Write back to file
    await fs.writeFile(
      jsonDirectory + '/testimonials.json',
      JSON.stringify(testimonialsData, null, 2)
    );

    return NextResponse.json(testimonialsData[index]);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Read current testimonials data
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/testimonials.json', 'utf8');
    const testimonialsData = JSON.parse(fileContents);

    // Find and remove the testimonial
    const index = testimonialsData.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    testimonialsData.splice(index, 1);

    // Write back to file
    await fs.writeFile(
      jsonDirectory + '/testimonials.json',
      JSON.stringify(testimonialsData, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

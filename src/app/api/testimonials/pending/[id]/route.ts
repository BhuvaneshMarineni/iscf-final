import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/pending-testimonials.json', 'utf8');
    const pendingData = JSON.parse(fileContents);
    
    const updatedPending = pendingData.filter((t: any) => t.id !== id);
    
    await fs.writeFile(
      jsonDirectory + '/pending-testimonials.json', 
      JSON.stringify(updatedPending, null, 2)
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pending testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete pending testimonial' },
      { status: 500 }
    );
  }
}

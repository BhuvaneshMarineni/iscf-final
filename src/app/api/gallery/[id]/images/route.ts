import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const albumId = parseInt(params.id);
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    console.log('Upload request:', { albumId, fileCount: files?.length });

    if (!files || files.length === 0) {
      console.error('No files provided');
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Read current gallery data
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/gallery.json', 'utf8');
    const galleryData = JSON.parse(fileContents);

    // Find the album
    const albumIndex = galleryData.findIndex((a: any) => a.id === albumId);
    if (albumIndex === -1) {
      console.error('Album not found:', albumId);
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Process each file
    const newImages = [];
    const publicDir = path.join(process.cwd(), 'public/images');
    
    // Ensure directory exists
    try {
      await fs.access(publicDir);
    } catch {
      await fs.mkdir(publicDir, { recursive: true });
    }
    
    for (const file of files) {
      console.log('Processing file:', file.name, file.size);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      
      // Save file to public/images directory
      const filePath = path.join(publicDir, filename);
      console.log('Saving file to:', filePath);
      await fs.writeFile(filePath, buffer);
      console.log('File saved successfully');
      
      // Create image object
      const maxImageId = Math.max(0, ...galleryData[albumIndex].images.map((img: any) => img.id));
      newImages.push({
        id: maxImageId + newImages.length + 1,
        url: `/images/${filename}`,
        thumbnail: `/images/${filename}`,
        alt: galleryData[albumIndex].title,
        caption: file.name
      });
    }

    // Add new images to album
    galleryData[albumIndex].images = [...galleryData[albumIndex].images, ...newImages];

    // Write back to file
    await fs.writeFile(
      jsonDirectory + '/gallery.json',
      JSON.stringify(galleryData, null, 2)
    );

    console.log('Successfully added images:', newImages.length);
    return NextResponse.json({ success: true, addedImages: newImages.length });
  } catch (error) {
    console.error('Error adding images:', error);
    return NextResponse.json(
      { error: 'Failed to add images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

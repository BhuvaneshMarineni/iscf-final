import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const albumId = parseInt(params.id);
    const imageId = parseInt(params.imageId);

    // Read current gallery data
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/gallery.json', 'utf8');
    const galleryData = JSON.parse(fileContents);

    // Find the album
    const albumIndex = galleryData.findIndex((a: any) => a.id === albumId);
    if (albumIndex === -1) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Remove the image from the album
    const album = galleryData[albumIndex];
    album.images = album.images.filter((img: any) => img.id !== imageId);

    // If no images left, optionally delete the album or keep it empty
    // For now, we'll keep the album even if empty

    // Write back to file
    await fs.writeFile(
      jsonDirectory + '/gallery.json',
      JSON.stringify(galleryData, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

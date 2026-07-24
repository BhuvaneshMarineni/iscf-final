import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Read the JSON file from the data directory
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/events.json', 'utf8');
    const eventsData = JSON.parse(fileContents);
    
    return NextResponse.json(eventsData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newEvent = await request.json();
    
    // Read current events
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/events.json', 'utf8');
    const eventsData = JSON.parse(fileContents);
    
    // Add new event with ID
    const eventWithId = {
      ...newEvent,
      id: Math.max(...eventsData.map((e: any) => e.id), 0) + 1,
      currentAttendees: 0,
      image: newEvent.image || ''
    };
    
    eventsData.push(eventWithId);
    
    // Write back to file
    await fs.writeFile(
      jsonDirectory + '/events.json', 
      JSON.stringify(eventsData, null, 2)
    );
    
    return NextResponse.json(eventWithId, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
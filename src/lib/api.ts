// API functions for fetching data from JSON files

// Base URL for API calls
const API_BASE_URL = '/api';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  category: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
  recurring: boolean;
  schedule: string;
  maxAttendees?: number;
  currentAttendees: number;
  registrationRequired: boolean;
  featured: boolean;
  image: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  thumbnail: string;
  alt: string;
  caption: string;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  photographer: string;
  tags: string[];
  featured: boolean;
  images: GalleryImage[];
}

export interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  schedule: string;
  location: string;
  coordinator: string;
  contactEmail: string;
  status: 'active' | 'paused' | 'planning' | 'completed';
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  recurring: boolean;
  materials: string;
  startDate: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  country: string;
  program: string;
  year: string;
  image: string;
  testimonial: string;
  status: 'Current Student' | 'Graduate' | 'Alumni';
  currentPosition: string;
  featured: boolean;
}

// Events API
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  try {
    const events = await getEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const events = await getEvents();
    return events.filter(event => event.featured);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

/**
 * @deprecated Use getEvents() or getFeaturedEvents() instead.
 * Kept temporarily during refactor to avoid breaking existing imports.
 */
export async function getActiveEvents(): Promise<Event[]> {
  return getEvents();
}

export async function getNextUpcomingEvent(): Promise<Event | null> {
  try {
    const events = await getEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(event => event.status === 'upcoming' || event.status === 'active')
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcoming[0] || null;
  } catch (error) {
    console.error('Error fetching next upcoming event:', error);
    return null;
  }
}

// Gallery API
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    if (!response.ok) {
      throw new Error('Failed to fetch gallery albums');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery albums:', error);
    return [];
  }
}

export async function getGalleryAlbumById(id: number): Promise<GalleryAlbum | null> {
  try {
    const albums = await getGalleryAlbums();
    return albums.find(album => album.id === id) || null;
  } catch (error) {
    console.error('Error fetching gallery album:', error);
    return null;
  }
}

export async function getFeaturedGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const albums = await getGalleryAlbums();
    return albums.filter(album => album.featured);
  } catch (error) {
    console.error('Error fetching featured gallery albums:', error);
    return [];
  }
}

// Programs API
export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/programs`);
    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
}

export async function getProgramById(id: number): Promise<Program | null> {
  try {
    const programs = await getPrograms();
    return programs.find(program => program.id === id) || null;
  } catch (error) {
    console.error('Error fetching program:', error);
    return null;
  }
}

export async function getActivePrograms(): Promise<Program[]> {
  try {
    const programs = await getPrograms();
    return programs.filter(program => program.status === 'active');
  } catch (error) {
    console.error('Error fetching active programs:', error);
    return [];
  }
}

// Testimonials API
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await getTestimonials();
    return testimonials.filter(testimonial => testimonial.featured);
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
}

// Utility functions
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatEventTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function getEventStatus(event: Event): string {
  const eventDate = new Date(event.date);
  const today = new Date();
  
  if (event.status === 'active' && event.recurring) {
    return 'Active';
  }
  
  if (eventDate > today) {
    return 'Upcoming';
  } else if (eventDate < today) {
    return 'Completed';
  } else {
    return 'Today';
  }
}
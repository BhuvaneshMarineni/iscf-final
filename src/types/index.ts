// Shared type definitions for the ISCF website
//
// Canonical API types are defined in src/lib/api.ts and are re-exported here
// for convenience. The simpler view-model types below are used by the admin
// dashboard and are intentionally kept separate from the richer API shapes.

export type {
  Event as ApiEvent,
  GalleryImage,
  GalleryAlbum,
  Program as ApiProgram,
  Testimonial as ApiTestimonial,
} from '@/lib/api';

// Admin dashboard view models
export interface Event {
  id: number;
  title: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  attendees: number;
}

export interface Photo {
  id: number;
  title: string;
  category: string;
  date: string;
  count: number;
  images?: Array<{
    id: number;
    url: string;
    thumbnail?: string;
    alt: string;
    caption: string;
  }>;
}

export interface Program {
  id: number;
  title: string;
  schedule: string;
  status: 'active' | 'paused' | 'inactive' | 'draft';
  participants: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
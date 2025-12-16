import { EventPrediction } from './prediction.model';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  location: EventLocation;
  category: EventCategory;
  type: EventType;
  image: string;
  gallery?: string[];
  capacity: number;
  interested: number;
  registered: number;
  prediction?: EventPrediction;
  organizer: Organizer;
  price?: number;
  currency?: string;
  isFree: boolean;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  status: EventStatus;
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  attendees?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventLocation {
  type: 'physical' | 'virtual' | 'hybrid';
  address?: string;
  city?: string;
  country?: string;
  venue?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  virtualLink?: string;
}

export type EventCategory = 
  | 'conference' 
  | 'hackathon' 
  | 'workshop' 
  | 'meetup' 
  | 'networking' 
  | 'bootcamp'
  | 'webinar'
  | 'all';

export type EventType = 'presencial' | 'virtual' | 'hibrido';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface AgendaItem {
  id?: string;
  time: string;
  title: string;
  description?: string;
  speaker?: Speaker;
  duration?: number;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Organizer {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  eventsCount?: number;
  averageAttendanceRate?: number;
  bio?: string;
  email?: string;
  website?: string;
}

export interface EventFilters {
  search?: string;
  categories?: EventCategory[];
  location?: {
    type?: 'all' | 'physical' | 'virtual';
    city?: string;
  };
  dateRange?: {
    preset?: 'today' | 'week' | 'month' | 'custom';
    start?: Date;
    end?: Date;
  };
  probability?: {
    min?: number;
    max?: number;
  };
  price?: {
    type?: 'all' | 'free' | 'paid';
    max?: number;
  };
  size?: 'all' | 'small' | 'medium' | 'large';
}

export function getCategoryLabel(category: EventCategory): string {
  const labels: Record<EventCategory, string> = {
    'hackathon': 'Hackathon',
    'conference': 'Conferencia',
    'workshop': 'Taller',
    'networking': 'Networking',
    'meetup': 'Meetup',
    'bootcamp': 'Bootcamp',
    'webinar': 'Webinar',
    'all': 'Todos'
  };
  return labels[category] || category;
}

export function getCategoryIcon(category: EventCategory): string {
  const icons: Record<EventCategory, string> = {
    'hackathon': 'trophy',
    'conference': 'sound',
    'workshop': 'code',
    'networking': 'team',
    'meetup': 'coffee',
    'bootcamp': 'rocket',
    'webinar': 'video-camera',
    'all': 'appstore'
  };
  return icons[category] || 'tag';
}

export function getEventSizeLabel(capacity: number): string {
  if (capacity < 50) return 'Pequeño';
  if (capacity < 200) return 'Mediano';
  return 'Grande';
}

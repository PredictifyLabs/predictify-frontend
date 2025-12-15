/**
 * Domain Models - Adapted from Backend DTOs
 * These interfaces match the Spring Boot backend contracts
 */

// Enums matching backend
export type EventCategory = 'CONFERENCE' | 'HACKATHON' | 'WORKSHOP' | 'MEETUP' | 'NETWORKING' | 'BOOTCAMP' | 'WEBINAR';
export type EventType = 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDO';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
export type LocationType = 'PHYSICAL' | 'VIRTUAL' | 'HYBRID';

export interface EventLocationDTO {
  type: LocationType;
  address?: string;
  city?: string;
  country?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  virtualLink?: string;
  virtualPlatform?: string;
}

export interface OrganizerDTO {
  id: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
  isVerified: boolean;
  eventsCount: number;
  rating?: number;
}

export interface EventDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  category: EventCategory;
  type: EventType;
  status: EventStatus;
  imageUrl: string;
  backgroundColor?: string;
  capacity: number;
  interestedCount: number;
  registeredCount: number;
  attendeesCount?: number;
  viewsCount?: number;
  price?: number;
  currency?: string;
  isFree: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  publishedAt?: string;
  createdAt?: string;
  organizer: OrganizerDTO;
  location: EventLocationDTO;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  category: EventCategory;
  type: EventType;
  imageUrl?: string;
  backgroundColor?: string;
  capacity: number;
  price?: number;
  currency?: string;
  isFree: boolean;
  location: CreateEventLocationDTO;
}

export interface CreateEventLocationDTO {
  type: LocationType;
  address?: string;
  city?: string;
  country?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  virtualLink?: string;
  virtualPlatform?: string;
}

export interface EventFilters {
  search?: string;
  category?: EventCategory;
  type?: EventType;
  city?: string;
  isFree?: boolean;
  startDate?: string;
  endDate?: string;
}

// Category data interface
export interface CategoryData {
  id: EventCategory;
  label: string;
  icon: string;
  color: string;
  eventCount: number;
  subscriberCount: number;
  description: string;
  imageUrl: string;
}

// Complete category data
export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'CONFERENCE',
    label: 'Tecnología',
    icon: 'laptop',
    color: '#10B981',
    eventCount: 2000,
    subscriberCount: 15000,
    description: 'Descubre las últimas tendencias en tecnología, desarrollo de software, inteligencia artificial y más. Conecta con expertos de la industria.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'
  },
  {
    id: 'WORKSHOP',
    label: 'Comida y bebida',
    icon: 'coffee',
    color: '#F59E0B',
    eventCount: 8,
    subscriberCount: 3000,
    description: 'Desde el café de la mañana hasta la pizza de medianoche, disfruta de excelente comida y bebidas con amigos de siempre y nuevos.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
  },
  {
    id: 'HACKATHON',
    label: 'IA',
    icon: 'robot',
    color: '#EF4444',
    eventCount: 919,
    subscriberCount: 8500,
    description: 'Explora el fascinante mundo de la inteligencia artificial, machine learning y las tecnologías del futuro.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600'
  },
  {
    id: 'MEETUP',
    label: 'Arte y cultura',
    icon: 'highlight',
    color: '#8B5CF6',
    eventCount: 563,
    subscriberCount: 4200,
    description: 'Sumérgete en el mundo del arte, la música, el teatro y las expresiones culturales de tu comunidad.',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600'
  },
  {
    id: 'NETWORKING',
    label: 'Clima',
    icon: 'cloud',
    color: '#06B6D4',
    eventCount: 212,
    subscriberCount: 1800,
    description: 'Eventos enfocados en sostenibilidad, cambio climático y acciones para cuidar nuestro planeta.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: 'BOOTCAMP',
    label: 'Fitness',
    icon: 'thunderbolt',
    color: '#F97316',
    eventCount: 469,
    subscriberCount: 5600,
    description: 'Mantente activo con clases de fitness, yoga, running y todo tipo de actividades deportivas.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'
  },
  {
    id: 'WEBINAR',
    label: 'Bienestar',
    icon: 'heart',
    color: '#10B981',
    eventCount: 691,
    subscriberCount: 7200,
    description: 'Cuida tu mente y cuerpo con eventos de meditación, mindfulness y bienestar integral.',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600'
  }
];

// Helper functions
export function getCategoryLabel(category: EventCategory): string {
  const data = CATEGORIES_DATA.find(c => c.id === category);
  return data?.label || category;
}

export function getCategoryIcon(category: EventCategory): string {
  const data = CATEGORIES_DATA.find(c => c.id === category);
  return data?.icon || 'calendar';
}

export function getCategoryData(category: EventCategory): CategoryData | undefined {
  return CATEGORIES_DATA.find(c => c.id === category);
}

export function getLocationTypeLabel(type: LocationType): string {
  const labels: Record<LocationType, string> = {
    'PHYSICAL': 'Presencial',
    'VIRTUAL': 'Virtual',
    'HYBRID': 'Híbrido'
  };
  return labels[type] || type;
}

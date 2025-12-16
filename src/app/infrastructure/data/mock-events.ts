import { EventDTO } from '../../domain/models/event.model';
import { PredictionDTO } from '../../domain/models/prediction.model';

/**
 * ═══════════════════════════════════════════════════════════
 * EVENTO DE EJEMPLO - PREDICTIFY
 * ═══════════════════════════════════════════════════════════
 * 
 * Este evento contiene todos los campos requeridos por el backend
 * incluyendo coordenadas para el mapa y datos completos del organizador.
 */
export const MOCK_EVENTS: EventDTO[] = [
  {
    id: 'evt_001',
    title: 'Angular 20 & AI Summit 2025',
    slug: 'angular-20-ai-summit-2025',
    description: `<h3>El evento más esperado del año para desarrolladores Angular</h3><p>Únete a nosotros en este increíble summit donde exploraremos las nuevas características de Angular 20.</p>`,
    shortDescription: 'Explora Angular 20 y aprende a integrar IA en tus aplicaciones con expertos de la industria.',
    startDate: '2025-03-15',
    endDate: '2025-03-16',
    startTime: '09:00',
    endTime: '18:00',
    timezone: 'America/Bogota',
    category: 'CONFERENCE',
    type: 'PRESENCIAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    capacity: 500,
    interestedCount: 342,
    registeredCount: 287,
    attendeesCount: 0,
    viewsCount: 1520,
    price: 49.99,
    currency: 'USD',
    isFree: false,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    publishedAt: '2024-12-01T10:00:00Z',
    createdAt: '2024-11-15T08:30:00Z',
    organizer: {
      id: 'org_001',
      displayName: 'Angular Spain Community',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ASC&backgroundColor=6366f1',
      bio: 'Comunidad oficial de Angular en España.',
      isVerified: true,
      eventsCount: 24,
      rating: 4.8
    },
    location: {
      type: 'PHYSICAL',
      address: 'Calle de Alcalá 45',
      city: 'Madrid',
      country: 'España',
      venue: 'Centro de Conferencias IFEMA',
      latitude: 40.4168,
      longitude: -3.7038
    }
  },
  {
    id: 'evt_002',
    title: 'Hackathon AI 2025',
    slug: 'hackathon-ai-2025',
    description: `<h3>48 horas de innovación con Inteligencia Artificial</h3><p>Compite con los mejores desarrolladores y crea soluciones innovadoras usando IA.</p>`,
    shortDescription: '48 horas de innovación con IA. Premios de hasta $10,000 USD.',
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    startTime: '08:00',
    endTime: '20:00',
    timezone: 'America/Bogota',
    category: 'HACKATHON',
    type: 'HIBRIDO',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    capacity: 200,
    interestedCount: 156,
    registeredCount: 142,
    attendeesCount: 0,
    viewsCount: 890,
    price: 0,
    currency: 'USD',
    isFree: true,
    isFeatured: true,
    isTrending: true,
    isNew: true,
    publishedAt: '2024-12-10T10:00:00Z',
    createdAt: '2024-12-05T08:30:00Z',
    organizer: {
      id: 'org_002',
      displayName: 'TechLab Innovation',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TLI&backgroundColor=10b981',
      bio: 'Laboratorio de innovación tecnológica.',
      isVerified: true,
      eventsCount: 12,
      rating: 4.9
    },
    location: {
      type: 'HYBRID',
      address: 'Carrera 7 #32-16',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'Hub de Innovación',
      latitude: 4.6097,
      longitude: -74.0817
    }
  },
  {
    id: 'evt_003',
    title: 'Workshop: React & Next.js Masterclass',
    slug: 'react-nextjs-masterclass',
    description: `<h3>Domina React y Next.js en un día intensivo</h3><p>Aprende las mejores prácticas y patrones de desarrollo con React 19 y Next.js 15.</p>`,
    shortDescription: 'Workshop intensivo de React 19 y Next.js 15 con proyectos prácticos.',
    startDate: '2025-01-20',
    endDate: '2025-01-20',
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/Bogota',
    category: 'WORKSHOP',
    type: 'VIRTUAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    capacity: 100,
    interestedCount: 87,
    registeredCount: 78,
    attendeesCount: 0,
    viewsCount: 456,
    price: 29.99,
    currency: 'USD',
    isFree: false,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    publishedAt: '2024-12-08T10:00:00Z',
    createdAt: '2024-12-01T08:30:00Z',
    organizer: {
      id: 'org_003',
      displayName: 'CodeAcademy Pro',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CAP&backgroundColor=f59e0b',
      bio: 'Educación tecnológica de alta calidad.',
      isVerified: true,
      eventsCount: 45,
      rating: 4.7
    },
    location: {
      type: 'VIRTUAL',
      city: 'Online',
      country: 'Global'
    }
  },
  {
    id: 'evt_004',
    title: 'Startup Networking Night',
    slug: 'startup-networking-night',
    description: `<h3>Conecta con emprendedores e inversores</h3><p>Una noche de networking para founders, inversores y entusiastas del ecosistema startup.</p>`,
    shortDescription: 'Conecta con founders, inversores y mentores del ecosistema startup.',
    startDate: '2025-02-10',
    endDate: '2025-02-10',
    startTime: '18:00',
    endTime: '22:00',
    timezone: 'America/Bogota',
    category: 'NETWORKING',
    type: 'PRESENCIAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
    capacity: 150,
    interestedCount: 98,
    registeredCount: 85,
    attendeesCount: 0,
    viewsCount: 320,
    price: 15,
    currency: 'USD',
    isFree: false,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    publishedAt: '2024-12-12T10:00:00Z',
    createdAt: '2024-12-10T08:30:00Z',
    organizer: {
      id: 'org_004',
      displayName: 'StartupHub Colombia',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SHC&backgroundColor=8b5cf6',
      bio: 'Impulsando el ecosistema emprendedor.',
      isVerified: true,
      eventsCount: 18,
      rating: 4.6
    },
    location: {
      type: 'PHYSICAL',
      address: 'Calle 93 #11-26',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'WeWork Zona T',
      latitude: 4.6766,
      longitude: -74.0485
    }
  },
  {
    id: 'evt_005',
    title: 'DevOps & Cloud Meetup',
    slug: 'devops-cloud-meetup',
    description: `<h3>Aprende las últimas tendencias en DevOps y Cloud</h3><p>Charlas sobre Kubernetes, Docker, AWS, Azure y mejores prácticas de CI/CD.</p>`,
    shortDescription: 'Meetup mensual sobre DevOps, Kubernetes, Docker y Cloud.',
    startDate: '2025-01-25',
    endDate: '2025-01-25',
    startTime: '18:30',
    endTime: '21:00',
    timezone: 'America/Bogota',
    category: 'MEETUP',
    type: 'PRESENCIAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    capacity: 80,
    interestedCount: 65,
    registeredCount: 58,
    attendeesCount: 0,
    viewsCount: 210,
    price: 0,
    currency: 'USD',
    isFree: true,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    publishedAt: '2024-12-05T10:00:00Z',
    createdAt: '2024-12-01T08:30:00Z',
    organizer: {
      id: 'org_005',
      displayName: 'DevOps Colombia',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DOC&backgroundColor=3b82f6',
      bio: 'Comunidad de DevOps en Colombia.',
      isVerified: true,
      eventsCount: 36,
      rating: 4.8
    },
    location: {
      type: 'PHYSICAL',
      address: 'Carrera 11 #82-01',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'Auditorio Empresarial',
      latitude: 4.6682,
      longitude: -74.0536
    }
  },
  {
    id: 'evt_006',
    title: 'Full Stack Bootcamp Intensivo',
    slug: 'fullstack-bootcamp-intensivo',
    description: `<h3>De cero a Full Stack Developer en 12 semanas</h3><p>Bootcamp intensivo con mentorías personalizadas y proyecto final real.</p>`,
    shortDescription: 'Bootcamp intensivo de 12 semanas para convertirte en Full Stack Developer.',
    startDate: '2025-03-01',
    endDate: '2025-05-25',
    startTime: '09:00',
    endTime: '13:00',
    timezone: 'America/Bogota',
    category: 'BOOTCAMP',
    type: 'HIBRIDO',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    capacity: 30,
    interestedCount: 45,
    registeredCount: 28,
    attendeesCount: 0,
    viewsCount: 567,
    price: 1500,
    currency: 'USD',
    isFree: false,
    isFeatured: true,
    isTrending: false,
    isNew: true,
    publishedAt: '2024-12-15T10:00:00Z',
    createdAt: '2024-12-10T08:30:00Z',
    organizer: {
      id: 'org_006',
      displayName: 'CodeMaster Academy',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CMA&backgroundColor=ef4444',
      bio: 'Academia de programación intensiva.',
      isVerified: true,
      eventsCount: 8,
      rating: 4.9
    },
    location: {
      type: 'HYBRID',
      address: 'Calle 100 #8a-49',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'Campus CodeMaster',
      latitude: 4.6833,
      longitude: -74.0419
    }
  },
  {
    id: 'evt_007',
    title: 'Webinar: Seguridad en Aplicaciones Web',
    slug: 'webinar-seguridad-web',
    description: `<h3>Protege tus aplicaciones de vulnerabilidades</h3><p>Aprende sobre OWASP Top 10, autenticación segura y mejores prácticas de seguridad.</p>`,
    shortDescription: 'Webinar gratuito sobre seguridad en aplicaciones web modernas.',
    startDate: '2025-01-18',
    endDate: '2025-01-18',
    startTime: '15:00',
    endTime: '17:00',
    timezone: 'America/Bogota',
    category: 'WEBINAR',
    type: 'VIRTUAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    capacity: 500,
    interestedCount: 234,
    registeredCount: 198,
    attendeesCount: 0,
    viewsCount: 890,
    price: 0,
    currency: 'USD',
    isFree: true,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    publishedAt: '2024-12-14T10:00:00Z',
    createdAt: '2024-12-12T08:30:00Z',
    organizer: {
      id: 'org_007',
      displayName: 'CyberSec Latam',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CSL&backgroundColor=14b8a6',
      bio: 'Comunidad de ciberseguridad en Latinoamérica.',
      isVerified: true,
      eventsCount: 22,
      rating: 4.7
    },
    location: {
      type: 'VIRTUAL',
      city: 'Online',
      country: 'Global'
    }
  },
  {
    id: 'evt_008',
    title: 'UX/UI Design Conference 2025',
    slug: 'ux-ui-design-conference-2025',
    description: `<h3>El futuro del diseño digital</h3><p>Conferencia sobre tendencias de UX/UI, design systems y herramientas de diseño.</p>`,
    shortDescription: 'Conferencia sobre las últimas tendencias en UX/UI Design.',
    startDate: '2025-02-20',
    endDate: '2025-02-21',
    startTime: '09:00',
    endTime: '18:00',
    timezone: 'America/Bogota',
    category: 'CONFERENCE',
    type: 'PRESENCIAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop',
    capacity: 300,
    interestedCount: 178,
    registeredCount: 156,
    attendeesCount: 0,
    viewsCount: 678,
    price: 79.99,
    currency: 'USD',
    isFree: false,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    publishedAt: '2024-12-01T10:00:00Z',
    createdAt: '2024-11-20T08:30:00Z',
    organizer: {
      id: 'org_008',
      displayName: 'DesignLab Colombia',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DLC&backgroundColor=ec4899',
      bio: 'Comunidad de diseñadores UX/UI.',
      isVerified: true,
      eventsCount: 15,
      rating: 4.8
    },
    location: {
      type: 'PHYSICAL',
      address: 'Carrera 13 #94-32',
      city: 'Bogotá',
      country: 'Colombia',
      venue: 'Centro de Convenciones Corferias',
      latitude: 4.6286,
      longitude: -74.0894
    }
  }
];

/**
 * Predicción de ejemplo para el evento
 */
export const MOCK_PREDICTIONS: Record<string, PredictionDTO> = {
  'evt_001': {
    id: 'pred_001',
    eventId: 'evt_001',
    probability: 87,
    level: 'HIGH',
    estimatedMin: 420,
    estimatedMax: 480,
    estimatedExpected: 450,
    confidence: 0.92,
    trend: 'UP',
    trendChange: 5,
    calculatedAt: new Date().toISOString(),
    factors: [
      {
        id: 'f1',
        name: 'Popularidad del tema',
        type: 'POSITIVE',
        impact: 'HIGH',
        weight: 0.25,
        score: 0.92,
        description: 'Angular 20 es un tema muy demandado actualmente'
      },
      {
        id: 'f2',
        name: 'Reputación del organizador',
        type: 'POSITIVE',
        impact: 'HIGH',
        weight: 0.20,
        score: 0.88,
        description: 'El organizador tiene un historial excelente'
      },
      {
        id: 'f3',
        name: 'Ubicación céntrica',
        type: 'POSITIVE',
        impact: 'MEDIUM',
        weight: 0.15,
        score: 0.75,
        description: 'Fácil acceso en transporte público'
      },
      {
        id: 'f4',
        name: 'Precio competitivo',
        type: 'POSITIVE',
        impact: 'MEDIUM',
        weight: 0.15,
        score: 0.70,
        description: 'Buen valor por el contenido ofrecido'
      },
      {
        id: 'f5',
        name: 'Época del año',
        type: 'NEUTRAL',
        impact: 'LOW',
        weight: 0.10,
        score: 0.50,
        description: 'Marzo es un mes con actividad moderada'
      }
    ]
  }
};

export function getMockEventById(id: string): EventDTO | undefined {
  return MOCK_EVENTS.find(e => e.id === id || e.slug === id);
}

export function getMockEventBySlug(slug: string): EventDTO | undefined {
  return MOCK_EVENTS.find(e => e.slug === slug);
}

export function getMockPrediction(eventId: string): PredictionDTO | undefined {
  return MOCK_PREDICTIONS[eventId];
}

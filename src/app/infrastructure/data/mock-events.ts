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
    description: `
      <h3>El evento más esperado del año para desarrolladores Angular</h3>
      <p>Únete a nosotros en este increíble summit donde exploraremos las nuevas características de Angular 20, 
      incluyendo Signals, el nuevo control flow, y cómo integrar Inteligencia Artificial en tus aplicaciones.</p>
      
      <h4>Lo que aprenderás:</h4>
      <ul>
        <li>Angular 20 Signals y estado reactivo</li>
        <li>Nuevo control flow (@if, @for, @switch)</li>
        <li>Server-Side Rendering mejorado</li>
        <li>Integración con modelos de IA</li>
        <li>Mejores prácticas de arquitectura</li>
      </ul>
      
      <h4>Incluye:</h4>
      <ul>
        <li>Acceso a todas las charlas</li>
        <li>Workshops prácticos</li>
        <li>Networking lunch</li>
        <li>Certificado de participación</li>
        <li>Swag exclusivo</li>
      </ul>
    `,
    shortDescription: 'Explora Angular 20 y aprende a integrar IA en tus aplicaciones con expertos de la industria.',
    startDate: '2025-03-15',
    endDate: '2025-03-16',
    startTime: '09:00',
    endTime: '18:00',
    timezone: 'Europe/Madrid',
    category: 'CONFERENCE',
    type: 'PRESENCIAL',
    status: 'PUBLISHED',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    capacity: 500,
    interestedCount: 342,
    registeredCount: 287,
    attendeesCount: 0,
    viewsCount: 1520,
    price: 49.99,
    currency: 'EUR',
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
      bio: 'Comunidad oficial de Angular en España. Organizamos eventos, meetups y conferencias para desarrolladores.',
      email: 'contact@angularspain.dev',
      website: 'https://angularspain.dev',
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

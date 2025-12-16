import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Event, EventFilters } from '../models/event.model';
import { PredictionService } from './prediction.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private predictionService: PredictionService) {}

  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'Hackathon Puerta Del Sol 2025',
      description: 'Competencia de desarrollo web de 48 horas con premios increíbles. Únete a desarrolladores de toda España para crear soluciones innovadoras.',
      shortDescription: 'Competencia de desarrollo web de 48 horas',
      date: '2025-12-15',
      time: '09:00 AM',
      location: {
        type: 'physical',
        city: 'Madrid',
        country: 'España',
        address: 'Puerta del Sol, Madrid',
        venue: 'Centro de Innovación'
      },
      category: 'hackathon',
      type: 'presencial',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      capacity: 150,
      interested: 245,
      registered: 180,
      organizer: {
        id: 'org1',
        name: 'TechMadrid',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TM',
        isVerified: true,
        eventsCount: 15,
        averageAttendanceRate: 0.82
      },
      price: 0,
      isFree: true,
      tags: ['desarrollo', 'competencia', 'premios'],
      isFeatured: true,
      isTrending: true,
      isNew: false,
      status: 'published',
      attendees: 150
    },
    {
      id: '2',
      title: 'TechCaribe Conference',
      description: 'La conferencia tech más grande del Caribe con speakers internacionales. Aprende sobre las últimas tendencias en tecnología.',
      shortDescription: 'Conferencia tech del Caribe',
      date: '2025-12-20',
      time: '10:00 AM',
      location: {
        type: 'physical',
        city: 'Santo Domingo',
        country: 'República Dominicana',
        venue: 'Centro de Convenciones'
      },
      category: 'conference',
      type: 'presencial',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      capacity: 500,
      interested: 420,
      registered: 380,
      organizer: {
        id: 'org2',
        name: 'Caribbean Tech',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CT',
        isVerified: true,
        eventsCount: 8,
        averageAttendanceRate: 0.78
      },
      price: 49.99,
      currency: 'USD',
      isFree: false,
      tags: ['conferencia', 'networking', 'internacional'],
      isFeatured: true,
      isTrending: false,
      isNew: false,
      status: 'published',
      attendees: 500
    },
    {
      id: '3',
      title: 'Workshop: React Avanzado',
      description: 'Aprende patrones avanzados de React con hooks y state management. Incluye ejercicios prácticos y proyecto final.',
      shortDescription: 'Patrones avanzados de React',
      date: '2025-12-10',
      time: '02:00 PM',
      location: {
        type: 'physical',
        city: 'Barcelona',
        country: 'España',
        venue: 'Tech Hub Barcelona'
      },
      category: 'workshop',
      type: 'presencial',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      capacity: 50,
      interested: 65,
      registered: 48,
      organizer: {
        id: 'org3',
        name: 'React Barcelona',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RB',
        isVerified: true,
        eventsCount: 25,
        averageAttendanceRate: 0.88
      },
      price: 29.99,
      currency: 'EUR',
      isFree: false,
      tags: ['react', 'javascript', 'frontend'],
      isFeatured: false,
      isTrending: false,
      isNew: true,
      status: 'published',
      attendees: 50
    },
    {
      id: '4',
      title: 'AI & Machine Learning Summit',
      description: 'Explora las últimas tendencias en IA y aprendizaje automático con expertos de la industria.',
      shortDescription: 'Summit de IA y ML',
      date: '2026-01-05',
      time: '09:00 AM',
      location: {
        type: 'virtual',
        virtualLink: 'https://zoom.us/j/example'
      },
      category: 'conference',
      type: 'virtual',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      capacity: 1000,
      interested: 850,
      registered: 720,
      organizer: {
        id: 'org4',
        name: 'AI Global',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AG',
        isVerified: true,
        eventsCount: 12,
        averageAttendanceRate: 0.75
      },
      price: 0,
      isFree: true,
      tags: ['ai', 'machine-learning', 'data-science'],
      isFeatured: true,
      isTrending: true,
      isNew: false,
      status: 'published',
      attendees: 1000
    },
    {
      id: '5',
      title: 'Networking Tech Drinks',
      description: 'Conecta con profesionales tech en un ambiente relajado. Bebidas y snacks incluidos.',
      shortDescription: 'Networking informal',
      date: '2025-12-08',
      time: '06:00 PM',
      location: {
        type: 'physical',
        city: 'Valencia',
        country: 'España',
        venue: 'Rooftop Bar Tech'
      },
      category: 'networking',
      type: 'presencial',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      capacity: 80,
      interested: 95,
      registered: 72,
      organizer: {
        id: 'org5',
        name: 'Valencia Tech Community',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VTC',
        isVerified: false,
        eventsCount: 5,
        averageAttendanceRate: 0.65
      },
      price: 0,
      isFree: true,
      tags: ['networking', 'social', 'drinks'],
      isFeatured: false,
      isTrending: false,
      isNew: true,
      status: 'published',
      attendees: 80
    }
  ];

  getEvents(filters?: EventFilters): Observable<Event[]> {
    let events = [...this.mockEvents];

    events = events.map(event => ({
      ...event,
      prediction: this.predictionService.calculatePrediction(event)
    }));

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        events = events.filter(e => 
          e.title.toLowerCase().includes(search) ||
          e.description.toLowerCase().includes(search) ||
          e.location.city?.toLowerCase().includes(search)
        );
      }

      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
        events = events.filter(e => filters.categories!.includes(e.category));
      }

      if (filters.price?.type === 'free') {
        events = events.filter(e => e.isFree);
      } else if (filters.price?.type === 'paid') {
        events = events.filter(e => !e.isFree);
      }

      if (filters.location?.type && filters.location.type !== 'all') {
        events = events.filter(e => e.location.type === filters.location!.type);
      }

      if (filters.probability) {
        events = events.filter(e => {
          const prob = e.prediction?.probability || 0;
          return prob >= (filters.probability!.min || 0) && prob <= (filters.probability!.max || 100);
        });
      }
    }

    return of(events).pipe(delay(300));
  }

  getEventById(id: string): Observable<Event | undefined> {
    const event = this.mockEvents.find(e => e.id === id);
    if (event) {
      const eventWithPrediction = {
        ...event,
        prediction: this.predictionService.calculatePrediction(event)
      };
      return of(eventWithPrediction).pipe(delay(200));
    }
    return of(undefined);
  }

  getFeaturedEvents(): Observable<Event[]> {
    const featured = this.mockEvents
      .filter(e => e.isFeatured)
      .map(event => ({
        ...event,
        prediction: this.predictionService.calculatePrediction(event)
      }));
    return of(featured).pipe(delay(200));
  }

  getTrendingEvents(): Observable<Event[]> {
    const trending = this.mockEvents
      .filter(e => e.isTrending)
      .map(event => ({
        ...event,
        prediction: this.predictionService.calculatePrediction(event)
      }));
    return of(trending).pipe(delay(200));
  }
}

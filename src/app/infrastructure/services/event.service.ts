import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventDTO, EventCategory, EventType } from '../../domain/models/event.model';
import { PredictionDTO } from '../../domain/models/prediction.model';
import { MOCK_EVENTS, getMockEventById, getMockEventBySlug, getMockPrediction } from '../data/mock-events';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;
  
  // Set to true to use mock data, false to use real backend
  private readonly USE_MOCK = false;
  
  // State signals
  private readonly _events = signal<EventDTO[]>([]);
  private readonly _featuredEvents = signal<EventDTO[]>([]);
  private readonly _trendingEvents = signal<EventDTO[]>([]);
  private readonly _selectedEvent = signal<EventDTO | null>(null);
  private readonly _selectedEventPrediction = signal<PredictionDTO | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  // Filter state
  private readonly _searchQuery = signal('');
  private readonly _selectedCategory = signal<EventCategory | 'ALL'>('ALL');
  
  // Public readonly signals
  readonly events = this._events.asReadonly();
  readonly featuredEvents = this._featuredEvents.asReadonly();
  readonly trendingEvents = this._trendingEvents.asReadonly();
  readonly selectedEvent = this._selectedEvent.asReadonly();
  readonly selectedEventPrediction = this._selectedEventPrediction.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  
  // Computed filtered events
  readonly filteredEvents = computed(() => {
    const events = this._events();
    const search = this._searchQuery().toLowerCase();
    const category = this._selectedCategory();
    
    return events.filter(event => {
      const matchesSearch = !search || 
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.location.city?.toLowerCase().includes(search);
      
      const matchesCategory = category === 'ALL' || event.category === category;
      
      return matchesSearch && matchesCategory;
    });
  });
  
  // Actions
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }
  
  setSelectedCategory(category: EventCategory | 'ALL'): void {
    this._selectedCategory.set(category);
  }
  
  loadEvents(): void {
    this._loading.set(true);
    this._error.set(null);
    
    if (this.USE_MOCK) {
      of(MOCK_EVENTS).pipe(delay(500)).subscribe(events => {
        // Merge with organizer and admin created events from localStorage
        const organizerEvents = this.getOrganizerEvents();
        const adminEvents = this.getAdminEvents();
        const allEvents = [...events, ...organizerEvents, ...adminEvents];
        this._events.set(allEvents);
        this._loading.set(false);
      });
      return;
    }
    
    this.http.get<EventDTO[]>(`${this.baseUrl}/upcoming`)
      .pipe(
        catchError(err => {
          this._error.set('Error al cargar eventos');
          console.error('Error loading events:', err);
          // Fallback to mock events if backend fails
          return of(MOCK_EVENTS);
        })
      )
      .subscribe(events => {
        // Merge with organizer and admin created events from localStorage
        const organizerEvents = this.getOrganizerEvents();
        const adminEvents = this.getAdminEvents();
        const allEvents = [...events, ...organizerEvents, ...adminEvents];
        this._events.set(allEvents);
        this._loading.set(false);
      });
  }
  
  loadFeaturedEvents(): void {
    this.http.get<EventDTO[]>(`${this.baseUrl}/featured`)
      .pipe(catchError(() => of([])))
      .subscribe(events => this._featuredEvents.set(events));
  }
  
  loadTrendingEvents(): void {
    this.http.get<EventDTO[]>(`${this.baseUrl}/trending`)
      .pipe(catchError(() => of([])))
      .subscribe(events => this._trendingEvents.set(events));
  }
  
  searchEvents(keyword: string): void {
    if (!keyword.trim()) {
      this.loadEvents();
      return;
    }
    
    this._loading.set(true);
    const params = new HttpParams().set('keyword', keyword);
    
    this.http.get<EventDTO[]>(`${this.baseUrl}/search`, { params })
      .pipe(
        catchError(err => {
          this._error.set('Error en la búsqueda');
          return of([]);
        })
      )
      .subscribe(events => {
        this._events.set(events);
        this._loading.set(false);
      });
  }
  
  loadEventById(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this._selectedEvent.set(null);
    this._selectedEventPrediction.set(null);
    
    if (this.USE_MOCK) {
      of(getMockEventById(id)).pipe(delay(300)).subscribe(event => {
        if (event) {
          this._selectedEvent.set(event);
          const prediction = getMockPrediction(event.id);
          if (prediction) {
            this._selectedEventPrediction.set(prediction);
          }
        } else {
          this._error.set('Evento no encontrado');
        }
        this._loading.set(false);
      });
      return;
    }
    
    this.http.get<EventDTO>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(err => {
          this._error.set('Evento no encontrado');
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe(event => {
        if (event) {
          this._selectedEvent.set(event);
          this.loadEventPrediction(id);
        }
        this._loading.set(false);
      });
  }
  
  loadEventBySlug(slug: string): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<EventDTO>(`${this.baseUrl}/slug/${slug}`)
      .pipe(
        catchError(err => {
          this._error.set('Evento no encontrado');
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe(event => {
        if (event) {
          this._selectedEvent.set(event);
          this.loadEventPrediction(event.id);
        }
        this._loading.set(false);
      });
  }
  
  private loadEventPrediction(eventId: string): void {
    this.http.get<PredictionDTO>(`${environment.apiUrl}/predictions/event/${eventId}`)
      .pipe(catchError(() => of(null)))
      .subscribe(prediction => this._selectedEventPrediction.set(prediction));
  }
  
  // Observable versions for components that need them
  getEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/upcoming`);
  }
  
  getEventById(id: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.baseUrl}/${id}`);
  }
  
  getFeaturedEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/featured`);
  }
  
  getTrendingEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/trending`);
  }
  
  clearSelectedEvent(): void {
    this._selectedEvent.set(null);
    this._selectedEventPrediction.set(null);
  }

  /**
   * Get organizer-created events from localStorage and convert to EventDTO format
   */
  private getOrganizerEvents(): EventDTO[] {
    try {
      const stored = localStorage.getItem('predictify_organizer_events');
      if (!stored) return [];
      
      const organizerEvents = JSON.parse(stored);
      return organizerEvents
        .filter((e: any) => e.status === 'PUBLISHED')
        .map((e: any): EventDTO => ({
          id: e.id,
          title: e.title,
          slug: e.title.toLowerCase().replace(/\s+/g, '-'),
          description: e.description || '',
          shortDescription: e.description?.substring(0, 100) || '',
          category: (e.category as EventCategory) || 'CONFERENCE',
          type: (e.type as EventType) || 'PRESENCIAL',
          status: 'PUBLISHED',
          imageUrl: e.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
          startDate: e.startDate || new Date().toISOString(),
          endDate: e.startDate || new Date().toISOString(),
          startTime: e.startTime || '09:00',
          endTime: e.startTime || '18:00',
          timezone: 'America/Bogota',
          location: {
            type: (!e.location || e.location === 'Virtual') ? 'VIRTUAL' : 'PHYSICAL',
            venue: e.location || 'Virtual',
            address: e.location || '',
            city: e.location || 'Virtual',
            country: 'Colombia'
          },
          capacity: e.capacity || 100,
          interestedCount: 0,
          registeredCount: e.registered || 0,
          isFree: true,
          isFeatured: false,
          isTrending: false,
          organizer: {
            id: 'org_current',
            displayName: 'Organizador',
            avatar: '',
            isVerified: false,
            eventsCount: 1
          },
          createdAt: e.createdAt || new Date().toISOString()
        }));
    } catch {
      return [];
    }
  }

  /**
   * Get admin-created events from localStorage and convert to EventDTO format
   */
  private getAdminEvents(): EventDTO[] {
    try {
      const stored = localStorage.getItem('predictify_admin_events');
      if (!stored) return [];
      
      const adminEvents = JSON.parse(stored);
      return adminEvents
        .filter((e: any) => e.status === 'PUBLISHED')
        .map((e: any): EventDTO => ({
          id: e.id,
          title: e.title,
          slug: e.title.toLowerCase().replace(/\s+/g, '-'),
          description: e.description || '',
          shortDescription: e.description?.substring(0, 100) || '',
          category: (e.category as EventCategory) || 'CONFERENCE',
          type: (e.type as EventType) || 'PRESENCIAL',
          status: 'PUBLISHED',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
          startDate: e.startDate || new Date().toISOString(),
          endDate: e.startDate || new Date().toISOString(),
          startTime: e.startTime || '09:00',
          endTime: '18:00',
          timezone: 'America/Bogota',
          location: {
            type: e.city === 'Virtual' ? 'VIRTUAL' : 'PHYSICAL',
            venue: e.venue || e.city || 'Venue',
            address: e.address || '',
            city: e.city || 'Colombia',
            country: 'Colombia',
            latitude: e.latitude,
            longitude: e.longitude
          },
          capacity: e.capacity || 100,
          interestedCount: 0,
          registeredCount: e.registered || 0,
          isFree: true,
          isFeatured: false,
          isTrending: false,
          organizer: {
            id: 'admin',
            displayName: e.organizerName || 'Administrador',
            avatar: '',
            isVerified: true,
            eventsCount: 1
          },
          createdAt: e.createdAt || new Date().toISOString()
        }));
    } catch {
      return [];
    }
  }

  /**
   * Refresh events (used when organizer creates new events)
   */
  refreshEvents(): void {
    this.loadEvents();
  }
}

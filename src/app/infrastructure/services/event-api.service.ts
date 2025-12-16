import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventDTO, CreateEventDTO, EventFilters } from '../../domain/models/event.model';
import { PredictionDTO } from '../../domain/models/prediction.model';
import { AuthService } from './auth.service';

type LocationTypeBackend = 'PHYSICAL' | 'VIRTUAL' | 'HYBRID';

export interface OrganizerProfileDTO {
  id: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
}

export interface CreateOrganizerDTO {
  displayName: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
}

export interface CreateEventLocationDTOBackend {
  type?: LocationTypeBackend;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  virtualUrl?: string;
  virtualPlatform?: string;
  instructions?: string;
}

export interface CreateEventDTOBackend {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  type: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  capacity: number;
  price?: number;
  currency?: string;
  isFree?: boolean;
  imageUrl?: string;
  location?: CreateEventLocationDTOBackend | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/events`;
  private readonly organizersUrl = `${environment.apiUrl}/organizers`;
  
  getUpcomingEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/upcoming`);
  }
  
  getFeaturedEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/featured`);
  }
  
  getTrendingEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/trending`);
  }
  
  searchEvents(keyword: string): Observable<EventDTO[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<EventDTO[]>(`${this.baseUrl}/search`, { params });
  }
  
  getEventById(id: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.baseUrl}/${id}`);
  }
  
  getEventBySlug(slug: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.baseUrl}/slug/${slug}`);
  }
  
  getMyEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/my-events`);
  }
  
  createEvent(event: CreateEventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(this.baseUrl, event);
  }

  isCurrentUserOrganizer(): Observable<boolean> {
    return this.http.get<boolean>(`${this.organizersUrl}/me/check`);
  }

  createOrganizerProfile(dto: CreateOrganizerDTO): Observable<OrganizerProfileDTO> {
    return this.http.post<OrganizerProfileDTO>(this.organizersUrl, dto);
  }

  /**
   * Best-practice helper for the backend constraint:
   * event creation requires an organizer profile for the currently authenticated user.
   */
  createEventEnsuringOrganizer(
    dto: CreateEventDTOBackend,
    organizerDisplayName?: string
  ): Observable<EventDTO> {
    return this.isCurrentUserOrganizer().pipe(
      catchError(() => of(false)),
      switchMap(isOrganizer => {
        if (isOrganizer) return of(true);

        const currentName = this.auth.user()?.name?.trim();
        const displayName = organizerDisplayName?.trim() || currentName || 'Organizer';
        return this.createOrganizerProfile({ displayName }).pipe(map(() => true));
      }),
      switchMap(() => this.http.post<EventDTO>(this.baseUrl, dto)),
      catchError(err => {
        // propagate for UI fallback handling
        return throwError(() => err);
      })
    );
  }
  
  updateEvent(id: string, event: Partial<CreateEventDTO>): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.baseUrl}/${id}`, event);
  }
  
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  publishEvent(id: string): Observable<EventDTO> {
    return this.http.post<EventDTO>(`${this.baseUrl}/${id}/publish`, {});
  }
  
  cancelEvent(id: string): Observable<EventDTO> {
    return this.http.post<EventDTO>(`${this.baseUrl}/${id}/cancel`, {});
  }
  
  getEventPrediction(eventId: string): Observable<PredictionDTO> {
    return this.http.get<PredictionDTO>(`${environment.apiUrl}/predictions/event/${eventId}`);
  }
}

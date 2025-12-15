import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventDTO, CreateEventDTO, EventFilters } from '../../domain/models/event.model';
import { PredictionDTO } from '../../domain/models/prediction.model';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;
  
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

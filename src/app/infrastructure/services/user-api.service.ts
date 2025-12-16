import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BackendRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';

export interface BackendRegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: BackendRole;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  registerUser(request: BackendRegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/auth/register`, request);
  }
}

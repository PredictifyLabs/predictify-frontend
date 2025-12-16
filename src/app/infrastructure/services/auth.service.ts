import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError, delay, switchMap, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { 
  UserDTO, 
  UserRole,
  UserStatus,
  AuthenticationRequest, 
  AuthenticationResponse, 
  RegisterRequest 
} from '../../domain/models/user.model';
import { findMockUser, generateMockToken, MOCK_USERS } from '../data/mock-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly TOKEN_KEY = 'predictify_access_token';
  private readonly REFRESH_TOKEN_KEY = 'predictify_refresh_token';
  private readonly USER_KEY = 'predictify_user';
  
  // Set to true to use mock data, false to use real backend
  private readonly USE_MOCK = false;
  
  private currentUser = signal<UserDTO | null>(null);
  
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser() && !!this.getAccessToken());
  
  constructor() {
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      }
    } catch {
      this.clearStorage();
    }
  }
  
  login(credentials: AuthenticationRequest): Observable<UserDTO> {
    console.log('📤 Login request:', credentials.email);
    
    // Use mock login in development mode
    if (this.USE_MOCK) {
      return this.mockLogin(credentials).pipe(
        map(() => this.currentUser()!)
      );
    }
    
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/auth/authenticate`,
      credentials
    ).pipe(
      tap(response => {
        console.log('✅ Login response:', response);
        this.storeTokens(response);
      }),
      switchMap(() => this.fetchCurrentUser())
    );
  }
  
  private storeTokens(response: AuthenticationResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    if (response.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    }
  }
  
  private mockLogin(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
    const mockUser = findMockUser(credentials.email, credentials.password);
    
    if (!mockUser) {
      return throwError(() => new Error('Credenciales inválidas'));
    }
    
    const response: AuthenticationResponse = {
      access_token: generateMockToken(mockUser.user),
      refresh_token: generateMockToken(mockUser.user) + '_refresh'
    };
    
    // Simulate network delay
    return of(response).pipe(
      delay(800),
      tap(res => this.handleMockAuthResponse(res, mockUser.user))
    );
  }
  
  private handleMockAuthResponse(response: AuthenticationResponse, user: UserDTO): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
  
  register(data: RegisterRequest): Observable<AuthenticationResponse> {
    console.log('📤 Register request:', JSON.stringify(data, null, 2));
    console.log('📤 URL:', `${environment.apiUrl}/auth/register`);
    
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/auth/register`,
      data
    ).pipe(
      tap(response => {
        console.log('✅ Register response:', response);
        this.handleAuthResponse(response);
      })
    );
  }
  
  refreshToken(): Observable<AuthenticationResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return of(null);
    
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }
  
  fetchCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${environment.apiUrl}/users/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
      })
    );
  }
  
  logout(): void {
    this.currentUser.set(null);
    this.clearStorage();
    this.router.navigate(['/']);
  }
  
  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  private handleAuthResponse(response: AuthenticationResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    if (response.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    }
    
    this.fetchCurrentUser().subscribe();
  }
  
  private clearStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Actualiza los datos del usuario actual (usado por admin)
   */
  updateCurrentUser(updates: Partial<UserDTO>): void {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      }
    }
  }

  /**
   * Actualiza un usuario específico por email (para sincronizar cambios de admin)
   */
  syncUserUpdate(email: string, updates: { role?: UserRole; status?: UserStatus }): void {
    const current = this.currentUser();
    if (current && current.email === email) {
      const updated: UserDTO = { 
        ...current, 
        role: updates.role ?? current.role,
        status: updates.status ?? current.status
      };
      this.currentUser.set(updated);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      }
      
      // Si el usuario fue baneado, redirigir a /banned
      if (updates.status === 'BANNED') {
        this.router.navigate(['/banned']);
      }
    }
  }

  /**
   * Verifica si el usuario actual está baneado
   */
  checkBannedStatus(): boolean {
    const user = this.currentUser();
    return user?.status === 'BANNED';
  }

  /**
   * Fuerza la recarga del usuario desde storage
   */
  reloadUser(): void {
    this.loadUserFromStorage();
    
    // Verificar si está baneado después de recargar
    if (this.checkBannedStatus()) {
      this.router.navigate(['/banned']);
    }
  }
}

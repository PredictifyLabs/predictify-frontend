import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Protege rutas que requieren autenticación
 * 
 * Si el usuario no está autenticado, redirige a /auth
 * 
 * Uso en rutas:
 *   { path: 'dashboard', canActivate: [authGuard], ... }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  const user = authService.user();
  
  console.log('[AuthGuard] Checking route:', state.url);
  console.log('[AuthGuard] isAuthenticated:', isAuth);
  console.log('[AuthGuard] user:', user);

  if (isAuth) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  
  console.log('[AuthGuard] Not authenticated, redirecting to /auth');
  
  // Redirect to login page
  router.navigate(['/auth'], { 
    queryParams: { returnUrl } 
  });
  
  return false;
};

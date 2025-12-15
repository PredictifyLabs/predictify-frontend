import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../domain/models/user.model';

/**
 * RoleGuard Factory - Protege rutas según el rol del usuario
 * 
 * Uso en rutas:
 *   { path: 'admin', canActivate: [roleGuard('ADMIN', 'ORGANIZER')], ... }
 */
export function roleGuard(...allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuth = authService.isAuthenticated();
    const user = authService.user();
    
    console.log('[RoleGuard] Checking route:', state.url);
    console.log('[RoleGuard] isAuthenticated:', isAuth);
    console.log('[RoleGuard] user:', user);
    console.log('[RoleGuard] allowedRoles:', allowedRoles);
    console.log('[RoleGuard] userRole:', user?.role);

    // First check if authenticated
    if (!isAuth) {
      console.log('[RoleGuard] Not authenticated, redirecting to /auth');
      router.navigate(['/auth'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    // Check user role
    if (user && allowedRoles.includes(user.role)) {
      console.log('[RoleGuard] Role allowed, granting access');
      return true;
    }

    // User doesn't have required role - redirect to forbidden
    console.log('[RoleGuard] Role not allowed, redirecting to /error/403');
    router.navigate(['/error/403']);
    return false;
  };
}

/**
 * Pre-configured guards for common use cases
 */
export const adminGuard: CanActivateFn = roleGuard('ADMIN', 'ORGANIZER');
export const organizerGuard: CanActivateFn = roleGuard('ORGANIZER', 'ADMIN');
export const attendeeGuard: CanActivateFn = roleGuard('ATTENDEE', 'ORGANIZER', 'ADMIN');

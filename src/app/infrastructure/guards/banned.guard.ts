import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que verifica si el usuario está baneado y lo redirige a /banned
 */
export const bannedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.user();
  
  if (user?.status === 'BANNED') {
    router.navigate(['/banned']);
    return false;
  }
  
  return true;
};

/**
 * Guard para la página /banned - solo permite acceso si está baneado
 */
export const onlyBannedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.user();
  
  // Si no está baneado, redirigir a eventos
  if (user?.status !== 'BANNED') {
    router.navigate(['/events']);
    return false;
  }
  
  return true;
};

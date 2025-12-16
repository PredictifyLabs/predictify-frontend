import { Routes } from '@angular/router';
import { authGuard, adminGuard, organizerGuard, bannedGuard, onlyBannedGuard } from './infrastructure/guards';

export const routes: Routes = [
    // Public routes
    { 
      path: '', 
      loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent),
      title: 'Predictify - Predicción IA de Eventos Tech'
    },
    { 
      path: 'events', 
      loadComponent: () => import('./components/events/events').then(m => m.Events),
      title: 'Eventos - Predictify'
    },
    { 
      path: 'events/:id', 
      loadComponent: () => import('./components/events/event-detail/event-detail.component').then(m => m.EventDetailComponent)
    },
    {
      path: 'category/:category',
      loadComponent: () => import('./components/events/category/category.component').then(m => m.CategoryComponent),
      title: 'Categoría - Predictify'
    },
    
    // Auth routes (public, but redirect if already logged in)
    { 
      path: 'auth', 
      loadComponent: () => import('./components/auth/auth-container/auth-container.component').then(m => m.AuthContainerComponent),
      title: 'Iniciar Sesión - Predictify'
    },
    { path: 'auth/login', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth/register', redirectTo: 'auth', pathMatch: 'full' },
    
    // Protected routes - require authentication
    { 
      path: 'dashboard', 
      loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
      title: 'Dashboard - Predictify',
      canActivate: [authGuard, bannedGuard]
    },
    { 
      path: 'profile', 
      loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
      title: 'Mi Perfil - Predictify',
      canActivate: [authGuard, bannedGuard]
    },
    {
      path: 'my-events',
      loadComponent: () => import('./components/my-events/my-events.component').then(m => m.MyEventsComponent),
      title: 'Mis Eventos - Predictify',
      canActivate: [authGuard, bannedGuard]
    },
    {
      path: 'discover',
      loadComponent: () => import('./components/discover/discover.component').then(m => m.DiscoverComponent),
      title: 'Descubrir - Predictify',
      canActivate: [authGuard, bannedGuard]
    },
    {
      path: 'organizer',
      loadComponent: () => import('./components/organizer/organizer-dashboard/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent),
      title: 'Dashboard Organizador - Predictify',
      canActivate: [organizerGuard, bannedGuard]
    },
    {
      path: 'organizer/event/:id/attendees',
      loadComponent: () => import('./components/organizer/event-attendees/event-attendees.component').then(m => m.EventAttendeesComponent),
      title: 'Gestión de Asistentes - Predictify',
      canActivate: [organizerGuard, bannedGuard]
    },
    
    // Admin routes - require ADMIN or ORGANIZER role
    { 
      path: 'admin', 
      loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
      title: 'Admin - Predictify',
      canActivate: [adminGuard]
    },
    
    // Banned page (only for banned users)
    {
      path: 'banned',
      loadComponent: () => import('./components/banned/banned.component').then(m => m.BannedComponent),
      title: 'Cuenta Suspendida - Predictify',
      canActivate: [onlyBannedGuard]
    },
    
    // Error pages (public)
    { 
      path: 'error/404', 
      loadComponent: () => import('./ui/pages/error/not-found/not-found.component').then(m => m.NotFoundComponent),
      title: 'Página no encontrada - Predictify'
    },
    { 
      path: 'error/500', 
      loadComponent: () => import('./ui/pages/error/server-error/server-error.component').then(m => m.ServerErrorComponent),
      title: 'Error del servidor - Predictify'
    },
    { 
      path: 'error/403', 
      loadComponent: () => import('./ui/pages/error/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      title: 'Acceso denegado - Predictify'
    },
    
    // Wildcard - 404
    { 
      path: '**', 
      loadComponent: () => import('./ui/pages/error/not-found/not-found.component').then(m => m.NotFoundComponent),
      title: 'Página no encontrada - Predictify'
    }
];

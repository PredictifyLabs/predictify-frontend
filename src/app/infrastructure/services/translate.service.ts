import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'es';

interface Translations {
  [key: string]: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.events': 'Events',
    'nav.discover': 'Discover',
    'nav.myEvents': 'My Events',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Administration',
    'nav.organizer': 'Manage Events',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    'nav.logout': 'Sign Out',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.noResults': 'No results found',
    'common.viewDetails': 'View Details',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.all': 'All',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.termsAgree': 'I agree to the terms and conditions',
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.headline1': 'Intelligent prediction',
    'auth.headline2': 'for',
    'auth.headline3': 'tech events',
    'auth.tagline': 'Access and manage your events with a modern and secure experience.',
    'auth.enterCredentials': 'Enter your credentials to access',
    'auth.rememberMe': 'Keep me signed in',
    'auth.registerSubtitle': 'Register in seconds and start discovering events',
    'auth.wantOrganizer': 'I want to create events (Organizer)',
    'auth.backToLogin': 'Back to sign in',
    
    // Events
    'events.title': 'Events',
    'events.upcoming': 'Upcoming Events',
    'events.featured': 'Featured',
    'events.trending': 'Trending',
    'events.capacity': 'Capacity',
    'events.registered': 'Registered',
    'events.date': 'Date',
    'events.location': 'Location',
    'events.category': 'Category',
    'events.organizer': 'Organizer',
    'events.register': 'Register',
    'events.unregister': 'Cancel Registration',
    'events.share': 'Share',
    'events.favorite': 'Add to Favorites',
    'events.noEvents': 'No events available',
    'events.exploreEvents': 'Explore Events',
    
    // Categories
    'category.conference': 'Conference',
    'category.workshop': 'Workshop',
    'category.meetup': 'Meetup',
    'category.hackathon': 'Hackathon',
    'category.webinar': 'Webinar',
    'category.networking': 'Networking',
    
    // My Events
    'myEvents.title': 'My Events',
    'myEvents.subtitle': 'Manage your registrations, history and favorites',
    'myEvents.inscribed': 'Registered',
    'myEvents.history': 'History',
    'myEvents.favorites': 'Favorites',
    'myEvents.noInscribed': 'No registered events',
    'myEvents.noHistory': 'No events in history',
    'myEvents.noFavorites': 'No favorite events',
    
    // Discover
    'discover.title': 'Discover',
    'discover.subtitle': 'Find users, organizers and connect with the community',
    'discover.users': 'Users',
    'discover.organizers': 'Organizers',
    'discover.follow': 'Follow',
    'discover.message': 'Message',
    'discover.recentEvents': 'Recent Events',
    
    // Organizer Dashboard
    'organizer.title': 'Organizer Dashboard',
    'organizer.subtitle': 'Manage your events and registration requests',
    'organizer.createEvent': 'Create Event',
    'organizer.myEvents': 'My Events',
    'organizer.requests': 'Requests',
    'organizer.published': 'Published',
    'organizer.totalRegistered': 'Total Registered',
    'organizer.pendingApproval': 'Pending Approval',
    'organizer.requiresApproval': 'Requires Approval',
    'organizer.viewAttendees': 'View Attendees',
    'organizer.noEvents': "You don't have any events",
    'organizer.createFirst': 'Create your first event to get started',
    'organizer.noPending': 'No pending requests',
    'organizer.noPendingDesc': 'No registration requests to approve',
    'organizer.approve': 'Approve',
    'organizer.reject': 'Reject',
    'organizer.requestsFor': 'Requests registration for:',
    
    // Event Form
    'eventForm.title': 'Event Title',
    'eventForm.description': 'Description',
    'eventForm.category': 'Category',
    'eventForm.capacity': 'Capacity',
    'eventForm.date': 'Date',
    'eventForm.time': 'Time',
    'eventForm.location': 'Location',
    'eventForm.imageUrl': 'Image URL',
    'eventForm.requiresApproval': 'Requires Approval?',
    'eventForm.requiresApprovalDesc': 'Attendees must be approved before confirming registration',
    'eventForm.createEvent': 'Create Event',
    'eventForm.editEvent': 'Edit Event',
    'eventForm.saveChanges': 'Save Changes',
    
    // Status
    'status.draft': 'Draft',
    'status.published': 'Published',
    'status.cancelled': 'Cancelled',
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.active': 'Active',
    'status.banned': 'Banned',
    'status.blocked': 'Blocked',
    
    // Roles
    'role.admin': 'Administrator',
    'role.organizer': 'Organizer',
    'role.attendee': 'Attendee',
    
    // Admin
    'admin.title': 'Administration',
    'admin.users': 'Users',
    'admin.events': 'Events',
    'admin.stats': 'Statistics',
    'admin.predictions': 'AI Predictions',
    'admin.manageUsers': 'Manage Users',
    'admin.manageEvents': 'Manage Events',
    'admin.newUser': 'New User',
    'admin.changePassword': 'Change Password',
    'admin.ban': 'Ban',
    'admin.unban': 'Unban',
    
    // Banned
    'banned.title': 'Account Suspended',
    'banned.message': 'Your account has been suspended',
    'banned.reason': 'This may be due to:',
    'banned.reason1': 'Violation of terms of service',
    'banned.reason2': 'Suspicious activity',
    'banned.reason3': 'Reported by other users',
    'banned.contact': 'If you believe this is an error, please contact support:',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.events': 'Eventos',
    'nav.discover': 'Descubrir',
    'nav.myEvents': 'Mis Eventos',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Administración',
    'nav.organizer': 'Gestionar Eventos',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.loading': 'Cargando...',
    'common.noResults': 'No se encontraron resultados',
    'common.viewDetails': 'Ver Detalles',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.all': 'Todos',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Auth
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.name': 'Nombre Completo',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.termsAgree': 'Acepto los términos y condiciones',
    'auth.welcomeBack': 'Bienvenido de Nuevo',
    'auth.createAccount': 'Crear Cuenta',
    'auth.headline1': 'Predicción inteligente',
    'auth.headline2': 'para',
    'auth.headline3': 'eventos tech',
    'auth.tagline': 'Accede y gestiona tus eventos con una experiencia moderna y segura.',
    'auth.enterCredentials': 'Ingresa tus credenciales para acceder',
    'auth.rememberMe': 'Mantener sesión iniciada',
    'auth.registerSubtitle': 'Regístrate en segundos y empieza a descubrir eventos',
    'auth.wantOrganizer': 'Quiero crear eventos (Organizador)',
    'auth.backToLogin': 'Volver a iniciar sesión',
    
    // Events
    'events.title': 'Eventos',
    'events.upcoming': 'Próximos Eventos',
    'events.featured': 'Destacados',
    'events.trending': 'Tendencias',
    'events.capacity': 'Capacidad',
    'events.registered': 'Inscritos',
    'events.date': 'Fecha',
    'events.location': 'Ubicación',
    'events.category': 'Categoría',
    'events.organizer': 'Organizador',
    'events.register': 'Inscribirse',
    'events.unregister': 'Cancelar Inscripción',
    'events.share': 'Compartir',
    'events.favorite': 'Agregar a Favoritos',
    'events.noEvents': 'No hay eventos disponibles',
    'events.exploreEvents': 'Explorar Eventos',
    
    // Categories
    'category.conference': 'Conferencia',
    'category.workshop': 'Taller',
    'category.meetup': 'Meetup',
    'category.hackathon': 'Hackathon',
    'category.webinar': 'Webinar',
    'category.networking': 'Networking',
    
    // My Events
    'myEvents.title': 'Mis Eventos',
    'myEvents.subtitle': 'Gestiona tus inscripciones, historial y favoritos',
    'myEvents.inscribed': 'Inscritos',
    'myEvents.history': 'Historial',
    'myEvents.favorites': 'Favoritos',
    'myEvents.noInscribed': 'No tienes eventos inscritos',
    'myEvents.noHistory': 'No tienes eventos en tu historial',
    'myEvents.noFavorites': 'No tienes eventos favoritos',
    
    // Discover
    'discover.title': 'Descubrir',
    'discover.subtitle': 'Encuentra usuarios, organizadores y conecta con la comunidad',
    'discover.users': 'Usuarios',
    'discover.organizers': 'Organizadores',
    'discover.follow': 'Seguir',
    'discover.message': 'Mensaje',
    'discover.recentEvents': 'Eventos Recientes',
    
    // Organizer Dashboard
    'organizer.title': 'Dashboard Organizador',
    'organizer.subtitle': 'Gestiona tus eventos y solicitudes de inscripción',
    'organizer.createEvent': 'Crear Evento',
    'organizer.myEvents': 'Mis Eventos',
    'organizer.requests': 'Solicitudes',
    'organizer.published': 'Publicados',
    'organizer.totalRegistered': 'Total Inscritos',
    'organizer.pendingApproval': 'Pendientes de Aprobación',
    'organizer.requiresApproval': 'Requiere Aprobación',
    'organizer.viewAttendees': 'Ver Inscritos',
    'organizer.noEvents': 'No tienes eventos',
    'organizer.createFirst': 'Crea tu primer evento para empezar',
    'organizer.noPending': 'Sin solicitudes pendientes',
    'organizer.noPendingDesc': 'No hay solicitudes de inscripción por aprobar',
    'organizer.approve': 'Aprobar',
    'organizer.reject': 'Rechazar',
    'organizer.requestsFor': 'Solicita inscripción a:',
    
    // Event Form
    'eventForm.title': 'Título del Evento',
    'eventForm.description': 'Descripción',
    'eventForm.category': 'Categoría',
    'eventForm.capacity': 'Capacidad',
    'eventForm.date': 'Fecha',
    'eventForm.time': 'Hora',
    'eventForm.location': 'Ubicación',
    'eventForm.imageUrl': 'URL de Imagen',
    'eventForm.requiresApproval': '¿Requiere Aprobación?',
    'eventForm.requiresApprovalDesc': 'Los asistentes deberán ser aprobados antes de confirmar su inscripción',
    'eventForm.createEvent': 'Crear Evento',
    'eventForm.editEvent': 'Editar Evento',
    'eventForm.saveChanges': 'Guardar Cambios',
    
    // Status
    'status.draft': 'Borrador',
    'status.published': 'Publicado',
    'status.cancelled': 'Cancelado',
    'status.pending': 'Pendiente',
    'status.approved': 'Aprobado',
    'status.rejected': 'Rechazado',
    'status.active': 'Activo',
    'status.banned': 'Baneado',
    'status.blocked': 'Bloqueado',
    
    // Roles
    'role.admin': 'Administrador',
    'role.organizer': 'Organizador',
    'role.attendee': 'Asistente',
    
    // Admin
    'admin.title': 'Administración',
    'admin.users': 'Usuarios',
    'admin.events': 'Eventos',
    'admin.stats': 'Estadísticas',
    'admin.predictions': 'Predicciones IA',
    'admin.manageUsers': 'Gestionar Usuarios',
    'admin.manageEvents': 'Gestionar Eventos',
    'admin.newUser': 'Nuevo Usuario',
    'admin.changePassword': 'Cambiar Contraseña',
    'admin.ban': 'Banear',
    'admin.unban': 'Desbanear',
    
    // Banned
    'banned.title': 'Cuenta Suspendida',
    'banned.message': 'Tu cuenta ha sido suspendida',
    'banned.reason': 'Esto puede deberse a:',
    'banned.reason1': 'Violación de los términos de servicio',
    'banned.reason2': 'Actividad sospechosa',
    'banned.reason3': 'Reportado por otros usuarios',
    'banned.contact': 'Si crees que esto es un error, contacta a soporte:',
    
    // Footer
    'footer.rights': 'Todos los derechos reservados',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly LANG_KEY = 'predictify_language';
  
  private readonly _currentLang = signal<Language>('en');
  
  readonly currentLang = this._currentLang.asReadonly();
  
  readonly isEnglish = computed(() => this._currentLang() === 'en');
  readonly isSpanish = computed(() => this._currentLang() === 'es');
  
  constructor() {
    this.loadSavedLanguage();
  }
  
  private loadSavedLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const saved = localStorage.getItem(this.LANG_KEY) as Language;
    if (saved && (saved === 'en' || saved === 'es')) {
      this._currentLang.set(saved);
    }
  }
  
  setLanguage(lang: Language): void {
    this._currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
    }
  }
  
  toggleLanguage(): void {
    const newLang = this._currentLang() === 'en' ? 'es' : 'en';
    console.log('[TranslateService] Toggling from', this._currentLang(), 'to', newLang);
    this.setLanguage(newLang);
  }
  
  t(key: string): string {
    const lang = this._currentLang();
    const translation = TRANSLATIONS[lang][key];
    if (!translation) {
      console.warn('[TranslateService] Missing translation for key:', key, 'in lang:', lang);
    }
    return translation || key;
  }
  
  get(key: string): string {
    return this.t(key);
  }

  /**
   * Force clear saved language and reset to default
   */
  resetToDefault(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.LANG_KEY);
    }
    this._currentLang.set('en');
  }
}

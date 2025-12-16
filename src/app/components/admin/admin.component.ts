import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SafePipe } from '../../ui/pipes/safe.pipe';
import { AuthService } from '../../infrastructure/services/auth.service';
import { AlertService } from '../../infrastructure/services/alert.service';
import { UserApiService } from '../../infrastructure/services/user-api.service';
import { EventApiService, CreateEventDTOBackend } from '../../infrastructure/services/event-api.service';
import { EventService } from '../../infrastructure/services/event.service';
import { switchMap, of } from 'rxjs';

type AdminSection = 'dashboard' | 'users' | 'events';
type AdminUserStatus = 'ACTIVE' | 'BLOCKED' | 'BANNED';
type AdminUserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
type AdminEventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  password: string;
  createdAt: string;
}

interface AdminEvent {
  id: string;
  title: string;
  organizerName: string;
  description?: string;
  category?: string;
  type?: string;
  startDate: string;
  startTime?: string;
  status: AdminEventStatus;
  capacity: number;
  registered?: number;
  prediction?: number;
  address?: string;
  city?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  requiresApproval?: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, SafePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentSection: AdminSection = 'dashboard';
  
  private readonly ADMIN_USERS_KEY = 'predictify_admin_users';
  private readonly ADMIN_EVENTS_KEY = 'predictify_admin_events';

  // Stats
  stats = {
    totalEvents: 0,
    totalUsers: 0,
    totalOrganizers: 0
  };

  // Chart Data
  chartData = {
    usersActivity: [
      { label: 'Lun', value: 65 },
      { label: 'Mar', value: 78 },
      { label: 'Mié', value: 85 },
      { label: 'Jue', value: 72 },
      { label: 'Vie', value: 90 },
      { label: 'Sáb', value: 45 },
      { label: 'Dom', value: 38 }
    ],
    eventsByCategory: [
      { label: 'Conferencias', count: 12, percentage: 30, color: '#7C3AED' },
      { label: 'Workshops', count: 8, percentage: 20, color: '#10B981' },
      { label: 'Hackathons', count: 5, percentage: 12.5, color: '#F59E0B' },
      { label: 'Meetups', count: 10, percentage: 25, color: '#3B82F6' },
      { label: 'Otros', count: 5, percentage: 12.5, color: '#6B7280' }
    ],
    registrationsTrend: [
      { label: 'Ene', value: 45 },
      { label: 'Feb', value: 52 },
      { label: 'Mar', value: 68 },
      { label: 'Abr', value: 75 },
      { label: 'May', value: 82 },
      { label: 'Jun', value: 90 },
      { label: 'Jul', value: 78 },
      { label: 'Ago', value: 85 },
      { label: 'Sep', value: 92 },
      { label: 'Oct', value: 88 },
      { label: 'Nov', value: 95 },
      { label: 'Dic', value: 100 }
    ]
  };

  getDonutOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.chartData.eventsByCategory[i].percentage;
    }
    return offset;
  }

  // Data
  users: AdminUser[] = [];
  events: AdminEvent[] = [];

  // Filters
  userSearch = '';
  userRoleFilter = '';
  userStatusFilter = '';
  eventSearch = '';
  eventStatusFilter = '';

  // Modals
  isCreateUserModalOpen = false;
  isCreateEventModalOpen = false;
  isPasswordModalOpen = false;
  editingUser: AdminUser | null = null;
  editingEvent: AdminEvent | null = null;
  passwordChangeUser: AdminUser | null = null;
  newPassword = '';
  confirmPassword = '';

  // Forms
  createUserForm = {
    name: '',
    email: '',
    role: 'ATTENDEE' as AdminUserRole,
    password: ''
  };

  createEventForm = {
    title: '',
    description: '',
    category: 'CONFERENCE',
    type: 'PRESENCIAL',
    organizerName: '',
    startDate: '',
    startTime: '09:00',
    status: 'DRAFT' as AdminEventStatus,
    capacity: 100,
    address: '',
    city: '',
    venue: '',
    latitude: 4.6097,
    longitude: -74.0817,
    requiresApproval: false
  };
  
  // Map state
  showMapPicker = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private userApi: UserApiService,
    private eventApi: EventApiService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEvents();
    this.updateStats();
  }

  // ==================== NAVIGATION ====================
  
  get isAdmin(): boolean {
    return this.authService.user()?.role === 'ADMIN';
  }

  setSection(section: AdminSection) {
    this.currentSection = section;
  }

  logout() {
    this.authService.logout();
  }

  getHeaderTitle(): string {
    switch (this.currentSection) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'Gestión de Usuarios';
      case 'events': return 'Gestión de Eventos';
      default: return 'Dashboard';
    }
  }

  // ==================== STATS ====================

  private updateStats(): void {
    this.stats.totalUsers = this.users.length;
    this.stats.totalEvents = this.events.length;
    this.stats.totalOrganizers = this.users.filter(u => u.role === 'ORGANIZER').length;
  }

  get topEventsByPrediction(): AdminEvent[] {
    return [...this.events]
      .filter(e => e.prediction !== undefined)
      .sort((a, b) => (b.prediction || 0) - (a.prediction || 0))
      .slice(0, 5);
  }

  // ==================== USERS ====================

  get organizers(): AdminUser[] {
    return this.users.filter(u => u.role === 'ORGANIZER');
  }

  get filteredUsers(): AdminUser[] {
    return this.users.filter(u => {
      const matchSearch = !this.userSearch || 
        u.name.toLowerCase().includes(this.userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(this.userSearch.toLowerCase());
      const matchRole = !this.userRoleFilter || u.role === this.userRoleFilter;
      const matchStatus = !this.userStatusFilter || u.status === this.userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }

  private loadUsers(): void {
    try {
      const raw = localStorage.getItem(this.ADMIN_USERS_KEY);
      if (raw) {
        this.users = JSON.parse(raw) as AdminUser[];
      }
    } catch {
      localStorage.removeItem(this.ADMIN_USERS_KEY);
    }

    if (this.users.length === 0) {
      const now = new Date().toISOString();
      this.users = [
        { id: 'usr_1', name: 'Carlos García', email: 'carlos@email.com', role: 'ATTENDEE', status: 'ACTIVE', password: 'pass123', createdAt: now },
        { id: 'usr_2', name: 'María López', email: 'maria@email.com', role: 'ORGANIZER', status: 'ACTIVE', password: 'pass123', createdAt: now },
        { id: 'usr_3', name: 'Juan Pérez', email: 'juan@email.com', role: 'ATTENDEE', status: 'ACTIVE', password: 'pass123', createdAt: now }
      ];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem(this.ADMIN_USERS_KEY, JSON.stringify(this.users));
    this.updateStats();
  }

  openCreateUserModal(): void {
    this.editingUser = null;
    this.createUserForm = { name: '', email: '', role: 'ATTENDEE', password: '' };
    this.isCreateUserModalOpen = true;
  }

  openEditUserModal(user: AdminUser): void {
    this.editingUser = user;
    this.createUserForm = { name: user.name, email: user.email, role: user.role, password: '' };
    this.isCreateUserModalOpen = true;
  }

  closeCreateUserModal(): void {
    this.isCreateUserModalOpen = false;
    this.editingUser = null;
  }

  saveUser(): void {
    const { name, email, role, password } = this.createUserForm;
    if (!name.trim() || !email.trim()) {
      this.alertService.error('Error', 'Nombre y email son requeridos');
      return;
    }

    if (this.editingUser) {
      // Update existing user
      const oldEmail = this.editingUser.email;
      this.users = this.users.map(u => 
        u.id === this.editingUser!.id ? { ...u, name: name.trim(), email: email.trim(), role } : u
      );
      this.saveUsers();
      
      // Sincronizar cambio de rol con el sistema de autenticación
      this.authService.syncUserUpdate(oldEmail, { role: role as any });
      
      this.closeCreateUserModal();
      this.alertService.toastSuccess('Usuario actualizado');
    } else {
      // Create new user
      if (!password.trim()) {
        this.alertService.error('Error', 'La contraseña es requerida');
        return;
      }
      
      this.userApi.registerUser({ name: name.trim(), email: email.trim(), password: password.trim(), role }).subscribe({
        next: () => {
          const newUser: AdminUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            role,
            status: 'ACTIVE',
            password: password.trim(),
            createdAt: new Date().toISOString()
          };
          this.users = [newUser, ...this.users];
          this.saveUsers();
          this.closeCreateUserModal();
          this.alertService.toastSuccess('Usuario creado exitosamente');
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo crear el usuario');
        }
      });
    }
  }

  toggleBanUserDirect(user: AdminUser): void {
    const newStatus: AdminUserStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
    this.users = this.users.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
    this.saveUsers();
    
    // Sincronizar con el sistema de autenticación
    this.authService.syncUserUpdate(user.email, { status: newStatus });
    
    this.alertService.toastSuccess(newStatus === 'BANNED' ? 'Usuario baneado' : 'Usuario desbaneado');
  }

  // ==================== PASSWORD CHANGE ====================

  openChangePasswordModal(user: AdminUser): void {
    this.passwordChangeUser = user;
    this.newPassword = '';
    this.confirmPassword = '';
    this.isPasswordModalOpen = true;
  }

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
    this.passwordChangeUser = null;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  savePassword(): void {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.alertService.error('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (this.newPassword.length < 6) {
      this.alertService.error('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.passwordChangeUser) {
      this.users = this.users.map(u => 
        u.id === this.passwordChangeUser!.id ? { ...u, password: this.newPassword } : u
      );
      this.saveUsers();
      this.closePasswordModal();
      this.alertService.toastSuccess('Contraseña actualizada exitosamente');
    }
  }

  deleteUserDirect(user: AdminUser): void {
    this.alertService.deleteConfirm(user.name, 'usuario').then(result => {
      if (result.isConfirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.saveUsers();
        this.alertService.toastSuccess('Usuario eliminado');
      }
    });
  }

  // ==================== EVENTS ====================

  get filteredEvents(): AdminEvent[] {
    return this.events.filter(e => {
      const matchSearch = !this.eventSearch || 
        e.title.toLowerCase().includes(this.eventSearch.toLowerCase()) ||
        e.organizerName.toLowerCase().includes(this.eventSearch.toLowerCase());
      const matchStatus = !this.eventStatusFilter || e.status === this.eventStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  private loadEvents(): void {
    try {
      const raw = localStorage.getItem(this.ADMIN_EVENTS_KEY);
      if (raw) {
        this.events = JSON.parse(raw) as AdminEvent[];
      }
    } catch {
      localStorage.removeItem(this.ADMIN_EVENTS_KEY);
    }

    if (this.events.length === 0) {
      const now = new Date();
      this.events = [
        { id: 'evt_1', title: 'Tech Summit 2025', organizerName: 'María López', category: 'CONFERENCE', type: 'PRESENCIAL', startDate: '2025-01-15', status: 'PUBLISHED', capacity: 500, registered: 423, prediction: 92, createdAt: now.toISOString() },
        { id: 'evt_2', title: 'Angular Masterclass', organizerName: 'Carlos García', category: 'WORKSHOP', type: 'VIRTUAL', startDate: '2025-01-20', status: 'PUBLISHED', capacity: 100, registered: 87, prediction: 95, createdAt: now.toISOString() },
        { id: 'evt_3', title: 'Hackathon AI 2025', organizerName: 'TechLab', category: 'HACKATHON', type: 'HIBRIDO', startDate: '2025-02-01', status: 'PUBLISHED', capacity: 200, registered: 156, prediction: 78, createdAt: now.toISOString() },
        { id: 'evt_4', title: 'Startup Networking Night', organizerName: 'StartupHub', category: 'NETWORKING', type: 'PRESENCIAL', startDate: '2025-02-10', status: 'PUBLISHED', capacity: 150, registered: 98, prediction: 65, createdAt: now.toISOString() },
        { id: 'evt_5', title: 'React vs Vue Debate', organizerName: 'DevCommunity', category: 'MEETUP', type: 'VIRTUAL', startDate: '2025-02-15', status: 'PUBLISHED', capacity: 300, registered: 245, prediction: 88, createdAt: now.toISOString() },
        { id: 'evt_6', title: 'Full Stack Bootcamp', organizerName: 'CodeAcademy', category: 'BOOTCAMP', type: 'PRESENCIAL', startDate: '2025-03-01', status: 'DRAFT', capacity: 50, registered: 12, prediction: 45, createdAt: now.toISOString() },
        { id: 'evt_7', title: 'Cloud Architecture Webinar', organizerName: 'AWS Partners', category: 'WEBINAR', type: 'VIRTUAL', startDate: '2025-02-20', status: 'PUBLISHED', capacity: 1000, registered: 756, prediction: 82, createdAt: now.toISOString() },
        { id: 'evt_8', title: 'UX Design Conference', organizerName: 'DesignLab', category: 'CONFERENCE', type: 'HIBRIDO', startDate: '2025-03-15', status: 'PUBLISHED', capacity: 400, registered: 312, prediction: 71, createdAt: now.toISOString() },
        { id: 'evt_9', title: 'Python Data Science Workshop', organizerName: 'DataScientists', category: 'WORKSHOP', type: 'VIRTUAL', startDate: '2025-02-25', status: 'PUBLISHED', capacity: 80, registered: 78, prediction: 98, createdAt: now.toISOString() },
        { id: 'evt_10', title: 'Blockchain Meetup', organizerName: 'CryptoDevs', category: 'MEETUP', type: 'PRESENCIAL', startDate: '2025-03-05', status: 'CANCELLED', capacity: 120, registered: 34, prediction: 28, createdAt: now.toISOString() }
      ];
      this.saveEvents();
    }
  }

  private saveEvents(): void {
    localStorage.setItem(this.ADMIN_EVENTS_KEY, JSON.stringify(this.events));
    this.updateStats();
    // Refresh public events list
    this.eventService.refreshEvents();
  }

  openCreateEventModal(): void {
    this.editingEvent = null;
    this.createEventForm = {
      title: '', description: '', category: 'CONFERENCE', type: 'PRESENCIAL',
      organizerName: '', startDate: '', startTime: '09:00', status: 'DRAFT', capacity: 100,
      address: '', city: '', venue: '', latitude: 4.6097, longitude: -74.0817, requiresApproval: false
    };
    this.showMapPicker = false;
    this.isCreateEventModalOpen = true;
  }
  
  toggleMapPicker(): void {
    this.showMapPicker = !this.showMapPicker;
  }
  
  onMapClick(lat: number, lng: number): void {
    this.createEventForm.latitude = lat;
    this.createEventForm.longitude = lng;
  }

  openEditEventModal(event: AdminEvent): void {
    this.editingEvent = event;
    this.createEventForm = {
      title: event.title,
      description: event.description || '',
      category: event.category || 'CONFERENCE',
      type: event.type || 'PRESENCIAL',
      organizerName: event.organizerName,
      startDate: event.startDate,
      startTime: event.startTime || '09:00',
      status: event.status,
      capacity: event.capacity,
      address: event.address || '',
      city: event.city || '',
      venue: event.venue || '',
      latitude: event.latitude || 4.6097,
      longitude: event.longitude || -74.0817,
      requiresApproval: event.requiresApproval || false
    };
    this.showMapPicker = false;
    this.isCreateEventModalOpen = true;
  }

  closeCreateEventModal(): void {
    this.isCreateEventModalOpen = false;
    this.editingEvent = null;
  }

  saveEvent(): void {
    const { title, description, category, type, organizerName, startDate, startTime, status, capacity } = this.createEventForm;
    
    if (!title.trim() || !startDate || !capacity) {
      this.alertService.error('Error', 'Título, fecha y capacidad son requeridos');
      return;
    }

    if (this.editingEvent) {
      // Update existing event
      this.events = this.events.map(e => 
        e.id === this.editingEvent!.id ? {
          ...e,
          title: title.trim(),
          description: description.trim(),
          category,
          type,
          organizerName: organizerName.trim(),
          startDate,
          startTime,
          status,
          capacity: Number(capacity)
        } : e
      );
      this.saveEvents();
      this.closeCreateEventModal();
      this.alertService.toastSuccess('Evento actualizado');
    } else {
      // Create new event via API
      const payload: CreateEventDTOBackend = {
        title: title.trim(),
        description: description.trim(),
        category,
        type,
        startDate,
        startTime,
        capacity: Number(capacity),
        isFree: true,
        currency: 'USD',
        location: null
      };

      this.eventApi.createEventEnsuringOrganizer(payload, organizerName || undefined).pipe(
        switchMap(created => status === 'PUBLISHED' ? this.eventApi.publishEvent(created.id as string) : of(created))
      ).subscribe({
        next: (created) => {
          const newEvent: AdminEvent = {
            id: created.id || `evt_${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            category,
            type,
            organizerName: created.organizer?.displayName || organizerName || 'Sin asignar',
            startDate,
            startTime,
            status: (created.status as AdminEventStatus) || status,
            capacity: Number(capacity),
            createdAt: new Date().toISOString()
          };
          this.events = [newEvent, ...this.events];
          this.saveEvents();
          this.closeCreateEventModal();
          this.alertService.toastSuccess('Evento creado exitosamente');
        },
        error: (err) => {
          this.alertService.error('Error', err.error?.message || 'No se pudo crear el evento');
        }
      });
    }
  }

  deleteEvent(event: AdminEvent): void {
    this.alertService.deleteConfirm(event.title, 'evento').then(result => {
      if (result.isConfirmed) {
        this.events = this.events.filter(e => e.id !== event.id);
        this.saveEvents();
        this.alertService.toastSuccess('Evento eliminado');
      }
    });
  }
}

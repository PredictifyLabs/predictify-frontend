import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AuthService } from '../../infrastructure/services/auth.service';
import { UserApiService } from '../../infrastructure/services/user-api.service';
import { EventApiService, CreateEventDTOBackend } from '../../infrastructure/services/event-api.service';
import { switchMap } from 'rxjs';

type AdminSection = 'dashboard' | 'users' | 'events' | 'settings' | 'ai-reports';

interface SidebarItem {
  icon: string;
  label: string;
  route: AdminSection;
}

interface AdminStats {
  totalEvents: number;
  totalUsers: number;
  totalOrganizers: number;
  totalRevenue: number;
  eventsGrowth: number;
  usersGrowth: number;
  organizersGrowth: number;
  revenueGrowth: number;
}

interface Alert {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  count?: number;
}

interface AdminSettings {
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  defaultTimezone: string;
  aiAutoRetrain: boolean;
}

interface AiReport {
  id: string;
  createdAt: string;
  modelVersion: string;
  globalAccuracy: number;
  predictionsToday: number;
  notes: string;
}

type AdminUserStatus = 'ACTIVE' | 'BLOCKED' | 'BANNED';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminSectionUserRole;
  status: AdminUserStatus;
  password: string;
  createdAt: string;
}

type AdminSectionUserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';

type AdminEventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

interface AdminEvent {
  id: string;
  title: string;
  organizerName: string;
  startDate: string;
  status: AdminEventStatus;
  capacity: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzBadgeModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentSection: AdminSection = 'dashboard';
  readonly allowedSections: AdminSection[] = ['dashboard', 'users', 'events', 'settings', 'ai-reports'];
  private readonly SETTINGS_KEY = 'predictify_admin_settings';
  private readonly ADMIN_USERS_KEY = 'predictify_admin_users';
  private readonly ADMIN_EVENTS_KEY = 'predictify_admin_events';

  stats: AdminStats = {
    totalEvents: 1247,
    totalUsers: 45892,
    totalOrganizers: 892,
    totalRevenue: 127845,
    eventsGrowth: 12,
    usersGrowth: 8,
    organizersGrowth: 15,
    revenueGrowth: 23
  };

  alerts: Alert[] = [
    { type: 'error', message: 'eventos reportados por usuarios', count: 3 },
    { type: 'warning', message: 'organizadores pendientes de validar', count: 5 },
    { type: 'success', message: 'Sistema IA funcionando óptimamente' },
    { type: 'info', message: 'Mantenimiento programado: 2 días' }
  ];

  recentActivity = [
    { icon: 'plus-circle', text: 'Nuevo evento: Tech Summit 2025', time: 'Hace 5 min', color: '#10B981' },
    { icon: 'user-add', text: 'Nuevo usuario registrado', time: 'Hace 12 min', color: '#3B82F6' },
    { icon: 'check-circle', text: 'Pago procesado: $299', time: 'Hace 25 min', color: '#10B981' },
    { icon: 'warning', text: 'Reporte recibido', time: 'Hace 1 hora', color: '#F59E0B' },
    { icon: 'robot', text: 'Modelo IA reentrenado', time: 'Hace 2 horas', color: '#7C3AED' }
  ];

  sidebarItems: SidebarItem[] = [
    { icon: 'dashboard', label: 'Dashboard General', route: 'dashboard' },
    { icon: 'calendar', label: 'Control de Eventos', route: 'events' },
    { icon: 'team', label: 'Control de Usuarios', route: 'users' },
    { icon: 'setting', label: 'Configuración', route: 'settings' },
    { icon: 'robot', label: 'Reportes de IA', route: 'ai-reports' }
  ];

  settings: AdminSettings = {
    maintenanceMode: false,
    notificationsEnabled: true,
    defaultTimezone: 'America/Bogota',
    aiAutoRetrain: false
  };

  reports: AiReport[] = [];

  users: AdminUser[] = [];
  events: AdminEvent[] = [];

  userSearch = '';
  eventSearch = '';

  isCreateUserModalOpen = false;
  isUserActionsModalOpen = false;
  isCreateEventModalOpen = false;
  isChangePasswordModalOpen = false;

  selectedUser: AdminUser | null = null;
  lastGeneratedPassword = '';

  createUserForm = {
    name: '',
    email: '',
    role: 'ATTENDEE' as AdminSectionUserRole,
    password: ''
  };

  createEventForm = {
    title: '',
    description: '',
    category: 'MEETUP' as string,
    type: 'PRESENCIAL' as string,
    organizerName: '',
    startDate: '',
    startTime: '09:00',
    status: 'DRAFT' as AdminEventStatus,
    capacity: 100
  };

  changePasswordForm = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private userApi: UserApiService,
    private eventApi: EventApiService
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.loadUsers();
    this.loadEvents();
  }

  setSection(section: AdminSection) {
    if (!this.allowedSections.includes(section)) {
      this.currentSection = 'dashboard';
      return;
    }
    this.currentSection = section;
  }

  logout() {
    this.authService.logout();
  }

  getHeaderTitle(): string {
    switch (this.currentSection) {
      case 'dashboard':
        return 'Dashboard General';
      case 'events':
        return 'Control de Eventos';
      case 'users':
        return 'Control de Usuarios';
      case 'settings':
        return 'Configuración';
      case 'ai-reports':
        return 'Reportes de IA';
      default:
        return 'Dashboard';
    }
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AdminSettings>;
      this.settings = {
        ...this.settings,
        ...parsed
      };
    } catch {
      localStorage.removeItem(this.SETTINGS_KEY);
    }
  }

  saveSettings(): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
  }

  resetSettings(): void {
    localStorage.removeItem(this.SETTINGS_KEY);
    this.settings = {
      maintenanceMode: false,
      notificationsEnabled: true,
      defaultTimezone: 'America/Bogota',
      aiAutoRetrain: false
    };
  }

  generateAiReport(): void {
    const now = new Date();
    const report: AiReport = {
      id: `rpt_${now.getTime()}`,
      createdAt: now.toISOString(),
      modelVersion: 'v2.3.1',
      globalAccuracy: 87.3,
      predictionsToday: 1247,
      notes: 'Reporte generado en modo desarrollo (mock).'
    };
    this.reports = [report, ...this.reports];
  }

  downloadReportJson(report: AiReport): void {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictify-ai-report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        {
          id: 'usr_1001',
          name: 'John Doe',
          email: 'john@email.com',
          role: 'ATTENDEE',
          status: 'ACTIVE',
          password: 'User123!',
          createdAt: now
        },
        {
          id: 'usr_1002',
          name: 'Jane Smith',
          email: 'jane@email.com',
          role: 'ORGANIZER',
          status: 'ACTIVE',
          password: 'Organizer123!',
          createdAt: now
        }
      ];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem(this.ADMIN_USERS_KEY, JSON.stringify(this.users));
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
        {
          id: 'evt_101',
          title: 'Tech Summit 2025',
          organizerName: 'TechMadrid',
          startDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString().slice(0, 10),
          status: 'PUBLISHED',
          capacity: 500,
          createdAt: now.toISOString()
        },
        {
          id: 'evt_102',
          title: 'AI Workshop Pro',
          organizerName: 'AI Global',
          startDate: new Date(now.getFullYear(), now.getMonth(), 20).toISOString().slice(0, 10),
          status: 'DRAFT',
          capacity: 120,
          createdAt: now.toISOString()
        }
      ];
      this.saveEvents();
    }
  }

  private saveEvents(): void {
    localStorage.setItem(this.ADMIN_EVENTS_KEY, JSON.stringify(this.events));
  }

  get filteredUsers(): AdminUser[] {
    const q = this.userSearch.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  }

  get filteredEvents(): AdminEvent[] {
    const q = this.eventSearch.trim().toLowerCase();
    if (!q) return this.events;
    return this.events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.organizerName.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }

  openCreateUserModal(): void {
    this.isCreateUserModalOpen = true;
    this.createUserForm = {
      name: '',
      email: '',
      role: 'ATTENDEE',
      password: ''
    };
  }

  closeCreateUserModal(): void {
    this.isCreateUserModalOpen = false;
  }

  createUser(): void {
    const name = this.createUserForm.name.trim();
    const email = this.createUserForm.email.trim().toLowerCase();
    const password = this.createUserForm.password.trim();

    if (!name || !email || !password) return;
    if (this.users.some(u => u.email === email)) return;

    const roleMap: Record<AdminSectionUserRole, 'attendee' | 'organizer' | 'admin'> = {
      ATTENDEE: 'attendee',
      ORGANIZER: 'organizer',
      ADMIN: 'admin'
    };

    this.userApi.registerUser({
      name,
      email,
      password,
      role: roleMap[this.createUserForm.role]
    }).subscribe({
      next: () => {
        const now = new Date().toISOString();
        const user: AdminUser = {
          id: `usr_${Math.floor(Date.now() / 10)}`,
          name,
          email,
          role: this.createUserForm.role,
          status: 'ACTIVE',
          password,
          createdAt: now
        };

        this.users = [user, ...this.users];
        this.saveUsers();
        this.closeCreateUserModal();
      },
      error: () => {
        const now = new Date().toISOString();
        const user: AdminUser = {
          id: `usr_${Math.floor(Date.now() / 10)}`,
          name,
          email,
          role: this.createUserForm.role,
          status: 'ACTIVE',
          password,
          createdAt: now
        };

        this.users = [user, ...this.users];
        this.saveUsers();
        this.closeCreateUserModal();
      }
    });
  }

  openUserActions(user: AdminUser): void {
    this.selectedUser = user;
    this.isUserActionsModalOpen = true;
    this.lastGeneratedPassword = '';
  }

  closeUserActions(): void {
    this.isUserActionsModalOpen = false;
    this.selectedUser = null;
    this.lastGeneratedPassword = '';
  }

  setUserRole(role: AdminSectionUserRole): void {
    if (!this.selectedUser) return;
    this.users = this.users.map(u => u.id === this.selectedUser!.id ? { ...u, role } : u);
    this.selectedUser = this.users.find(u => u.id === this.selectedUser!.id) || null;
    this.saveUsers();
  }

  toggleBlockUser(): void {
    if (!this.selectedUser) return;
    const nextStatus: AdminUserStatus = this.selectedUser.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    this.users = this.users.map(u => u.id === this.selectedUser!.id ? { ...u, status: nextStatus } : u);
    this.selectedUser = this.users.find(u => u.id === this.selectedUser!.id) || null;
    this.saveUsers();
  }

  toggleBanUser(): void {
    if (!this.selectedUser) return;
    const nextStatus: AdminUserStatus = this.selectedUser.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
    this.users = this.users.map(u => u.id === this.selectedUser!.id ? { ...u, status: nextStatus } : u);
    this.selectedUser = this.users.find(u => u.id === this.selectedUser!.id) || null;
    this.saveUsers();
  }

  deleteSelectedUser(): void {
    if (!this.selectedUser) return;
    this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
    this.saveUsers();
    this.closeUserActions();
  }

  resetUserPassword(): void {
    if (!this.selectedUser) return;
    const temp = this.generatePassword();
    this.lastGeneratedPassword = temp;
    this.users = this.users.map(u => u.id === this.selectedUser!.id ? { ...u, password: temp } : u);
    this.selectedUser = this.users.find(u => u.id === this.selectedUser!.id) || null;
    this.saveUsers();
  }

  openChangePasswordModal(): void {
    if (!this.selectedUser) return;
    this.isChangePasswordModalOpen = true;
    this.changePasswordForm = { newPassword: '', confirmPassword: '' };
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordModalOpen = false;
    this.changePasswordForm = { newPassword: '', confirmPassword: '' };
  }

  changeUserPassword(): void {
    if (!this.selectedUser) return;
    const p1 = this.changePasswordForm.newPassword.trim();
    const p2 = this.changePasswordForm.confirmPassword.trim();
    if (!p1 || p1 !== p2) return;
    this.users = this.users.map(u => u.id === this.selectedUser!.id ? { ...u, password: p1 } : u);
    this.selectedUser = this.users.find(u => u.id === this.selectedUser!.id) || null;
    this.saveUsers();
    this.closeChangePasswordModal();
  }

  openCreateEventModal(): void {
    this.isCreateEventModalOpen = true;
    this.createEventForm = {
      title: '',
      description: '',
      category: 'MEETUP',
      type: 'PRESENCIAL',
      organizerName: '',
      startDate: '',
      startTime: '09:00',
      status: 'DRAFT',
      capacity: 100
    };
  }

  closeCreateEventModal(): void {
    this.isCreateEventModalOpen = false;
  }

  createEvent(): void {
    const title = this.createEventForm.title.trim();
    const description = this.createEventForm.description.trim();
    const category = String(this.createEventForm.category || '').trim();
    const type = String(this.createEventForm.type || '').trim();
    const organizerName = this.createEventForm.organizerName.trim();
    const startDate = this.createEventForm.startDate;
    const startTime = this.createEventForm.startTime;
    const capacity = Number(this.createEventForm.capacity);

    if (!title || !description || !category || !type || !startDate || !startTime || !capacity || capacity <= 0) return;

    const payload: CreateEventDTOBackend = {
      title,
      description,
      category,
      type,
      startDate,
      startTime,
      capacity,
      isFree: true,
      currency: 'USD',
      location: null
    };

    this.eventApi.createEventEnsuringOrganizer(payload, organizerName || undefined).pipe(
      switchMap(created => {
        if (this.createEventForm.status === 'PUBLISHED') {
          return this.eventApi.publishEvent(created.id as string);
        }
        return [created];
      })
    ).subscribe({
      next: (created) => {
        const now = new Date().toISOString();
        const event: AdminEvent = {
          id: created.id,
          title: created.title,
          organizerName: created.organizer?.displayName || organizerName || 'Organizer',
          startDate: String(created.startDate),
          status: String(created.status) as AdminEventStatus,
          capacity: Number(created.capacity),
          createdAt: String(created.createdAt || now)
        };
        this.events = [event, ...this.events];
        this.saveEvents();
        this.closeCreateEventModal();
      },
      error: () => {
        const now = new Date().toISOString();
        const event: AdminEvent = {
          id: `evt_${Math.floor(Date.now() / 10)}`,
          title,
          organizerName: organizerName || 'Organizer',
          startDate,
          status: this.createEventForm.status,
          capacity,
          createdAt: now
        };

        this.events = [event, ...this.events];
        this.saveEvents();
        this.closeCreateEventModal();
      }
    });
  }

  deleteEvent(event: AdminEvent): void {
    this.events = this.events.filter(e => e.id !== event.id);
    this.saveEvents();
  }

  private generatePassword(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let out = '';
    for (let i = 0; i < 10; i++) {
      out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return out + '!';
  }

  getAlertIcon(type: string): string {
    const icons: Record<string, string> = {
      'error': 'close-circle',
      'warning': 'exclamation-circle',
      'success': 'check-circle',
      'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  getAlertColor(type: string): string {
    const colors: Record<string, string> = {
      'error': '#EF4444',
      'warning': '#F59E0B',
      'success': '#10B981',
      'info': '#3B82F6'
    };
    return colors[type] || '#6B7280';
  }
}

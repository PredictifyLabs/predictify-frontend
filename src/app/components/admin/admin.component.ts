import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzBadgeModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentSection = 'dashboard';
  
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

  sidebarItems = [
    { icon: 'dashboard', label: 'Dashboard General', route: 'dashboard' },
    { icon: 'calendar', label: 'Gestión Eventos', route: 'events' },
    { icon: 'team', label: 'Gestión Usuarios', route: 'users' },
    { icon: 'bank', label: 'Organizadores', route: 'organizers' },
    { icon: 'robot', label: 'Sistema IA', route: 'ai' },
    { icon: 'bar-chart', label: 'Analytics Global', route: 'analytics' },
    { icon: 'dollar', label: 'Finanzas', route: 'finance' },
    { icon: 'setting', label: 'Configuración', route: 'settings' },
    { icon: 'bell', label: 'Moderación', route: 'moderation' },
    { icon: 'file-text', label: 'Reportes', route: 'reports' },
    { icon: 'safety', label: 'Seguridad', route: 'security' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  setSection(section: string) {
    this.currentSection = section;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
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

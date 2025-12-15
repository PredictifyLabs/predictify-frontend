import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DashboardStats } from '../../models/analytics.model';
import { EventDTO, EventStatus } from '../../domain/models/event.model';
import { EventApiService } from '../../infrastructure/services/event-api.service';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule, NzTableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalEvents: 12,
    totalAttendees: 2450,
    averageAttendanceRate: 78,
    totalRevenue: 15200,
    upcomingEvents: 5,
    completedEvents: 7,
    draftEvents: 0
  };

  myEvents: EventDTO[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private eventApi: EventApiService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadMyEvents();
  }

  loadMyEvents() {
    this.isLoading = true;
    if (!this.auth.isAuthenticated()) {
      this.myEvents = [];
      this.isLoading = false;
      return;
    }

    this.eventApi.getMyEvents().subscribe({
      next: (events) => {
        this.myEvents = (events || []).slice(0, 5);
        this.stats.totalEvents = events?.length || 0;
        this.stats.draftEvents = (events || []).filter(e => e.status === 'DRAFT').length;
        this.stats.completedEvents = (events || []).filter(e => e.status === 'COMPLETED').length;
        this.stats.upcomingEvents = (events || []).filter(e => e.status === 'PUBLISHED').length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.myEvents = [];
        this.isLoading = false;
      }
    });
  }

  createEvent() {
    console.log('Create new event');
  }

  editEvent(event: EventDTO) {
    console.log('Edit event:', event.id);
  }

  viewAnalytics(event: EventDTO) {
    console.log('View analytics:', event.id);
  }

  duplicateEvent(event: EventDTO) {
    console.log('Duplicate event:', event.id);
  }

  getStatusColor(status: EventStatus | string): string {
    const colors: Record<string, string> = {
      'PUBLISHED': '#10B981',
      'DRAFT': '#6B7280',
      'COMPLETED': '#3B82F6',
      'CANCELLED': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getStatusLabel(status: EventStatus | string): string {
    const labels: Record<string, string> = {
      'PUBLISHED': 'Publicado',
      'DRAFT': 'Borrador',
      'COMPLETED': 'Finalizado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }
}

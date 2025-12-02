import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Event } from '../../models/event.model';
import { DashboardStats } from '../../models/analytics.model';
import { EventService } from '../../services/event.service';

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

  myEvents: Event[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadMyEvents();
  }

  loadMyEvents() {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.myEvents = events.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  createEvent() {
    console.log('Create new event');
  }

  editEvent(event: Event) {
    console.log('Edit event:', event.id);
  }

  viewAnalytics(event: Event) {
    console.log('View analytics:', event.id);
  }

  duplicateEvent(event: Event) {
    console.log('Duplicate event:', event.id);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'published': '#10B981',
      'draft': '#6B7280',
      'completed': '#3B82F6',
      'cancelled': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'published': 'Publicado',
      'draft': 'Borrador',
      'completed': 'Finalizado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }
}

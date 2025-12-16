import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Navbar } from '../../navbar/navbar';

type AttendeeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  registeredAt: string;
  status: AttendeeStatus;
}

interface EventInfo {
  id: string;
  title: string;
  requiresApproval: boolean;
  capacity: number;
}

@Component({
  selector: 'app-event-attendees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzIconModule,
    NzAvatarModule,
    NzTagModule,
    NzEmptyModule,
    Navbar
  ],
  template: `
    <div class="attendees-page">
      <app-navbar></app-navbar>
      
      <div class="page-content">
        <header class="page-header">
          <div class="header-info">
            <a class="back-link" routerLink="/organizer">
              <span nz-icon nzType="arrow-left"></span>
              Volver
            </a>
            <h1>{{ eventInfo().title }}</h1>
            <p>Gestión de asistentes</p>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <span class="stat-value">{{ approvedCount() }}</span>
              <span class="stat-label">Aprobados</span>
            </div>
            <div class="stat-card pending">
              <span class="stat-value">{{ pendingCount() }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ eventInfo().capacity }}</span>
              <span class="stat-label">Capacidad</span>
            </div>
          </div>
        </header>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            [class.active]="currentFilter() === 'all'"
            (click)="setFilter('all')">
            Todos ({{ allAttendees().length }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="currentFilter() === 'pending'"
            (click)="setFilter('pending')">
            <span class="pending-dot"></span>
            Pendientes ({{ pendingCount() }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="currentFilter() === 'approved'"
            (click)="setFilter('approved')">
            Aprobados ({{ approvedCount() }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="currentFilter() === 'rejected'"
            (click)="setFilter('rejected')">
            Rechazados ({{ rejectedCount() }})
          </button>
        </div>

        <!-- Attendees List -->
        @if (filteredAttendees().length > 0) {
          <div class="attendees-list">
            @for (attendee of filteredAttendees(); track attendee.id) {
              <div class="attendee-card" [class.pending]="attendee.status === 'PENDING'">
                <div class="attendee-info">
                  <nz-avatar [nzSize]="48" [nzSrc]="attendee.avatar" nzIcon="user"></nz-avatar>
                  <div class="attendee-details">
                    <h4>{{ attendee.name }}</h4>
                    <span class="attendee-email">{{ attendee.email }}</span>
                    <span class="attendee-date">Registrado: {{ attendee.registeredAt }}</span>
                  </div>
                </div>
                
                <div class="attendee-status">
                  @switch (attendee.status) {
                    @case ('PENDING') {
                      <nz-tag nzColor="warning">Pendiente</nz-tag>
                    }
                    @case ('APPROVED') {
                      <nz-tag nzColor="success">Aprobado</nz-tag>
                    }
                    @case ('REJECTED') {
                      <nz-tag nzColor="error">Rechazado</nz-tag>
                    }
                  }
                </div>

                <div class="attendee-actions">
                  @if (attendee.status === 'PENDING') {
                    <button class="btn-approve" (click)="approveAttendee(attendee)">
                      <span nz-icon nzType="check"></span>
                      Aprobar
                    </button>
                    <button class="btn-reject" (click)="rejectAttendee(attendee)">
                      <span nz-icon nzType="close"></span>
                      Rechazar
                    </button>
                  } @else {
                    <button class="btn-secondary" (click)="resetStatus(attendee)">
                      <span nz-icon nzType="undo"></span>
                      Cambiar Estado
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <nz-empty [nzNotFoundContent]="getEmptyMessage()"></nz-empty>
        }

        <!-- Bulk Actions -->
        @if (pendingCount() > 0) {
          <div class="bulk-actions">
            <button class="btn-bulk approve" (click)="approveAll()">
              <span nz-icon nzType="check-circle"></span>
              Aprobar Todos ({{ pendingCount() }})
            </button>
            <button class="btn-bulk reject" (click)="rejectAll()">
              <span nz-icon nzType="close-circle"></span>
              Rechazar Todos
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .attendees-page {
      min-height: 100vh;
      background: #0a0a0a;
    }

    .page-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 100px 24px 60px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #888888;
      text-decoration: none;
      margin-bottom: 8px;
    }

    .back-link:hover {
      color: #A855F7;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 4px 0;
    }

    .page-header p {
      font-size: 14px;
      color: #888888;
      margin: 0;
    }

    .header-stats {
      display: flex;
      gap: 16px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px 24px;
      text-align: center;
    }

    .stat-card.pending {
      border-color: rgba(245, 158, 11, 0.3);
      background: rgba(245, 158, 11, 0.05);
    }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .stat-label {
      font-size: 12px;
      color: #888888;
      text-transform: uppercase;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #888888;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #FFFFFF;
    }

    .filter-tab.active {
      background: rgba(124, 58, 237, 0.15);
      border-color: rgba(124, 58, 237, 0.3);
      color: #A855F7;
    }

    .pending-dot {
      width: 8px;
      height: 8px;
      background: #F59E0B;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .attendees-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .attendee-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .attendee-card:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .attendee-card.pending {
      border-color: rgba(245, 158, 11, 0.2);
    }

    .attendee-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .attendee-details h4 {
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 4px 0;
    }

    .attendee-email {
      display: block;
      font-size: 13px;
      color: #888888;
    }

    .attendee-date {
      display: block;
      font-size: 11px;
      color: #666666;
      margin-top: 4px;
    }

    .attendee-status {
      min-width: 100px;
    }

    .attendee-actions {
      display: flex;
      gap: 8px;
    }

    .btn-approve,
    .btn-reject,
    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-approve {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10B981;
    }

    .btn-approve:hover {
      background: rgba(16, 185, 129, 0.25);
    }

    .btn-reject {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }

    .btn-reject:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #888888;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .bulk-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .btn-bulk {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-bulk.approve {
      background: linear-gradient(135deg, #10B981, #34D399);
      border: none;
      color: #FFFFFF;
    }

    .btn-bulk.reject {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }

    :host ::ng-deep .ant-empty-description {
      color: #888888;
    }
  `]
})
export class EventAttendeesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);

  readonly eventInfo = signal<EventInfo>({
    id: '',
    title: 'Cargando...',
    requiresApproval: true,
    capacity: 0
  });

  readonly allAttendees = signal<Attendee[]>([]);
  readonly currentFilter = signal<'all' | 'pending' | 'approved' | 'rejected'>('all');

  readonly filteredAttendees = computed(() => {
    const filter = this.currentFilter();
    const attendees = this.allAttendees();
    
    if (filter === 'all') return attendees;
    return attendees.filter(a => a.status === filter.toUpperCase());
  });

  readonly pendingCount = computed(() => 
    this.allAttendees().filter(a => a.status === 'PENDING').length
  );

  readonly approvedCount = computed(() => 
    this.allAttendees().filter(a => a.status === 'APPROVED').length
  );

  readonly rejectedCount = computed(() => 
    this.allAttendees().filter(a => a.status === 'REJECTED').length
  );

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    this.eventInfo.set({
      id: 'evt_001',
      title: 'Angular 20 & AI Summit 2025',
      requiresApproval: true,
      capacity: 500
    });

    this.allAttendees.set([
      { id: 'a1', name: 'Carlos Mendoza', email: 'carlos@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', registeredAt: '15 Dic 2024', status: 'PENDING' },
      { id: 'a2', name: 'María García', email: 'maria@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', registeredAt: '14 Dic 2024', status: 'PENDING' },
      { id: 'a3', name: 'Juan López', email: 'juan@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', registeredAt: '13 Dic 2024', status: 'APPROVED' },
      { id: 'a4', name: 'Ana Rodríguez', email: 'ana@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', registeredAt: '12 Dic 2024', status: 'APPROVED' },
      { id: 'a5', name: 'Pedro Sánchez', email: 'pedro@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro', registeredAt: '11 Dic 2024', status: 'REJECTED' },
      { id: 'a6', name: 'Laura Martínez', email: 'laura@email.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura', registeredAt: '15 Dic 2024', status: 'PENDING' }
    ]);
  }

  setFilter(filter: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.currentFilter.set(filter);
  }

  approveAttendee(attendee: Attendee): void {
    this.updateStatus(attendee.id, 'APPROVED');
    this.message.success(`${attendee.name} ha sido aprobado`);
  }

  rejectAttendee(attendee: Attendee): void {
    this.updateStatus(attendee.id, 'REJECTED');
    this.message.warning(`${attendee.name} ha sido rechazado`);
  }

  resetStatus(attendee: Attendee): void {
    this.updateStatus(attendee.id, 'PENDING');
    this.message.info(`Estado de ${attendee.name} reiniciado`);
  }

  approveAll(): void {
    this.allAttendees.update(attendees =>
      attendees.map(a => a.status === 'PENDING' ? { ...a, status: 'APPROVED' as AttendeeStatus } : a)
    );
    this.message.success('Todos los pendientes han sido aprobados');
  }

  rejectAll(): void {
    this.allAttendees.update(attendees =>
      attendees.map(a => a.status === 'PENDING' ? { ...a, status: 'REJECTED' as AttendeeStatus } : a)
    );
    this.message.warning('Todos los pendientes han sido rechazados');
  }

  private updateStatus(id: string, status: AttendeeStatus): void {
    this.allAttendees.update(attendees =>
      attendees.map(a => a.id === id ? { ...a, status } : a)
    );
  }

  getEmptyMessage(): string {
    const filter = this.currentFilter();
    switch (filter) {
      case 'pending': return 'No hay solicitudes pendientes';
      case 'approved': return 'No hay asistentes aprobados';
      case 'rejected': return 'No hay asistentes rechazados';
      default: return 'No hay asistentes registrados';
    }
  }
}

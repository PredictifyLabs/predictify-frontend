import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { Navbar } from '../../navbar/navbar';
import { AlertService } from '../../../infrastructure/services/alert.service';
import { AuthService } from '../../../infrastructure/services/auth.service';
import { EventService } from '../../../infrastructure/services/event.service';
import { TranslateService } from '../../../infrastructure/services/translate.service';

type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
type AttendeeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface OrganizerEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  startDate: string;
  startTime: string;
  location: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  requiresApproval: boolean;
  pendingApprovals: number;
  createdAt: string;
}

interface PendingApproval {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  requestedAt: string;
  status: AttendeeStatus;
}

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzIconModule,
    NzAvatarModule,
    NzTagModule,
    NzEmptyModule,
    NzBadgeModule,
    Navbar
  ],
  template: `
    <div class="organizer-page">
      <app-navbar></app-navbar>
      
      <div class="page-content">
        <!-- Header -->
        <header class="page-header">
          <div class="header-info">
            <h1><span nz-icon nzType="appstore" nzTheme="outline"></span> {{ t('organizer.title') }}</h1>
            <p>{{ t('organizer.subtitle') }}</p>
          </div>
          <button class="btn-create" (click)="openCreateModal()">
            <span nz-icon nzType="plus"></span>
            {{ t('organizer.createEvent') }}
          </button>
        </header>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon" nz-icon nzType="calendar"></span>
            <div class="stat-info">
              <span class="stat-value">{{ myEvents().length }}</span>
              <span class="stat-label">{{ t('organizer.myEvents') }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon published" nz-icon nzType="check-circle"></span>
            <div class="stat-info">
              <span class="stat-value">{{ publishedCount() }}</span>
              <span class="stat-label">{{ t('organizer.published') }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon attendees" nz-icon nzType="team"></span>
            <div class="stat-info">
              <span class="stat-value">{{ totalRegistered() }}</span>
              <span class="stat-label">{{ t('organizer.totalRegistered') }}</span>
            </div>
          </div>
          <div class="stat-card pending">
            <span class="stat-icon pending" nz-icon nzType="clock-circle"></span>
            <div class="stat-info">
              <span class="stat-value">{{ totalPendingApprovals() }}</span>
              <span class="stat-label">{{ t('organizer.pendingApproval') }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="section-tabs">
          <button class="tab" [class.active]="currentTab() === 'events'" (click)="setTab('events')">
            <span nz-icon nzType="calendar"></span>
            {{ t('organizer.myEvents') }}
          </button>
          <button class="tab" [class.active]="currentTab() === 'approvals'" (click)="setTab('approvals')">
            <span nz-icon nzType="audit"></span>
            {{ t('organizer.requests') }}
            @if (totalPendingApprovals() > 0) {
              <nz-badge [nzCount]="totalPendingApprovals()" [nzOverflowCount]="99"></nz-badge>
            }
          </button>
        </div>

        <!-- Events Tab -->
        @if (currentTab() === 'events') {
          <div class="events-section">
            @if (myEvents().length > 0) {
              <div class="events-list">
                @for (event of myEvents(); track event.id) {
                  <div class="event-card">
                    <div class="event-image">
                      <img [src]="event.imageUrl" [alt]="event.title">
                      <span class="event-status" [class]="event.status.toLowerCase()">
                        {{ getStatusLabel(event.status) }}
                      </span>
                    </div>
                    <div class="event-content">
                      <div class="event-header">
                        <h3>{{ event.title }}</h3>
                        @if (event.requiresApproval) {
                          <nz-tag nzColor="warning">{{ t('organizer.requiresApproval') }}</nz-tag>
                        }
                      </div>
                      <div class="event-meta">
                        <span><i nz-icon nzType="calendar"></i> {{ event.startDate }} - {{ event.startTime }}</span>
                        <span><i nz-icon nzType="environment"></i> {{ event.location }}</span>
                        <span><i nz-icon nzType="team"></i> {{ event.registered }}/{{ event.capacity }} inscritos</span>
                      </div>
                      <div class="event-actions">
                        <button class="btn-action" (click)="viewAttendees(event)">
                          <span nz-icon nzType="team"></span>
                          {{ t('organizer.viewAttendees') }}
                          @if (event.pendingApprovals > 0) {
                            <nz-badge [nzCount]="event.pendingApprovals" nzSize="small"></nz-badge>
                          }
                        </button>
                        <button class="btn-action secondary" (click)="editEvent(event)">
                          <span nz-icon nzType="edit"></span>
                          Editar
                        </button>
                        <button class="btn-action danger" (click)="deleteEvent(event)">
                          <span nz-icon nzType="delete"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span nz-icon nzType="calendar" nzTheme="outline"></span>
                <h3>{{ t('organizer.noEvents') }}</h3>
                <p>{{ t('organizer.createFirst') }}</p>
                <button class="btn-create" (click)="openCreateModal()">
                  <span nz-icon nzType="plus"></span>
                  Crear Evento
                </button>
              </div>
            }
          </div>
        }

        <!-- Approvals Tab -->
        @if (currentTab() === 'approvals') {
          <div class="approvals-section">
            @if (pendingApprovals().length > 0) {
              <div class="approvals-list">
                @for (approval of pendingApprovals(); track approval.id) {
                  <div class="approval-card">
                    <div class="approval-user">
                      <nz-avatar [nzSize]="48" [nzSrc]="approval.userAvatar" nzIcon="user"></nz-avatar>
                      <div class="user-info">
                        <h4>{{ approval.userName }}</h4>
                        <span class="user-email">{{ approval.userEmail }}</span>
                      </div>
                    </div>
                    <div class="approval-event">
                      <span class="label">Solicita inscripción a:</span>
                      <span class="event-name">{{ approval.eventTitle }}</span>
                    </div>
                    <div class="approval-date">
                      <span nz-icon nzType="clock-circle"></span>
                      {{ approval.requestedAt }}
                    </div>
                    <div class="approval-actions">
                      <button class="btn-approve" (click)="approveRequest(approval)">
                        <span nz-icon nzType="check"></span>
                        {{ t('organizer.approve') }}
                      </button>
                      <button class="btn-reject" (click)="rejectRequest(approval)">
                        <span nz-icon nzType="close"></span>
                        {{ t('organizer.reject') }}
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span nz-icon nzType="check-circle" nzTheme="outline"></span>
                <h3>{{ t('organizer.noPending') }}</h3>
                <p>{{ t('organizer.noPendingDesc') }}</p>
              </div>
            }
          </div>
        }
      </div>

      <!-- Create/Edit Event Modal -->
      @if (isModalOpen()) {
        <div class="modal-overlay" (click)="closeModal()"></div>
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingEvent() ? 'Editar Evento' : 'Crear Nuevo Evento' }}</h3>
            <button class="close-btn" (click)="closeModal()">
              <span nz-icon nzType="close"></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group full">
                <label>Título del Evento *</label>
                <input type="text" [(ngModel)]="eventForm.title" placeholder="Ej: Workshop de Angular">
              </div>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea [(ngModel)]="eventForm.description" rows="3" placeholder="Describe tu evento..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select [(ngModel)]="eventForm.category">
                  <option value="CONFERENCE">Conferencia</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="HACKATHON">Hackathon</option>
                </select>
              </div>
              <div class="form-group">
                <label>Capacidad</label>
                <input type="number" [(ngModel)]="eventForm.capacity" min="1">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input type="date" [(ngModel)]="eventForm.startDate">
              </div>
              <div class="form-group">
                <label>Hora</label>
                <input type="time" [(ngModel)]="eventForm.startTime">
              </div>
            </div>
            <div class="form-group">
              <label>Ubicación</label>
              <input type="text" [(ngModel)]="eventForm.location" placeholder="Ej: Bogotá, Colombia">
            </div>
            <div class="form-group">
              <label>URL de Imagen</label>
              <input type="text" [(ngModel)]="eventForm.imageUrl" placeholder="https://...">
            </div>

            <!-- Approval Toggle -->
            <div class="toggle-group">
              <div class="toggle-info">
                <label>
                  <span nz-icon nzType="safety-certificate"></span>
                  ¿Requiere Aprobación?
                </label>
                <p>Los asistentes deberán ser aprobados antes de confirmar su inscripción</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" [(ngModel)]="eventForm.requiresApproval">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Cancelar</button>
            <button class="btn-primary" (click)="saveEvent()">
              {{ editingEvent() ? 'Guardar Cambios' : 'Crear Evento' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .organizer-page {
      min-height: 100vh;
      background: #0a0a0a;
    }

    .page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 100px 24px 60px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
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

    .btn-create {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      border-radius: 10px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
    }

    .stat-card.pending {
      border-color: rgba(245, 158, 11, 0.3);
      background: rgba(245, 158, 11, 0.05);
    }

    .stat-icon {
      font-size: 28px;
      color: #7C3AED;
    }

    .stat-icon.published { color: #10B981; }
    .stat-icon.attendees { color: #3B82F6; }
    .stat-icon.pending { color: #F59E0B; }

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

    /* Tabs */
    .section-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #888888;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab:hover {
      color: #FFFFFF;
    }

    .tab.active {
      color: #A855F7;
      border-bottom-color: #A855F7;
    }

    /* Events List */
    .events-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .event-card {
      display: flex;
      gap: 20px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      transition: all 0.2s;
    }

    .event-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .event-image {
      position: relative;
      width: 180px;
      height: 120px;
      flex-shrink: 0;
      border-radius: 10px;
      overflow: hidden;
    }

    .event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .event-status {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .event-status.published { background: rgba(16, 185, 129, 0.9); color: #FFFFFF; }
    .event-status.draft { background: rgba(107, 114, 128, 0.9); color: #FFFFFF; }
    .event-status.cancelled { background: rgba(239, 68, 68, 0.9); color: #FFFFFF; }

    .event-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .event-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0;
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #888888;
    }

    .event-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .btn-action {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 8px;
      color: #A855F7;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action:hover {
      background: rgba(124, 58, 237, 0.25);
    }

    .btn-action.secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: #B3B3B3;
    }

    .btn-action.danger {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    /* Approvals List */
    .approvals-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .approval-card {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 14px;
    }

    .approval-user {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 200px;
    }

    .user-info h4 {
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 2px 0;
    }

    .user-email {
      font-size: 12px;
      color: #888888;
    }

    .approval-event {
      flex: 1;
    }

    .approval-event .label {
      display: block;
      font-size: 11px;
      color: #666666;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .approval-event .event-name {
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
    }

    .approval-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #888888;
    }

    .approval-actions {
      display: flex;
      gap: 8px;
    }

    .btn-approve, .btn-reject {
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
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .btn-reject:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-state > span {
      font-size: 48px;
      color: #333333;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      color: #888888;
      margin: 0 0 24px 0;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      z-index: 1001;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .modal-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      border-radius: 8px;
      color: #888888;
      cursor: pointer;
    }

    .modal-body {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group.full {
      grid-column: span 2;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #B3B3B3;
      margin-bottom: 6px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 14px;
    }

    .form-group textarea {
      resize: vertical;
    }

    .toggle-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      margin-top: 8px;
    }

    .toggle-info label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .toggle-info p {
      font-size: 12px;
      color: #888888;
      margin: 0;
    }

    .toggle-switch {
      position: relative;
      width: 50px;
      height: 28px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      transition: 0.3s;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background: #FFFFFF;
      border-radius: 50%;
      transition: 0.3s;
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #7C3AED, #A855F7);
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(22px);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .btn-secondary {
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #B3B3B3;
      font-size: 14px;
      cursor: pointer;
    }

    .btn-primary {
      padding: 10px 20px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .event-card {
        flex-direction: column;
      }

      .event-image {
        width: 100%;
        height: 160px;
      }

      .approval-card {
        flex-wrap: wrap;
      }
    }
  `]
})
export class OrganizerDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly eventService = inject(EventService);
  readonly ts = inject(TranslateService);

  t(key: string): string {
    return this.ts.t(key);
  }

  private readonly STORAGE_KEY = 'predictify_organizer_events';

  readonly currentTab = signal<'events' | 'approvals'>('events');
  readonly isModalOpen = signal(false);
  readonly editingEvent = signal<OrganizerEvent | null>(null);

  readonly myEvents = signal<OrganizerEvent[]>([]);
  readonly allApprovals = signal<PendingApproval[]>([]);

  readonly pendingApprovals = computed(() => 
    this.allApprovals().filter(a => a.status === 'PENDING')
  );

  readonly publishedCount = computed(() => 
    this.myEvents().filter(e => e.status === 'PUBLISHED').length
  );

  readonly totalRegistered = computed(() => 
    this.myEvents().reduce((sum, e) => sum + e.registered, 0)
  );

  readonly totalPendingApprovals = computed(() => 
    this.myEvents().reduce((sum, e) => sum + e.pendingApprovals, 0)
  );

  eventForm = {
    title: '',
    description: '',
    category: 'WORKSHOP',
    capacity: 50,
    startDate: '',
    startTime: '09:00',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    requiresApproval: false
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Load events from localStorage or use mock data
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.myEvents.set(JSON.parse(stored));
    } else {
      this.loadMockData();
    }
    this.loadMockApprovals();
  }

  private loadMockData(): void {
    const mockEvents: OrganizerEvent[] = [
      {
        id: 'evt_001',
        title: 'Workshop Angular Signals',
        description: 'Aprende a usar signals en Angular 17+',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
        category: 'WORKSHOP',
        startDate: '2025-01-20',
        startTime: '10:00',
        location: 'Bogotá, Colombia',
        capacity: 30,
        registered: 18,
        status: 'PUBLISHED',
        requiresApproval: true,
        pendingApprovals: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 'evt_002',
        title: 'Meetup DevOps Colombia',
        description: 'Networking y charlas sobre CI/CD',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        category: 'MEETUP',
        startDate: '2025-02-05',
        startTime: '18:00',
        location: 'Virtual',
        capacity: 100,
        registered: 45,
        status: 'PUBLISHED',
        requiresApproval: false,
        pendingApprovals: 0,
        createdAt: new Date().toISOString()
      }
    ];
    this.myEvents.set(mockEvents);
    this.saveEvents();
  }

  private loadMockApprovals(): void {
    const eventsWithApproval = this.myEvents().filter(e => e.requiresApproval && e.pendingApprovals > 0);
    
    const approvals: PendingApproval[] = [
      { id: 'apr_001', eventId: 'evt_001', eventTitle: 'Workshop Angular Signals', userId: 'u1', userName: 'Carlos Mendoza', userEmail: 'carlos@email.com', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', requestedAt: 'Hace 2 horas', status: 'PENDING' },
      { id: 'apr_002', eventId: 'evt_001', eventTitle: 'Workshop Angular Signals', userId: 'u2', userName: 'Ana García', userEmail: 'ana@email.com', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', requestedAt: 'Hace 5 horas', status: 'PENDING' },
      { id: 'apr_003', eventId: 'evt_001', eventTitle: 'Workshop Angular Signals', userId: 'u3', userName: 'Juan López', userEmail: 'juan@email.com', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', requestedAt: 'Ayer', status: 'PENDING' }
    ];
    
    this.allApprovals.set(approvals);
  }

  private saveEvents(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.myEvents()));
    // Refresh public events list
    this.eventService.refreshEvents();
  }

  setTab(tab: 'events' | 'approvals'): void {
    this.currentTab.set(tab);
  }

  openCreateModal(): void {
    this.editingEvent.set(null);
    this.eventForm = {
      title: '',
      description: '',
      category: 'WORKSHOP',
      capacity: 50,
      startDate: '',
      startTime: '09:00',
      location: '',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      requiresApproval: false
    };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingEvent.set(null);
  }

  editEvent(event: OrganizerEvent): void {
    this.editingEvent.set(event);
    this.eventForm = {
      title: event.title,
      description: event.description,
      category: event.category,
      capacity: event.capacity,
      startDate: event.startDate,
      startTime: event.startTime,
      location: event.location,
      imageUrl: event.imageUrl,
      requiresApproval: event.requiresApproval
    };
    this.isModalOpen.set(true);
  }

  saveEvent(): void {
    if (!this.eventForm.title.trim()) {
      this.alertService.error('Error', 'El título es requerido');
      return;
    }

    if (this.editingEvent()) {
      // Update existing
      this.myEvents.update(events => 
        events.map(e => e.id === this.editingEvent()!.id ? {
          ...e,
          ...this.eventForm
        } : e)
      );
      this.alertService.toastSuccess('Evento actualizado');
    } else {
      // Create new - Published immediately so everyone can see it
      const newEvent: OrganizerEvent = {
        id: `evt_${Date.now()}`,
        ...this.eventForm,
        registered: 0,
        status: 'PUBLISHED',
        pendingApprovals: 0,
        createdAt: new Date().toISOString()
      };
      this.myEvents.update(events => [newEvent, ...events]);
      this.alertService.toastSuccess('Evento publicado');
    }

    this.saveEvents();
    this.closeModal();
  }

  deleteEvent(event: OrganizerEvent): void {
    this.alertService.deleteConfirm(event.title, 'evento').then(result => {
      if (result.isConfirmed) {
        this.myEvents.update(events => events.filter(e => e.id !== event.id));
        this.saveEvents();
        this.alertService.toastSuccess('Evento eliminado');
      }
    });
  }

  viewAttendees(event: OrganizerEvent): void {
    this.router.navigate(['/organizer/event', event.id, 'attendees']);
  }

  approveRequest(approval: PendingApproval): void {
    this.allApprovals.update(approvals => 
      approvals.map(a => a.id === approval.id ? { ...a, status: 'APPROVED' as AttendeeStatus } : a)
    );
    
    // Update pending count on event
    this.myEvents.update(events => 
      events.map(e => e.id === approval.eventId ? {
        ...e,
        pendingApprovals: e.pendingApprovals - 1,
        registered: e.registered + 1
      } : e)
    );
    this.saveEvents();
    
    this.alertService.toastSuccess(`${approval.userName} aprobado`);
  }

  rejectRequest(approval: PendingApproval): void {
    this.allApprovals.update(approvals => 
      approvals.map(a => a.id === approval.id ? { ...a, status: 'REJECTED' as AttendeeStatus } : a)
    );
    
    // Update pending count on event
    this.myEvents.update(events => 
      events.map(e => e.id === approval.eventId ? {
        ...e,
        pendingApprovals: e.pendingApprovals - 1
      } : e)
    );
    this.saveEvents();
    
    this.alertService.toastSuccess(`Solicitud de ${approval.userName} rechazada`);
  }

  getStatusLabel(status: EventStatus): string {
    const labels = { DRAFT: 'Borrador', PUBLISHED: 'Publicado', CANCELLED: 'Cancelado' };
    return labels[status];
  }
}

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Navbar } from '../navbar/navbar';
import { TranslateService } from '../../infrastructure/services/translate.service';

interface UserEvent {
  id: string;
  title: string;
  imageUrl: string;
  startDate: string;
  location: string;
  category: string;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  organizerName: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    NzTabsModule,
    NzEmptyModule,
    NzAvatarModule,
    Navbar
  ],
  template: `
    <div class="my-events-page">
      <app-navbar></app-navbar>
      
      <div class="page-content">
        <header class="page-header">
          <h1>{{ t('myEvents.title') }}</h1>
          <p>{{ t('myEvents.subtitle') }}</p>
        </header>

        <nz-tabset nzType="card" class="events-tabs">
          <!-- Inscribed Tab -->
          <nz-tab>
            <ng-template nz-tab-title>
              <span nz-icon nzType="calendar" nzTheme="outline"></span> {{ t('myEvents.inscribed') }}
            </ng-template>
            <div class="tab-content">
              @if (inscribedEvents().length > 0) {
                <div class="events-grid">
                  @for (event of inscribedEvents(); track event.id) {
                    <div class="event-card">
                      <div class="event-image">
                        <img [src]="event.imageUrl" [alt]="event.title">
                        <span class="event-category">{{ event.category }}</span>
                      </div>
                      <div class="event-info">
                        <h3>{{ event.title }}</h3>
                        <div class="event-meta">
                          <span><i nz-icon nzType="calendar"></i> {{ event.startDate }}</span>
                          <span><i nz-icon nzType="environment"></i> {{ event.location }}</span>
                        </div>
                        <div class="event-organizer">
                          <nz-avatar nzSize="small" nzIcon="user"></nz-avatar>
                          <span>{{ event.organizerName }}</span>
                        </div>
                      </div>
                      <div class="event-actions">
                        <button class="btn-action" [routerLink]="['/events', event.id]">
                          Ver Detalles
                        </button>
                        <button class="btn-favorite" (click)="toggleFavorite(event)">
                          <i nz-icon [nzType]="event.isFavorite ? 'heart' : 'heart'" [nzTheme]="event.isFavorite ? 'fill' : 'outline'"></i>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No tienes eventos inscritos" [nzNotFoundFooter]="inscribedFooter">
                  <ng-template #inscribedFooter>
                    <button class="btn-primary" routerLink="/events">Explorar Eventos</button>
                  </ng-template>
                </nz-empty>
              }
            </div>
          </nz-tab>

          <!-- History Tab -->
          <nz-tab>
            <ng-template nz-tab-title>
              <span nz-icon nzType="history" nzTheme="outline"></span> {{ t('myEvents.history') }}
            </ng-template>
            <div class="tab-content">
              @if (pastEvents().length > 0) {
                <div class="events-grid">
                  @for (event of pastEvents(); track event.id) {
                    <div class="event-card past">
                      <div class="event-image">
                        <img [src]="event.imageUrl" [alt]="event.title">
                        <span class="event-badge past">Finalizado</span>
                      </div>
                      <div class="event-info">
                        <h3>{{ event.title }}</h3>
                        <div class="event-meta">
                          <span><i nz-icon nzType="calendar"></i> {{ event.startDate }}</span>
                          <span><i nz-icon nzType="environment"></i> {{ event.location }}</span>
                        </div>
                      </div>
                      <div class="event-actions">
                        <button class="btn-action secondary">Dejar Reseña</button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No tienes eventos en tu historial"></nz-empty>
              }
            </div>
          </nz-tab>

          <!-- Favorites Tab -->
          <nz-tab>
            <ng-template nz-tab-title>
              <span nz-icon nzType="heart" nzTheme="outline"></span> {{ t('myEvents.favorites') }}
            </ng-template>
            <div class="tab-content">
              @if (favoriteEvents().length > 0) {
                <div class="events-grid">
                  @for (event of favoriteEvents(); track event.id) {
                    <div class="event-card">
                      <div class="event-image">
                        <img [src]="event.imageUrl" [alt]="event.title">
                        <span class="event-category">{{ event.category }}</span>
                      </div>
                      <div class="event-info">
                        <h3>{{ event.title }}</h3>
                        <div class="event-meta">
                          <span><i nz-icon nzType="calendar"></i> {{ event.startDate }}</span>
                          <span><i nz-icon nzType="environment"></i> {{ event.location }}</span>
                        </div>
                      </div>
                      <div class="event-actions">
                        <button class="btn-action" [routerLink]="['/events', event.id]">Ver Detalles</button>
                        <button class="btn-favorite active" (click)="toggleFavorite(event)">
                          <i nz-icon nzType="heart" nzTheme="fill"></i>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No tienes eventos favoritos"></nz-empty>
              }
            </div>
          </nz-tab>
        </nz-tabset>
      </div>
    </div>
  `,
  styles: [`
    .my-events-page {
      min-height: 100vh;
      background: #0a0a0a;
    }

    .page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 100px 24px 60px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 8px 0;
    }

    .page-header p {
      font-size: 16px;
      color: #888888;
      margin: 0;
    }

    :host ::ng-deep .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px 8px 0 0;
      color: #888888;
    }

    :host ::ng-deep .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
      background: rgba(124, 58, 237, 0.15);
      border-color: rgba(124, 58, 237, 0.3);
      color: #A855F7;
    }

    :host ::ng-deep .ant-tabs-content-holder {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: none;
      border-radius: 0 0 12px 12px;
    }

    .tab-content {
      padding: 24px;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .event-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .event-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .event-card.past {
      opacity: 0.7;
    }

    .event-image {
      position: relative;
      height: 160px;
    }

    .event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .event-category {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 10px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    .event-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .event-badge.past {
      background: rgba(107, 114, 128, 0.8);
      color: #FFFFFF;
    }

    .event-info {
      padding: 16px;
    }

    .event-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .event-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #888888;
    }

    .event-organizer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #B3B3B3;
    }

    .event-actions {
      display: flex;
      gap: 8px;
      padding: 0 16px 16px;
    }

    .btn-action {
      flex: 1;
      padding: 10px 16px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action:hover {
      transform: translateY(-1px);
    }

    .btn-action.secondary {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-favorite {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #888888;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-favorite:hover,
    .btn-favorite.active {
      color: #EF4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-primary {
      padding: 12px 24px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    :host ::ng-deep .ant-empty-description {
      color: #888888;
    }
  `]
})
export class MyEventsComponent implements OnInit {
  readonly ts = inject(TranslateService);
  t(key: string): string { return this.ts.t(key); }

  private readonly allEvents = signal<UserEvent[]>([]);

  readonly inscribedEvents = computed(() => 
    this.allEvents().filter(e => e.status === 'UPCOMING')
  );

  readonly pastEvents = computed(() => 
    this.allEvents().filter(e => e.status === 'PAST')
  );

  readonly favoriteEvents = computed(() => 
    this.allEvents().filter(e => e.isFavorite)
  );

  ngOnInit(): void {
    this.loadMockEvents();
  }

  private loadMockEvents(): void {
    this.allEvents.set([
      {
        id: 'evt_001',
        title: 'Angular 20 & AI Summit 2025',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        startDate: '15 Mar 2025',
        location: 'Madrid, España',
        category: 'Conference',
        status: 'UPCOMING',
        organizerName: 'Angular Spain',
        isFavorite: true
      },
      {
        id: 'evt_002',
        title: 'Hackathon AI 2025',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
        startDate: '1-3 Feb 2025',
        location: 'Bogotá, Colombia',
        category: 'Hackathon',
        status: 'UPCOMING',
        organizerName: 'TechLab',
        isFavorite: false
      },
      {
        id: 'evt_003',
        title: 'React Meetup Diciembre',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        startDate: '10 Dic 2024',
        location: 'Virtual',
        category: 'Meetup',
        status: 'PAST',
        organizerName: 'React Community',
        isFavorite: false
      },
      {
        id: 'evt_004',
        title: 'DevOps Conference 2024',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        startDate: '20 Nov 2024',
        location: 'México City',
        category: 'Conference',
        status: 'PAST',
        organizerName: 'DevOps Latam',
        isFavorite: true
      }
    ]);
  }

  toggleFavorite(event: UserEvent): void {
    this.allEvents.update(events => 
      events.map(e => e.id === event.id ? { ...e, isFavorite: !e.isFavorite } : e)
    );
  }
}

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { Navbar } from '../navbar/navbar';
import { TranslateService } from '../../infrastructure/services/translate.service';

interface PublicUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: 'ATTENDEE' | 'ORGANIZER';
  eventsAttended?: number;
  eventsOrganized?: number;
  isVerified?: boolean;
}

interface OrganizerEvent {
  id: string;
  title: string;
  imageUrl: string;
  startDate: string;
  category: string;
}

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzIconModule,
    NzTabsModule,
    NzInputModule,
    NzAvatarModule,
    NzEmptyModule,
    Navbar
  ],
  template: `
    <div class="discover-page">
      <app-navbar></app-navbar>
      
      <div class="page-content">
        <header class="page-header">
          <h1>{{ t('discover.title') }}</h1>
          <p>{{ t('discover.subtitle') }}</p>
        </header>

        <nz-tabset nzType="card" class="discover-tabs">
          <!-- Users Tab -->
          <nz-tab>
            <ng-template nz-tab-title>
              <span nz-icon nzType="team" nzTheme="outline"></span> {{ t('discover.users') }}
            </ng-template>
            <div class="tab-content">
              <div class="search-bar">
                <nz-input-group [nzPrefix]="searchIcon">
                  <input nz-input placeholder="Buscar usuarios..." [(ngModel)]="userSearchQuery" (ngModelChange)="filterUsers()">
                </nz-input-group>
                <ng-template #searchIcon>
                  <span nz-icon nzType="search"></span>
                </ng-template>
              </div>

              @if (filteredUsers().length > 0) {
                <div class="users-grid">
                  @for (user of filteredUsers(); track user.id) {
                    <div class="user-card">
                      <div class="user-banner"></div>
                      <div class="user-avatar">
                        <nz-avatar [nzSize]="64" [nzSrc]="user.avatar" nzIcon="user"></nz-avatar>
                      </div>
                      <div class="user-info">
                        <h3>
                          {{ user.name }}
                          @if (user.isVerified) {
                            <span class="verified-badge" nz-icon nzType="safety-certificate" nzTheme="fill"></span>
                          }
                        </h3>
                        <span class="user-role">{{ user.role === 'ORGANIZER' ? 'Organizador' : 'Asistente' }}</span>
                        <p class="user-bio">{{ user.bio }}</p>
                        <div class="user-stats">
                          @if (user.eventsAttended) {
                            <span>{{ user.eventsAttended }} eventos asistidos</span>
                          }
                          @if (user.eventsOrganized) {
                            <span>{{ user.eventsOrganized }} eventos organizados</span>
                          }
                        </div>
                      </div>
                      <div class="user-actions">
                        <button class="btn-follow">Seguir</button>
                        <button class="btn-message">
                          <span nz-icon nzType="message"></span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No se encontraron usuarios"></nz-empty>
              }
            </div>
          </nz-tab>

          <!-- Organizers Tab -->
          <nz-tab>
            <ng-template nz-tab-title>
              <span nz-icon nzType="solution" nzTheme="outline"></span> {{ t('discover.organizers') }}
            </ng-template>
            <div class="tab-content">
              <div class="search-bar">
                <nz-input-group [nzPrefix]="orgSearchIcon">
                  <input nz-input placeholder="Buscar organizadores..." [(ngModel)]="organizerSearchQuery" (ngModelChange)="filterOrganizers()">
                </nz-input-group>
                <ng-template #orgSearchIcon>
                  <span nz-icon nzType="search"></span>
                </ng-template>
              </div>

              @if (filteredOrganizers().length > 0) {
                <div class="organizers-list">
                  @for (org of filteredOrganizers(); track org.id) {
                    <div class="organizer-card">
                      <div class="organizer-header">
                        <nz-avatar [nzSize]="56" [nzSrc]="org.avatar" nzIcon="user"></nz-avatar>
                        <div class="organizer-info">
                          <h3>
                            {{ org.name }}
                            @if (org.isVerified) {
                              <span class="verified-badge" nz-icon nzType="safety-certificate" nzTheme="fill"></span>
                            }
                          </h3>
                          <span class="organizer-stats">{{ org.eventsOrganized }} eventos organizados</span>
                        </div>
                        <button class="btn-follow">Seguir</button>
                      </div>
                      <p class="organizer-bio">{{ org.bio }}</p>
                      
                      <div class="organizer-events">
                        <h4>Eventos recientes</h4>
                        <div class="events-scroll">
                          @for (event of getOrganizerEvents(org.id); track event.id) {
                            <a class="mini-event-card" [routerLink]="['/events', event.id]">
                              <img [src]="event.imageUrl" [alt]="event.title">
                              <div class="mini-event-info">
                                <span class="mini-event-title">{{ event.title }}</span>
                                <span class="mini-event-date">{{ event.startDate }}</span>
                              </div>
                            </a>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No se encontraron organizadores"></nz-empty>
              }
            </div>
          </nz-tab>
        </nz-tabset>
      </div>
    </div>
  `,
  styles: [`
    .discover-page {
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
      color: #888888;
    }

    :host ::ng-deep .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
      background: rgba(124, 58, 237, 0.15);
      border-color: rgba(124, 58, 237, 0.3);
      color: #A855F7;
    }

    .tab-content {
      padding: 24px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: none;
      border-radius: 0 0 12px 12px;
    }

    .search-bar {
      margin-bottom: 24px;
    }

    :host ::ng-deep .ant-input-affix-wrapper {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    :host ::ng-deep .ant-input {
      background: transparent;
      color: #FFFFFF;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .user-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
    }

    .user-banner {
      height: 60px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
    }

    .user-avatar {
      display: flex;
      justify-content: center;
      margin-top: -32px;
    }

    .user-info {
      padding: 16px;
      text-align: center;
    }

    .user-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .verified-badge {
      color: #3B82F6;
      font-size: 14px;
    }

    .user-role {
      font-size: 12px;
      color: #A855F7;
      text-transform: uppercase;
      font-weight: 600;
    }

    .user-bio {
      font-size: 13px;
      color: #888888;
      margin: 12px 0;
      line-height: 1.5;
    }

    .user-stats {
      font-size: 12px;
      color: #666666;
    }

    .user-actions {
      display: flex;
      gap: 8px;
      padding: 0 16px 16px;
    }

    .btn-follow {
      flex: 1;
      padding: 10px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-message {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #888888;
      cursor: pointer;
    }

    .organizers-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .organizer-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
    }

    .organizer-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .organizer-info {
      flex: 1;
    }

    .organizer-info h3 {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .organizer-stats {
      font-size: 13px;
      color: #888888;
    }

    .organizer-bio {
      font-size: 14px;
      color: #B3B3B3;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .organizer-events h4 {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 12px 0;
    }

    .events-scroll {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .mini-event-card {
      flex-shrink: 0;
      width: 180px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      overflow: hidden;
      text-decoration: none;
      transition: all 0.2s;
    }

    .mini-event-card:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .mini-event-card img {
      width: 100%;
      height: 80px;
      object-fit: cover;
    }

    .mini-event-info {
      padding: 10px;
    }

    .mini-event-title {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mini-event-date {
      font-size: 11px;
      color: #888888;
    }
  `]
})
export class DiscoverComponent implements OnInit {
  readonly ts = inject(TranslateService);
  t(key: string): string { return this.ts.t(key); }

  userSearchQuery = '';
  organizerSearchQuery = '';

  private readonly allUsers = signal<PublicUser[]>([]);
  private readonly allOrganizers = signal<PublicUser[]>([]);
  private readonly organizerEvents = signal<Record<string, OrganizerEvent[]>>({});

  readonly filteredUsers = signal<PublicUser[]>([]);
  readonly filteredOrganizers = signal<PublicUser[]>([]);

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    const users: PublicUser[] = [
      { id: 'u1', name: 'Ana García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', bio: 'Desarrolladora Full Stack apasionada por Angular y React', role: 'ATTENDEE', eventsAttended: 15, isVerified: false },
      { id: 'u2', name: 'Carlos López', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', bio: 'DevOps Engineer | Cloud Enthusiast', role: 'ATTENDEE', eventsAttended: 23, isVerified: true },
      { id: 'u3', name: 'María Rodríguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', bio: 'UX Designer | Product thinking', role: 'ATTENDEE', eventsAttended: 8, isVerified: false },
      { id: 'u4', name: 'Juan Pérez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', bio: 'Backend developer | Python & Go', role: 'ATTENDEE', eventsAttended: 31, isVerified: true }
    ];

    const organizers: PublicUser[] = [
      { id: 'o1', name: 'TechLab Innovation', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TLI', bio: 'Laboratorio de innovación tecnológica enfocado en IA y desarrollo web moderno.', role: 'ORGANIZER', eventsOrganized: 24, isVerified: true },
      { id: 'o2', name: 'Angular Spain Community', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ASC', bio: 'Comunidad oficial de Angular en España. Meetups, conferencias y más.', role: 'ORGANIZER', eventsOrganized: 45, isVerified: true },
      { id: 'o3', name: 'DevOps Colombia', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DOC', bio: 'Comunidad de profesionales DevOps en Colombia.', role: 'ORGANIZER', eventsOrganized: 18, isVerified: true }
    ];

    const events: Record<string, OrganizerEvent[]> = {
      'o1': [
        { id: 'e1', title: 'Hackathon AI 2025', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300', startDate: '1 Feb 2025', category: 'Hackathon' },
        { id: 'e2', title: 'ML Workshop', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300', startDate: '15 Feb 2025', category: 'Workshop' }
      ],
      'o2': [
        { id: 'e3', title: 'Angular Summit', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300', startDate: '15 Mar 2025', category: 'Conference' },
        { id: 'e4', title: 'Signals Workshop', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300', startDate: '20 Mar 2025', category: 'Workshop' }
      ],
      'o3': [
        { id: 'e5', title: 'K8s Meetup', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300', startDate: '25 Jan 2025', category: 'Meetup' }
      ]
    };

    this.allUsers.set(users);
    this.allOrganizers.set(organizers);
    this.organizerEvents.set(events);
    this.filteredUsers.set(users);
    this.filteredOrganizers.set(organizers);
  }

  filterUsers(): void {
    const query = this.userSearchQuery.toLowerCase();
    this.filteredUsers.set(
      this.allUsers().filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.bio.toLowerCase().includes(query)
      )
    );
  }

  filterOrganizers(): void {
    const query = this.organizerSearchQuery.toLowerCase();
    this.filteredOrganizers.set(
      this.allOrganizers().filter(o => 
        o.name.toLowerCase().includes(query) || 
        o.bio.toLowerCase().includes(query)
      )
    );
  }

  getOrganizerEvents(organizerId: string): OrganizerEvent[] {
    return this.organizerEvents()[organizerId] || [];
  }
}

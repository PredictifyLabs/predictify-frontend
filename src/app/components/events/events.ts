import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { EventCard } from './event-card/event-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { EventService } from '../../infrastructure/services/event.service';
import { AuthService } from '../../infrastructure/services/auth.service';
import { EventCategory, EventDTO, getCategoryLabel, CATEGORIES_DATA, CategoryData } from '../../domain/models/event.model';
import { EventPreviewModalComponent } from '../shared/event-preview-modal/event-preview-modal.component';
import { getRoleLabel } from '../../domain/models/user.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    EventCard, 
    CommonModule, 
    FormsModule, 
    RouterLink, 
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule,
    NzEmptyModule,
    NzDropDownModule,
    NzAvatarModule,
    NzMenuModule,
    EventPreviewModalComponent
  ],
  templateUrl: './events.html',
  styleUrl: './events.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Events implements OnInit, OnDestroy {
  private readonly eventService = inject(EventService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Auth signals
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;
  readonly userName = computed(() => this.user()?.name || 'Usuario');
  readonly userAvatar = computed(() => this.user()?.avatar || '');
  readonly userRole = computed(() => {
    const role = this.user()?.role;
    return role ? getRoleLabel(role) : '';
  });
  readonly isAdmin = computed(() => {
    const role = this.user()?.role;
    return role === 'ADMIN' || role === 'ORGANIZER';
  });
  
  // Local UI state
  readonly viewMode = signal<'grid' | 'list'>('grid');
  readonly currentTime = signal('');
  readonly timezone = signal('');
  private timeInterval: ReturnType<typeof setInterval> | null = null;
  
  // Preview modal state
  readonly previewEvent = signal<EventDTO | null>(null);
  readonly isPreviewOpen = signal(false);
  
  // Categories data
  readonly categoriesData = CATEGORIES_DATA;
  
  // Expose service signals
  readonly events = this.eventService.filteredEvents;
  readonly loading = this.eventService.loading;
  readonly error = this.eventService.error;
  readonly searchQuery = this.eventService.searchQuery;
  readonly selectedCategory = this.eventService.selectedCategory;
  
  // Categories for filter
  readonly categories: (EventCategory | 'ALL')[] = [
    'ALL', 'CONFERENCE', 'HACKATHON', 'WORKSHOP', 'MEETUP', 'NETWORKING', 'BOOTCAMP', 'WEBINAR'
  ];
  
  getCategoryLabel = getCategoryLabel;

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  navigateToEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  openPreview(event: EventDTO): void {
    this.previewEvent.set(event);
    this.isPreviewOpen.set(true);
  }

  closePreview(): void {
    this.isPreviewOpen.set(false);
    this.previewEvent.set(null);
  }

  goToCategory(category: CategoryData): void {
    const slugMap: Record<string, string> = {
      'CONFERENCE': 'tecnologia',
      'WORKSHOP': 'comida-y-bebida',
      'HACKATHON': 'ia',
      'MEETUP': 'arte-y-cultura',
      'NETWORKING': 'clima',
      'BOOTCAMP': 'fitness',
      'WEBINAR': 'bienestar'
    };
    const slug = slugMap[category.id] || category.id.toLowerCase();
    this.router.navigate(['/category', slug]);
  }

  ngOnInit(): void {
    this.eventService.loadEvents();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    const now = new Date();
    
    this.currentTime.set(now.toLocaleTimeString(navigator.language || 'es', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }));
    
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzAbbr = now.toLocaleTimeString(navigator.language || 'es', {
      timeZoneName: 'short'
    }).split(' ').pop();
    
    this.timezone.set(tzAbbr || userTimezone.split('/').pop()?.replace('_', ' ') || 'Local');
  }

  onSearchChange(query: string): void {
    this.eventService.setSearchQuery(query);
  }

  filterByCategory(category: EventCategory | 'ALL'): void {
    this.eventService.setSelectedCategory(category);
  }
  
  getCategoryDisplayLabel(category: EventCategory | 'ALL'): string {
    if (category === 'ALL') return 'Todos';
    return getCategoryLabel(category);
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}

import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EventService } from '../../../infrastructure/services/event.service';
import { EventDTO, EventCategory, CATEGORIES_DATA, CategoryData } from '../../../domain/models/event.model';
import { EventCard } from '../event-card/event-card';
import { EventPreviewModalComponent } from '../../shared/event-preview-modal/event-preview-modal.component';
import { Navbar } from '../../navbar/navbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzIconModule,
    EventCard,
    EventPreviewModalComponent,
    Navbar
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);

  readonly categoryId = signal<EventCategory | null>(null);
  readonly categoryData = signal<CategoryData | null>(null);
  readonly loading = this.eventService.loading;
  
  // Preview modal state
  readonly previewEvent = signal<EventDTO | null>(null);
  readonly isPreviewOpen = signal(false);

  // Get events filtered by category
  // Search and filter state
  readonly searchQuery = signal('');
  
  readonly categoryEvents = computed(() => {
    const catId = this.categoryId();
    const query = this.searchQuery().toLowerCase().trim();
    if (!catId) return [];
    
    let events = this.eventService.events().filter(e => e.category === catId);
    
    // Apply search filter
    if (query) {
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
      );
    }
    
    return events;
  });

  ngOnInit(): void {
    const categorySlug = this.route.snapshot.paramMap.get('category');
    if (categorySlug) {
      const category = this.getCategoryFromSlug(categorySlug);
      if (category) {
        this.categoryId.set(category.id);
        this.categoryData.set(category);
        this.eventService.loadEvents();
      } else {
        this.router.navigate(['/events']);
      }
    }
  }

  private getCategoryFromSlug(slug: string): CategoryData | undefined {
    const slugMap: Record<string, EventCategory> = {
      'tecnologia': 'CONFERENCE',
      'comida-y-bebida': 'WORKSHOP',
      'ia': 'HACKATHON',
      'arte-y-cultura': 'MEETUP',
      'clima': 'NETWORKING',
      'fitness': 'BOOTCAMP',
      'bienestar': 'WEBINAR'
    };
    const categoryId = slugMap[slug.toLowerCase()];
    return categoryId ? CATEGORIES_DATA.find(c => c.id === categoryId) : undefined;
  }

  openPreview(event: EventDTO): void {
    this.previewEvent.set(event);
    this.isPreviewOpen.set(true);
  }

  closePreview(): void {
    this.isPreviewOpen.set(false);
    this.previewEvent.set(null);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + ' mil';
    }
    return num.toString();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventCard } from './event-card/event-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Event, EventCategory } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [EventCard, CommonModule, FormsModule, RouterLink, NzIconModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit, OnDestroy {
  searchQuery: string = '';
  events: Event[] = [];
  isLoading: boolean = false;
  selectedCategory: EventCategory = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Time display
  currentTime: string = '';
  timezone: string = '';
  private timeInterval: any;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  navigateToEvent(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }

  ngOnInit() {
    this.loadEvents();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
    
    // Get timezone offset
    const offset = -now.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '';
    this.timezone = `GMT${sign}${offset}`;
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredEvents() {
    return this.events.filter(event => {
      const matchesCategory = this.selectedCategory === 'all' || event.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery ||
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (event.location.city?.toLowerCase() || '').includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  filterByCategory(category: EventCategory) {
    this.selectedCategory = category;
    this.loadEvents();
  }
}

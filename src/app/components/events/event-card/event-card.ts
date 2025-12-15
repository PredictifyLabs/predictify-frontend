import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EventDTO, getCategoryLabel, getCategoryIcon } from '../../../domain/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCard {
  @Input() event!: EventDTO;
  @Output() preview = new EventEmitter<EventDTO>();
  
  private readonly router = inject(Router);

  onCardClick(): void {
    this.preview.emit(this.event);
  }

  navigateToDetail(): void {
    this.router.navigate(['/events', this.event.id]);
  }

  getDay(date: string): string {
    return new Date(date).getDate().toString();
  }

  getMonth(date: string): string {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[new Date(date).getMonth()];
  }

  getCategoryLabel(category: string): string {
    return getCategoryLabel(category as any) || category;
  }

  getCategoryIcon(category: string): string {
    return getCategoryIcon(category as any) || 'tag';
  }
}

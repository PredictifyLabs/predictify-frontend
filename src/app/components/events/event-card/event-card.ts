import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  @Input() event!: Event;

  constructor(private router: Router) {}

  navigateToDetail() {
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
    const labels: { [key: string]: string } = {
      'hackathon': 'Hackathon',
      'conference': 'Conferencia',
      'workshop': 'Taller',
      'networking': 'Networking'
    };
    return labels[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'hackathon': 'trophy',
      'conference': 'sound',
      'workshop': 'code',
      'networking': 'team'
    };
    return icons[category] || 'tag';
  }
}

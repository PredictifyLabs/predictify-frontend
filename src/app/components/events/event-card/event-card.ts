import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-event-card',
  imports: [NzCardModule, NzIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  @Input() event!: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    category: string;
    attendees: number;
  };

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

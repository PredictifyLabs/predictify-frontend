import { Component } from '@angular/core';
import { EventCard } from './event-card/event-card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-events',
  imports: [EventCard, CommonModule, FormsModule, NzIconModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  searchQuery: string = '';
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
  selectedCategory: string = 'all';

  events = [
    {
      title: 'Hackathon Puerta Del Sol 2025',
      date: '2025-12-15',
      time: '09:00 AM',
      location: 'Madrid, España',
      description: 'Competencia de desarrollo web de 48 horas con premios increíbles',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      category: 'hackathon',
      attendees: 150
    },
    {
      title: 'TechCaribe Conference',
      date: '2025-12-20',
      time: '10:00 AM',
      location: 'Santo Domingo, RD',
      description: 'La conferencia tech más grande del Caribe con speakers internacionales',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      category: 'conference',
      attendees: 500
    },
    {
      title: 'Workshop: React Avanzado',
      date: '2025-12-10',
      time: '02:00 PM',
      location: 'Barcelona, España',
      description: 'Aprende patrones avanzados de React con hooks y state management',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      category: 'workshop',
      attendees: 50
    },
    {
      title: 'AI & Machine Learning Summit',
      date: '2026-01-05',
      time: '09:00 AM',
      location: 'Online',
      description: 'Explora las últimas tendencias en IA y aprendizaje automático',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      category: 'conference',
      attendees: 1000
    },
    {
      title: 'Networking Tech Drinks',
      date: '2025-12-08',
      time: '06:00 PM',
      location: 'Valencia, España',
      description: 'Conecta con profesionales tech en un ambiente relajado',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      category: 'networking',
      attendees: 80
    },
    {
      title: 'Cybersecurity Bootcamp',
      date: '2026-01-15',
      time: '09:00 AM',
      location: 'México City, México',
      description: 'Taller intensivo de seguridad informática y ethical hacking',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      category: 'workshop',
      attendees: 40
    },
    {
      title: 'Startup Pitch Competition',
      date: '2026-01-20',
      time: '11:00 AM',
      location: 'Buenos Aires, Argentina',
      description: 'Las mejores startups tech compiten por inversión',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      category: 'hackathon',
      attendees: 200
    }
  ];

  get filteredEvents() {
    return this.events.filter(event => {
      const matchesCategory = this.selectedCategory === 'all' || event.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery ||
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }
}

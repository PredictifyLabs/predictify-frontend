import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  joinedDate: Date;
  eventsAttended: number;
  eventsCreated: number;
}

interface SavedEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  image: string;
  prediction: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NzIconModule, NzTabsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {
    id: '1',
    name: 'Juan García',
    email: 'juan@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    bio: 'Desarrollador Full Stack apasionado por la tecnología y los eventos tech.',
    location: 'Madrid, España',
    website: 'https://juangarcia.dev',
    role: 'user',
    joinedDate: new Date('2024-01-15'),
    eventsAttended: 12,
    eventsCreated: 0
  };

  savedEvents: SavedEvent[] = [
    {
      id: '1',
      title: 'Tech Summit 2025',
      date: new Date('2025-03-15'),
      location: 'Madrid',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      prediction: 85
    },
    {
      id: '2',
      title: 'AI Conference',
      date: new Date('2025-04-20'),
      location: 'Barcelona',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
      prediction: 72
    },
    {
      id: '3',
      title: 'DevOps Meetup',
      date: new Date('2025-02-28'),
      location: 'Valencia',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',
      prediction: 68
    }
  ];

  attendedEvents: SavedEvent[] = [
    {
      id: '4',
      title: 'JavaScript Conference 2024',
      date: new Date('2024-11-10'),
      location: 'Madrid',
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
      prediction: 92
    },
    {
      id: '5',
      title: 'Cloud Summit',
      date: new Date('2024-09-05'),
      location: 'Sevilla',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      prediction: 78
    }
  ];

  isEditing = false;
  editedUser: Partial<UserProfile> = {};

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      this.user.email = parsed.email || this.user.email;
      this.user.name = parsed.name || this.user.name;
      this.user.role = parsed.role || this.user.role;
    }
  }

  startEditing() {
    this.isEditing = true;
    this.editedUser = { ...this.user };
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedUser = {};
  }

  saveProfile() {
    Object.assign(this.user, this.editedUser);
    this.isEditing = false;
    this.editedUser = {};
  }

  removeFromSaved(eventId: string) {
    this.savedEvents = this.savedEvents.filter(e => e.id !== eventId);
  }

  navigateToEvent(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getPredictionColor(prediction: number): string {
    if (prediction >= 70) return '#10B981';
    if (prediction >= 40) return '#F59E0B';
    return '#EF4444';
  }
}

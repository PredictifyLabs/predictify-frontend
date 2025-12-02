import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { PredictionMeterComponent } from '../../shared/prediction-meter/prediction-meter.component';
import { PredictionFactorsComponent } from '../../shared/prediction-factors/prediction-factors.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    PredictionMeterComponent,
    PredictionFactorsComponent
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  isLoading = true;
  isSaved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string) {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.isLoading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  toggleSave() {
    this.isSaved = !this.isSaved;
  }

  share() {
    if (navigator.share && this.event) {
      navigator.share({
        title: this.event.title,
        text: this.event.description,
        url: window.location.href
      });
    }
  }

  register() {
    console.log('Register for event:', this.event?.id);
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }
}

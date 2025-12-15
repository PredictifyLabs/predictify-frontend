import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { EventService } from '../../../infrastructure/services/event.service';
import { SeoService } from '../../../infrastructure/services/seo.service';
import { EventDTO } from '../../../domain/models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzModalModule,
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly seoService = inject(SeoService);
  private readonly modal = inject(NzModalService);
  private readonly sanitizer = inject(DomSanitizer);
  
  readonly isSaved = signal(false);

  readonly calendarWeekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

  private toDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date();
  }

  getCalendarMonthLabel(dateInput: unknown): string {
    const date = this.toDate(dateInput);
    return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  }

  getCalendarYear(dateInput: unknown): number {
    return this.toDate(dateInput).getFullYear();
  }

  getCalendarDay(dateInput: unknown): number {
    return this.toDate(dateInput).getDate();
  }

  getCalendarWeeks(dateInput: unknown): Array<Array<number | null>> {
    const date = this.toDate(dateInput);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastOfMonth.getDate();

    // JS: 0=Sunday..6=Saturday. We want Monday=0..Sunday=6.
    const startOffset = (firstOfMonth.getDay() + 6) % 7;

    const weeks: Array<Array<number | null>> = [];
    let week: Array<number | null> = [];

    for (let i = 0; i < startOffset; i++) week.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    return weeks;
  }
  
  getMapUrl(lat: number, lng: number): SafeResourceUrl {
    const bbox = `${lng - 0.008},${lat - 0.005},${lng + 0.008},${lat + 0.005}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  // Expose service signals
  readonly event = this.eventService.selectedEvent;
  readonly prediction = this.eventService.selectedEventPrediction;
  readonly isLoading = this.eventService.loading;
  readonly error = this.eventService.error;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.loadEventById(id);
      
      // Subscribe to event changes to update SEO
      const checkEvent = setInterval(() => {
        const event = this.event();
        if (event) {
          this.seoService.updateForEvent(event);
          clearInterval(checkEvent);
        }
      }, 100);
      
      // Clear after 5 seconds if no event loaded
      setTimeout(() => clearInterval(checkEvent), 5000);
    }
  }
  
  ngOnDestroy(): void {
    this.eventService.clearSelectedEvent();
    this.seoService.resetToDefault();
  }

  toggleSave(): void {
    this.isSaved.update(v => !v);
  }

  share(): void {
    const currentEvent = this.event();
    if (navigator.share && currentEvent) {
      navigator.share({
        title: currentEvent.title,
        text: currentEvent.shortDescription || currentEvent.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }
  
  showQRModal(): void {
    const currentEvent = this.event();
    if (currentEvent) {
      this.modal.info({
        nzTitle: 'Compartir Evento',
        nzContent: `
          <div style="
            text-align: center; 
            padding: 30px;
            background: linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98));
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <div class="qr-code-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}" 
                   alt="QR Code" 
                   style="display: block; border-radius: 8px;" />
            </div>
            <p style="
              margin-top: 20px; 
              color: #B3B3B3;
              font-size: 14px;
              line-height: 1.5;
            ">Escanea este código QR para compartir el evento</p>
            <p style="
              margin-top: 8px;
              color: #6366F1;
              font-size: 12px;
              font-weight: 500;
            ">${currentEvent.title}</p>
          </div>
        `,
        nzOkText: 'Cerrar',
        nzClassName: 'qr-modal-custom'
      });
    }
  }

  register(): void {
    const currentEvent = this.event();
    if (currentEvent) {
      console.log('Register for event:', currentEvent.id);
    }
  }

  goBack(): void {
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

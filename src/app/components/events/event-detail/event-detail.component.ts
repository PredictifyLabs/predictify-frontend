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
import { PredictionMeterComponent } from '../../shared/prediction-meter/prediction-meter.component';
import { PredictionFactorsComponent } from '../../shared/prediction-factors/prediction-factors.component';
import { SafePipe } from '../../../ui/pipes/safe.pipe';
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
    PredictionMeterComponent,
    PredictionFactorsComponent,
    SafePipe
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
          ">
            <div style="
              background: white;
              padding: 20px;
              border-radius: 16px;
              display: inline-block;
              box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
            ">
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

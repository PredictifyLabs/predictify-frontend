import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AlertService } from '../../../infrastructure/services/alert.service';
import { EventDTO, getCategoryLabel } from '../../../domain/models/event.model';
import { AuthService } from '../../../infrastructure/services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-event-preview-modal',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule, AuthModalComponent],
  templateUrl: './event-preview-modal.component.html',
  styleUrls: ['./event-preview-modal.component.css']
})
export class EventPreviewModalComponent implements OnChanges, OnDestroy {
  @Input() event: EventDTO | null = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);

  showAuthModal = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      this.toggleBodyScroll(this.isVisible);
    }
  }

  ngOnDestroy(): void {
    this.toggleBodyScroll(false);
  }

  private toggleBodyScroll(disable: boolean): void {
    document.body.style.overflow = disable ? 'hidden' : '';
  }

  get eventUrl(): string {
    const baseUrl = 'https://predictify.app';
    return this.event ? `${baseUrl}/events/${this.event.slug || this.event.id}` : '';
  }

  get formattedDate(): string {
    if (!this.event) return '';
    const date = new Date(this.event.startDate);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }

  get formattedTime(): string {
    if (!this.event) return '';
    return `${this.event.startTime}${this.event.endTime ? ' - ' + this.event.endTime : ''}`;
  }

  get categoryLabel(): string {
    return this.event ? getCategoryLabel(this.event.category) : '';
  }

  get eventColor(): string {
    return this.event?.backgroundColor || '#6366F1';
  }

  closeModal(): void {
    this.close.emit();
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.eventUrl).then(() => {
      this.alert.toastSuccess('Enlace copiado al portapapeles');
    });
  }

  goToEvent(): void {
    if (this.event) {
      this.closeModal();
      this.router.navigate(['/events', this.event.slug || this.event.id]);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  getMapUrl(): SafeResourceUrl {
    if (!this.event?.location) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const lat = this.event.location.latitude || 4.6097;
    const lng = this.event.location.longitude || -74.0817;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  registerToEvent(): void {
    if (!this.authService.isAuthenticated()) {
      this.showAuthModal.set(true);
      return;
    }
    // TODO: Call registration API
    this.alert.eventRegistrationSuccess(this.event?.title || 'Evento');
  }

  closeAuthModal(): void {
    this.showAuthModal.set(false);
  }

  onAuthenticated(): void {
    this.showAuthModal.set(false);
    this.alert.toastSuccess('¡Sesión iniciada! Ya puedes inscribirte.');
  }
}

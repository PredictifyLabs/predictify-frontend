import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  @Input() isVisible = false;
  @Input() message = 'Para inscribirte en este evento necesitas una cuenta';
  @Output() close = new EventEmitter<void>();
  @Output() authenticated = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  mode: 'options' | 'login' | 'register' = 'options';
  
  // Login form
  loginEmail = '';
  loginPassword = '';
  
  // Register form
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerRole = 'ATTENDEE';
  
  loading = false;
  error = '';

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('auth-modal-overlay')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.mode = 'options';
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.error = '';
    this.loading = false;
  }

  goToLogin(): void {
    this.mode = 'login';
    this.error = '';
  }

  goToRegister(): void {
    this.mode = 'register';
    this.error = '';
  }

  goBack(): void {
    this.mode = 'options';
    this.error = '';
  }

  submitLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.authenticated.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Credenciales inválidas';
      }
    });
  }

  submitRegister(): void {
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.authenticated.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al crear la cuenta';
      }
    });
  }

  navigateToAuth(): void {
    this.closeModal();
    this.router.navigate(['/auth']);
  }
}

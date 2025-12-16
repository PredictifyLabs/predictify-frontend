import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AlertService } from '../../../infrastructure/services/alert.service';
import { AuthService } from '../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NzIconModule, NzInputModule, NzButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  email = '';
  password = '';
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.alert.welcomeUser(user?.name || 'Usuario').then(() => {
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (user?.role === 'ORGANIZER') {
            this.router.navigate(['/organizer']);
          } else {
            this.router.navigate(['/events']);
          }
        });
      },
      error: (err) => {
        this.alert.error('Error de autenticación', err.error?.message || err.message || 'Credenciales incorrectas');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  loginWithGoogle(): void {
    this.alert.toastInfo('Login con Google próximamente');
  }

  loginWithGithub(): void {
    this.alert.toastInfo('Login con GitHub próximamente');
  }
}

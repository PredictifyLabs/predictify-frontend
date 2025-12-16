import { Component, inject, computed, signal, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../../infrastructure/services/auth.service';
import { TranslateService } from '../../infrastructure/services/translate.service';
import { getRoleLabel } from '../../domain/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzAvatarModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly translateService = inject(TranslateService);
  private timeInterval: ReturnType<typeof setInterval> | null = null;

  // Expose auth signals to template
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;
  
  // Time display
  readonly currentTime = signal('');
  readonly timezone = signal('');
  
  // Computed signals for UI
  readonly userName = computed(() => this.user()?.name || 'Usuario');
  readonly userAvatar = computed(() => this.user()?.avatar || '');
  readonly userRole = computed(() => {
    const role = this.user()?.role;
    return role ? getRoleLabel(role) : '';
  });
  readonly isAdmin = computed(() => {
    const role = this.user()?.role;
    return role === 'ADMIN' || role === 'ORGANIZER';
  });
  
  // Language
  readonly currentLang = this.translateService.currentLang;
  readonly isEnglish = this.translateService.isEnglish;

  ngOnInit(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }));
    
    const offset = -now.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '';
    this.timezone.set(`GMT${sign}${offset}`);
  }

  navigate(route: string): void {
    this.router.navigate(['/' + route]);
  }

  logout(): void {
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth'], { queryParams: { mode: 'register' } });
  }

  toggleLanguage(): void {
    this.translateService.toggleLanguage();
    // Force page reload to apply translations globally
    window.location.reload();
  }

  t(key: string): string {
    return this.translateService.t(key);
  }
}

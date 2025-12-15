import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../infrastructure/services/auth.service';
import { getRoleLabel } from '../../domain/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NzMenuModule,
    NzBadgeModule,
    NzLayoutModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Expose auth signals to template
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;
  
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

  selectedCategory = 'all';
  searchQuery = '';

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.router.navigate(['/events'], { queryParams: { category } });
  }

  filterByType(type: string): void {
    this.router.navigate(['/events'], { queryParams: { type } });
  }

  filterByLocation(location: string): void {
    this.router.navigate(['/events'], { queryParams: { location } });
  }

  navigate(route: string): void {
    this.router.navigate(['/' + route]);
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/events'], { queryParams: { q: this.searchQuery } });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}

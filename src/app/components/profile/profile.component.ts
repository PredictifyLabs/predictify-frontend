import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { AlertService } from '../../infrastructure/services/alert.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../../infrastructure/services/auth.service';
import { Navbar } from '../navbar/navbar';
import { UserDTO, getRoleLabel } from '../../domain/models/user.model';

interface SavedEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  image: string;
  prediction: number;
}

interface EditProfileForm {
  name: string;
  bio: string;
  location: string;
  avatar: string;
  banner: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    NzIconModule, 
    NzTabsModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzUploadModule,
    NzAvatarModule,
    Navbar
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modal = inject(NzModalService);
  private readonly alert = inject(AlertService);
  
  private readonly BANNER_KEY = 'predictify_user_banner';

  // Auth signals
  readonly user = this.authService.user;
  readonly isAuthenticated = this.authService.isAuthenticated;
  
  // Computed user info
  readonly userName = computed(() => this.user()?.name || 'Usuario');
  readonly userEmail = computed(() => this.user()?.email || '');
  readonly userAvatar = computed(() => this.user()?.avatar || '');
  readonly userBio = computed(() => this.user()?.bio || 'Sin biografía');
  readonly userLocation = computed(() => this.user()?.location || 'Sin ubicación');
  readonly userRole = computed(() => {
    const role = this.user()?.role;
    return role ? getRoleLabel(role) : 'Usuario';
  });
  readonly isOrganizer = computed(() => {
    const role = this.user()?.role;
    return role === 'ORGANIZER' || role === 'ADMIN';
  });
  readonly memberSince = computed(() => {
    const createdAt = this.user()?.createdAt;
    if (!createdAt) return 'Recientemente';
    return new Date(createdAt).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  });

  // Profile banner - load from localStorage
  readonly userBanner = signal(this.loadBannerFromStorage());
  
  // Modal state
  readonly isEditModalVisible = signal(false);
  readonly editForm = signal<EditProfileForm>({
    name: '',
    bio: '',
    location: '',
    avatar: '',
    banner: ''
  });
  readonly isSaving = signal(false);

  // Mock saved events (will be replaced by real API)
  readonly savedEvents = signal<SavedEvent[]>([
    {
      id: 'evt_001',
      title: 'Angular 20 & AI Summit 2025',
      date: new Date('2025-03-15'),
      location: 'Madrid',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      prediction: 87
    }
  ]);

  readonly attendedEvents = signal<SavedEvent[]>([]);

  // Open edit modal
  openEditModal(): void {
    this.editForm.set({
      name: this.userName(),
      bio: this.user()?.bio || '',
      location: this.user()?.location || '',
      avatar: this.userAvatar(),
      banner: this.userBanner()
    });
    this.isEditModalVisible.set(true);
  }

  // Close edit modal
  closeEditModal(): void {
    this.isEditModalVisible.set(false);
  }

  // Load banner from localStorage
  private loadBannerFromStorage(): string {
    try {
      const saved = localStorage.getItem(this.BANNER_KEY);
      return saved || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop';
    }
  }

  // Save banner to localStorage
  private saveBannerToStorage(banner: string): void {
    try {
      localStorage.setItem(this.BANNER_KEY, banner);
    } catch (e) {
      console.error('Error saving banner:', e);
    }
  }

  // Save profile changes
  saveProfile(): void {
    this.isSaving.set(true);
    
    const form = this.editForm();
    
    // Save banner to localStorage first
    if (form.banner) {
      this.saveBannerToStorage(form.banner);
      this.userBanner.set(form.banner);
    }
    
    // Update user data in localStorage
    const currentUser = this.user();
    if (currentUser) {
      const updatedUser: UserDTO = {
        ...currentUser,
        name: form.name,
        bio: form.bio,
        location: form.location,
        avatar: form.avatar
      };
      
      localStorage.setItem('predictify_user', JSON.stringify(updatedUser));
    }
    
    this.isSaving.set(false);
    this.isEditModalVisible.set(false);
    this.alert.toastSuccess('Perfil actualizado correctamente');
  }

  // Handle avatar upload
  handleAvatarUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.editForm.update(f => ({ ...f, avatar: e.target.result }));
    };
    reader.readAsDataURL(file as any);
    return false; // Prevent default upload
  };

  // Handle banner upload
  handleBannerUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.editForm.update(f => ({ ...f, banner: e.target.result }));
    };
    reader.readAsDataURL(file as any);
    return false; // Prevent default upload
  };

  // Update form field
  updateFormField(field: keyof EditProfileForm, value: string): void {
    this.editForm.update(f => ({ ...f, [field]: value }));
  }

  removeFromSaved(eventId: string): void {
    this.savedEvents.update(events => events.filter(e => e.id !== eventId));
  }

  navigateToEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  logout(): void {
    this.authService.logout();
  }

  getPredictionColor(prediction: number): string {
    if (prediction >= 70) return '#10B981';
    if (prediction >= 40) return '#F59E0B';
    return '#EF4444';
  }
}

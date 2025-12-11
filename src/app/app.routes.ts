import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { Events } from './components/events/events';
import { EventDetailComponent } from './components/events/event-detail/event-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthContainerComponent } from './components/auth/auth-container/auth-container.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'events', component: Events },
    { path: 'events/:id', component: EventDetailComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'auth', component: AuthContainerComponent },
    { path: 'auth/login', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth/register', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' }
];

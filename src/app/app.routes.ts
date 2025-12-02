import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { Events } from './components/events/events';
import { EventDetailComponent } from './components/events/event-detail/event-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'events', component: Events },
    { path: 'events/:id', component: EventDetailComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { Events } from './components/events/events';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'events', component: Events },
    { path: '**', redirectTo: '' }
];

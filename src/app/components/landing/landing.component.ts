import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    constructor(private router: Router) { }

    navigateToApp(): void {
        // Navigate to the main app (you can change this route as needed)
        this.router.navigate(['/events']);
    }
}

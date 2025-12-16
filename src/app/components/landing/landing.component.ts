import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Navbar } from '../navbar/navbar';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzIconModule, RouterLink, Navbar],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    constructor(private router: Router) { }

    navigateToApp(): void {
        this.router.navigate(['/events']);
    }
}

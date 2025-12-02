import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NzIconModule, NzInputModule, NzButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulación de login
    setTimeout(() => {
      if (this.email === 'admin@predictify.com' && this.password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ email: this.email, role: 'admin' }));
        this.router.navigate(['/admin']);
      } else if (this.email && this.password) {
        localStorage.setItem('user', JSON.stringify({ email: this.email, role: 'user' }));
        this.router.navigate(['/events']);
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
      this.isLoading = false;
    }, 1500);
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithGithub() {
    console.log('Login with GitHub');
  }
}

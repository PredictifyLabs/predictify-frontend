import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzInputModule, NzButtonModule],
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.css'],
  animations: [
    trigger('panelAnimation', [
      state('login', style({
        transform: 'translateX(0%)'
      })),
      state('register', style({
        transform: 'translateX(-50%)'
      })),
      transition('login <=> register', [
        animate('600ms cubic-bezier(0.68, -0.15, 0.32, 1.15)')
      ])
    ]),
    trigger('overlayAnimation', [
      state('login', style({
        transform: 'translateX(0%)'
      })),
      state('register', style({
        transform: 'translateX(100%)'
      })),
      transition('login <=> register', [
        animate('600ms cubic-bezier(0.68, -0.15, 0.32, 1.15)')
      ])
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AuthContainerComponent {
  // Estado del panel
  isLoginMode = signal(true);
  
  // Login form
  loginEmail = '';
  loginPassword = '';
  showLoginPassword = false;
  loginLoading = false;
  loginError = '';
  rememberMe = false;

  // Register form
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  showRegisterPassword = false;
  registerLoading = false;
  registerError = '';
  isOrganizer = false;
  acceptTerms = false;

  // Password strength
  passwordStrength = signal(0);
  passwordStrengthText = signal('');
  passwordStrengthColor = signal('');

  constructor(private router: Router) {}

  // Toggle between login and register
  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.clearErrors();
  }

  showLogin() {
    this.isLoginMode.set(true);
    this.clearErrors();
  }

  showRegister() {
    this.isLoginMode.set(false);
    this.clearErrors();
  }

  clearErrors() {
    this.loginError = '';
    this.registerError = '';
  }

  // Login methods
  toggleLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Por favor completa todos los campos';
      return;
    }

    this.loginLoading = true;
    this.loginError = '';

    setTimeout(() => {
      if (this.loginEmail === 'admin@predictify.com' && this.loginPassword === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ 
          email: this.loginEmail, 
          role: 'admin',
          name: 'Administrador'
        }));
        this.router.navigate(['/admin']);
      } else if (this.loginEmail && this.loginPassword) {
        localStorage.setItem('user', JSON.stringify({ 
          email: this.loginEmail, 
          role: 'user',
          name: 'Usuario'
        }));
        this.router.navigate(['/events']);
      } else {
        this.loginError = 'Credenciales incorrectas';
      }
      this.loginLoading = false;
    }, 1500);
  }

  // Register methods
  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  checkPasswordStrength() {
    const password = this.registerPassword;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    this.passwordStrength.set(strength);
    
    if (strength <= 1) {
      this.passwordStrengthText.set('Débil');
      this.passwordStrengthColor.set('#ef4444');
    } else if (strength <= 3) {
      this.passwordStrengthText.set('Media');
      this.passwordStrengthColor.set('#f59e0b');
    } else {
      this.passwordStrengthText.set('Fuerte');
      this.passwordStrengthColor.set('#10b981');
    }
  }

  register() {
    if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.registerError = 'Por favor completa todos los campos';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.registerError = 'Las contraseñas no coinciden';
      return;
    }

    if (this.registerPassword.length < 6) {
      this.registerError = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.acceptTerms) {
      this.registerError = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.registerLoading = true;
    this.registerError = '';

    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        name: this.registerName,
        email: this.registerEmail,
        role: this.isOrganizer ? 'organizer' : 'user'
      }));
      this.router.navigate(['/events']);
      this.registerLoading = false;
    }, 1500);
  }

  // Social login
  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithGithub() {
    console.log('Login with GitHub');
  }
}

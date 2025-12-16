import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, NzButtonModule, NzIconModule, NzResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-illustration">
          <div class="error-code">404</div>
          <div class="error-circles">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
        </div>
        
        <h1 class="error-title">Página no encontrada</h1>
        <p class="error-description">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div class="error-actions">
          <a routerLink="/" class="btn-primary">
            <span nz-icon nzType="home" nzTheme="outline"></span>
            Regresar al Home
          </a>
          <a routerLink="/events" class="btn-secondary">
            <span nz-icon nzType="calendar" nzTheme="outline"></span>
            Ver Eventos
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      padding: 2rem;
    }
    
    .error-content {
      text-align: center;
      max-width: 500px;
    }
    
    .error-illustration {
      position: relative;
      margin-bottom: 2rem;
    }
    
    .error-code {
      font-size: 8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    
    .error-circles {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
    }
    
    .circle {
      position: absolute;
      border-radius: 50%;
      border: 2px solid rgba(168, 85, 247, 0.2);
      animation: pulse 3s ease-in-out infinite;
    }
    
    .circle-1 {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    
    .circle-2 {
      width: 70%;
      height: 70%;
      top: 15%;
      left: 15%;
      animation-delay: 0.5s;
    }
    
    .circle-3 {
      width: 40%;
      height: 40%;
      top: 30%;
      left: 30%;
      animation-delay: 1s;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    
    .error-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.75rem;
    }
    
    .error-description {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 2rem;
      font-size: 1rem;
    }
    
    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: #fff;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class NotFoundComponent {}

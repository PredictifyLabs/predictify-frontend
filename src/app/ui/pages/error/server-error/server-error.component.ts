import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink, NzButtonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-illustration">
          <span nz-icon nzType="cloud-server" nzTheme="outline" class="server-icon"></span>
          <div class="error-code">500</div>
        </div>
        
        <h1 class="error-title">Error del servidor</h1>
        <p class="error-description">
          Algo salió mal en nuestros servidores. Nuestro equipo ya está trabajando para solucionarlo.
        </p>
        
        <div class="error-actions">
          <a routerLink="/" class="btn-primary">
            <span nz-icon nzType="home" nzTheme="outline"></span>
            Regresar al Home
          </a>
          <button class="btn-secondary" (click)="reload()">
            <span nz-icon nzType="reload" nzTheme="outline"></span>
            Reintentar
          </button>
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
    
    .server-icon {
      font-size: 4rem;
      color: #ef4444;
      opacity: 0.8;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .error-code {
      font-size: 6rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-top: 1rem;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
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
      cursor: pointer;
      border: none;
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
export class ServerErrorComponent {
  reload(): void {
    window.location.reload();
  }
}

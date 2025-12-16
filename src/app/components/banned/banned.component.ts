import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-banned',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule],
  template: `
    <div class="banned-container">
      <div class="banned-card">
        <div class="banned-icon">
          <span nz-icon nzType="stop" nzTheme="outline"></span>
        </div>
        
        <h1>Cuenta Suspendida</h1>
        
        <p class="banned-message">
          Tu cuenta ha sido suspendida por incumplimiento de nuestros 
          <a href="/terms" target="_blank">Términos y Condiciones</a>.
        </p>
        
        <div class="banned-reasons">
          <h3>Posibles razones:</h3>
          <ul>
            <li>Violación de las normas de la comunidad</li>
            <li>Actividad sospechosa o fraudulenta</li>
            <li>Contenido inapropiado o spam</li>
            <li>Múltiples reportes de otros usuarios</li>
          </ul>
        </div>
        
        <div class="banned-actions">
          <p class="contact-info">
            Si crees que esto es un error, puedes contactar a nuestro equipo de soporte:
          </p>
          
          <div class="action-buttons">
            <a href="mailto:soporte&#64;predictify.com?subject=Apelación de suspensión de cuenta" class="btn-primary">
              <span nz-icon nzType="mail" nzTheme="outline"></span>
              Contactar Soporte
            </a>
            
            <a href="https://help.predictify.com" target="_blank" class="btn-secondary">
              <span nz-icon nzType="question-circle" nzTheme="outline"></span>
              Centro de Ayuda
            </a>
          </div>
        </div>
        
        <div class="banned-footer">
          <p>ID de referencia: {{ referenceId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .banned-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      padding: 20px;
    }

    .banned-card {
      max-width: 520px;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 48px;
      text-align: center;
    }

    .banned-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: rgba(239, 68, 68, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .banned-icon span {
      font-size: 40px;
      color: #EF4444;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 16px 0;
    }

    .banned-message {
      font-size: 16px;
      color: #888888;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }

    .banned-message a {
      color: #A855F7;
      text-decoration: none;
    }

    .banned-message a:hover {
      text-decoration: underline;
    }

    .banned-reasons {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
      text-align: left;
    }

    .banned-reasons h3 {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 12px 0;
    }

    .banned-reasons ul {
      margin: 0;
      padding-left: 20px;
    }

    .banned-reasons li {
      font-size: 13px;
      color: #666666;
      margin-bottom: 8px;
    }

    .banned-reasons li:last-child {
      margin-bottom: 0;
    }

    .banned-actions {
      margin-bottom: 24px;
    }

    .contact-info {
      font-size: 14px;
      color: #888888;
      margin: 0 0 16px 0;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-primary,
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      color: #FFFFFF;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .banned-footer {
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .banned-footer p {
      font-size: 12px;
      color: #444444;
      margin: 0;
      font-family: monospace;
    }
  `]
})
export class BannedComponent {
  referenceId = `BAN-${Date.now().toString(36).toUpperCase()}`;
}

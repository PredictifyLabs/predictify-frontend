import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../infrastructure/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <div class="loading-container">
          <div class="logo-wrapper">
            <span class="logo">predictify<span class="degree">°</span></span>
            <svg class="spinner-ring" viewBox="0 0 100 100">
              <circle 
                class="spinner-track" 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke-width="4"
              />
              <circle 
                class="spinner-path" 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .logo-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      height: 140px;
    }
    
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.02em;
      z-index: 1;
    }
    
    .logo .degree {
      color: #a855f7;
    }
    
    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: rotate 2s linear infinite;
    }
    
    .spinner-track {
      stroke: rgba(168, 85, 247, 0.1);
    }
    
    .spinner-path {
      stroke: url(#gradient);
      stroke-dasharray: 180;
      stroke-dashoffset: 60;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 100, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 100, 200;
        stroke-dashoffset: -180;
      }
    }
  `]
})
export class LoadingComponent {
  readonly loadingService = inject(LoadingService);
}

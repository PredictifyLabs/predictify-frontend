import { Directive, ElementRef, Input, OnInit, inject, HostListener } from '@angular/core';
import { getUserInitials } from '../../domain/models/user.model';

@Directive({
  selector: '[appDefaultAvatar]',
  standalone: true
})
export class DefaultAvatarDirective implements OnInit {
  @Input() appDefaultAvatar: string = '';
  @Input() avatarName: string = '';
  @Input() avatarSize: number = 40;
  
  private readonly el = inject(ElementRef);
  
  ngOnInit(): void {
    this.setupFallback();
  }
  
  @HostListener('error')
  onError(): void {
    this.showFallback();
  }
  
  private setupFallback(): void {
    const img = this.el.nativeElement as HTMLImageElement;
    if (!img.src || img.src === '' || this.appDefaultAvatar === '') {
      this.showFallback();
    }
  }
  
  private showFallback(): void {
    const initials = getUserInitials(this.avatarName || 'User');
    const size = this.avatarSize;
    
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a855f7"/>
            <stop offset="100%" style="stop-color:#6366f1"/>
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size / 5}" fill="url(#avatarGradient)"/>
        <text x="50%" y="50%" dy=".1em" fill="white" font-family="Inter, sans-serif" 
              font-size="${size * 0.4}" font-weight="600" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
      </svg>
    `;
    
    const encodedSvg = btoa(svg);
    const img = this.el.nativeElement as HTMLImageElement;
    img.src = `data:image/svg+xml;base64,${encodedSvg}`;
  }
}

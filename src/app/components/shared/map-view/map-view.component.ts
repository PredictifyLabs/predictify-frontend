import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container" [style.height]="height">
      <div #mapElement class="map-element"></div>
      @if (!isBrowser) {
        <div class="map-placeholder">
          <span>Mapa no disponible</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .map-container {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      background: #1a1a2e;
    }
    .map-element {
      width: 100% !important;
      height: 100% !important;
      min-height: 250px;
    }
    .map-placeholder {
      width: 100%;
      height: 100%;
      min-height: 250px;
      background: rgba(20, 20, 30, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
    }
    :host ::ng-deep .leaflet-container {
      width: 100% !important;
      height: 100% !important;
      min-height: 250px;
      background: #1a1a2e;
    }
    :host ::ng-deep .leaflet-control-attribution {
      background: rgba(0,0,0,0.7) !important;
      color: #888 !important;
      font-size: 10px;
    }
    :host ::ng-deep .leaflet-control-attribution a {
      color: #6366f1 !important;
    }
  `]
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement') mapElement!: ElementRef;
  
  @Input() latitude: number = 40.4168;
  @Input() longitude: number = -3.7038;
  @Input() zoom: number = 15;
  @Input() height: string = '250px';
  @Input() markerTitle: string = 'Ubicación del evento';
  @Input() interactive: boolean = false;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private platformId = inject(PLATFORM_ID);
  
  isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (!this.mapElement?.nativeElement) return;

    // Fix Leaflet icon paths
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    
    const defaultIcon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // Initialize map
    this.map = L.map(this.mapElement.nativeElement, {
      scrollWheelZoom: this.interactive,
      dragging: this.interactive,
      zoomControl: this.interactive,
      attributionControl: true
    }).setView([this.latitude, this.longitude], this.zoom);

    // Add tile layer (dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Add marker
    this.marker = L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup(this.markerTitle);

    // Multiple invalidateSize calls to ensure proper rendering
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 300);
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 500);
  }

  updatePosition(lat: number, lng: number): void {
    if (this.map && this.marker) {
      this.latitude = lat;
      this.longitude = lng;
      this.map.setView([lat, lng], this.zoom);
      this.marker.setLatLng([lat, lng]);
    }
  }
}

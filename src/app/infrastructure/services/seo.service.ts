import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { EventDTO } from '../../domain/models/event.model';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  publishedTime?: string;
  author?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly defaultConfig: SeoConfig = {
    title: environment.appName,
    description: environment.appDescription,
    image: `${environment.appUrl}/assets/og-image.png`,
    url: environment.appUrl,
    type: 'website'
  };
  
  updateTags(config: Partial<SeoConfig>): void {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    // Title
    this.title.setTitle(`${fullConfig.title} | ${environment.appName}`);
    
    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: fullConfig.description });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullConfig.title });
    this.meta.updateTag({ property: 'og:description', content: fullConfig.description });
    this.meta.updateTag({ property: 'og:image', content: fullConfig.image || '' });
    this.meta.updateTag({ property: 'og:url', content: fullConfig.url || '' });
    this.meta.updateTag({ property: 'og:type', content: fullConfig.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: environment.appName });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullConfig.title });
    this.meta.updateTag({ name: 'twitter:description', content: fullConfig.description });
    this.meta.updateTag({ name: 'twitter:image', content: fullConfig.image || '' });
    
    // Additional tags
    if (fullConfig.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: fullConfig.publishedTime });
    }
    if (fullConfig.author) {
      this.meta.updateTag({ property: 'article:author', content: fullConfig.author });
    }
  }
  
  updateForEvent(event: EventDTO): void {
    const url = `${environment.appUrl}/events/${event.slug || event.id}`;
    
    this.updateTags({
      title: event.title,
      description: event.shortDescription || event.description.substring(0, 160),
      image: event.imageUrl,
      url: url,
      type: 'event',
      publishedTime: event.publishedAt,
      author: event.organizer.displayName
    });
    
    // Add JSON-LD Schema for Event
    this.addEventSchema(event, url);
  }
  
  private addEventSchema(event: EventDTO, url: string): void {
    // Remove existing schema
    this.removeSchema();
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.description,
      image: event.imageUrl,
      url: url,
      startDate: `${event.startDate}T${event.startTime}`,
      endDate: event.endDate ? `${event.endDate}T${event.endTime || event.startTime}` : undefined,
      eventStatus: this.getEventStatus(event.status),
      eventAttendanceMode: this.getAttendanceMode(event.location.type),
      location: this.getLocationSchema(event),
      organizer: {
        '@type': 'Organization',
        name: event.organizer.displayName,
        url: event.organizer.website
      },
      offers: {
        '@type': 'Offer',
        price: event.isFree ? '0' : event.price?.toString(),
        priceCurrency: event.currency || 'USD',
        availability: 'https://schema.org/InStock',
        url: url
      }
    };
    
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'event-schema';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
  
  private removeSchema(): void {
    const existing = this.document.getElementById('event-schema');
    if (existing) {
      existing.remove();
    }
  }
  
  private getEventStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PUBLISHED': 'https://schema.org/EventScheduled',
      'CANCELLED': 'https://schema.org/EventCancelled',
      'COMPLETED': 'https://schema.org/EventMovedOnline',
      'DRAFT': 'https://schema.org/EventPostponed'
    };
    return statusMap[status] || 'https://schema.org/EventScheduled';
  }
  
  private getAttendanceMode(locationType: string): string {
    const modeMap: Record<string, string> = {
      'PHYSICAL': 'https://schema.org/OfflineEventAttendanceMode',
      'VIRTUAL': 'https://schema.org/OnlineEventAttendanceMode',
      'HYBRID': 'https://schema.org/MixedEventAttendanceMode'
    };
    return modeMap[locationType] || 'https://schema.org/OfflineEventAttendanceMode';
  }
  
  private getLocationSchema(event: EventDTO): object {
    if (event.location.type === 'VIRTUAL') {
      return {
        '@type': 'VirtualLocation',
        url: event.location.virtualLink
      };
    }
    
    return {
      '@type': 'Place',
      name: event.location.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address,
        addressLocality: event.location.city,
        addressCountry: event.location.country
      },
      geo: event.location.latitude && event.location.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: event.location.latitude,
        longitude: event.location.longitude
      } : undefined
    };
  }
  
  resetToDefault(): void {
    this.updateTags(this.defaultConfig);
    this.removeSchema();
  }
}

import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { EventPrediction, PredictionFactor, PredictionLevel, PREDICTION_FACTORS } from '../models/prediction.model';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  calculatePrediction(event: Event): EventPrediction {
    let score = 50;
    const factors: PredictionFactor[] = [];

    const engagementRatio = event.interested / event.capacity;
    if (engagementRatio > 0.7) {
      score += 15;
      factors.push({
        ...PREDICTION_FACTORS.HIGH_ENGAGEMENT,
        impact: 'high',
        weight: 0.15,
      });
    } else if (engagementRatio > 0.4) {
      score += 8;
      factors.push({
        ...PREDICTION_FACTORS.HIGH_ENGAGEMENT,
        impact: 'medium',
        weight: 0.08,
      });
    }

    if (event.organizer.isVerified) {
      score += 10;
      factors.push({
        ...PREDICTION_FACTORS.VERIFIED_ORGANIZER,
        impact: 'high',
        weight: 0.10,
      });
    }

    if (event.organizer.averageAttendanceRate && event.organizer.averageAttendanceRate > 0.75) {
      score += 8;
      factors.push({
        id: 'good_organizer_history',
        name: 'Buen historial del organizador',
        icon: 'check-circle',
        type: 'positive',
        impact: 'medium',
        weight: 0.08,
        description: `Tasa de asistencia promedio: ${Math.round(event.organizer.averageAttendanceRate * 100)}%`
      });
    }

    if (event.isFree) {
      score -= 10;
      factors.push({
        ...PREDICTION_FACTORS.FREE_EVENT,
        impact: 'medium',
        weight: -0.10,
      });
    }

    if (event.isTrending) {
      score += 12;
      factors.push({
        ...PREDICTION_FACTORS.TRENDING_TOPIC,
        impact: 'high',
        weight: 0.12,
      });
    }

    if (event.location.type === 'virtual') {
      score += 5;
      factors.push({
        id: 'virtual_event',
        name: 'Evento virtual',
        icon: 'global',
        type: 'positive',
        impact: 'low',
        weight: 0.05,
        description: 'Mayor accesibilidad al ser virtual'
      });
    } else if (event.location.type === 'physical' && event.location.city) {
      score += 3;
      factors.push({
        ...PREDICTION_FACTORS.GOOD_LOCATION,
        impact: 'low',
        weight: 0.03,
      });
    }

    const eventDate = new Date(event.date);
    const dayOfWeek = eventDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      score -= 5;
      factors.push({
        ...PREDICTION_FACTORS.WEEKEND_EVENT,
        type: 'negative',
        impact: 'low',
        weight: -0.05,
        description: 'Eventos en fin de semana pueden tener menor asistencia'
      });
    }

    const daysUntilEvent = Math.floor((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilEvent > 30 && event.interested > event.capacity * 0.3) {
      score += 7;
      factors.push({
        ...PREDICTION_FACTORS.EARLY_REGISTRATIONS,
        impact: 'medium',
        weight: 0.07,
      });
    }

    if (event.capacity < 50) {
      score += 5;
      factors.push({
        id: 'small_event',
        name: 'Evento pequeño',
        icon: 'team',
        type: 'positive',
        impact: 'low',
        weight: 0.05,
        description: 'Eventos pequeños suelen tener mayor tasa de asistencia'
      });
    }

    score = Math.min(100, Math.max(0, score));

    const level = this.getLevel(score);
    const estimatedAttendees = this.calculateEstimate(event, score);

    return {
      probability: Math.round(score),
      level,
      estimatedAttendees,
      confidence: this.calculateConfidence(factors),
      factors: factors.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)),
      lastUpdated: new Date(),
      trend: this.calculateTrend(event),
      trendChange: Math.random() * 10 - 5
    };
  }

  private getLevel(score: number): PredictionLevel {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private calculateEstimate(event: Event, score: number): { min: number; max: number; expected: number } {
    const baseRate = score / 100;
    const expected = Math.round(event.interested * baseRate);
    const variance = Math.round(expected * 0.1);

    return {
      min: Math.max(0, expected - variance),
      max: Math.min(event.capacity, expected + variance),
      expected
    };
  }

  private calculateConfidence(factors: PredictionFactor[]): number {
    const baseConfidence = 70;
    const factorBonus = Math.min(25, factors.length * 3);
    return Math.min(95, baseConfidence + factorBonus);
  }

  private calculateTrend(event: Event): 'up' | 'down' | 'stable' {
    const engagementRatio = event.interested / event.capacity;
    if (engagementRatio > 0.6) return 'up';
    if (engagementRatio < 0.3) return 'down';
    return 'stable';
  }

  getPredictionSummary(prediction: EventPrediction): string {
    const { probability, level, estimatedAttendees } = prediction;
    
    if (level === 'high') {
      return `Excelente perspectiva: se espera una asistencia de ${estimatedAttendees.expected} personas (${probability}% de probabilidad)`;
    } else if (level === 'medium') {
      return `Perspectiva moderada: se estima entre ${estimatedAttendees.min}-${estimatedAttendees.max} asistentes`;
    } else {
      return `Perspectiva baja: se recomienda revisar los factores negativos para mejorar la asistencia`;
    }
  }
}

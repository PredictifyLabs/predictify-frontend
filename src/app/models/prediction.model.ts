export interface EventPrediction {
  probability: number;
  level: PredictionLevel;
  estimatedAttendees: {
    min: number;
    max: number;
    expected: number;
  };
  confidence: number;
  factors: PredictionFactor[];
  lastUpdated: Date;
  trend?: 'up' | 'down' | 'stable';
  trendChange?: number;
}

export type PredictionLevel = 'high' | 'medium' | 'low';

export interface PredictionFactor {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  weight: number;
  description: string;
  icon: string;
}

export const PREDICTION_FACTORS = {
  HIGH_ENGAGEMENT: {
    id: 'high_engagement',
    name: 'Engagement alto',
    icon: 'fire',
    type: 'positive' as const,
    description: 'Alto número de interesados en relación a la capacidad'
  },
  TRENDING_TOPIC: {
    id: 'trending_topic',
    name: 'Tema trending',
    icon: 'rise',
    type: 'positive' as const,
    description: 'El tema del evento está en tendencia'
  },
  VERIFIED_ORGANIZER: {
    id: 'verified_organizer',
    name: 'Organizador verificado',
    icon: 'safety-certificate',
    type: 'positive' as const,
    description: 'Organizador con historial comprobado'
  },
  GOOD_LOCATION: {
    id: 'good_location',
    name: 'Ubicación accesible',
    icon: 'environment',
    type: 'positive' as const,
    description: 'Ubicación de fácil acceso'
  },
  EARLY_REGISTRATIONS: {
    id: 'early_registrations',
    name: 'Registros anticipados',
    icon: 'calendar',
    type: 'positive' as const,
    description: 'Registros tempranos indican alto interés'
  },
  GOOD_WEATHER: {
    id: 'good_weather',
    name: 'Buen clima previsto',
    icon: 'sun',
    type: 'positive' as const,
    description: 'Condiciones climáticas favorables'
  },
  FREE_EVENT: {
    id: 'free_event',
    name: 'Evento gratuito',
    icon: 'warning',
    type: 'negative' as const,
    description: 'Eventos gratis tienen mayor tasa de no-show'
  },
  COMPETING_EVENTS: {
    id: 'competing_events',
    name: 'Eventos competidores',
    icon: 'disconnect',
    type: 'negative' as const,
    description: 'Otros eventos similares en la misma fecha'
  },
  BAD_WEATHER: {
    id: 'bad_weather',
    name: 'Mal clima previsto',
    icon: 'cloud',
    type: 'negative' as const,
    description: 'Condiciones climáticas desfavorables'
  },
  HOLIDAY_SEASON: {
    id: 'holiday_season',
    name: 'Temporada de vacaciones',
    icon: 'gift',
    type: 'negative' as const,
    description: 'Menor asistencia en época de vacaciones'
  },
  WEEKEND_EVENT: {
    id: 'weekend_event',
    name: 'Evento en fin de semana',
    icon: 'calendar',
    type: 'neutral' as const,
    description: 'Puede aumentar o disminuir asistencia según tipo'
  }
} as const;

export function getPredictionColor(level: PredictionLevel): string {
  switch (level) {
    case 'high':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#EF4444';
  }
}

export function getPredictionLabel(level: PredictionLevel): string {
  switch (level) {
    case 'high':
      return 'Alta probabilidad';
    case 'medium':
      return 'Probabilidad media';
    case 'low':
      return 'Baja probabilidad';
  }
}

export function getPredictionIcon(level: PredictionLevel): string {
  switch (level) {
    case 'high':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'low':
      return '🔴';
  }
}

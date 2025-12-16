/**
 * Prediction Domain Models - Adapted from Backend DTOs
 */

export type PredictionLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type PredictionTrend = 'UP' | 'DOWN' | 'STABLE';
export type FactorType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type FactorImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PredictionFactorDTO {
  id: string;
  name: string;
  type: FactorType;
  impact: FactorImpact;
  weight: number;
  score: number;
  description?: string;
}

export interface PredictionDTO {
  id: string;
  eventId: string;
  probability: number;
  level: PredictionLevel;
  confidence: number;
  estimatedMin: number;
  estimatedMax: number;
  estimatedExpected: number;
  trend: PredictionTrend;
  trendChange?: number;
  calculatedAt: string;
  factors: PredictionFactorDTO[];
}

// Helper functions
export function getPredictionLevelLabel(level: PredictionLevel): string {
  const labels: Record<PredictionLevel, string> = {
    'HIGH': 'Alta probabilidad',
    'MEDIUM': 'Probabilidad media',
    'LOW': 'Baja probabilidad'
  };
  return labels[level] || level;
}

export function getPredictionLevelColor(level: PredictionLevel): string {
  const colors: Record<PredictionLevel, string> = {
    'HIGH': '#10B981',
    'MEDIUM': '#F59E0B',
    'LOW': '#EF4444'
  };
  return colors[level] || '#6B7280';
}

export function getFactorTypeIcon(type: FactorType): string {
  const icons: Record<FactorType, string> = {
    'POSITIVE': 'rise',
    'NEGATIVE': 'fall',
    'NEUTRAL': 'minus'
  };
  return icons[type] || 'info-circle';
}

export function getTrendIcon(trend: PredictionTrend): string {
  const icons: Record<PredictionTrend, string> = {
    'UP': 'arrow-up',
    'DOWN': 'arrow-down',
    'STABLE': 'minus'
  };
  return icons[trend] || 'minus';
}

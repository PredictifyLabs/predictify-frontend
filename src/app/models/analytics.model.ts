export interface EventAnalytics {
  eventId: string;
  overview: AnalyticsOverview;
  registrations: RegistrationTrend[];
  demographics: Demographics;
  trafficSources: TrafficSource[];
  engagement: EngagementMetrics;
  predictionAccuracy?: PredictionAccuracy;
}

export interface AnalyticsOverview {
  totalViews: number;
  totalInterested: number;
  totalRegistered: number;
  totalAttended?: number;
  conversionRate: number;
  attendanceRate?: number;
  revenue?: number;
}

export interface RegistrationTrend {
  date: string;
  count: number;
  cumulative: number;
}

export interface Demographics {
  ageGroups: DemographicData[];
  locations: DemographicData[];
  industries: DemographicData[];
  gender?: DemographicData[];
}

export interface DemographicData {
  label: string;
  value: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  conversions: number;
}

export interface EngagementMetrics {
  emailOpenRate: number;
  emailClickRate: number;
  socialShares: number;
  averageTimeOnPage: number;
  bounceRate: number;
}

export interface PredictionAccuracy {
  predicted: number;
  actual: number;
  accuracy: number;
  difference: number;
}

export interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
  averageAttendanceRate: number;
  totalRevenue: number;
  upcomingEvents: number;
  completedEvents: number;
  draftEvents: number;
}

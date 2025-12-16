export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: UserRole;
  isVerified: boolean;
  interests?: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  savedEvents?: string[];
  attendedEvents?: string[];
  organizedEvents?: string[];
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    eventReminders: boolean;
    newEvents: boolean;
    eventUpdates: boolean;
  };
  privacy: {
    showProfile: boolean;
    showAttendedEvents: boolean;
    showSavedEvents: boolean;
  };
  recommendations: {
    categories?: string[];
    locations?: string[];
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

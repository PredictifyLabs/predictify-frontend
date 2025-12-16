/**
 * User Domain Models - Adapted from Backend DTOs
 */

export type UserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'BANNED';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: UserRole;
  status?: UserStatus;
  isVerified: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export type BackendRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: BackendRole;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export interface UpdateUserDTO {
  name?: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

// Helper function to get user initials
export function getUserInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    'ATTENDEE': 'Asistente',
    'ORGANIZER': 'Organizador',
    'ADMIN': 'Administrador'
  };
  return labels[role] || role;
}

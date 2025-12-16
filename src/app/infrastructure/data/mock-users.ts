import { UserDTO } from '../../domain/models/user.model';

export interface MockUser {
  email: string;
  password: string;
  user: UserDTO;
}

/**
 * ═══════════════════════════════════════════════════════════
 * USUARIOS DE PRUEBA - PREDICTIFY
 * ═══════════════════════════════════════════════════════════
 * 
 * 👤 USUARIO (Asistente):
 *    Email:    user@predictify.app
 *    Password: User123!
 * 
 * 🎤 ORGANIZADOR:
 *    Email:    organizer@predictify.app
 *    Password: Organizer123!
 * 
 * 🔐 ADMIN:
 *    Email:    admin@predictify.app
 *    Password: Admin123!
 * 
 * ═══════════════════════════════════════════════════════════
 */
export const MOCK_USERS: MockUser[] = [
  {
    email: 'user@predictify.app',
    password: 'User123!',
    user: {
      id: 'usr_001',
      name: 'Carlos García',
      email: 'user@predictify.app',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      bio: 'Desarrollador Full Stack apasionado por eventos tech y networking.',
      location: 'Madrid, España',
      role: 'ATTENDEE',
      isVerified: true,
      emailVerifiedAt: '2024-01-15T10:30:00Z',
      lastLoginAt: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    email: 'organizer@predictify.app',
    password: 'Organizer123!',
    user: {
      id: 'usr_002',
      name: 'María López',
      email: 'organizer@predictify.app',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Organizadora de eventos tech. CEO de TechEvents Madrid. +50 eventos organizados.',
      location: 'Barcelona, España',
      role: 'ORGANIZER',
      isVerified: true,
      emailVerifiedAt: '2023-06-20T14:00:00Z',
      lastLoginAt: new Date().toISOString(),
      createdAt: '2023-06-01T00:00:00Z'
    }
  },
  {
    email: 'admin@predictify.app',
    password: 'Admin123!',
    user: {
      id: 'usr_003',
      name: 'Admin Predictify',
      email: 'admin@predictify.app',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      bio: 'Administrador de la plataforma Predictify.',
      location: 'Global',
      role: 'ADMIN',
      isVerified: true,
      emailVerifiedAt: '2023-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      createdAt: '2023-01-01T00:00:00Z'
    }
  }
];

export function findMockUser(email: string, password: string): MockUser | undefined {
  return MOCK_USERS.find(u => u.email === email && u.password === password);
}

export function generateMockToken(user: UserDTO): string {
  // Simula un JWT token (base64 encoded)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa('mock-signature-' + user.id);
  return `${header}.${payload}.${signature}`;
}

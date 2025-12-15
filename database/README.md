# Predictify - Database Schema

## Descripción General

Este esquema de base de datos PostgreSQL está diseñado para **Predictify**, una plataforma de gestión de eventos con predicciones de asistencia basadas en múltiples factores.

## Requisitos

- **PostgreSQL 15+**
- Extensiones requeridas:
  - `uuid-ossp` - Generación de UUIDs
  - `pgcrypto` - Funciones criptográficas
  - `pg_trgm` - Búsquedas de texto eficientes
  - `unaccent` - Búsquedas sin acentos

## Instalación

```bash
# Crear la base de datos
createdb predictify

# Ejecutar el schema
psql -d predictify -f schema.sql
```

## Arquitectura del Esquema

### Diagrama de Entidades Principales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  users                                                                   │
│    ├── user_social_links (1:1)                                          │
│    ├── user_preferences (1:1)                                           │
│    ├── user_interests (1:N)                                             │
│    ├── user_preferred_categories (1:N)                                  │
│    └── user_preferred_locations (1:N)                                   │
└─────────────────────────────────────────────────────────────────────────┘
           │
           │ (1:1)
           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            ORGANIZERS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  organizers ◄───────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────────┘
           │
           │ (1:N)
           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              EVENTS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  events                                                                  │
│    ├── event_locations (1:1)                                            │
│    ├── event_gallery (1:N)                                              │
│    ├── event_tags (N:M) ──► tags                                        │
│    ├── event_speakers (N:M) ──► speakers                                │
│    ├── event_agenda (1:N)                                               │
│    ├── event_predictions (1:N)                                          │
│    │     └── event_prediction_factors (1:N)                             │
│    ├── event_analytics (1:N)                                            │
│    ├── registration_trends (1:N)                                        │
│    ├── traffic_sources (1:N)                                            │
│    └── event_demographics (1:N)                                         │
└─────────────────────────────────────────────────────────────────────────┘
           │
           │ (N:M)
           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER-EVENT RELATIONS                            │
├─────────────────────────────────────────────────────────────────────────┤
│  event_registrations (users ◄──► events)                                │
│  event_interested (users ◄──► events)                                   │
│  saved_events (users ◄──► events)                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Tablas Principales

### Gestión de Usuarios

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema |
| `user_social_links` | Redes sociales del usuario |
| `user_preferences` | Preferencias de notificaciones y privacidad |
| `user_interests` | Intereses para recomendaciones |
| `organizers` | Perfil extendido de organizadores |

### Gestión de Eventos

| Tabla | Descripción |
|-------|-------------|
| `events` | Información principal del evento |
| `event_locations` | Ubicación física/virtual |
| `event_gallery` | Galería de imágenes |
| `event_agenda` | Programa del evento |
| `event_speakers` | Ponentes asignados |
| `event_tags` | Etiquetas del evento |
| `speakers` | Catálogo de ponentes |
| `tags` | Catálogo de etiquetas |

### Predicciones

| Tabla | Descripción |
|-------|-------------|
| `prediction_factors_catalog` | Catálogo de factores de predicción |
| `event_predictions` | Predicciones calculadas |
| `event_prediction_factors` | Factores aplicados por predicción |

### Analytics

| Tabla | Descripción |
|-------|-------------|
| `event_analytics` | Métricas agregadas |
| `registration_trends` | Tendencias de registro |
| `traffic_sources` | Fuentes de tráfico |
| `event_demographics` | Datos demográficos |

### Interacción Usuario-Evento

| Tabla | Descripción |
|-------|-------------|
| `event_registrations` | Registros a eventos |
| `event_interested` | Usuarios interesados |
| `saved_events` | Eventos guardados |

### Seguridad y Autenticación

| Tabla | Descripción |
|-------|-------------|
| `refresh_tokens` | Tokens de refresco JWT |
| `email_verifications` | Tokens de verificación de email |
| `password_resets` | Tokens de restablecimiento de contraseña |
| `active_sessions` | Sesiones activas de usuarios |
| `audit_log` | Log de auditoría |

### Sistema de Permisos

| Tabla | Descripción |
|-------|-------------|
| `permissions` | Catálogo de permisos del sistema |
| `role_permissions` | Asignación de permisos por rol |
| `protected_routes` | Rutas protegidas del frontend |

## Tipos Enumerados

```sql
-- Roles de usuario
user_role: 'attendee', 'organizer', 'admin'

-- Estado del evento
event_status: 'draft', 'published', 'cancelled', 'completed'

-- Categoría del evento
event_category: 'conference', 'hackathon', 'workshop', 'meetup', 
                'networking', 'bootcamp', 'webinar'

-- Tipo de evento
event_type: 'presencial', 'virtual', 'hibrido'

-- Tipo de ubicación
location_type: 'physical', 'virtual', 'hybrid'

-- Nivel de predicción
prediction_level: 'high', 'medium', 'low'

-- Tendencia de predicción
prediction_trend: 'up', 'down', 'stable'

-- Tipo de factor
factor_type: 'positive', 'negative', 'neutral'

-- Impacto del factor
factor_impact: 'high', 'medium', 'low'
```

## Características de Seguridad

### 1. Validaciones con Constraints
- Validación de formato de email con regex
- Rangos válidos para coordenadas geográficas
- Consistencia de fechas y precios
- Validación de porcentajes y tasas (0-1)
- Longitud mínima de nombres

### 2. Row Level Security (RLS)
Habilitado en tablas sensibles con políticas específicas:

| Tabla | Políticas |
|-------|-----------|
| `users` | Solo ver/editar propio perfil, admins ven todo |
| `user_preferences` | Solo acceso a preferencias propias |
| `user_social_links` | Solo acceso a links propios |
| `event_registrations` | Usuario ve propios, organizador ve de sus eventos |
| `saved_events` | Solo acceso a guardados propios |
| `refresh_tokens` | Solo acceso a tokens propios |

### 3. Auditoría Automática
- Tabla `audit_log` con triggers automáticos
- Registro de INSERT, UPDATE, DELETE en tablas críticas
- Almacena valores anteriores y nuevos (JSONB)
- Tracking de IP y user_agent

### 4. Protección contra Ataques
- Contraseñas almacenadas como hash bcrypt
- Contador de intentos fallidos de login
- Bloqueo temporal de cuentas (`locked_until`)
- Tokens de verificación con expiración
- Rate limiting recomendado en API Gateway

### 5. Gestión de Sesiones
- Tokens de refresh con expiración
- Revocación de tokens
- Tracking de dispositivos y ubicación
- Verificación de email obligatoria

## Optimizaciones de Rendimiento

### Índices Estratégicos
- Índices parciales para queries frecuentes
- Índice GIN para búsqueda full-text en español
- Índice trigram para búsqueda aproximada
- Índices compuestos para filtros comunes

### Contadores Desnormalizados
Para evitar COUNT(*) costosos:
- `events.interested_count`
- `events.registered_count`
- `events.attendees_count`
- `events.views_count`
- `organizers.events_count`
- `tags.usage_count`

### Triggers Automáticos
- Actualización de `updated_at`
- Generación de slugs únicos
- Actualización de contadores
- Mantenimiento de estadísticas

## Vistas Disponibles

### `v_events_complete`
Eventos con toda su información relacionada (ubicación, organizador, última predicción).

### `v_dashboard_stats`
Estadísticas agregadas para el dashboard:
- Total de eventos
- Total de asistentes
- Tasa promedio de asistencia
- Ingresos totales
- Eventos próximos/completados/borradores

## Mantenimiento

### Limpieza de Datos Antiguos

```sql
-- Eliminar tokens expirados
DELETE FROM refresh_tokens 
WHERE expires_at < NOW() - INTERVAL '7 days';

-- Archivar logs antiguos (más de 1 año)
DELETE FROM audit_log 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Estadísticas de Tablas

```sql
-- Actualizar estadísticas
ANALYZE;

-- Ver tamaño de tablas
SELECT 
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## Sistema de Roles y Permisos

### Roles del Sistema

El sistema maneja **3 roles principales**:

| Rol | Descripción | Accesos |
|-----|-------------|---------|
| `admin` | Administrador | Acceso total al sistema |
| `organizer` | Organizador de eventos | Crear/gestionar eventos propios, analytics |
| `attendee` | Usuario normal | Ver eventos, registrarse, guardar favoritos |

### Matriz de Permisos por Rol

```
╔═══════════════════════╦═══════════════╦═══════════════╦══════════════════════╗
║ PERMISO               ║ ADMIN         ║ ORGANIZER     ║ ATTENDEE (Usuario)   ║
╠═══════════════════════╬═══════════════╬═══════════════╬══════════════════════╣
║ USUARIOS              ║               ║               ║                      ║
║ - Ver todos           ║ ✓             ║ ✗             ║ ✗                    ║
║ - Ver/Editar propio   ║ ✓             ║ ✓             ║ ✓                    ║
║ - Eliminar            ║ ✓             ║ ✗             ║ ✗                    ║
║ - Cambiar roles       ║ ✓             ║ ✗             ║ ✗                    ║
╠═══════════════════════╬═══════════════╬═══════════════╬══════════════════════╣
║ EVENTOS               ║               ║               ║                      ║
║ - Ver publicados      ║ ✓             ║ ✓             ║ ✓                    ║
║ - Ver todos (drafts)  ║ ✓             ║ ✗             ║ ✗                    ║
║ - Crear               ║ ✓             ║ ✓             ║ ✗                    ║
║ - Editar propios      ║ ✓             ║ ✓             ║ ✗                    ║
║ - Publicar            ║ ✓             ║ ✓             ║ ✗                    ║
║ - Destacar            ║ ✓             ║ ✗             ║ ✗                    ║
╠═══════════════════════╬═══════════════╬═══════════════╬══════════════════════╣
║ REGISTROS             ║               ║               ║                      ║
║ - Ver propios         ║ ✓             ║ ✓             ║ ✓                    ║
║ - Registrarse         ║ ✓             ║ ✓             ║ ✓                    ║
║ - Check-in            ║ ✓             ║ ✓             ║ ✗                    ║
╠═══════════════════════╬═══════════════╬═══════════════╬══════════════════════╣
║ ANALYTICS             ║               ║               ║                      ║
║ - Ver propios         ║ ✓             ║ ✓             ║ ✗                    ║
║ - Ver todos           ║ ✓             ║ ✗             ║ ✗                    ║
║ - Exportar            ║ ✓             ║ ✓             ║ ✗                    ║
╠═══════════════════════╬═══════════════╬═══════════════╬══════════════════════╣
║ DASHBOARDS            ║               ║               ║                      ║
║ - Admin               ║ ✓             ║ ✗             ║ ✗                    ║
║ - Organizador         ║ ✓             ║ ✓             ║ ✗                    ║
║ - Usuario             ║ ✓             ║ ✓             ║ ✓                    ║
╚═══════════════════════╩═══════════════╩═══════════════╩══════════════════════╝
```

### Rutas Protegidas

Las rutas están configuradas en la tabla `protected_routes`:

#### Rutas Públicas
- `/` - Home
- `/events` - Listado de eventos
- `/events/:slug` - Detalle de evento
- `/auth/login` - Login
- `/auth/register` - Registro
- `/organizers` - Listado de organizadores

#### Rutas de Usuario Autenticado
- `/profile` - Mi perfil
- `/profile/edit` - Editar perfil
- `/my-events` - Eventos registrados
- `/saved-events` - Favoritos

#### Rutas de Organizador
- `/dashboard` - Panel principal
- `/dashboard/events` - Mis eventos
- `/dashboard/events/new` - Crear evento
- `/dashboard/events/:id/edit` - Editar evento
- `/dashboard/events/:id/analytics` - Analytics

#### Rutas de Administrador
- `/admin` - Panel admin
- `/admin/users` - Gestión usuarios
- `/admin/events` - Gestión eventos
- `/admin/organizers` - Verificar organizadores
- `/admin/audit` - Logs de auditoría
- `/admin/settings` - Configuración

### Funciones de Autorización

```sql
-- Obtener usuario actual (desde JWT)
SELECT current_user_id();

-- Obtener rol del usuario actual
SELECT current_user_role();

-- Verificar permiso específico
SELECT has_permission('events.create');

-- Verificar si es admin
SELECT is_admin();

-- Verificar si es organizador
SELECT is_organizer();

-- Verificar propiedad de evento
SELECT owns_event('event-uuid-here');

-- Verificar acceso a ruta
SELECT can_access_route('user-uuid', '/dashboard/events');

-- Obtener permisos de usuario
SELECT * FROM get_user_permissions('user-uuid');

-- Obtener rutas accesibles
SELECT * FROM get_accessible_routes('user-uuid');
```

### Uso con JWT (Backend)

En cada request, el backend debe setear el usuario actual:

```sql
-- Al inicio de cada request autenticado
SET LOCAL app.current_user_id = 'uuid-del-usuario';

-- Las políticas RLS aplicarán automáticamente
SELECT * FROM events; -- Solo verá lo permitido por su rol
```

## Roles de Base de Datos

### Roles Creados

| Rol | Tipo | Descripción |
|-----|------|-------------|
| `predictify_app` | LOGIN | Rol principal de la aplicación |
| `predictify_anon` | NOLOGIN | Usuarios no autenticados |
| `predictify_authenticated` | NOLOGIN | Usuarios autenticados |
| `predictify_admin` | NOLOGIN | Administradores |
| `predictify_readonly` | LOGIN | Solo lectura para reportes |

### Configuración en Producción

```sql
-- IMPORTANTE: Cambiar contraseñas antes de producción
ALTER ROLE predictify_app WITH PASSWORD 'nueva_contraseña_segura';
ALTER ROLE predictify_readonly WITH PASSWORD 'otra_contraseña_segura';
```

## Migración desde Frontend

El esquema está diseñado para mapear directamente los modelos TypeScript del frontend:

| Frontend Interface | PostgreSQL Table(s) |
|--------------------|---------------------|
| `User` | `users`, `user_social_links`, `user_preferences` |
| `Event` | `events`, `event_locations`, `event_gallery` |
| `Organizer` | `organizers` |
| `Speaker` | `speakers` |
| `AgendaItem` | `event_agenda` |
| `EventPrediction` | `event_predictions`, `event_prediction_factors` |
| `PredictionFactor` | `prediction_factors_catalog` |
| `EventAnalytics` | `event_analytics`, `registration_trends`, etc. |

## Licencia

Parte del proyecto Predictify.

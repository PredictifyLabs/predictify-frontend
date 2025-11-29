# Planificación: Nuevo hero para componente `Events`

## Objetivo

- **Recrear** el diseño del hero de la referencia (tarjeta grande con bordes redondeados y varios bloques internos).
- **Mantener** los colores y patrones de la página actual (fondos oscuros, gradientes ya definidos en el proyecto), evitando los morados sólidos del mockup.
- **Integrar** la barra de búsqueda y la lógica existente (`searchQuery`, `filteredEvents`) sin cambios en TypeScript.

## Paleta de colores del proyecto a reutilizar

Tomada de los estilos actuales en `events.css` y otras partes de la app. El nuevo hero **no introduce colores nuevos**, solo combina los existentes:

- **Fondo principal página**: `#050505`
- **Texto principal**: `#fff`, `whitesmoke`
- **Gradiente principal** (títulos, pills activas, etc.): `linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)`
- **Grises para texto secundario y placeholders**: `#888`, `#666`
- **Bordes y fondos sutiles**:
  - `rgba(255, 255, 255, 0.03)`
  - `rgba(255, 255, 255, 0.05)`
  - `rgba(255, 255, 255, 0.08)`
  - `rgba(255, 255, 255, 0.1)`

El diseño del hero deberá usar combinaciones de estos valores (y sus opacidades) para fondos de tarjeta, bordes, sombras suaves y estados hover.

## Pasos

### 1. Actualizar estructura HTML del hero (`events.html`)

- **Reemplazar** el bloque existente del hero (desde `<!-- Hero Section -->` hasta el cierre de `</div>` de esa sección) por una nueva estructura basada en `CSS Grid` que copie la distribución de la imagen de referencia.

- **Estructura general del hero**:
  - Contenedor principal `div.hero-section`.
  - Dentro, un contenedor tipo tarjeta `div.hero-shell` que actúa como el marco redondeado grande.
  - Dentro de `hero-shell`, tres zonas principales:
    - **Nav superior**: `div.hero-nav` con varios botones `button.hero-nav-pill` centrados horizontalmente.
    - **Contenido de cabecera (texto)**: `div.hero-header` con:
      - `h1.hero-title` (título multilínea grande).
      - `p.hero-subtitle` (texto descriptivo más corto debajo).
      - (Opcional) la barra de búsqueda `search-container hero-search` justo debajo del subtítulo.
    - **Zona de tarjetas inferior**: `div.hero-grid` que usará `grid-template-areas` para replicar la composición de la imagen.

- **Layout tipo grid para la parte inferior (`hero-grid`)**:
  - `hero-grid` definirá 3 columnas y 2 filas, algo como:
    - Fila 1: `[left-main][right-text][right-text]`
    - Fila 2: `[left-main][center-buttons][right-box]`
  - Cada área se representará con un contenedor específico:
    - `div.hero-panel-left` (rectángulo grande a la izquierda, ocupa dos filas y una columna completa).
    - `div.hero-panel-right-text` (bloque de texto superior derecho, ocupa la parte superior de las columnas 2 y 3).
    - `div.hero-panel-center` (columna central inferior con dos botones apilados).
      - Dentro: dos botones tipo pill `div.hero-button` uno encima del otro (por ejemplo “Seleccionar” y “Contenido”).
    - `div.hero-panel-right-box` (rectángulo inferior derecho que ocupa la tercera columna de la segunda fila).

- **Contenido semántico** dentro de cada bloque:
  - `hero-panel-left`: puede mostrar una previsualización del evento destacado o simplemente ser un bloque decorativo por ahora.
  - `hero-panel-right-text`: texto secundario o descripción larga de eventos.
  - `hero-panel-center`: CTA principales en forma de botones.
  - `hero-panel-right-box`: otro bloque que en el futuro puede mostrar métricas, próximos eventos, etc.

### 2. Definir/ajustar estilos CSS (`events.css`)

- **Actualizar** la sección `/* Hero Section */` para que:
  - `hero-section` tenga un padding general y use como fondo el de la página.
  - `hero-shell` funcione como tarjeta principal (igual a la imagen):
    - `max-width` centrado.
    - `border-radius` grande (≈ 2rem) en todo el marco.
    - Fondo basado en la paleta existente (base oscura + gradiente principal si se desea).
    - Borde sutil y `box-shadow` profundo.
    - `backdrop-filter: blur(...)` para dar efecto de vidrio.
- **Barra de navegación superior** (parte superior de la tarjeta):
  - `hero-nav`: contenedor centrado horizontalmente con `display: inline-flex`, fondo oscuro translúcido y borde suave.
  - `hero-nav-pill`: botones tipo píldora, con estados hover.
  - `hero-nav-pill.active`: usa el gradiente principal `#a855f7 → #3b82f6`, texto oscuro y `font-weight` más alto.
- **Cabecera de texto** (`hero-header`):
  - Alineado a la izquierda dentro de `hero-shell`.
  - `hero-title`: tipografía muy grande (similar a la imagen), color claro y con posible uso de `gradient-text` en una parte.
  - `hero-subtitle`: texto secundario gris (`#888`) con `max-width` para que no ocupe todo el ancho.
  - `hero-search`: reutiliza estilos de `.search-container`, añadiendo solo margen superior.
- **Grid inferior que replica exactamente la composición de la imagen**:
  - `hero-grid`:
    - `display: grid`.
    - 3 columnas (por ejemplo `2fr 1.1fr 1.1fr`).
    - 2 filas.
    - `grid-template-areas` similar a:
      - `"left-main right-text right-text"`
      - `"left-main center-buttons right-box"`.
    - `gap` uniforme entre tarjetas.
  - `hero-panel-left`:
    - `grid-area: left-main`.
    - Gran rectángulo con `border-radius` grande, borde sutil y fondo translúcido usando la paleta.
  - `hero-panel-right-text`:
    - `grid-area: right-text`.
    - Bloque de texto con fondo similar al del hero pero ligeramente elevado.
  - `hero-panel-center`:
    - `grid-area: center-buttons`.
    - Contenedor vertical (`display: flex; flex-direction: column; gap: ...`) para los dos botones.
  - `hero-panel-right-box`:
    - `grid-area: right-box`.
    - Rectángulo inferior derecho con mismo estilo de tarjeta que el izquierdo, pero más compacto.
  - Botones dentro de `hero-panel-center`:
    - Clase `hero-button` o reutilización de estilo tipo pill.
    - Mismo gradiente que las pills activas o fondo translúcido según paleta.
- **Hacer el diseño responsivo**:
  - Media query `@media (max-width: 900px)`:
    - `hero-shell` mantiene el marco, pero `hero-grid` pasa a una sola columna.
    - Los paneles (`hero-panel-left`, `hero-panel-right-text`, `hero-panel-center`, `hero-panel-right-box`) se apilan en un orden lógico (texto, panel izquierdo, botones, panel derecho).
    - Reducir tamaño de fuente de `hero-title` para caber en pantallas pequeñas.

## Verificación funcional

- **Comprobar** que:
  - La barra de búsqueda sigue filtrando eventos (`[(ngModel)]="searchQuery"` intacto).
  - No se modificó la lógica en `events.ts`.
  - El hero se adapta correctamente en desktop y mobile.
- **Ajustar** gradientes, sombras o tamaños de fuente para alinear mejor con la identidad visual global de la app.

## Posibles mejoras futuras

- Conectar el contenido de “Próximo evento” a los datos reales del arreglo `events` (por ejemplo, el primer evento o el más próximo en fecha).
- Añadir animaciones sutiles al hover de las tarjetas (`transform`, `box-shadow`).
- Permitir que las píldoras de la nav superior cambien vistas reales (por ejemplo, pestañas de eventos).

<div align="center">

# 🔥 PULSO 100

### **Tu límite es el siguiente pulso**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Plataforma de entrenamiento personalizado con sistema de gamificación y seguimiento de progreso**

[🚀 Ver Demo](https://proyecto-pulso100.vercel.app) | [📖 Documentación](#-arquitectura-técnica) | [🐛 Reportar Bug](https://github.com/usuario/Proyecto-Pulso100/issues)

</div>

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase (gratuita)

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/usuario/Proyecto-Pulso100.git
cd Proyecto-Pulso100

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Copiar credenciales del proyecto:
   - Project URL
   - Anon/Public Key

3. Actualizar archivo `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. Ejecutar migraciones SQL (ver carpeta `/database`)

### Ejecutar en desarrollo

```bash
npm run dev
# Abre http://localhost:5173
```

### Build para producción

```bash
npm run build
npm run preview
```

---

## 📊 Estado del Proyecto

| Fase | Descripción | Estado | Completado |
|------|-------------|--------|------------|
| **Semana 1** | Setup + Fundación | ✅ Completada | 100% |
| **Semana 2** | Vista Usuario - Core | ✅ Completada | 100% |
| **Semana 3** | Calendario Usuario | ✅ Completada | 100% |
| **Semana 4** | Progreso + Gamificación | ✅ Completada | 100% |
| **Semana 5** | Integración Supabase | ✅ Completada | 95% |
| **Semana 6** | Panel Admin + CRUD | 🔄 En Progreso | 30% |
| **Semana 7** | Polish + Testing | ⏳ Pendiente | 0% |

### 🎯 Hitos Principales Alcanzados

- ✅ **Migración completa** de LocalStorage a PostgreSQL (Supabase)
- ✅ **Sistema de autenticación** con Supabase Auth (login, registro, recuperación)
- ✅ **14 medallas desbloqueables** con lógica automática
- ✅ **Gráficos de progreso** con Recharts (7 días, categorías, calorías)
- ✅ **Services Layer** completo (workout, progress, medal, schedule)
- ✅ **Hook useProgress** optimizado con carga en 2 fases
- 🔄 **Panel Admin** en desarrollo (estructura UI creada)

---

## ✨ Core Features

### 👤 Para Usuarios

<table>
<tr>
<td width="50%">

#### 📅 Calendario Inteligente
- Visualización mensual con eventos
- Drag & Drop para reprogramar
- Colores por categoría de entrenamiento
- Estados: pendiente/completado/cancelado

#### 🏋️ Biblioteca de Rutinas
- 5+ rutinas pre-cargadas
- Filtros: Fuerza, Cardio, HIIT, Flexibilidad
- Detalle con ejercicios paso a paso
- Videos embebidos de YouTube

</td>
<td width="50%">

#### 📈 Seguimiento & Progreso
- Gráficos de entrenamientos (últimos 7 días)
- Stats: minutos, calorías, categorías
- Racha de días consecutivos 🔥
- Hook `useProgress` centralizado

#### 🏆 Sistema de Gamificación
- **14 medallas desbloqueables**
  - Primera Victoria
  - Racha de Fuego (7 días)
  - Guerrero (30 entrenamientos)
  - Incansable (500 calorías)
  - Y más...
- Desbloqueo automático post-workout

</td>
</tr>
</table>

#### ⏱️ Timer de Entrenamiento
- Cronómetro en tiempo real
- Lista de ejercicios con reps
- Registro automático al completar
- Cálculo de calorías quemadas

---

### 🔧 Para Administradores

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Dashboard** | ✅ UI Creada | Métricas globales, usuarios activos, workouts completados |
| **Ejercicios** | 🔄 En Progreso | CRUD completo (estructura lista, falta conectar Supabase) |
| **Rutinas** | 🔄 En Progreso | Gestión de workouts con asignación de ejercicios |
| **Usuarios** | 🔄 En Progreso | Tabla de usuarios, asignar entrenadoras, ver progreso |
| **Configuración** | ⏳ Pendiente | Categorías, niveles, sistema de medallas |

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend          │  Backend          │  Tooling
──────────────────┼───────────────────┼────────────────
React 18.3        │  Supabase         │  Vite 5.4
React Router v7   │  PostgreSQL       │  ESLint
Context API       │  Supabase Auth    │  PostCSS
Recharts          │  Row Level Sec.   │  date-fns
Tailwind CSS 3.4  │                   │  Lucide Icons
```

### Arquitectura de Capas

```
┌─────────────────────────────────────────────┐
│            Pages (usuario/admin)            │
├─────────────────────────────────────────────┤
│   Hooks (useProgress, useAuth, ...)        │
├─────────────────────────────────────────────┤
│   Context (Auth, Schedule, Workout, ...)   │
├─────────────────────────────────────────────┤
│   Services (workoutService, medalService)  │
├─────────────────────────────────────────────┤
│           Supabase Client (lib/)            │
└─────────────────────────────────────────────┘
```

**Principios de diseño:**
- 🔹 **Separación de responsabilidades**: Services manejan lógica de negocio, Contexts manejan estado global
- 🔹 **Optimización**: Queries con límites (max 30-90 registros), carga paralela crítica/secundaria
- 🔹 **Reutilización**: Componentes UI modulares en `components/ui/`
- 🔹 **Type Safety**: PropTypes en componentes críticos

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales (Supabase PostgreSQL)

```sql
┌─────────────────────┐
│     exercises       │  15 ejercicios
├─────────────────────┤
│ id (INT4)           │
│ name                │
│ description         │
│ muscle_group        │
│ video_url           │
└─────────────────────┘

┌─────────────────────┐
│      workouts       │  5 rutinas
├─────────────────────┤
│ id (UUID)           │
│ name                │
│ category            │  fuerza/cardio/hiit/flexibilidad
│ duration            │
│ calories            │
│ level               │  principiante/intermedio/avanzado
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│ scheduled_workouts  │       │ completed_workouts  │
├─────────────────────┤       ├─────────────────────┤
│ id (UUID)           │       │ id (UUID)           │
│ user_id (FK)        │       │ user_id (FK)        │
│ workout_id (FK)     │       │ workout_id (FK)     │
│ scheduled_date      │       │ completed_date      │
│ status              │       │ duration_minutes    │
│ completed_at        │       │ calories_burned     │
└─────────────────────┘       └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│       medals        │       │    user_medals      │
├─────────────────────┤       ├─────────────────────┤
│ id (UUID)           │       │ id (UUID)           │
│ name                │       │ user_id (FK)        │
│ requirement_type    │◄──────┤ medal_id (FK)       │
│ requirement_value   │       │ unlocked_at         │
└─────────────────────┘       └─────────────────────┘
```

**Relaciones:**
- `workout_exercises`: Tabla intermedia (workouts ↔ exercises) con `order_index`, `reps`
- **CASCADE**: Delete workout → delete scheduled/completed references
- **UNIQUE**: user_medals tiene constraint (user_id, medal_id)

---

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Supabase (proyecto creado)

### Paso a Paso

```bash
# 1. Clonar repositorio
git clone https://github.com/kevinramirezok/Proyecto-Pulso100.git
cd Proyecto-Pulso100

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env en la raíz:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# 4. Ejecutar en desarrollo
npm run dev

# 5. Compilar para producción
npm run build
npm run preview
```

### 🗃️ Setup de Base de Datos

Si estás partiendo desde cero, ejecuta los scripts SQL en Supabase:

```sql
-- Ver archivo: FASE-2-BACKEND-SUPABASE.md
-- Incluye creación de tablas, relaciones, constraints y datos seed
```

---

## 📁 Estructura del Proyecto

```
pulso100-v2/
├── src/
│   ├── components/
│   │   ├── calendar/          # CalendarioCustom
│   │   ├── features/          # EntrenamientoActivo, MedalCard
│   │   ├── layout/            # Layouts por rol, BottomNav
│   │   └── ui/                # Button, Card, Badge, Input, Modal
│   ├── pages/
│   │   ├── auth/              # Login, Register, Forgot/Reset Password
│   │   ├── usuario/           # Home, Rutinas, Calendario, Progreso, Perfil
│   │   └── admin/             # Dashboard, Ejercicios, RutinasAdmin, Usuarios
│   ├── context/
│   │   ├── AuthContext.jsx    # Manejo de autenticación
│   │   ├── ScheduleContext.jsx# Calendario + Progreso
│   │   ├── WorkoutContext.jsx # Rutinas + Ejercicios
│   │   └── ThemeContext.jsx   # Dark mode
│   ├── services/
│   │   ├── workoutService.js  # CRUD workouts/exercises
│   │   ├── progressService.js # Stats, rachas, historial
│   │   ├── medalService.js    # Lógica de medallas
│   │   └── scheduleService.js # Gestión de calendario
│   ├── hooks/
│   │   └── useProgress.js     # Hook centralizado de progreso
│   ├── data/                  # Mock data (fallback)
│   ├── lib/
│   │   └── supabase.js        # Cliente Supabase
│   └── utils/
├── APLICACION COMPLETA.MD     # Documentación completa del proyecto
├── FASE-2-BACKEND-SUPABASE.md # Guía de integración Supabase
└── package.json
```

---

## 🎨 Guía de Estilos

### Paleta de Colores

```css
/* Configuración en tailwind.config.js */
pulso-rojo:    #FF0000  /* Acento principal, botones CTA */
negro:         #0a0a0a  /* Fondo principal */
negro-sec:     #1a1a1a  /* Cards, contenedores */
gris-claro:    #9ca3af  /* Textos secundarios */
```

### Componentes UI Reutilizables

| Componente | Props principales | Uso |
|------------|-------------------|-----|
| `Button` | `variant`, `size`, `onClick` | Botones primarios/secundarios |
| `Card` | `className`, `children` | Contenedores de información |
| `Badge` | `variant`, `children` | Labels de estado/categoría |
| `Modal` | `isOpen`, `onClose`, `title` | Diálogos y confirmaciones |

---

## 🔐 Seguridad

### Estado Actual
- ✅ Autenticación con Supabase Auth (JWT)
- ✅ Validación de sesión en rutas protegidas
- ⚠️ **RLS (Row Level Security) DESACTIVADO** para desarrollo

### ⚠️ ANTES DE DEPLOY A PRODUCCIÓN

```sql
-- ¡CRÍTICO! Activar RLS en todas las tablas sensibles
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_medals ENABLE ROW LEVEL SECURITY;

-- Crear policies (ver FASE-2-BACKEND-SUPABASE.md)
CREATE POLICY "Users view own data" ON scheduled_workouts
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 🧪 Testing (Pendiente - Semana 7)

### Plan de Testing
- [ ] Unit tests: Services con Jest
- [ ] Integration tests: Contexts con React Testing Library
- [ ] E2E tests: Flujos críticos con Playwright
- [ ] Performance: Lighthouse CI (<3s FCP)

---

## 🚧 Roadmap

### Semana 6 (En Progreso)
- [ ] Completar CRUD de Ejercicios en Admin
- [ ] Completar CRUD de Rutinas en Admin
- [ ] Tabla de Usuarios con filtros y búsqueda
- [ ] Sistema de asignación Usuario ↔ Entrenadora

### Semana 7 (Próximamente)
- [ ] Responsive completo (tablet/móvil)
- [ ] Animaciones con Framer Motion
- [ ] Testing exhaustivo
- [ ] Activar RLS en Supabase
- [ ] Deploy a producción

### Futuro (Post-MVP)
- [ ] Notificaciones push (workouts pendientes)
- [ ] Chat en tiempo real (usuario ↔ entrenadora)
- [ ] Modo offline con sync
- [ ] App móvil nativa (React Native)
- [ ] Sistema de pagos (Stripe)

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo. Si tienes acceso y quieres contribuir:

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Commit: `git commit -m "Add: nueva funcionalidad"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 👤 Autor

**Kevin Marcos Ramirez**  
GitHub: [@kevinramirezok](https://github.com/kevinramirezok)

---

## 📄 Licencia

Proyecto privado y confidencial © 2025

---

<div align="center">

**PULSO 100** 🔥 _Tu límite es el siguiente pulso_

[⬆ Volver arriba](#-pulso-100)

</div>


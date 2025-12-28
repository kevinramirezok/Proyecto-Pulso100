
# 📋 PULSO 100 — DOCUMENTACIÓN COMPLETA

## 🛠️ Stack Tecnológico

- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS (con dark mode)
- **Iconos:** Lucide React
- **Gráficos:** Recharts
- **Calendario:** CalendarioCustom (sin Big Calendar)
- **Routing:** React Router DOM v6
- **Utilidades de fecha:** date-fns
- **Animaciones:** Framer Motion (opcional)
- **Backend futuro:** Supabase
- **Auth futuro:** Supabase Auth



## 📋 Metodología: Waterfall con Sprints

**Modelo híbrido:** Desarrollo en cascada con iteraciones y checkpoints.

### Principios Clave
- No avanzar hasta completar la fase actual
- Testing después de cada fase
- Aprobación antes de seguir
- Código limpio y documentado
- Commits organizados por fase

---


---

## 🗓️ Cronograma Detallado (7 Semanas)


### 📅 Semana 1: Setup + Fundación (1-7 Dic) ✅ COMPLETADA
**Entregables:**
- Proyecto Vite configurado
- Tailwind configurado (modo oscuro implementado)
- CalendarioCustom implementado (sin Big Calendar)
- Sistema de rutas por roles
- Layouts base (Usuario/Admin)
- Bottom Navigation por rol
- Componentes UI base (Button, Card, Badge, Input, Modal, MiniCalendario)
- Login mockup con selección de rol
- Paleta de colores aplicada

**Checkpoint:** Navegación funciona, calendario custom renderiza
**Pendiente:** Temas claro/noche adicionales

---


### 📅 Semana 2: Vista Usuario - Core (8-14 Dic) ✅ COMPLETADA
**Entregables:**
- Home Usuario: Buscador + Categorías + "Próximo entrenamiento"
- Rutinas/Library: Lista con filtros (Bicicleta/Running/Fuerza/Natación/Otro)
- Detalle de Rutina: Nombre, descripción, duración, nivel, calorías, categoría, lista de ejercicios paso a paso, estructura para video tutorial, botones para programar en calendario e iniciar entrenamiento
- Marcar como completada
- Datos mock de rutinas (mockWorkouts.js)

**Checkpoint:** Usuario puede buscar, ver y programar rutinas, iniciar entrenamientos y registrar progreso
**Pendiente:** Mejoras en video y feedback visual

---


### 📅 Semana 3: Calendario Usuario (15-21 Dic) ✅ COMPLETADA (90%)
**Entregables:**
- Vista Calendario Usuario: Vista personalizada (CalendarioCustom), workouts visualizados con colores por categoría, agregar workout por día, ver detalle/marcar completado
- Integración con Rutinas: Programar desde detalle, selección de fecha, marcar completada desde Rutinas
- Estados visuales: Pendiente (color normal), Completado (verde con opacidad)
- Contador de racha: Días consecutivos entrenando con badge especial 7+ días
- Sistema unificado: ScheduleContext maneja progreso y calendario
- Card "Rutina de Hoy": Próximo entrenamiento pendiente
- Stats de semana: Contador lunes a domingo automático

**Checkpoint:** Sistema completo de calendario y progreso funcionando
**Pendiente:** Drag & Drop, estados vencidos (opcionales)

---


### 📅 Semana 4: Progreso + Gamificación (22-28 Dic) ⏳ EN PROGRESO
**Entregables:**
- Gráficos de progreso (Recharts) en Progreso.jsx: entrenamientos últimos 7 días (barras), minutos por semana (área), calorías por semana (línea), distribución por categoría, stats cards, total completados
- Adherencia mensual (pendiente)
- Contador de entrenamientos (ScheduleContext)
- Funcionalidad Iniciar Entrenamiento: Timer, ejercicios, calorías estimadas y registro automático
- Sistema de Medallas: Visualización y lógica de medallas/logros en Progreso.jsx
- Performance Metrics (pendiente)
- Perfil Usuario (pendiente)

**Checkpoint:** Usuario ve su progreso con gráficos, estadísticas, medallas y puede iniciar entrenamientos
**Pendiente:** Performance Metrics, Adherencia mensual, Perfil Usuario

---



### 📅 Semana 5: Integración Supabase (29 Dic - 4 Ene) ⏳ PENDIENTE
**Entregables:**
- Conexión inicial a Supabase
- CRUD de rutinas y ejercicios desde Admin (pendiente)
- Reemplazo de datos mock por datos reales (pendiente)
- Autenticación real con Supabase Auth (pendiente)

**Checkpoint:** App conectada a base de datos real (pendiente)
**Estado:** Solo estructura base

---


### 📅 Semana 6: Vista Admin + Integración (5-11 Ene) ⏳ PENDIENTE
**Entregables:**
- Dashboard Admin: UI base creada, sin funcionalidad
- Gestión de Usuarios: lista, crear/editar/eliminar, asignar entrenadora, ver calendario del usuario (pendiente)
- Gestión de Entrenadores: lista, crear/editar/eliminar, ver usuarios asignados (pendiente)
- Configuración del Sistema: categorías de rutinas, niveles de dificultad, sistema de medallas, configuración de calendario (pendiente)
- Integración completa entre roles (pendiente)

**Checkpoint:** Admin puede gestionar todo el sistema (pendiente)
**Estado:** Solo estructura base

---


### 📅 Semana 7: Polish + Testing (12-18 Ene) ⏳ PENDIENTE
**Entregables:**
- Refinamiento UI: Animaciones, transiciones, micro-interacciones
- Calendario optimizado: funcionalidad básica implementada, rendimiento con muchos workouts (pendiente), responsive parcial (falta tablet), touch gestures en móvil (pendiente)
- Responsive completo (pendiente)
- Testing exhaustivo (pendiente)
- Bug fixing (pendiente)
- Documentación: README actualizado, falta completar
- Performance optimization (pendiente)
- Preparar para Supabase: estructura de datos definida

**Checkpoint:** App lista para producción (pendiente)
**Estado:** Fase no iniciada

---


### 📅 Buffer (19 Ene - 1 Feb)
- Imprevistos
- Ajustes de diseño
- Bugs adicionales
- Documentación extra

---


---

## 🚀 Estructura de Carpetas
```text
pulso100-v2/
├── public/
│   └── logo-pulso100.png
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   ├── CalendarView.jsx
│   │   │   ├── WorkoutEvent.jsx
│   │   │   ├── DayModal.jsx
│   │   │   └── CalendarToolbar.jsx
│   │   ├── layout/
│   │   │   ├── LayoutUsuario.jsx
│   │   │   ├── LayoutAdmin.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── ThemeSwitcher.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Select.jsx
│   │   └── features/
│   │       ├── PerformanceMetrics.jsx
│   │       ├── WorkoutCard.jsx
│   │       ├── ProgressChart.jsx
│   │       ├── MedalBadge.jsx
│   │       ├── WorkoutDetail.jsx
│   │       └── ScheduleWorkout.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── usuario/
│   │   │   ├── Home.jsx
│   │   │   ├── Calendario.jsx
│   │   │   ├── Rutinas.jsx
│   │   │   ├── Progreso.jsx
│   │   │   └── Perfil.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       └── (CRUD y gestión en desarrollo)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useWorkouts.js
│   │   ├── useProgress.js
│   │   ├── useCalendar.js
│   │   └── useScheduledWorkouts.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ScheduleContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── EntrenamientoContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── dateUtils.js
│   ├── data/
│   │   ├── exercises.js
│   │   ├── mockWorkouts.js
│   │   └── medals.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```
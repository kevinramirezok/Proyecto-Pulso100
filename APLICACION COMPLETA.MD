{
  "framework": "React 18 + Vite",
  "styling": "Tailwind CSS (con dark mode)",
  "icons": "Lucide React",
  "charts": "Recharts",
  "calendar": "React Big Calendar",
  "routing": "React Router DOM v6",
  "date-utils": "date-fns",
  "animations": "Framer Motion (opcional)",
  "future-backend": "Supabase",
  "future-auth": "Supabase Auth"
}
```

---

## 📋 **METODOLOGÍA: WATERFALL con SPRINTS**

**"Desarrollo en Cascada con Iteraciones"** o **"Agile Waterfall Híbrido"**

### **Principios:**
✅ No avanzar hasta completar fase actual
✅ Testing después de cada fase
✅ Aprobación antes de seguir
✅ Código limpio y documentado
✅ Commits organizados por fase

---

## 🗓️ **CRONOGRAMA DETALLADO (7 Semanas)**

### **📅 SEMANA 1: Setup + Fundación (1-7 Dic)**
**Entregables:**
- ✅ Proyecto Vite configurado
- ✅ Tailwind con 3 modos (oscuro/claro/noche)
- ✅ React Big Calendar instalado y configurado
- ✅ Sistema de rutas por roles
- ✅ Layouts base (Usuario/Entrenadora/Admin)
- ✅ Bottom Navigation por rol (5 tabs Usuario/Entrenadora, 4 Admin)
- ✅ Componentes UI base (Button, Card, Badge, Input)
- ✅ Login mockup con selección de rol
- ✅ Paleta de colores aplicada

**Checkpoint:** Navegación funciona, cambio de tema funciona, calendario renderiza

---

### **📅 SEMANA 2: Vista Usuario - Core (8-14 Dic)**
**Entregables:**
- ✅ **Home Usuario**: Buscador + Categorías + "Próximo entrenamiento"
- ✅ **Rutinas/Library**: Lista con filtros (Bicicleta/Running/Fuerza/Natación/Otro)
- ✅ **Detalle de Rutina**: 
  - Nombre, descripción, duración, nivel
  - Calorías, categoría
  - Lista de ejercicios paso a paso
  - Video tutorial (URL)
  - Botón "Programar en Calendario"
  - Botón "Iniciar Entrenamiento"
- ✅ **Marcar como completada**
- ✅ Datos mock de 30-40 rutinas

**Checkpoint:** Usuario puede buscar, ver y programar rutinas

---

### **📅 SEMANA 3: Calendario Usuario (15-21 Dic)**
**Entregables:**
- ✅ **Vista Calendario Usuario**:
  - Vista Mes / Semana / Día / Agenda
  - Workouts visualizados con colores por categoría
  - Click en día → agregar workout
  - Click en workout → ver detalle / marcar completado
  - Drag & Drop de workouts entre días
- ✅ **Integración con Rutinas**:
  - Desde "Detalle de Rutina" → "Programar en Calendario"
  - Modal de selección de fecha
- ✅ **Estados visuales**:
  - Pendiente (color normal)
  - Completado (✅ verde con opacidad)
  - Vencido/no completado (🔴 rojo)
- ✅ **Contador de racha**: Días consecutivos entrenando

**Checkpoint:** Usuario puede programar y gestionar workouts en calendario

---

### **📅 SEMANA 4: Progreso + Gamificación (22-28 Dic)**
**Entregables:**
- ✅ **Performance Metrics**: 3 indicadores (Fatigue/Fitness/Form)
- ✅ **Gráficos de progreso** (Recharts):
  - Entrenamientos por semana (línea)
  - Calorías quemadas (barras)
  - Minutos activos (área)
  - Adherencia mensual (calendario de calor)
- ✅ **Contador de entrenamientos**: Total, semanal, mensual
- ✅ **Sistema de Medallas**:
  - Primera rutina completada
  - 5 entrenamientos
  - 10 entrenamientos
  - Racha 7 días
  - Racha 30 días
  - 100% adherencia semanal
- ✅ **Perfil Usuario**: Stats generales + configuración + tema

**Checkpoint:** Usuario ve su progreso con gráficos y gana medallas

---

### **📅 SEMANA 5: Vista Entrenadora (29 Dic - 4 Ene)**
**Entregables:**
- ✅ **Dashboard Entrenadora**:
  - Resumen de usuarios activos
  - Rutinas creadas
  - Stats generales
  - Adherencia promedio de usuarios
- ✅ **Calendario Entrenadora**:
  - Selector de usuario
  - Ver calendario de cualquier usuario
  - Asignar workouts desde calendario
  - Drag & Drop de rutinas
  - Ver adherencia visual
- ✅ **Mis Usuarios**: Lista con progreso de cada uno
- ✅ **Crear Rutina**:
  - Formulario completo
  - Todas las propiedades
  - Lista de ejercicios dinámica
  - Marcar como "General" o "Personalizada"
  - Asignar a usuario específico
  - Agregar URL de video tutorial
- ✅ **Ver Progreso de Usuario**: Gráficos individuales

**Checkpoint:** Entrenadora puede crear, asignar rutinas y gestionar calendarios

---

### **📅 SEMANA 6: Vista Admin + Integración (5-11 Ene)**
**Entregables:**
- ✅ **Dashboard Admin**:
  - Total usuarios, entrenadores
  - Actividad general del sistema
  - Adherencia global
- ✅ **Gestión de Usuarios**:
  - Lista completa
  - Crear/editar/eliminar
  - Asignar entrenadora
  - Ver calendario del usuario
- ✅ **Gestión de Entrenadores**:
  - Lista
  - Crear/editar/eliminar
  - Ver usuarios asignados
- ✅ **Configuración del Sistema**:
  - Categorías de rutinas
  - Niveles de dificultad
  - Sistema de medallas
  - Configuración de calendario
- ✅ **Integración completa** entre roles

**Checkpoint:** Admin puede gestionar todo el sistema

---

### **📅 SEMANA 7: Polish + Testing (12-18 Ene)**
**Entregables:**
- ✅ **Refinamiento UI**: Animaciones, transiciones, micro-interacciones
- ✅ **Calendario optimizado**:
  - Rendimiento con muchos workouts
  - Responsive mobile/tablet/desktop
  - Touch gestures en móvil
- ✅ **Responsive completo**: Todas las pantallas
- ✅ **Testing exhaustivo**: Todos los flujos
- ✅ **Bug fixing**
- ✅ **Documentación**: README completo
- ✅ **Performance optimization**
- ✅ **Preparar para Supabase**: Estructura de datos definida

**Checkpoint:** App lista para producción

---

### **📅 BUFFER (19 Ene - 1 Feb)**
- 🔧 Imprevistos
- 🎨 Ajustes de diseño
- 🐛 Bugs adicionales
- 📝 Documentación extra

---

## 🚀 **ESTRUCTURA DE CARPETAS**
```
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
│   │   │   ├── LayoutEntrenadora.jsx
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
│   │   ├── entrenadora/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Calendario.jsx
│   │   │   ├── MisUsuarios.jsx
│   │   │   ├── CrearRutina.jsx
│   │   │   └── Perfil.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Usuarios.jsx
│   │       ├── Entrenadores.jsx
│   │       └── Config.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useWorkouts.js
│   │   ├── useProgress.js
│   │   ├── useCalendar.js
│   │   └── useScheduledWorkouts.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── dateUtils.js
│   ├── data/
│   │   ├── mockUsers.js
│   │   ├── mockWorkouts.js
│   │   ├── mockProgress.js
│   │   └── mockScheduled.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
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

### **📅 SEMANA 1: Setup + Fundación (1-7 Dic)** ✅ COMPLETADA
**Entregables:**
- ✅ Proyecto Vite configurado
- ⚠️ Tailwind configurado (solo modo oscuro implementado)
- ❌ React Big Calendar removido → Reemplazado por CalendarioCustom
- ✅ Sistema de rutas por roles
- ✅ Layouts base (Usuario/Entrenadora/Admin)
- ✅ Bottom Navigation por rol
- ✅ Componentes UI base (Button, Card, Badge, Input, Modal, MiniCalendario)
- ✅ Login mockup con selección de rol
- ✅ Paleta de colores aplicada

**Checkpoint:** ✅ Navegación funciona, calendario custom renderiza
**Pendiente:** Implementar temas claro/noche adicionales

---

### **📅 SEMANA 2: Vista Usuario - Core (8-14 Dic)** ✅ COMPLETADA
**Entregables:**
- ✅ **Home Usuario**: Buscador + Categorías + "Próximo entrenamiento"
- ✅ **Rutinas/Library**: Lista con filtros (Bicicleta/Running/Fuerza/Natación/Otro)
- ✅ **Detalle de Rutina**: 
  - ✅ Nombre, descripción, duración, nivel
  - ✅ Calorías, categoría
  - ✅ Lista de ejercicios paso a paso
  - ⚠️ Video tutorial (estructura preparada, sin URLs reales)
  - ✅ Botón "Programar en Calendario" (con MiniCalendario)
  - ✅ Botón "Iniciar Entrenamiento" (pantalla completa con timer y ejercicios)
- ✅ **Marcar como completada**
- ✅ Datos mock de rutinas (mockWorkouts.js)

**Checkpoint:** ✅ Usuario puede buscar, ver y programar rutinas, iniciar entrenamientos y registrar progreso
**Pendiente:** Mejoras en video y feedback visual

---

### **📅 SEMANA 3: Calendario Usuario (15-21 Dic)** ✅ COMPLETADA (90%)
**Entregables:**
- ✅ **Vista Calendario Usuario**:
  - ✅ Vista personalizada (CalendarioCustom)
  - ✅ Workouts visualizados with colores por categoría
  - ✅ Click en día → agregar workout (con MiniCalendario)
  - ✅ Click en workout → ver detalle / marcar completado
- ✅ **Integración con Rutinas**:
  - ✅ Desde "Detalle de Rutina" → "Programar en Calendario"
  - ✅ MiniCalendario de selección de fecha
  - ✅ Marcar completada desde Rutinas → aparece en calendario
- ✅ **Estados visuales**:
  - ✅ Pendiente (color normal)
  - ✅ Completado (✅ verde con opacidad)
- ✅ **Contador de racha**: Días consecutivos entrenando con badge especial 7+ días
- ✅ **Sistema unificado**: ScheduleContext maneja todo (progreso + calendario)
- ✅ **Card "Rutina de Hoy"**: Muestra próximo entrenamiento pendiente funcional
- ✅ **Stats de semana**: Contador lunes a domingo automático

**Checkpoint:** ✅ Sistema completo de calendario y progreso funcionando
**Pendiente:** Drag & Drop, estados vencidos (opcionales)

---

### **📅 SEMANA 4: Progreso + Gamificación (22-28 Dic)** ⏳ EN PROGRESO
**Entregables:**
- ✅ **Gráficos de progreso** (Recharts) - Implementados en `Progreso.jsx`:
  - ✅ Entrenamientos últimos 7 días (gráfico de barras)
  - ✅ Minutos por semana - últimas 4 semanas (gráfico de área)
  - ✅ Calorías por semana - últimas 4 semanas (gráfico de línea)
  - ✅ Distribución por categoría (lista visual con colores)
  - ✅ Stats Cards: Esta Semana, Racha, Minutos Totales, Calorías Quemadas
  - ✅ Total completados con diseño destacado
  - ❌ Adherencia mensual (calendario de calor) - pendiente
- ✅ **Contador de entrenamientos**: Funcional (completados locales desde ScheduleContext)
- ✅ **Funcionalidad Iniciar Entrenamiento**: Timer, ejercicios, calorías estimadas y registro automático
- ❗️ **Sistema de Medallas**: 
  - ✅ Visualización y lógica de medallas/logros en Progreso.jsx
- ❌ **Performance Metrics**: 3 indicadores (Fatigue/Fitness/Form) - pendiente
- ❌ **Perfil Usuario**: Stats generales + configuración + tema - pendiente

**Checkpoint:** ✅ Usuario ve su progreso con gráficos, estadísticas, medallas y puede iniciar entrenamientos
**Pendiente:** Performance Metrics, Adherencia mensual, Perfil Usuario

---

### **📅 SEMANA 5: Vista Entrenadora (29 Dic - 4 Ene)** ⏳ PENDIENTE
**Entregables:**
- ⚠️ **Dashboard Entrenadora**: UI base creada, sin funcionalidad
- ❌ **Calendario Entrenadora**:
  - Selector de usuario
  - Ver calendario de cualquier usuario
  - Asignar workouts desde calendario
  - Drag & Drop de rutinas
  - Ver adherencia visual
- ❌ **Mis Usuarios**: Lista con progreso de cada uno
- ❌ **Crear Rutina**:
  - Formulario completo
  - Todas las propiedades
  - Lista de ejercicios dinámica
  - Marcar como "General" o "Personalizada"
  - Asignar a usuario específico
  - Agregar URL de video tutorial
- ❌ **Ver Progreso de Usuario**: Gráficos individuales

**Checkpoint:** ❌ Entrenadora puede crear, asignar rutinas y gestionar calendarios
**Estado:** Solo estructura base

---

### **📅 SEMANA 6: Vista Admin + Integración (5-11 Ene)** ⏳ PENDIENTE
**Entregables:**
- ⚠️ **Dashboard Admin**: UI base creada, sin funcionalidad
- ❌ **Gestión de Usuarios**:
  - Lista completa
  - Crear/editar/eliminar
  - Asignar entrenadora
  - Ver calendario del usuario
- ❌ **Gestión de Entrenadores**:
  - Lista
  - Crear/editar/eliminar
  - Ver usuarios asignados
- ❌ **Configuración del Sistema**:
  - Categorías de rutinas
  - Niveles de dificultad
  - Sistema de medallas
  - Configuración de calendario
- ❌ **Integración completa** entre roles

**Checkpoint:** ❌ Admin puede gestionar todo el sistema
**Estado:** Solo estructura base

---

### **📅 SEMANA 7: Polish + Testing (12-18 Ene)** ⏳ PENDIENTE
**Entregables:**
- ❌ **Refinamiento UI**: Animaciones, transiciones, micro-interacciones
- ⚠️ **Calendario optimizado**:
  - ✅ Funcionalidad básica implementada
  - ❌ Rendimiento con muchos workouts
  - ⚠️ Responsive parcial (falta tablet)
  - ❌ Touch gestures en móvil
- ❌ **Responsive completo**: Todas las pantallas
- ❌ **Testing exhaustivo**: Todos los flujos
- ❌ **Bug fixing**
- ⚠️ **Documentación**: README actualizado, falta completar
- ❌ **Performance optimization**
- ❌ **Preparar para Supabase**: Estructura de datos definida

**Checkpoint:** ❌ App lista para producción
**Estado:** Fase no iniciada

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
```
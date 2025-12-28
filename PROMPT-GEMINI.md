# 🤖 PROMPT PARA GEMINI IA - Análisis Proyecto Pulso100

## 📋 Contexto del Proyecto

Soy desarrollador de **PULSO 100**, una plataforma web de entrenamiento personalizado que conecta usuarios con entrenadoras virtuales. El proyecto está en desarrollo activo y necesito tu análisis experto para optimizar arquitectura, identificar mejoras y planificar las siguientes fases.

---

## 🛠️ Stack Tecnológico Actual

- **Frontend:** React 18 + Vite
- **Estilos:** Tailwind CSS (modo oscuro implementado)
- **Iconos:** Lucide React
- **Gráficos:** Recharts
- **Routing:** React Router DOM v7
- **Backend:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Estado Global:** Context API (AuthContext, ScheduleContext, WorkoutContext, ThemeContext, EntrenamientoContext)
- **Utilidades:** date-fns, Framer Motion (opcional)

---

## 📊 Estado Actual del Desarrollo

### ✅ COMPLETADO (Semanas 1-5)

**Semana 1: Setup + Fundación**
- Proyecto Vite configurado con Tailwind CSS
- CalendarioCustom implementado (sin dependencias externas como Big Calendar)
- Sistema de rutas por roles (Usuario/Admin)
- Layouts base con Bottom Navigation
- Componentes UI: Button, Card, Badge, Input, Modal, MiniCalendario
- Login con selección de rol
- Paleta de colores (Rojo #FF0000, Negro #0a0a0a)

**Semana 2: Vista Usuario - Core**
- Home Usuario: Buscador + Categorías + "Próximo entrenamiento"
- Biblioteca de Rutinas con filtros (Bicicleta/Running/Fuerza/Natación/Otro)
- Detalle de Rutina completo con ejercicios paso a paso
- Sistema para programar en calendario e iniciar entrenamientos
- Datos mock de rutinas (mockWorkouts.js)

**Semana 3: Calendario Usuario**
- CalendarioCustom con visualización por colores de categoría
- Agregar/ver/completar workouts por día
- Contador de racha (días consecutivos)
- Sistema unificado con ScheduleContext
- Card "Rutina de Hoy"
- Stats de semana automáticos

**Semana 4: Progreso + Gamificación**
- Gráficos con Recharts (entrenamientos últimos 7 días, minutos, calorías, distribución por categoría)
- Sistema de 14 Medallas con lógica de desbloqueo automático
- Hook useProgress.js centralizado (stats, medallas, progreso con carga optimizada)
- Perfil Usuario con estadísticas personales, nivel y medallas
- Timer de entrenamiento con registro automático

**Semana 5: Integración Supabase** (~95% completada)
- Base de datos: 7 tablas (exercises, workouts, workout_exercises, scheduled_workouts, completed_workouts, medals, user_medals)
- Services: workoutService, progressService, medalService, scheduleService
- Migración completa de localStorage a PostgreSQL
- Autenticación real con Supabase Auth
- 15 ejercicios, 5 rutinas, 5 medallas cargadas
- Queries optimizadas con límites y carga paralela

### 🔄 EN PROGRESO (Semana 6)

**Vista Admin** (~30% completada)
- Dashboard Admin con métricas visuales
- Páginas creadas: Ejercicios.jsx, RutinasAdmin.jsx, Usuarios.jsx
- Estructura lista para CRUD
- **Pendiente:** Conectar funcionalidad a Supabase

### ⏳ PENDIENTE (Semana 7)

**Polish + Testing**
- Animaciones y transiciones
- Responsive completo (falta tablet/móvil optimizado)
- Testing exhaustivo
- Activar RLS en Supabase para producción
- Performance optimization
- Documentación completa

---

## 📁 Estructura del Proyecto

```
pulso100-v2/
├── src/
│   ├── components/
│   │   ├── calendar/ (CalendarioCustom.jsx)
│   │   ├── layout/ (LayoutUsuario, LayoutAdmin, BottomNav)
│   │   ├── ui/ (Button, Card, Badge, Input, Modal, MiniCalendario)
│   │   └── features/ (EntrenamientoActivo, MedalCard)
│   ├── pages/
│   │   ├── auth/ (Login, Register, ForgotPassword, ResetPassword)
│   │   ├── usuario/ (Home, Calendario, Rutinas, Progreso, Perfil)
│   │   └── admin/ (Dashboard, Ejercicios, RutinasAdmin, Usuarios)
│   ├── hooks/ (useProgress.js)
│   ├── context/ (AuthContext, ScheduleContext, ThemeContext, WorkoutContext, EntrenamientoContext)
│   ├── services/ (workoutService, progressService, medalService, scheduleService)
│   ├── data/ (exercises.js, mockWorkouts.js, medals.js)
│   ├── lib/ (supabase.js)
│   └── utils/
├── APLICACION COMPLETA.MD
├── FASE-1-AUTENTICACION.md
├── FASE-2-BACKEND-SUPABASE.md
└── README.md
```

---

## 🎯 Características Principales Implementadas

### Para Usuarios:
- ✅ Calendario interactivo con visualización por categorías
- ✅ Biblioteca de rutinas con filtros
- ✅ Sistema de progreso con gráficos (Recharts)
- ✅ Timer de entrenamiento en tiempo real
- ✅ Sistema de rachas (días consecutivos)
- ✅ 14 medallas desbloqueables automáticamente
- ✅ Perfil con estadísticas personales y nivel
- ✅ Entrenamiento activo global con cronómetro

### Para Admin:
- ✅ Dashboard con métricas
- 🔄 Gestión de ejercicios (estructura creada)
- 🔄 Gestión de rutinas (estructura creada)
- 🔄 Gestión de usuarios (estructura creada)
- ⏳ Sistema de configuración (pendiente)

---

## 🗄️ Base de Datos Supabase

### Tablas Implementadas:
- **exercises** (15 ejercicios): name, description, muscle_group, video_url
- **workouts** (5 rutinas): name, description, duration, level, calories, category, video_url
- **workout_exercises** (20 relaciones): orden, reps, notas
- **scheduled_workouts**: user_id, workout_id, scheduled_date, status, completed_at
- **completed_workouts**: user_id, workout_id, completed_date, duration_minutes, calories_burned
- **medals** (5 medallas): name, description, requirement_type, requirement_value
- **user_medals**: desbloqueo de medallas por usuario

### Optimizaciones:
- Queries con límites inteligentes (max 30-90 registros)
- Carga paralela en 2 fases (crítico primero, secundario después)
- CASCADE en deletes
- Constraints y validaciones

### ⚠️ Pendiente para Producción:
- Activar RLS (Row Level Security)
- Crear índices para performance
- Restaurar CHECK constraints en medals

---

## 🎨 Services y Hooks Implementados

### Services (src/services/):
- **workoutService.js**: CRUD completo con joins optimizados
- **scheduleService.js**: Agendar, completar, reprogramar, eliminar
- **progressService.js**: Stats, historial, cálculo de rachas, filtros por fecha
- **medalService.js**: Verificación automática y desbloqueo de logros

### Hooks (src/hooks/):
- **useProgress.js**: Hook centralizado que retorna:
  - `stats`: totalCompleted, totalMinutes, totalCalories, streak, avgDuration, avgCalories
  - `medals`: Medallas desbloqueadas
  - `medalsProgress`: Progreso hacia siguientes medallas
  - `completedWorkouts`: Historial
  - `loading`, `error`, `refreshProgress()`

---

## 🚀 Metodología de Desarrollo

**Waterfall con Sprints**
- No avanzar hasta completar la fase actual
- Testing después de cada fase
- Código limpio y documentado
- Commits organizados por fase

**Cronograma:**
- Semanas 1-5: ✅ Completadas
- Semana 6 (5-11 Ene): 🔄 En progreso (~30%)
- Semana 7 (12-18 Ene): ⏳ Polish + Testing
- Buffer (19 Ene - 1 Feb): Imprevistos

---

## 💡 LO QUE NECESITO DE TI, GEMINI IA

### 1. **Análisis de Arquitectura**
- ¿La estructura actual es escalable para 100+ usuarios simultáneos?
- ¿Los Context API están bien implementados o debería migrar a Zustand/Redux?
- ¿La separación de Services/Hooks/Context es óptima?

### 2. **Optimización de Performance**
- ¿Las queries a Supabase están bien optimizadas?
- ¿Hay oportunidades de implementar caché (React Query)?
- ¿El hook useProgress con carga en 2 fases es la mejor estrategia?

### 3. **Seguridad**
- ¿Qué políticas RLS específicas recomiendas para cada tabla?
- ¿Hay vulnerabilidades en el manejo de autenticación?
- ¿Cómo proteger endpoints de admin?

### 4. **Completar Semana 6 (Admin)**
- ¿Cómo estructurarías el CRUD de Ejercicios conectado a Supabase?
- ¿Qué validaciones son críticas en creación de rutinas?
- ¿Debería implementar un sistema de roles más robusto (admin, entrenador, usuario)?

### 5. **UX/UI**
- ¿Qué mejoras de experiencia de usuario son prioritarias?
- ¿Falta algún feedback visual crítico?
- ¿El sistema de medallas es motivador suficiente?

### 6. **Nuevas Funcionalidades**
- ¿Qué features innovadoras agregarías basándote en apps similares (Strava, Nike Training)?
- ¿Sistema de notificaciones push? ¿Chat con entrenadora?
- ¿Modo offline con sync?

### 7. **Testing y Deploy**
- ¿Qué tipo de tests son prioritarios (unit/integration/e2e)?
- ¿Checklist completo antes de deploy a producción?
- ¿Estrategia de CI/CD recomendada?

### 8. **Escalabilidad**
- ¿Cómo manejar si tengo 10,000 workouts completados por usuario?
- ¿Cuándo debería implementar paginación?
- ¿Supabase soportará el crecimiento o necesito migrar?

### 9. **Documentación**
- ¿Qué falta documentar para nuevos desarrolladores?
- ¿Debería crear un API docs para los services?
- ¿Guía de contribución?

### 10. **Roadmap Futuro**
- ¿Qué priorizar: completar admin o mejorar usuario?
- ¿Monetización: freemium, suscripción, pago único?
- ¿App móvil nativa o PWA?

---

## 📊 Métricas Actuales

- **Archivos:** ~40 componentes/páginas/services
- **Líneas de código:** ~8,000 (estimado)
- **Tiempo desarrollo:** 5 semanas (140 horas aprox)
- **Estado:** MVP funcional al 80%
- **Deploy:** Vercel (https://proyecto-pulso100.vercel.app)

---

## 🎯 Objetivo Final

Una plataforma robusta, escalable y profesional que permita a usuarios seguir rutinas personalizadas, visualizar su progreso con gamificación, y a administradores gestionar todo el ecosistema de entrenamientos.

---

## 🙏 TU MISIÓN

Analiza este proyecto en profundidad y proporciona:

1. ✅ Evaluación honesta de lo bueno y lo malo
2. 🚨 Problemas críticos que debo resolver YA
3. 💡 Sugerencias de mejora priorizadas (alto/medio/bajo impacto)
4. 🛠️ Código de ejemplo para implementaciones clave (RLS policies, optimizaciones, etc.)
5. 📋 Checklist completo para Semana 6 (completar admin)
6. 🚀 Roadmap recomendado para los próximos 3 meses
7. 📚 Recursos/bibliotecas que debería considerar

**Formato esperado:** Respuesta estructurada, concisa pero detallada, con código cuando sea necesario.

---

**Fecha:** 28 de diciembre de 2025  
**Desarrollador:** Kevin Marcos Ramirez  
**Estado:** Proyecto activo, buscando llevar a producción en 3 semanas

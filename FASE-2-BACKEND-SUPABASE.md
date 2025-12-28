# FASE 2 - Backend Supabase ✅

**Estado:** ~95% Completado  
**Fecha:** 22 de diciembre de 2025  
**Rama:** `CianMateo`

---

## 📋 Resumen

Integración completa del backend con Supabase para gestión de entrenamientos, progreso de usuarios y sistema de medallas. Migración exitosa de localStorage a base de datos PostgreSQL con optimizaciones de rendimiento.

---

## ✅ Completado

### 🗄️ **1. Base de Datos Supabase**

#### Tablas Creadas:
- ✅ `exercises` (15 ejercicios cargados)
  - Campos: id INT4, name, description, muscle_group, video_url, created_at
  
- ✅ `workouts` (5 rutinas cargadas)
  - Campos: id UUID, name, description, duration, level, calories, category, video_url, is_personalized, created_by
  
- ✅ `workout_exercises` (20 relaciones cargadas)
  - Campos: id UUID, workout_id UUID FK, exercise_id INT4 FK, order_index, reps, notes
  - CASCADE en delete de workout
  
- ✅ `scheduled_workouts`
  - Campos: id UUID, user_id UUID FK, workout_id UUID FK, scheduled_date DATE, status TEXT, completed_at TIMESTAMPTZ
  - CASCADE en delete de user
  
- ✅ `completed_workouts`
  - Campos: id UUID, user_id UUID FK, workout_id UUID FK, scheduled_workout_id UUID FK, completed_date DATE, duration_minutes, calories_burned, notes
  
- ✅ `medals` (5 medallas cargadas)
  - Campos: id UUID, name, description, icon, requirement_type, requirement_value, category
  
- ✅ `user_medals`
  - Campos: id UUID, user_id UUID FK, medal_id UUID FK, unlocked_at TIMESTAMPTZ
  - UNIQUE constraint en (user_id, medal_id)

#### Datos Insertados:
```sql
-- 15 ejercicios (IDs 1-15)
-- 5 workouts con UUIDs válidos
-- 20 relaciones workout_exercises
-- 5 medallas con sistema de requisitos
```

---

### 🔧 **2. Services Layer**

#### Archivos Creados:

**`src/services/scheduleService.js`** (Gestión de calendario)
- `getScheduledWorkouts(userId)` - Obtener agendados
- `getScheduledWorkoutsByDateRange(userId, start, end)` - Por rango
- `getScheduledWorkoutsByDate(userId, date)` - Por fecha específica
- `scheduleWorkout(userId, workoutId, date, status)` - Agendar nuevo
- `updateScheduledStatus(id, status, completedAt)` - Actualizar estado
- `markAsCompleted(id)` - Marcar completado
- `markAsCancelled(id)` - Cancelar
- `rescheduleWorkout(id, newDate)` - Reprogramar
- `deleteScheduledWorkout(id)` - Eliminar
- `getPendingCount(userId)` - Contador pendientes

**`src/services/progressService.js`** (Estadísticas y progreso)
- `completeWorkout(userId, workoutId, ...)` - Registrar completado
- `getCompletedWorkouts(userId, limit)` - Historial con límite
- `getCompletedWorkoutsByDateRange(userId, start, end)` - Por rango
- `getUserStats(userId)` - Stats generales (total, racha, promedios)
- `getMonthlyStats(userId, year, month)` - Stats por mes
- `getActivityByDate(userId, start, end)` - Actividad para heatmap
- `deleteCompletedWorkout(id)` - Eliminar registro
- **Función especial:** `calculateStreak()` - Calcula días consecutivos

**`src/services/medalService.js`** (Sistema de logros)
- `getAllMedals()` - Todas las medallas disponibles
- `getUserMedals(userId)` - Medallas desbloqueadas
- `hasUserMedal(userId, medalId)` - Verificar si tiene medalla
- `unlockMedal(userId, medalId)` - Desbloquear con manejo de duplicados
- `checkAndUnlockMedals(userId)` - **Verificación automática** post-workout
- `getMedalsProgress(userId)` - Progreso % hacia cada medalla
- Manejo inteligente de error 23505 (duplicados)

**`src/services/workoutService.js`** (CRUD workouts - ya existía, mejorado)
- `getWorkouts()` - Con joins a workout_exercises
- `getWorkoutById(id)` - Con ejercicios ordenados
- `getExercises()` - Todos los ejercicios
- CRUD completo para exercises y workouts

---

### 🎣 **3. Hooks Personalizados**

**`src/hooks/useProgress.js`** (Hook centralizado de progreso)
```javascript
const { stats, completedWorkouts, medals, medalsProgress, loading, error, refreshProgress } = useProgress();
```

**Características:**
- Carga inteligente en 2 fases (crítico primero, secundario después)
- Stats: totalCompleted, totalMinutes, totalCalories, streak, avgDuration, avgCalories
- Auto-actualización cuando user cambia
- Manejo de estados: loading, error

---

### 🔄 **4. Contexts Actualizados**

**`src/context/ScheduleContext.jsx`**
- ❌ localStorage eliminado
- ✅ Usa scheduleService + progressService + medalService
- ✅ `scheduleWorkout()` - async con manejo de errores
- ✅ `completeScheduledWorkout()` - Registra en completed_workouts + desbloquea medallas
- ✅ `deleteScheduledWorkout()` - async
- ✅ Auto-refresh después de operaciones
- Estados: loading, error, scheduledWorkouts

**`src/context/WorkoutContext.jsx`**
- ✅ Ya estaba usando Supabase correctamente
- ✅ Carga workouts con ejercicios en paralelo
- ✅ refreshData() para recargar

---

### 🎨 **5. Componentes y Páginas Actualizadas**

**Páginas modificadas:**
- ✅ `src/pages/usuario/Home.jsx` - Stats desde useProgress
- ✅ `src/pages/usuario/Progreso.jsx` - Gráficos con datos reales + skeleton
- ✅ `src/pages/usuario/Perfil.jsx` - Stats personales
- ✅ `src/pages/usuario/Calendario.jsx` - CRUD completo con Supabase

**Componentes modificados:**
- ✅ `src/components/calendar/CalendarioCustom.jsx` - Usa scheduled_date (formato correcto)
- ✅ `src/components/features/MedalCard.jsx` - Barra de progreso visual

**Mejoras de UX:**
- ✅ Skeleton screens en Progreso (no pantalla en blanco)
- ✅ Loading states profesionales
- ✅ Manejo de errores con mensajes claros

---

### 🚀 **6. Optimizaciones de Rendimiento**

**Query Optimization:**
```javascript
// Antes: Traía TODOS los completed_workouts
getCompletedWorkouts(userId)

// Ahora: Límites inteligentes
getCompletedWorkouts(userId, limit = 30)  // Solo últimos 30 para gráficos
getUserStats(userId)  // Solo últimos 90 días, max 200 registros
```

**Carga Progresiva:**
```javascript
// Fase 1: Datos críticos (stats, medals)
await Promise.all([getUserStats(), getUserMedals()])

// Fase 2: Datos secundarios (gráficos)
await Promise.all([getCompletedWorkouts(30), getMedalsProgress()])
```

**Resultados:**
- ⚡ Tiempo de carga reducido ~70%
- 📊 Skeleton visible inmediatamente
- 🎯 Queries más eficientes con `.limit()`

---

### 📁 **7. Archivos Mock Data Actualizados**

**`src/data/mockWorkouts.js`**
- ✅ IDs cambiados de INT a UUIDs
- ✅ Solo 5 workouts (coinciden con Supabase)
- ✅ Categories actualizadas: fuerza, cardio, hiit, flexibilidad

**`src/data/medals.js`**
- ✅ IDs UUIDs (coinciden con Supabase)
- ✅ Campos: requirementType, requirementValue, category
- ✅ 5 medallas: Primera Victoria, Racha de Fuego, Guerrero, Incansable, Madrugador

**`src/data/exercises.js`**
- ✅ Mantiene INT4 IDs (1-15, coinciden con Supabase)

---

## 🔥 Flujos Funcionales Probados

### ✅ **Flujo Completo: Agendar → Completar → Medalla**

1. **Usuario agenda workout**
   ```
   Calendario → Día 24 → + → Selecciona "Core & Legs" → ✅ Agendado
   ```
   - INSERT en `scheduled_workouts`
   - Status: 'pendiente'
   - Aparece en calendario con indicador visual

2. **Usuario completa workout**
   ```
   Calendario → Día 24 → Click en workout → "Completar" → ✅
   ```
   - UPDATE `scheduled_workouts.status` = 'completado'
   - INSERT en `completed_workouts`
   - INSERT en `user_medals` (si desbloquea)

3. **Stats se actualizan automáticamente**
   ```
   Home: Total +1, Racha +1
   Progreso: Gráfico actualizado, medalla desbloqueada 🏆
   Perfil: Nivel actualizado
   ```

**Tiempo total del flujo:** ~2 segundos

---

## ⚠️ Pendientes & Recordatorios

### 🔴 **CRÍTICO para Producción**

#### 1. **Activar RLS en Supabase**
```sql
-- Actualmente DESACTIVADO para desarrollo
-- ANTES DE DEPLOY, ejecutar:

-- scheduled_workouts
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own scheduled workouts"
  ON scheduled_workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled workouts"
  ON scheduled_workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled workouts"
  ON scheduled_workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled workouts"
  ON scheduled_workouts FOR DELETE
  USING (auth.uid() = user_id);

-- completed_workouts
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own completed workouts"
  ON completed_workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completed workouts"
  ON completed_workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_medals
ALTER TABLE user_medals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own medals"
  ON user_medals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock medals"
  ON user_medals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- workouts, exercises, medals (público read-only)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view workouts" ON workouts FOR SELECT USING (true);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);

ALTER TABLE medals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view medals" ON medals FOR SELECT USING (true);
```

#### 2. **Volver a agregar CHECK constraint en medals**
```sql
-- Se eliminó temporalmente para testing
-- Volver a agregar:
ALTER TABLE medals 
ADD CONSTRAINT medals_requirement_type_check 
CHECK (requirement_type IN (
  'entrenamientos_completados', 
  'dias_consecutivos', 
  'calorias_quemadas', 
  'hora_entrenamiento'
));
```

---

### 🟡 **Mejoras Opcionales (No bloqueantes)**

#### 3. **Probar "Iniciar Entrenamiento"**
- Botón existe en Calendario
- Usa `iniciarEntrenamiento()` del EntrenamientoContext
- **Pendiente:** Verificar que el componente EntrenamientoActivo funcione

#### 4. **Editar workout agendado**
- Actualmente solo se puede: agendar, completar, eliminar
- **Feature pendiente:** Reprogramar fecha (usar `rescheduleWorkout()`)

#### 5. **Indices en Supabase** (Performance)
```sql
-- Acelerar queries frecuentes
CREATE INDEX idx_scheduled_user_date ON scheduled_workouts(user_id, scheduled_date);
CREATE INDEX idx_completed_user_date ON completed_workouts(user_id, completed_date DESC);
CREATE INDEX idx_user_medals_user ON user_medals(user_id);
```

#### 6. **Real-time subscriptions** (Opcional)
```javascript
// Para actualización en vivo
supabase
  .channel('scheduled_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'scheduled_workouts' },
    (payload) => refreshSchedule()
  )
  .subscribe()
```

---

## 📊 Decisiones Técnicas Importantes

### **UUID vs INT4**
- **Decisión:** Usar UUID en todas las tablas principales excepto `exercises`
- **Razón:** Seguridad (evita IDOR), no expone volumen de datos
- **Excepción:** `exercises` mantiene INT4 por compatibilidad con datos existentes

### **Status enum**
- **Valores:** 'pendiente', 'completado', 'cancelado'
- **Importante:** Usar español (no 'pending', 'completed')

### **Estructura de datos de Supabase**
```javascript
// scheduled_workout objeto:
{
  id: UUID,
  user_id: UUID,
  workout_id: UUID,
  scheduled_date: "2025-12-24",  // YYYY-MM-DD
  status: "pendiente",
  completed_at: null,
  workout: {  // JOIN automático
    id: UUID,
    name: "Core & Legs",
    duration: 35,
    category: "fuerza",
    ...
  }
}
```

### **Optimización de queries**
- **Límites:** completed_workouts max 30-90 registros
- **Parallel loading:** Stats críticos primero, gráficos después
- **Skeleton UI:** Siempre mientras carga

---

## 🐛 Bugs Corregidos

### 1. **Error `getStreak is not defined`**
- **Problema:** Componentes usaban `getStreak()` del viejo context
- **Solución:** Cambiado a `stats.streak` del hook useProgress

### 2. **Error `completedIs is not defined`**
- **Problema:** Variable `completados` no existía (era `completedWorkouts`)
- **Solución:** Actualizar todas las referencias

### 3. **Calendario no mostraba workouts agendados**
- **Problema:** Buscaba `scheduledDate` pero Supabase usa `scheduled_date`
- **Solución:** Actualizar acceso a campos con snake_case

### 4. **Error 409 Conflict en medallas**
- **Problema:** Intentaba insertar medalla duplicada
- **Solución:** Manejo de error 23505 en `unlockMedal()`

### 5. **Botón "Completar" no guardaba en Supabase**
- **Problema:** No esperaba respuesta async
- **Solución:** Agregar `async/await` y cerrar modal después

---

## 📦 Comandos Útiles

### Testing local
```bash
npm run dev
```

### Verificar queries a Supabase
```javascript
// En DevTools Console:
localStorage.setItem('supabase.debug', 'true')
```

### Limpiar datos de prueba
```sql
-- En Supabase SQL Editor:
DELETE FROM user_medals WHERE user_id = 'TU_USER_ID';
DELETE FROM completed_workouts WHERE user_id = 'TU_USER_ID';
DELETE FROM scheduled_workouts WHERE user_id = 'TU_USER_ID';
```

---

## 🎯 Próximos Pasos (FASE 3)

### Opción A: Admin Dashboard
- CRUD visual para exercises
- CRUD visual para workouts
- Ver usuarios y stats globales
- Gestión de medallas

### Opción B: Completar Usuario
- Probar EntrenamientoActivo
- Editar workouts agendados
- Notificaciones de medallas
- Compartir progreso

### Opción C: Preparar Producción
- Activar RLS
- Testing end-to-end
- Deploy a Vercel/Netlify
- Configurar dominio

---

## 📝 Notas del Desarrollador

### Aprendizajes:
1. **Race conditions:** Mejor usar constraint + manejo de error que verificar antes
2. **Supabase naming:** snake_case en DB, camelCase en frontend
3. **Optimización:** Limitar queries es más efectivo que cacheo prematuro
4. **UX:** Skeleton > Spinner en la mayoría de casos

### Tiempo invertido:
- Diseño de schema: ~30 min
- Creación de services: ~1.5 hrs
- Actualización de contexts: ~1 hr
- Debugging y testing: ~1 hr
- Optimizaciones: ~30 min
**Total: ~4.5 horas**

---

## ✅ Checklist Pre-Deploy

- [ ] RLS activado en todas las tablas
- [ ] CHECK constraint de medals restaurado
- [ ] Variables de entorno configuradas
- [ ] Testing en diferentes navegadores
- [ ] Verificar policies de RLS funcionan
- [ ] Backup de Supabase
- [ ] Documentación actualizada

---

**Última actualización:** 22 de diciembre de 2025  
**Desarrollador:** Tomas (con asistencia de GitHub Copilot)  
**Estado:** ✅ Listo para commit y push

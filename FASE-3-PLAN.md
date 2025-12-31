# 🎯 FASE 3 - Plan de Trabajo (Usuario)

**Fecha:** 26 de diciembre de 2025  
**Decisión:** Dashboard Admin en pausa (lo visual lo hace un amigo)  
**Enfoque:** Completar experiencia de usuario y preparar producción

---

## 📊 Estado Actual

### ✅ Completado (FASE 1 + 2)
- Autenticación con Supabase Auth
- Base de datos completa (7 tablas)
- CRUD de ejercicios y rutinas (funcional)
- Sistema de calendario (agendar, completar, eliminar)
- Sistema de medallas automático
- Estadísticas y progreso en tiempo real
- Optimizaciones de rendimiento

### ⚠️ Pendientes en Usuario
1. **Iniciar Entrenamiento** - Timer funcional existe pero no probado end-to-end
2. **Editar workouts agendados** - No hay UI para cambiar fecha
3. **Notificaciones de medallas** - Se desbloquean pero sin feedback visual
4. **Experiencia de calendario** - Mejorable (drag & drop, edición rápida)

### 🔴 Pendientes para Producción
1. **RLS activado** - Seguridad crítica
2. **Variables de entorno** - `.env` para producción
3. **Testing end-to-end** - Verificar todos los flujos
4. **Deploy** - Vercel/Netlify

---

## 🎯 OPCIÓN A: Completar Experiencia Usuario

**Tiempo estimado:** 4-5 horas  
**Complejidad:** Baja-Media  
**Impacto:** Alto (UX mejorada)

### 1️⃣ **Probar y Arreglar "Iniciar Entrenamiento"** 🏃‍♂️

**Estado actual:**
- ✅ Componente `EntrenamientoActivo.jsx` existe (206 líneas)
- ✅ Context `EntrenamientoContext` funcional
- ✅ Se puede llamar desde Home, Calendario, Rutinas
- ❌ No testeado completamente
- ❌ No guarda progreso parcial
- ❌ No hay ejercicios con instrucciones detalladas

**Tareas:**
- [ ] Testing del flujo completo:
  ```
  Home → "Iniciar" → EntrenamientoActivo → Timer corre → Completar
  ```
- [ ] Verificar que al completar:
  - Se cree `completed_workout` en Supabase
  - Se actualice `scheduled_workout.status`
  - Se calculen calorías reales (basado en duración)
  - Se verifiquen medallas
- [ ] Mejorar UI del timer:
  - Mostrar ejercicio actual con descripción
  - Mostrar video del ejercicio (YouTube embed)
  - Botón "Siguiente ejercicio"
  - Progreso visual (ej: 3/8 ejercicios)
- [ ] Agregar pausar/reanudar funcionalidad
- [ ] Modal de confirmación al cancelar

**Archivos a modificar:**
- `src/components/features/EntrenamientoActivo.jsx`
- `src/context/EntrenamientoContext.jsx` (si es necesario)
- `src/pages/usuario/Home.jsx` (botón "Iniciar")
- `src/pages/usuario/Calendario.jsx` (botón "Iniciar")

**Query a verificar:**
```javascript
// En EntrenamientoActivo, al completar:
const handleComplete = async () => {
  const duracionMinutos = Math.round(segundos / 60);
  const caloriasQuemadas = Math.round(duracionMinutos * 8); // ~8 cal/min
  
  await completeWorkout(
    user.id,
    workout.id,
    scheduledWorkoutId,
    duracionMinutos,
    caloriasQuemadas,
    ''
  );
  
  // Verificar medallas
  await checkAndUnlockMedals(user.id);
  
  onComplete();
};
```

---

### 2️⃣ **Editar Workouts Agendados** ✏️

**Estado actual:**
- ✅ Función `rescheduleWorkout()` existe en `scheduleService.js`
- ❌ No hay UI para editar
- ❌ Solo se puede: agendar, completar, eliminar

**Tareas:**
- [ ] Agregar botón "Editar" en modal de workout (Calendario)
- [ ] Modal de edición con:
  - DatePicker para nueva fecha
  - Input de hora (opcional)
  - Botón "Guardar cambios"
- [ ] Implementar `handleEditarWorkout()`:
  ```javascript
  const handleEditarWorkout = async (scheduleId, newDate) => {
    await rescheduleWorkout(scheduleId, newDate);
    await refreshSchedule();
    closeModal();
  };
  ```
- [ ] Validación: no permitir editar si ya está completado
- [ ] Confirmación: "¿Mover workout a [nueva fecha]?"

**Archivos a modificar:**
- `src/pages/usuario/Calendario.jsx`
- Opcional: crear `src/components/ui/DatePicker.jsx` (mejor UX)

---

### 3️⃣ **Notificaciones de Medallas Desbloqueadas** 🏆

**Estado actual:**
- ✅ Medallas se desbloquean automáticamente
- ❌ Usuario no ve feedback inmediato
- ❌ No hay animación ni toast

**Opciones de implementación:**

**Opción A: Toast simple** (15 min)
```javascript
// Usar react-hot-toast o similar
import toast from 'react-hot-toast';

// En ScheduleContext después de checkAndUnlockMedals():
const newMedals = await checkAndUnlockMedals(user.id);
if (newMedals.length > 0) {
  newMedals.forEach(medal => {
    toast.success(`🏆 ¡Medalla desbloqueada: ${medal.name}!`, {
      duration: 5000,
      icon: medal.icon,
    });
  });
}
```

**Opción B: Modal animado** (1 hora)
- Crear `src/components/ui/MedalUnlockModal.jsx`
- Animación de confetti o similar
- Mostrar medalla grande con descripción
- Botón "¡Genial!" para cerrar

**Opción C: Notificación in-app** (30 min)
- Badge en el ícono de Perfil con número de nuevas medallas
- Panel deslizable en Progreso mostrando nuevas medallas

**Recomendación:** Empezar con Opción A (toast), luego mejorar a B si da tiempo

**Tareas:**
- [ ] Instalar `react-hot-toast`: `npm install react-hot-toast`
- [ ] Modificar `checkAndUnlockMedals()` para retornar medallas nuevas
- [ ] Agregar `<Toaster />` en `App.jsx`
- [ ] Implementar toast en `ScheduleContext.completeScheduledWorkout()`

**Archivos:**
- `src/services/medalService.js` - modificar return
- `src/context/ScheduleContext.jsx` - agregar toast
- `src/App.jsx` - agregar Toaster provider

---

### 4️⃣ **Mejorar UX del Calendario** 📅

**Mejoras opcionales:**

**A. Drag & Drop de workouts** (1-2 horas)
- Arrastrar workout de un día a otro
- Usar `react-beautiful-dnd` o similar
- Confirmar antes de mover

**B. Edición rápida inline** (30 min)
- Click derecho → "Cambiar fecha"
- Doble click → Modal de edición

**C. Vista de semana/mes** (1 hora)
- Alternar entre vista mensual y semanal
- Mejor para móviles (vista semanal)

**D. Indicadores visuales mejorados** (15 min)
- Colores según estado: pendiente (azul), completado (verde), cancelado (gris)
- Íconos de categoría más grandes
- Hora del workout visible

**Recomendación:** Solo D (rápido, alto impacto visual)

---

## 🚀 OPCIÓN B: Preparar para Producción

**Tiempo estimado:** 2-3 horas  
**Complejidad:** Baja (pero crítico)  
**Impacto:** Alto (seguridad + deploy)

### 1️⃣ **Activar RLS en Supabase** 🔒

**CRÍTICO para seguridad**

**Tareas:**
- [ ] Ir a Supabase Dashboard → SQL Editor
- [ ] Ejecutar policies para cada tabla:

```sql
-- 1. scheduled_workouts
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own scheduled workouts"
  ON scheduled_workouts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. completed_workouts
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own completed workouts"
  ON completed_workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own completed workouts"
  ON completed_workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. user_medals
ALTER TABLE user_medals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own medals"
  ON user_medals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users unlock own medals"
  ON user_medals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. profiles (si existe)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. workouts, exercises, medals (público - solo lectura)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view workouts" 
  ON workouts FOR SELECT 
  USING (true);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view exercises" 
  ON exercises FOR SELECT 
  USING (true);

ALTER TABLE medals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view medals" 
  ON medals FOR SELECT 
  USING (true);

-- 6. workout_exercises (público - solo lectura)
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view workout_exercises" 
  ON workout_exercises FOR SELECT 
  USING (true);
```

- [ ] Testing después de activar RLS:
  - Login como usuario A → Ver solo mis workouts ✓
  - Login como usuario B → No ver workouts de A ✓
  - Intentar modificar workout de otro usuario → Error ✓

---

### 2️⃣ **Re-agregar Constraint de Medals**

```sql
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

### 3️⃣ **Variables de Entorno**

**Tareas:**
- [ ] Crear `.env.example`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] Actualizar `.gitignore`:
```
.env
.env.local
.env.production
```

- [ ] Modificar `src/lib/supabase.js`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

- [ ] Crear `.env` local con tus credenciales
- [ ] Verificar que no esté en git: `git status`

---

### 4️⃣ **Testing End-to-End**

**Checklist de testing manual:**

**Flujo de Usuario Nuevo:**
- [ ] Registro → Verificar email → Login
- [ ] Ver Home → Stats en 0
- [ ] Ir a Rutinas → Ver 5 rutinas disponibles
- [ ] Agendar workout para hoy
- [ ] Ir a Calendario → Ver workout agendado
- [ ] Completar workout → Verificar INSERT en Supabase
- [ ] Ver Home → Stats actualizados (Total: 1)
- [ ] Ir a Progreso → Ver gráfico con 1 workout
- [ ] Ir a Perfil → Ver medalla "Primera Victoria"

**Flujo de Usuario Recurrente:**
- [ ] Login → Ver stats correctos
- [ ] Agendar 3 workouts (días diferentes)
- [ ] Completar 1 → Verificar racha
- [ ] Completar 2 días consecutivos → Verificar "Racha de Fuego"
- [ ] Editar workout agendado (si implementado)
- [ ] Eliminar workout agendado

**Flujo Admin:**
- [ ] Login como admin
- [ ] Crear ejercicio nuevo
- [ ] Crear rutina nueva con 3 ejercicios
- [ ] Ver Dashboard → Stats actualizados
- [ ] Editar ejercicio → Verificar cambios
- [ ] Eliminar ejercicio → Confirmar CASCADE

**Seguridad:**
- [ ] Abrir DevTools → Network
- [ ] Verificar que queries tienen `user_id = [tu-id]`
- [ ] Intentar en Console: `supabase.from('scheduled_workouts').select('*')` → Solo ve los tuyos

---

### 5️⃣ **Deploy a Vercel**

**Pasos:**

1. **Preparar repositorio:**
```bash
git add .
git commit -m "feat: FASE 3 - Preparación para producción"
git push origin CianMateo
```

2. **Crear cuenta en Vercel:**
- Ir a vercel.com
- "Import Git Repository"
- Conectar GitHub
- Seleccionar repo `Proyecto-Pulso100`

3. **Configurar variables de entorno en Vercel:**
```
VITE_SUPABASE_URL = https://filvdjekfcgszgzkezwc.supabase.co
VITE_SUPABASE_ANON_KEY = [tu-anon-key]
```

4. **Deploy settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

5. **Verificar deploy:**
- Esperar build (2-3 min)
- Abrir URL de producción
- Hacer testing completo
- Verificar HTTPS activo

6. **Configurar dominio (opcional):**
- Comprar dominio en Namecheap/GoDaddy
- En Vercel → Settings → Domains
- Agregar dominio custom
- Configurar DNS (CNAME)

---

## 📋 Recomendación Final

### Plan Óptimo (6-7 horas total):

**Día 1 (3-4 horas):**
1. ✅ Activar RLS en Supabase (30 min)
2. ✅ Testing RLS funciona (20 min)
3. ✅ Probar "Iniciar Entrenamiento" end-to-end (1 hora)
4. ✅ Implementar toast de medallas (30 min)
5. ✅ Testing completo de flujos (1 hora)

**Día 2 (2-3 horas):**
6. ✅ Variables de entorno (15 min)
7. ✅ Deploy a Vercel (30 min)
8. ✅ Testing en producción (30 min)
9. ✅ Editar workouts agendados (1 hora) - OPCIONAL
10. ✅ Mejorar indicadores de calendario (30 min) - OPCIONAL

---

## 🎯 ¿Qué Hacemos?

**Opción 1: Solo Producción (Plan Seguro)**
- Activar RLS
- Testing
- Deploy
- **Tiempo:** 2-3 horas
- **Resultado:** App en producción, segura

**Opción 2: Completar Usuario + Producción (Plan Completo)**
- Arreglar Iniciar Entrenamiento
- Toast de medallas
- Editar workouts (opcional)
- Activar RLS
- Deploy
- **Tiempo:** 5-7 horas
- **Resultado:** App pulida + en producción

**Opción 3: Solo Usuario (Plan UX)**
- Iniciar Entrenamiento funcional
- Notificaciones de medallas
- Editar workouts
- Mejorar calendario
- **Tiempo:** 4-5 horas
- **Resultado:** Mejor experiencia de usuario

---

**¿Con cuál arrancamos?** 🚀

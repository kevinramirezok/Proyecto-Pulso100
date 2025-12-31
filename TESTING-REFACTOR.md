# ✅ Testing - EntrenamientoActivo REFACTORIZADO

**Fecha:** 30 de diciembre de 2025  
**Componente:** `EntrenamientoActivo.jsx`  
**Estado:** Refactorizado profesional con Supabase + Videos + UX

---

## 🎯 Cambios Implementados

### ✨ Nuevas Funcionalidades
1. ✅ **Integración Supabase completa**
   - Guarda `completed_workouts` automáticamente al finalizar
   - Actualiza `scheduled_workouts.status = 'completado'`
   - Calcula calorías basadas en nivel (6/8/10 kcal/min según Principiante/Intermedio/Avanzado)
   
2. ✅ **Videos de ejercicios**
   - Botón YouTube en cada ejercicio con video disponible
   - Modal profesional con iframe embebido
   - Extracción automática de video ID desde URL

3. ✅ **UX Profesional**
   - Modal de confirmación al cancelar (si > 30 segundos)
   - Loading state al finalizar con spinner
   - Toast notifications con sonner
   - Botón "Siguiente ejercicio" visible en ejercicio actual

4. ✅ **Mejor UI**
   - Estados visuales claros (completado/actual/pendiente)
   - Progreso visual por ejercicio
   - Iconos contextuales (CheckCircle, Youtube, ChevronRight)

---

## 📋 Checklist de Testing

### Flujo 1: Desde Home (Workout programado para hoy)
- [ ] Ir a **Home**
- [ ] Verificar que aparece workout en "Hoy programado"
- [ ] Click en **"Iniciar"**
- [ ] ✓ Timer debe empezar automáticamente en 00:00
- [ ] ✓ Ver nombre del workout correcto
- [ ] ✓ Ver categoría y nivel como badges
- [ ] ✓ Timer cuenta: 00:01 → 00:02 → ...
- [ ] ✓ Calorías aumentan progresivamente
- [ ] ✓ Ejercicios listados en panel inferior
- [ ] Click **Pausa** → Verificar que muestra "PAUSADO" en rojo
- [ ] Click **Play** → Timer continúa desde donde estaba
- [ ] Click **icono YouTube** en ejercicio con video → Modal se abre
- [ ] ✓ Video carga y reproduce
- [ ] Cerrar modal de video → Timer sigue corriendo
- [ ] Click **botón "Siguiente"** (chevron) → Ejercicio avanza a siguiente
- [ ] ✓ Ejercicio completado muestra check verde
- [ ] Llegar a > 30 segundos y click **X** (cerrar)
- [ ] ✓ Modal de confirmación aparece
- [ ] Click **"Continuar"** → Volver al entrenamiento
- [ ] Click **"Finalizar"**
- [ ] ✓ Botón muestra spinner + "Guardando..."
- [ ] ✓ Toast verde: "¡Entrenamiento completado! X min · Y kcal"
- [ ] Volver a **Home** → Workout ya NO aparece en "Hoy"
- [ ] Ir a **Progreso** → Ver workout completado en gráfica/historial

### Flujo 2: Desde Calendario (Workout agendado)
- [ ] Ir a **Calendario**
- [ ] Seleccionar día con workout agendado (tarjeta azul)
- [ ] Click **"Iniciar"** en la tarjeta
- [ ] ✓ EntrenamientoActivo abre correctamente
- [ ] Dejar correr timer 1-2 minutos
- [ ] Click **"Finalizar"**
- [ ] ✓ Toast de éxito
- [ ] Volver a **Calendario**
- [ ] ✓ Día debe mostrar check verde (completado)

### Flujo 3: Desde Rutinas (Workout NO agendado)
- [ ] Ir a **Rutinas**
- [ ] Buscar workout que NO esté agendado para hoy
- [ ] Click **"Iniciar ahora"**
- [ ] ✓ Timer funciona correctamente
- [ ] Completar workout
- [ ] ✓ Toast de éxito
- [ ] Ir a **Progreso** → Ver workout completado en historial

### Flujo 4: Cancelar entrenamiento
**Caso A: < 30 segundos**
- [ ] Iniciar workout
- [ ] Esperar 10-20 segundos
- [ ] Click **X** → Debe cerrar inmediatamente (sin modal)
- [ ] ✓ No guarda nada en Supabase

**Caso B: > 30 segundos**
- [ ] Iniciar workout
- [ ] Esperar 40-60 segundos
- [ ] Click **X**
- [ ] ✓ Modal de confirmación aparece
- [ ] Click **"Cancelar"** (rojo) → Cerrar sin guardar
- [ ] Verificar en Progreso → NO aparece

### Flujo 5: Videos de ejercicios
- [ ] Iniciar workout que tiene ejercicios con `video_url`
- [ ] Click icono **YouTube** (rojo) en cualquier ejercicio
- [ ] ✓ Modal abre con video embebido
- [ ] ✓ Video carga y se puede reproducir
- [ ] ✓ Nombre y descripción del ejercicio visible
- [ ] Cerrar modal con X
- [ ] ✓ Timer sigue corriendo en background
- [ ] ✓ Ejercicio actual no cambia al ver video

---

## 🔍 Verificaciones en Supabase

### Tabla `completed_workouts`
Después de completar un workout, ejecutar en **Supabase SQL Editor**:

```sql
SELECT 
  id,
  workout_id,
  scheduled_workout_id,
  duration_minutes,
  calories_burned,
  completed_date,
  created_at
FROM completed_workouts
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 5;
```

**Verificar:**
- ✓ `workout_id` coincide con el workout completado
- ✓ `scheduled_workout_id` existe si vino de calendario/home (puede ser NULL si vino de Rutinas)
- ✓ `duration_minutes` = tiempo real del timer (ej: 2 min si corrió 2 min)
- ✓ `calories_burned` correcto según nivel:
  - Principiante: 6 kcal/min
  - Intermedio: 8 kcal/min
  - Avanzado: 10 kcal/min
- ✓ `completed_date` = fecha de hoy (YYYY-MM-DD)

### Tabla `scheduled_workouts`
Si completaste workout agendado, ejecutar:

```sql
SELECT 
  id,
  workout_id,
  scheduled_date,
  status,
  completed_at
FROM scheduled_workouts
WHERE user_id = auth.uid()
  AND status = 'completado'
ORDER BY completed_at DESC
LIMIT 5;
```

**Verificar:**
- ✓ `status` = 'completado' (no 'pendiente')
- ✓ `completed_at` tiene timestamp reciente

---

## 🐛 Posibles Errores a Verificar

### ❌ Toast: "No se pudo obtener el usuario"
**Causa:** `auth.uid()` retorna null  
**Solución:** Recargar app o re-login

### ❌ Toast: "Error al guardar entrenamiento"
**Causa:** RLS policies bloqueando INSERT  
**Solución:** Verificar políticas de `completed_workouts`:
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'completed_workouts';
```
Debe existir política permitiendo INSERT para `auth.uid() = user_id`

### ❌ Videos no cargan
**Causa:** URL de YouTube inválida  
**Formato correcto:** `https://youtube.com/watch?v=XXXXXXXXXXX` o `https://youtu.be/XXXXXXXXXXX`

### ❌ Timer no para al pausar
**Causa:** useEffect no limpia intervalo  
**Verificar:** En consola no debe haber warnings de memory leaks

### ❌ Modal de confirmación no aparece
**Causa:** Estado `showExitConfirm` no se actualiza  
**Verificar:** Segundos > 30 antes de cerrar

---

## 📊 Métricas de Éxito

Al finalizar testing completo, debes tener:

✅ **Mínimo 3 workouts completados:**
  - 1 desde Home (agendado)
  - 1 desde Calendario
  - 1 desde Rutinas (no agendado)

✅ **0 errores en consola** del navegador (F12)

✅ **Toast notifications** mostrando correctamente con sonner

✅ **Datos correctos en Supabase:**
  - `completed_workouts` con duration y calories correctas
  - `scheduled_workouts` actualizados a status='completado'

✅ **Videos reproduciendo** sin errores de CORS

✅ **Modal de confirmación** funcionando al cancelar > 30 seg

---

## 🚀 Próximos Pasos

Si el testing pasa al 100%:

1. ✅ **EntrenamientoActivo** → COMPLETADO
2. ⏳ **Notificaciones de medallas** con sonner (1 hora)
3. ⏳ **Editar workouts agendados** (1 hora)
4. ⏳ **Variables de entorno** para producción (15 min)
5. ⏳ **Deploy a Vercel** (30 min)

---

## 📝 Notas Adicionales

- El componente ahora maneja TODO internamente (no necesita lógica en App.jsx)
- App.jsx solo cierra el modal al completar (ya no maneja guardado)
- ScheduleContext ya no se usa en el flujo de completar
- Sonner ya está instalado (v2.0.7) - no instalar nada más

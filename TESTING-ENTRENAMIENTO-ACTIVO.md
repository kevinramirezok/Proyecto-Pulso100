# 🧪 Testing: Iniciar Entrenamiento

**Fecha:** 26 de diciembre de 2025  
**Componente:** EntrenamientoActivo.jsx  
**Estado:** Mejorado y listo para testing

---

## ✅ Cambios Implementados

### 1. **Conexión con Supabase**
- Al completar workout se guarda en `completed_workouts`
- Se verifica y desbloquea medallas automáticamente
- Se actualiza `scheduled_workouts.status = 'completado'`
- Loading state mientras guarda

### 2. **Videos de Ejercicios**
- Embebido de YouTube por ejercicio
- Extracción automática de ID de YouTube
- Iframe optimizado (modestbranding, rel=0)

### 3. **Mejor UX**
- Tarjeta del ejercicio actual con toda la info
- Botón "Siguiente ejercicio" funcional
- Modal de confirmación al cancelar
- Progreso mejorado (ejercicioActual + 1)
- Click en cualquier ejercicio para ir a ese

### 4. **Cálculo de Calorías Mejorado**
- Por categoría de workout:
  - HIIT: 15 cal/min
  - Running: 14 cal/min
  - Cardio: 12 cal/min
  - Natación: 13 cal/min
  - Bicicleta: 10 cal/min
  - Fuerza: 8 cal/min
  - Flexibilidad: 4 cal/min

### 5. **Optimizaciones de Performance**
- `useMemo` para cálculos pesados
- `useCallback` para funciones
- Re-renders minimizados

---

## 🧪 Checklist de Testing

### **Fase 1: Iniciar desde Home**

- [ ] `npm run dev`
- [ ] Login como usuario
- [ ] Ir a Home
- [ ] Verificar que hay "Próximo Entrenamiento" card
- [ ] Click en "Iniciar"
- [ ] ✅ Se abre EntrenamientoActivo fullscreen
- [ ] ✅ Timer empieza en 00:00 y corre
- [ ] ✅ Se ve nombre del workout en header
- [ ] ✅ Badge de categoría visible
- [ ] ✅ Stats: tiempo meta, calorías, ejercicios

---

### **Fase 2: Verificar Ejercicio Actual**

- [ ] ✅ Se muestra tarjeta del primer ejercicio
- [ ] ✅ Nombre del ejercicio visible
- [ ] ✅ Badge "1/X" visible (donde X = total ejercicios)
- [ ] Si el ejercicio tiene video:
  - [ ] ✅ Se ve iframe de YouTube
  - [ ] ✅ Video se puede reproducir
  - [ ] ✅ No muestra ads molestos (rel=0 funciona)
- [ ] Si tiene `reps`:
  - [ ] ✅ Se ve en tarjeta roja "3 series de 12 reps"
- [ ] Si tiene `notes`:
  - [ ] ✅ Se ven las notas en texto gris
- [ ] ✅ Botón "Siguiente ejercicio →" visible

---

### **Fase 3: Navegación de Ejercicios**

- [ ] Click en "Siguiente ejercicio"
- [ ] ✅ Cambia al ejercicio 2
- [ ] ✅ Badge ahora dice "2/X"
- [ ] ✅ Nuevo video se carga (si tiene)
- [ ] ✅ Lista inferior: ejercicio 1 tiene ✓ verde
- [ ] ✅ Lista inferior: ejercicio 2 está resaltado en rojo
- [ ] Seguir clickeando "Siguiente" hasta último ejercicio
- [ ] ✅ En último ejercicio el botón dice "Último ejercicio ✓"
- [ ] ✅ Botón está disabled (no se puede seguir)

---

### **Fase 4: Lista de Ejercicios Inferior**

- [ ] Scroll en la lista de ejercicios
- [ ] ✅ Ejercicios completados: fondo verde, ✓
- [ ] ✅ Ejercicio actual: fondo rojo, número
- [ ] ✅ Ejercicios pendientes: fondo gris, número
- [ ] Click en ejercicio 3 de la lista
- [ ] ✅ Salta al ejercicio 3
- [ ] ✅ Tarjeta superior se actualiza
- [ ] ✅ Video cambia
- [ ] Si ejercicio tiene video:
  - [ ] ✅ Icono de YouTube visible en la lista

---

### **Fase 5: Controles del Timer**

- [ ] Esperar a que timer llegue a 00:30
- [ ] ✅ Segundos avanzan correctamente
- [ ] ✅ Formato: 00:30, 01:00, 01:15, etc.
- [ ] ✅ Calorías aumentan (verificar que es realista)
  - HIIT → ~7-8 cal en 30seg
  - Fuerza → ~4 cal en 30seg
- [ ] Click en botón de Pausa (círculo izquierdo)
- [ ] ✅ Timer se detiene
- [ ] ✅ Texto "PAUSADO" aparece sobre el timer
- [ ] ✅ Botón cambia a ▶ Play
- [ ] ✅ Botón se agranda (scale-110)
- [ ] Click en Play
- [ ] ✅ Timer continúa desde donde estaba
- [ ] ✅ "PAUSADO" desaparece

---

### **Fase 6: Cancelar Entrenamiento**

- [ ] Click en X (arriba a la derecha)
- [ ] ✅ Se abre modal de confirmación
- [ ] ✅ Título: "¿Cancelar entrenamiento?"
- [ ] ✅ Texto: "Llevas XX:XX entrenando y XX kcal quemadas"
- [ ] ✅ Botón "Continuar" (gris)
- [ ] ✅ Botón "Sí, cancelar" (amarillo)
- [ ] Click en "Continuar"
- [ ] ✅ Modal se cierra
- [ ] ✅ Entrenamiento sigue activo
- [ ] Volver a abrir modal (X)
- [ ] Click en "Sí, cancelar"
- [ ] ✅ Modal se cierra
- [ ] ✅ EntrenamientoActivo se cierra
- [ ] ✅ Vuelvo a la página de donde venía

---

### **Fase 7: Completar Entrenamiento** ⚠️ CRÍTICO

- [ ] Iniciar nuevo entrenamiento
- [ ] Esperar al menos 30 segundos
- [ ] Pasar por 2-3 ejercicios
- [ ] Click en botón "Finalizar" (botón grande rojo)
- [ ] ✅ Botón cambia a "Guardando..." con spinner
- [ ] ✅ Botón queda disabled
- [ ] **Esperar 2-3 segundos** (guardando en Supabase)
- [ ] ✅ EntrenamientoActivo se cierra
- [ ] ✅ Vuelvo a Home

---

### **Fase 8: Verificar en Supabase** ⚠️ MUY IMPORTANTE

- [ ] Abrir Supabase Dashboard
- [ ] Ir a Table Editor → `completed_workouts`
- [ ] ✅ HAY UN NUEVO REGISTRO
- [ ] Verificar campos del registro:
  - [ ] ✅ `user_id` = tu user_id
  - [ ] ✅ `workout_id` = ID del workout que hiciste
  - [ ] ✅ `scheduled_workout_id` = ID del agendado (si era agendado)
  - [ ] ✅ `completed_date` = hoy
  - [ ] ✅ `duration_minutes` = tiempo que estuviste (ej: 1-2 min)
  - [ ] ✅ `calories_burned` = calorías calculadas
  - [ ] ✅ `notes` = '' (vacío por ahora)
  - [ ] ✅ `created_at` = timestamp reciente

- [ ] Ir a `scheduled_workouts`
- [ ] Buscar el workout que completaste
- [ ] ✅ `status` = 'completado'
- [ ] ✅ `completed_at` = timestamp reciente

- [ ] Ir a `user_medals`
- [ ] Si era tu primer workout:
  - [ ] ✅ HAY UN NUEVO REGISTRO de "Primera Victoria"
  - [ ] ✅ `user_id` = tu user_id
  - [ ] ✅ `medal_id` = ID de "Primera Victoria"
  - [ ] ✅ `unlocked_at` = timestamp reciente

---

### **Fase 9: Verificar Stats Actualizados**

- [ ] Ir a Home
- [ ] Card "Stats Personales":
  - [ ] ✅ Total: +1 (incrementó)
  - [ ] ✅ Racha: 1 día (si es tu primer workout)
- [ ] Ir a Progreso
- [ ] ✅ Gráfico muestra 1 workout
- [ ] ✅ Barra del día de hoy visible
- [ ] Ir a Perfil
- [ ] ✅ Total entrenamientos: +1
- [ ] ✅ Medalla "Primera Victoria" visible

---

### **Fase 10: Testing de Edge Cases**

#### **Sin ejercicios en workout:**
- [ ] Crear workout sin exercises en Supabase
- [ ] Intentar iniciarlo
- [ ] ✅ Timer funciona
- [ ] ✅ No muestra tarjeta de ejercicio actual
- [ ] ✅ Lista inferior vacía
- [ ] ✅ Stats: "0/0 ejercicios"

#### **Ejercicio sin video:**
- [ ] Verificar que hay ejercicio sin `video_url`
- [ ] Navegar a ese ejercicio
- [ ] ✅ No muestra iframe
- [ ] ✅ Muestra solo nombre, reps, notas
- [ ] ✅ No hay error en consola

#### **Ejercicio sin reps ni notas:**
- [ ] Verificar ejercicio sin `reps` ni `notes`
- [ ] ✅ Solo muestra nombre
- [ ] ✅ Botón "Siguiente" sigue funcionando

#### **Completar sin scheduled_id:**
- [ ] Ir a Rutinas
- [ ] Click "Iniciar" en rutina no agendada
- [ ] Completar workout
- [ ] ✅ Se guarda en `completed_workouts`
- [ ] ✅ `scheduled_workout_id` = NULL
- [ ] ✅ No da error

---

### **Fase 11: Testing en Móvil (DevTools)**

- [ ] F12 → Toggle Device Toolbar
- [ ] Seleccionar iPhone 12 Pro
- [ ] Iniciar entrenamiento
- [ ] ✅ Header no está cortado por notch
- [ ] ✅ Timer se ve completo
- [ ] ✅ Tarjeta de ejercicio cabe en pantalla
- [ ] ✅ Video tiene aspect ratio correcto
- [ ] ✅ Botones son fáciles de presionar (min 44x44px)
- [ ] ✅ Lista inferior scrollea suave
- [ ] Probar en landscape (horizontal):
  - [ ] ✅ Todo sigue visible
  - [ ] ✅ Video no se rompe

---

### **Fase 12: Performance**

- [ ] Abrir DevTools → Performance
- [ ] Iniciar recording
- [ ] Iniciar entrenamiento
- [ ] Navegar entre ejercicios
- [ ] Pausar/reanudar
- [ ] Stop recording
- [ ] ✅ FPS > 55
- [ ] ✅ No hay long tasks (>50ms)
- [ ] ✅ Memory usage estable

---

## 🐛 Bugs a Reportar

Si encontrás algún problema, anotalo acá:

### Bug Template:
```
**Título:** [Descripción corta]
**Pasos:**
1. 
2. 
3. 

**Esperado:** [Qué debería pasar]
**Actual:** [Qué pasa realmente]
**Console:** [Errores en consola]
**Screenshot:** [Si es posible]
```

---

## ✅ Resultado Esperado

Al terminar el testing deberías tener:

- ✅ Timer funcional con pausar/reanudar
- ✅ Videos de YouTube cargando por ejercicio
- ✅ Navegación entre ejercicios funcional
- ✅ Completar workout guarda en Supabase correctamente
- ✅ Stats se actualizan en tiempo real
- ✅ Medallas se desbloquean (Primera Victoria)
- ✅ Modal de confirmación al cancelar
- ✅ Calorías calculadas realísticamente
- ✅ Sin errores en consola
- ✅ Responsive en móvil

---

## 🚀 Siguiente Paso

Una vez que todo funcione perfecto, continuamos con:
- **Parte 2:** Notificaciones toast de medallas (1 hora)
- **Parte 3:** Editar workouts agendados (1 hora)

**¿Listo para testing?** 🧪

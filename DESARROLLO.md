# PULSO 100 - Documentación de Desarrollo

## 🔧 Estado Actual del Proyecto

### ✅ Completado
- [x] Frontend completo (React + Vite + Tailwind)
- [x] Sistema de roles (Usuario / Admin)
- [x] Calendario interactivo
- [x] Rutinas con ejercicios
- [x] Videos por ejercicio (YouTube embebido)
- [x] Timer de entrenamiento
- [x] Progreso con gráficos (Recharts)
- [x] Sistema de medallas
- [x] Perfil de usuario
- [x] Deploy en Vercel
- [x] Base de datos Supabase configurada

### ⏳ Pendiente
- [ ] Conectar app a Supabase (reemplazar datos mock)
- [ ] CRUD Admin (crear/editar/eliminar ejercicios y rutinas)
- [ ] Autenticación real con Supabase Auth
- [ ] Capacitor para Play Store / App Store

---

## 🗄️ Supabase

### Credenciales
- **URL:** `https://filvdjekfcgszgzkezwc.supabase.co`
- **Anon Key:** Ver archivo `src/lib/supabase.js`
- **Región:** Americas

### Tablas Creadas

| Tabla | Descripción |
|-------|-------------|
| `exercises` | Biblioteca de ejercicios con videos |
| `workouts` | Rutinas de entrenamiento |
| `workout_exercises` | Relación ejercicios-rutinas |
| `user_profiles` | Perfiles de usuario |
| `scheduled_workouts` | Entrenamientos programados/completados |

### Archivo de Conexión
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://filvdjekfcgszgzkezwc.supabase.co';
const supabaseAnonKey = 'TU_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 📁 Archivos Clave

### Datos Mock (a reemplazar por Supabase)
- `src/data/exercises.js` → Tabla `exercises`
- `src/data/mockWorkouts.js` → Tablas `workouts` + `workout_exercises`

### Contextos
- `src/context/AuthContext.jsx` → Autenticación
- `src/context/ScheduleContext.jsx` → Calendario y progreso
- `src/context/EntrenamientoContext.jsx` → Timer global

### Páginas Admin
- `src/pages/admin/Dashboard.jsx` → Panel principal

---

## 🔌 Próximos Pasos (Conexión Supabase)

### 1. Leer ejercicios desde Supabase
```javascript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('exercises')
  .select('*');
```

### 2. Leer rutinas con sus ejercicios
```javascript
const { data, error } = await supabase
  .from('workouts')
  .select(`
    *,
    workout_exercises (
      *,
      exercise:exercises (*)
    )
  `);
```

### 3. CRUD Admin - Crear ejercicio
```javascript
const { data, error } = await supabase
  .from('exercises')
  .insert({ name, description, video_url, muscle_group });
```

---

## 🚀 Deploy

### Vercel
- URL: [proyecto-pulso100.vercel.app](https://proyecto-pulso100.vercel.app)
- Auto-deploy desde branch `main`

### Variables de Entorno (para producción)

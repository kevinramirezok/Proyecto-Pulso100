# 🔧 Pendientes - Panel de Administración

**Estado actual:** Dashboard operativo con CRUD de Ejercicios y Rutinas ✅  
**Última actualización:** 26 de diciembre de 2025

---

## ✅ Completado

### 1. **Dashboard Principal** (`/admin/dashboard`)
- ✅ Vista general con estadísticas en tiempo real
- ✅ 4 tarjetas principales: Ejercicios, Rutinas, Ejercicios en Rutinas, Promedio
- ✅ Gráficos de distribución (Categorías y Niveles)
- ✅ Menú de acciones rápidas con navegación
- ✅ Integrado con Supabase (lee datos reales)

### 2. **Gestión de Ejercicios** (`/admin/ejercicios`)
- ✅ CRUD completo: Crear, Editar, Eliminar
- ✅ Búsqueda por nombre
- ✅ Filtro por grupo muscular
- ✅ Soporte para video URL (YouTube)
- ✅ Vista de tarjetas con información detallada
- ✅ Modal de formulario con validaciones

### 3. **Gestión de Rutinas** (`/admin/rutinas`)
- ✅ CRUD completo: Crear, Editar, Eliminar
- ✅ Asignación de ejercicios a rutinas
- ✅ Orden de ejercicios (con drag & drop visual)
- ✅ Configuración de repeticiones y notas por ejercicio
- ✅ Filtros por categoría y nivel
- ✅ Vista expandible con detalles completos
- ✅ Contador de ejercicios incluidos

---

## 🔴 Pendientes Críticos

### 1. **Gestión de Usuarios** (`/admin/usuarios`) ⚠️ Alta prioridad

**Estado:** Ruta creada pero sin implementar (muestra "Próximamente")

**Funcionalidades requeridas:**
- [ ] Listar todos los usuarios registrados
  ```sql
  -- Query necesaria:
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.last_sign_in_at,
    COALESCE(p.role, 'usuario') as role,
    COALESCE(p.name, 'Sin nombre') as name
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  ORDER BY au.created_at DESC;
  ```

- [ ] Ver estadísticas por usuario:
  - Total de entrenamientos completados
  - Racha actual
  - Última actividad
  - Medallas desbloqueadas
  - Categorías favoritas

- [ ] Acciones administrativas:
  - Buscar usuarios por email/nombre
  - Filtrar por rol (usuario/admin)
  - Ver historial completo de entrenamientos
  - Cambiar rol de usuario (usuario ↔ admin)
  - Desactivar/reactivar cuenta
  - Resetear contraseña (enviar link)

**Componentes a crear:**
- `src/pages/admin/Usuarios.jsx` - Vista principal
- `src/components/admin/UserCard.jsx` - Tarjeta de usuario
- `src/components/admin/UserDetailModal.jsx` - Modal con stats detalladas
- `src/services/adminService.js` - Queries específicas de admin

**Queries Supabase necesarias:**
```javascript
// Obtener todos los usuarios con stats
const { data, error } = await supabase
  .from('profiles')
  .select(`
    *,
    completed_workouts:completed_workouts(count),
    user_medals:user_medals(count)
  `);

// Obtener stats de un usuario específico
const { data, error } = await supabase
  .from('completed_workouts')
  .select('*, workout:workouts(*)')
  .eq('user_id', userId)
  .order('completed_date', { ascending: false });
```

---

### 2. **Gestión de Medallas** 🏆

**Estado:** Sistema de medallas funciona automáticamente, pero no hay UI para gestionarlas

**Funcionalidades requeridas:**
- [ ] Página `/admin/medallas`
  - Listar todas las medallas disponibles (de `medals` table)
  - Ver cuántos usuarios han desbloqueado cada medalla
  - Crear nuevas medallas
  - Editar requisitos de medallas existentes
  - Eliminar medallas (con confirmación)

- [ ] Desbloquear medallas manualmente
  - Útil para eventos especiales o correcciones
  - Modal: "Asignar medalla a usuario"
  - Select de usuario + Select de medalla
  - Confirmación antes de insertar

- [ ] Ver usuarios que tienen cada medalla
  - Al hacer click en medalla → Ver lista de usuarios
  - Fecha de desbloqueo
  - Opción de revocar (eliminar de `user_medals`)

**Componentes a crear:**
- `src/pages/admin/Medallas.jsx`
- `src/components/admin/MedalManager.jsx`
- Extender `src/services/medalService.js` con funciones admin:
  - `assignMedalToUser(userId, medalId)`
  - `revokeMedal(userMedalId)`
  - `getUsersWithMedal(medalId)`
  - `getMedalStats()` - Cuántos usuarios tienen cada medalla

**SQL requerido:**
```sql
-- Ver stats de medallas
SELECT 
  m.id,
  m.name,
  m.description,
  m.requirement_type,
  m.requirement_value,
  COUNT(um.id) as users_unlocked
FROM medals m
LEFT JOIN user_medals um ON um.medal_id = m.id
GROUP BY m.id
ORDER BY users_unlocked DESC;
```

---

### 3. **Configuración del Sistema** (`/admin/config`) 

**Estado:** Ruta creada pero sin implementar (muestra "Próximamente")

**Funcionalidades requeridas:**
- [ ] **Ajustes generales:**
  - Nombre de la aplicación
  - Logo/Favicon
  - Colores principales (paleta)
  - Timezone por defecto

- [ ] **Configuración de medallas:**
  - Habilitar/deshabilitar sistema de medallas
  - Modo de notificación (Toast, Modal, Silencioso)

- [ ] **Límites y restricciones:**
  - Max entrenamientos por día para usuarios
  - Max ejercicios por rutina
  - Duración mínima/máxima de entrenamientos

- [ ] **Notificaciones:**
  - Recordatorios de entrenamiento (Supabase Edge Functions)
  - Emails de bienvenida
  - Newsletters

- [ ] **Backup y mantenimiento:**
  - Exportar todos los datos (JSON)
  - Limpiar datos antiguos (completed_workouts > 1 año)
  - Ver logs de actividad

**Componentes a crear:**
- `src/pages/admin/Configuracion.jsx`
- `src/components/admin/ConfigSection.jsx`
- Nueva tabla en Supabase: `app_settings` (key-value)

---

### 4. **Calendario General** (`/admin/calendario`) 

**Estado:** Ruta creada pero sin implementar

**Funcionalidades requeridas:**
- [ ] Vista de calendario global (todos los usuarios)
- [ ] Filtrar por usuario específico
- [ ] Ver tendencias:
  - Días con más actividad
  - Horas pico de entrenamiento
  - Rutinas más populares por día
- [ ] Crear eventos especiales (challenges, competencias)
- [ ] Estadísticas de adherencia:
  - % de workouts completados vs agendados
  - Tasa de cancelación
  - Días promedio entre entrenamientos

**Componentes a crear:**
- `src/pages/admin/CalendarioAdmin.jsx`
- Reutilizar `src/components/calendar/CalendarioCustom.jsx` con props admin
- Agregar `src/services/adminService.js` → `getGlobalSchedule()`

---

## 🟡 Mejoras Opcionales (No bloqueantes)

### 5. **Dashboard Mejorado**

- [ ] Gráfico de usuarios registrados por mes (Recharts)
- [ ] Top 5 rutinas más completadas (última semana)
- [ ] Top 5 ejercicios más usados en rutinas
- [ ] Actividad reciente (últimos 10 entrenamientos completados)
- [ ] Alerta de usuarios inactivos (>30 días sin entrenar)

### 6. **Gestión Avanzada de Rutinas**

- [ ] Duplicar rutina existente (para crear variaciones)
- [ ] Plantillas de rutinas (pre-configuradas)
- [ ] Asignar rutina a usuario específico (workout personalizado)
- [ ] Marcar rutina como "Destacada" o "Recomendada"
- [ ] Categorías personalizadas (además de fuerza, cardio, etc.)

### 7. **Gestión Avanzada de Ejercicios**

- [ ] Importar ejercicios desde CSV/JSON
- [ ] Exportar biblioteca de ejercicios
- [ ] Subir videos directamente (no solo YouTube)
  - Integrar con Supabase Storage
  - Límite de tamaño (ej: 50MB)
- [ ] Ejercicios con variaciones (beginner, intermediate, advanced)
- [ ] Historial de cambios en ejercicios (auditoría)

### 8. **Análisis y Reportes**

- [ ] Página `/admin/reportes`
- [ ] Exportar a PDF:
  - Reporte mensual de actividad
  - Estadísticas de usuarios
  - Progreso general
- [ ] Gráficos comparativos:
  - Usuarios vs Admins (actividad)
  - Categorías más populares por mes
  - Tendencia de nuevos usuarios
- [ ] Métricas de retención:
  - Usuarios activos (7 días, 30 días)
  - Churn rate
  - Engagement score

---

## 🧩 Estructura Propuesta para Implementar

### Orden de prioridad recomendado:

**FASE 3A - Usuarios y Medallas** (Alta prioridad)
1. Crear `adminService.js` con queries necesarias
2. Implementar `/admin/usuarios` - Vista + Búsqueda + Stats
3. Implementar `/admin/medallas` - CRUD + Asignación manual
4. Testing completo de ambas páginas

**FASE 3B - Configuración y Calendario** (Media prioridad)
5. Crear tabla `app_settings` en Supabase
6. Implementar `/admin/config` - Settings básicos
7. Implementar `/admin/calendario` - Vista global
8. Testing completo

**FASE 3C - Mejoras y Análisis** (Opcional)
9. Dashboard avanzado con gráficos
10. Página de reportes
11. Funcionalidades extra de rutinas/ejercicios
12. Exportación y backup automatizado

---

## 📋 Checklist de Archivos a Crear

### Services:
- [ ] `src/services/adminService.js` (nuevo)
  - `getAllUsers()`
  - `getUserStats(userId)`
  - `updateUserRole(userId, newRole)`
  - `toggleUserStatus(userId)`
  - `getGlobalSchedule(filters)`
  - `getSystemStats()`

### Páginas Admin:
- [ ] `src/pages/admin/Usuarios.jsx`
- [ ] `src/pages/admin/Medallas.jsx`
- [ ] `src/pages/admin/Configuracion.jsx`
- [ ] `src/pages/admin/CalendarioAdmin.jsx` (o renombrar a CalendarioGlobal)
- [ ] `src/pages/admin/Reportes.jsx` (opcional)

### Componentes Admin:
- [ ] `src/components/admin/UserCard.jsx`
- [ ] `src/components/admin/UserDetailModal.jsx`
- [ ] `src/components/admin/MedalManager.jsx`
- [ ] `src/components/admin/ConfigSection.jsx`
- [ ] `src/components/admin/StatCard.jsx` (reutilizable)

### Rutas en App.jsx:
```javascript
// Actualizar en src/App.jsx:
<Route path="usuarios" element={<UsuariosAdmin />} />
<Route path="medallas" element={<MedallasAdmin />} />
<Route path="config" element={<ConfiguracionAdmin />} />
<Route path="calendario" element={<CalendarioAdmin />} />
<Route path="reportes" element={<ReportesAdmin />} /> // opcional
```

### Tabla Supabase nueva:
```sql
-- Crear tabla app_settings
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer/escribir
CREATE POLICY "Admins can manage settings"
  ON app_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

---

## 🎯 Recomendación

**Si tenés tiempo limitado:** Empezá con **Gestión de Usuarios** (`/admin/usuarios`). Es lo más útil y te permite ver cómo está funcionando la app en producción.

**Si querés impacto visual rápido:** Mejorá el **Dashboard** con gráficos adicionales usando los datos que ya tenés.

**Si querés completar lo prometido en el UI:** Implementá **Usuarios** y **Configuración** (las dos secciones que dicen "Próximamente").

---



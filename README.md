git clone https://github.com/kevinramirezok/Proyecto-Pulso100.git

# PULSO 100 🏃‍♂️💪
**Tu límite es el siguiente pulso**

Plataforma de entrenamiento personalizado que conecta usuarios con su entrenador/a personal de forma virtual.

---

## 🚀 Demo
[Ver Demo en Vivo](https://proyecto-pulso100.vercel.app)

---

## 📱 Características Principales

### Usuario
- Calendario interactivo para programar y visualizar entrenamientos
- Biblioteca de rutinas con buscador y filtros por categoría
- Biblioteca de ejercicios con videos tutoriales y videos embebidos de YouTube
- Seguimiento de progreso con gráficos (Recharts)
- Timer de entrenamiento en tiempo real
- Sistema de racha (días consecutivos)
- Medallas y logros desbloqueables (14 medallas, rachas, calorías, minutos, variedad de categorías)
- Perfil con estadísticas personales
- Entrenamiento activo global con cronómetro

### Admin
- Dashboard de administración
- Gestión de usuarios y entrenamientos (en desarrollo)

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite
- **Estilos:** Tailwind CSS (v3.4.1)
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Routing:** React Router DOM v7
- **Estado global:** Context API
- **Persistencia local:** LocalStorage
- **Fechas:** date-fns
- **Backend y Auth:** Supabase
- **Otros:** ESLint, PostCSS

---

## 📦 Instalación y Uso para Desarrolladores

```bash
# Clonar repositorio


# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 📁 Estructura del Proyecto

```text
src/
 ├── App.jsx
 ├── App.css
 ├── index.css
 ├── main.jsx
 ├── assets/
 ├── components/
 │   ├── ui/           # Badge, Button, Card, Input, MiniCalendario, Modal
 │   ├── features/     # EntrenamientoActivo, MedalCard
 │   ├── layout/       # BottomNav, LayoutAdmin, LayoutUsuario
 │   └── calendar/     # CalendarioCustom
 ├── context/          # AuthContext, ScheduleContext, ThemeContext, EntrenamientoContext
 ├── data/             # exercises.js, mockWorkouts.js, medals.js
 ├── hooks/            # (custom hooks)
 ├── lib/
 │   └── supabase.js   # Configuración de Supabase
 ├── pages/
 │   ├── auth/         # Login, Register, ForgotPassword, ResetPassword
 │   ├── usuario/      # Home, Rutinas, Calendario, Progreso, Perfil
 │   └── admin/        # Dashboard, Ejercicios, RutinasAdmin
 └── utils/
```

---

## 🗄️ Base de Datos (Supabase)

- **Tablas principales:**
  - `exercises`
  - `workouts`
  - `workout_exercises`
  - `user_profiles`
  - `scheduled_workouts`

---

## 👥 Roles del Sistema

- **Usuario:** Acceso a rutinas, calendario, progreso, perfil y gamificación.
- **Admin:** Acceso a dashboard y gestión de la plataforma.

---

## 🗓️ Sistema de Calendario

- Visualización y programación de entrenamientos por día
- Selección visual de fechas (MiniCalendario)
- Marcado y eliminación de entrenamientos
- Persistencia en localStorage
- Categorización visual por tipo de entrenamiento

---

## 📊 Seguimiento y Gamificación

- Gráficos de progreso (Recharts)
- Historial de entrenamientos
- Sistema de medallas/logros
- Estadísticas detalladas

---

## 🎨 Paleta de Colores

| Color        | Hex      | Uso                |
|--------------|----------|--------------------|
| Rojo PULSO   | #FF0000  | Acento principal   |
| Negro        | #0a0a0a  | Fondo principal    |
| Negro Sec    | #1a1a1a  | Fondos secundarios |

---

## 📝 Variables de Entorno

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 👤 Autor

Desarrollado por Kevin Marcos Ramirez

---

## 📄 Licencia

Proyecto privado y confidencial.

---
**PULSO 100** © 2025


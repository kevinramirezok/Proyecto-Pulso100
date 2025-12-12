# PULSO 100 🏃‍♂️💪
**Tu límite es el siguiente pulso**

Plataforma de entrenamiento personalizado que conecta usuarios con su entrenador/a personal de forma virtual.

---

## 🚀 Demo
[Ver Demo en Vivo](URL_DE_VERCEL_AQUÍ)

---

## 📱 Características para Usuarios
- Calendario interactivo para programar entrenamientos
- Biblioteca de rutinas con filtros por categoría y buscador
- **Biblioteca de ejercicios con videos tutoriales por ejercicio**
- **Videos embebidos de YouTube en cada ejercicio de rutina**
- Seguimiento de progreso con gráficos
- Timer de entrenamiento en tiempo real con lista de ejercicios
- Sistema de racha (días consecutivos)
- Medallas y logros desbloqueables
- Perfil con estadísticas personales
- Entrenamiento activo global con cronómetro

### Categorías de Entrenamiento
- 🚴 Bicicleta
- 🏃 Running
- 💪 Fuerza
- 🏊 Natación
- 🧘 Otros

---

## 🛠️ Tecnologías
- **Frontend:** React 18 + Vite
- **Estilos:** Tailwind CSS (v3.4.1)
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Routing:** React Router DOM v6
- **Estado:** Context API
- **Persistencia:** LocalStorage

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
 ├── components/
 │   ├── ui/                 # Componentes reutilizables (Button, Card, Modal, Input...)
 │   ├── features/           # Componentes funcionales (MedalCard, EntrenamientoActivo)
 │   ├── layout/             # Layouts (LayoutUsuario, LayoutAdmin, BottomNav)
 │   └── calendar/           # Calendario custom (CalendarioCustom)
 ├── pages/
 │   ├── auth/               # Login y autenticación
 │   ├── usuario/            # Vistas del usuario (Home, Rutinas, Calendario, Progreso, Perfil)
 │   └── admin/              # Dashboard de admin
 ├── context/                # Context API (Auth, Schedule, Theme, Entrenamiento)
 │   ├── AuthContext.jsx
 │   ├── ScheduleContext.jsx
 │   ├── ThemeContext.jsx
 │   └── EntrenamientoContext.jsx
 ├── hooks/                  # Custom hooks (vacío por ahora)
 ├── utils/                  # Utilidades
 ├── data/                   # Datos mock/estáticos
 │   ├── exercises.js        # Biblioteca de ejercicios con videos y descripción
 │   ├── mockWorkouts.js     # Rutinas que referencian ejercicios por exerciseId
 │   └── medals.js           # Sistema de medallas y logros
 ├── App.jsx
 └── main.jsx
tailwind.config.js           # Configuración TailwindCSS
```

---

## 👥 Roles del Sistema
- **Usuario:** Accede a rutinas, seguimiento personal, calendario y progreso
- **Admin:** Administración completa de la plataforma y gestión de entrenamientos

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
- Sistema de medallas/logros: 14 medallas desbloqueables, rachas, calorías, minutos y variedad de categorías
- Estadísticas detalladas

---

## 🎨 Paleta de Colores

# PULSO 100 🏃‍♂️💪

**Tu límite es el siguiente pulso**

Plataforma de entrenamiento personalizado que conecta usuarios con su entrenador/a personal de forma virtual.

## 🚀 Demo
[Ver Demo en Vivo](https://proyecto-pulso100.vercel.app)

## 📱 Características

### Usuario
- Calendario interactivo para programar y visualizar entrenamientos
- Biblioteca de rutinas con buscador y filtros
- Biblioteca de ejercicios con videos tutoriales
- Videos embebidos de YouTube en cada ejercicio de rutina
- Seguimiento de progreso con gráficos (Recharts)
- Timer de entrenamiento en tiempo real
- Sistema de racha (días consecutivos)
- Medallas y logros desbloqueables
- Perfil con estadísticas personales
- Entrenamiento activo global con cronómetro

### Admin
- Dashboard de administración
- Gestión de usuarios y entrenamientos (en desarrollo)

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Routing:** React Router DOM v7
- **Estado global:** Context API
- **Persistencia local:** LocalStorage
- **Fechas:** date-fns
- **Backend y Auth:** Supabase
- **Otros:** ESLint, PostCSS

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/kevinramirezok/Proyecto-Pulso100.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

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
 │   ├── auth/         # Login.jsx
 │   ├── usuario/      # Home, Rutinas, Calendario, Progreso, Perfil
 │   └── admin/        # Dashboard.jsx
 └── utils/
```

## 🗄️ Base de Datos

- **Proveedor:** Supabase
- **Tablas principales:**
	- `exercises`
	- `workouts`
	- `workout_exercises`
	- `user_profiles`
	- `scheduled_workouts`

## 👥 Roles

- **Usuario:** Acceso a rutinas, calendario, progreso, perfil y gamificación.
- **Admin:** Acceso a dashboard y gestión de la plataforma.

## 🎨 Paleta de Colores

| Color        | Hex      | Uso                |
|--------------|----------|--------------------|
| Rojo PULSO   | #FF0000  | Acento principal   |
| Negro        | #0a0a0a  | Fondo principal    |
| Negro Sec    | #1a1a1a  | Fondos secundarios |

## 📝 Variables de Entorno

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 👤 Autor

Desarrollado por Kevin Marcos Ramirez

## 📄 Licencia

Proyecto privado y confidencial.

---
**PULSO 100** © 2025

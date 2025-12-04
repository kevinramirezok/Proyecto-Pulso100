# PULSO 100 🏃‍♂️

**Tu límite es el siguiente pulso**

Plataforma web para gestión de entrenamiento fitness con sistema de roles (Usuario, Entrenadora, Admin).

## 🚀 Tecnologías

- **React 18** + **Vite**
- **TailwindCSS** (v3.4.1) para estilos
- **React Router** para navegación
- **Lucide React** para iconos
- **Context API** (autenticación, progreso, calendario)
- **LocalStorage** para persistencia de datos

## 📁 Estructura del Proyecto

```
pulso100-v2/
├── public/
│   ├── logo-completo.jpg      # Logo principal
│   ├── logo-simple.jpg         # Logo simplificado
│   ├── logo-runner.jpg         # Logo con corredor
│   └── logo-circular.jpg       # Logo circular
├── src/
│   ├── components/
│   │   ├── layout/             # Layouts por rol
│   │   │   ├── BottomNav.jsx
│   │   │   ├── LayoutUsuario.jsx
│   │   │   ├── LayoutEntrenadora.jsx
│   │   │   └── LayoutAdmin.jsx
│   │   ├── ui/                 # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── MiniCalendario.jsx
│   │   ├── features/           # Componentes específicos
│   │   └── calendar/           # Componentes de calendario
│   │        └── CalendarioCustom.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── usuario/
│   │   │   ├── Home.jsx
│   │   │   ├── Rutinas.jsx
│   │   │   └── Calendario.jsx
│   │   ├── entrenadora/
│   │   │   └── Dashboard.jsx
│   │   └── admin/
│   │       └── Dashboard.jsx
│   ├── context/                # Context API
│   │   ├── AuthContext.jsx
│   │   ├── ProgressContext.jsx
│   │   ├── ScheduleContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilidades
│   ├── data/                   # Datos mock/estáticos
│   │   └── mockWorkouts.js
│   ├── App.jsx
│   └── main.jsx
└── tailwind.config.js
```

## 🎨 Paleta de Colores

```js
colors: {
  'pulso-rojo': '#FF0000',
  'pulso-negro': '#0a0a0a',
  'pulso-negroSec': '#1a1a1a',
}
```

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 👥 Roles del Sistema

1. **Usuario** - Accede a rutinas y seguimiento personal
2. **Entrenadora** - Gestiona rutinas y usuarios asignados
3. **Admin** - Administración completa de la plataforma

## 🔧 Configuración

El proyecto usa **TailwindCSS v3.4.1** con configuración personalizada en `tailwind.config.js`.

### PostCSS

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🗓️ Sistema de Calendario

El proyecto incluye un sistema completo de calendario personalizado:

- **CalendarioCustom**: Componente principal que muestra los entrenamientos programados
- **MiniCalendario**: Selector visual de fecha para programación de rutinas
- **ScheduleContext**: Gestión de estado para entrenamientos programados con persistencia en localStorage

### Funcionalidades del Calendario

- ✅ Visualización de entrenamientos programados por día
- ✅ Selección visual de fechas con `MiniCalendario`
- ✅ Programación de rutinas desde la página de Rutinas
- ✅ Marcado de entrenamientos como completados
- ✅ Eliminación de entrenamientos programados
- ✅ Persistencia de datos en localStorage
- ✅ Categorización visual por tipo de entrenamiento (colores distintivos)

## 📱 Características Principales

### Gestión de Rutinas
- Catálogo completo de entrenamientos con filtros por categoría
- Sistema de búsqueda en tiempo real
- Detalles completos de ejercicios, duración y calorías
- Programación visual de rutinas con calendario

### Seguimiento de Progreso
- Marcado de rutinas completadas
- Historial de entrenamientos
- Persistencia de datos local

### Sistema de Roles
- **Usuario**: Acceso a rutinas, calendario y progreso personal
- **Entrenadora**: Dashboard con gestión de usuarios y rutinas
- **Admin**: Panel de administración completa

## 📝 Notas de Desarrollo

- Utiliza **React Router** para la navegación entre roles
- Sistema de autenticación con **Context API**
- Componentes UI reutilizables con TailwindCSS
- Diseño mobile-first con navegación inferior
- **ScheduleProvider** envuelve toda la aplicación para gestión de calendario
- **ProgressContext** para seguimiento de entrenamientos completados
- Persistencia de datos con **localStorage**

## 🎯 Próximas Funcionalidades

- Sistema de notificaciones para entrenamientos programados
- Gráficos de progreso y estadísticas
- Creación de rutinas personalizadas
- Sistema de metas y objetivos
- Integración con APIs externas de fitness

---

**PULSO 100** © 2025

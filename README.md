# PULSO 100 🏃‍♂️💪
**Tu límite es el siguiente pulso**

Plataforma de entrenamiento personalizado que conecta usuarios con su entrenador/a personal de forma virtual.

---

## 🚀 Demo
[Ver Demo en Vivo](URL_DE_VERCEL_AQUÍ)

---

## 📱 Características para Usuarios
- Calendario interactivo para programar entrenamientos
- Biblioteca de rutinas con filtros por categoría
- Seguimiento de progreso con gráficos
- Timer de entrenamiento y lista de ejercicios
- Sistema de racha (días consecutivos)
- Medallas y logros desbloqueables
- Perfil con estadísticas personales

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
 │   ├── ui/                 # Componentes reutilizables
 │   ├── features/           # Componentes funcionales (ej: MedalCard)
 │   ├── calendar/           # Calendario custom (ej: CalendarioCustom)
 ├── pages/
 │   ├── auth/               # Login y autenticación
 │   ├── usuario/            # Vistas del usuario (Home, Rutinas, Calendario, Progreso)
 │   ├── entrenadora/        # Dashboard de entrenadora
 │   └── admin/              # Dashboard de admin
 ├── context/                # Context API (Auth, Schedule, Theme)
 ├── hooks/                  # Custom hooks
 ├── utils/                  # Utilidades
 ├── data/                   # Datos mock/estáticos (mockUsers, mockWorkouts, medals...)
 ├── App.jsx
 └── main.jsx
tailwind.config.js           # Configuración TailwindCSS
```

---

## 👥 Roles del Sistema
- **Usuario:** Accede a rutinas y seguimiento personal
- **Entrenadora:** Gestiona rutinas y usuarios asignados
- **Admin:** Administración completa de la plataforma

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
| Color        | Hex      | Uso                |
|-------------|----------|--------------------|
| Rojo PULSO  | #FF0000  | Acento principal   |
| Negro       | #0a0a0a  | Fondo principal    |
| Negro Sec   | #1a1a1a  | Fondos secundarios |

---

## 📝 Notas para Desarrolladores
- Navegación con React Router
- Autenticación y estados globales con Context API
- Componentes UI reutilizables con TailwindCSS
- Diseño mobile-first con navegación inferior
- ScheduleProvider envuelve la app para gestión de calendario
- Persistencia de datos con localStorage

---

## 🎯 Próximas Funcionalidades
- Sistema de notificaciones para entrenamientos programados
- Gráficos de progreso y estadísticas avanzadas
- Creación de rutinas personalizadas
- Sistema de metas y objetivos
- Integración con APIs externas de fitness
- Métricas de performance y medallas avanzadas

---

## 👤 Autor
Desarrollado por [TU_NOMBRE]

## 📄 Licencia
Este proyecto es privado y confidencial.

---
**PULSO 100** © 2025 - Tu límite es el siguiente pulso

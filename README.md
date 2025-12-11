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
| Color        | Hex      | Uso                |
|-------------|----------|--------------------|
| Rojo PULSO  | #FF0000  | Acento principal   |
| Negro       | #0a0a0a  | Fondo principal    |
| Negro Sec   | #1a1a1a  | Fondos secundarios |

---

## 📝 Notas para Desarrolladores
- Navegación con React Router v6
- Autenticación y estados globales con Context API (Auth, Schedule, Theme, Entrenamiento)
- Componentes UI reutilizables con TailwindCSS
- Diseño mobile-first con navegación inferior (BottomNav)
- ScheduleProvider y EntrenamientoProvider envuelven la app
- Persistencia de datos con localStorage
- **Las rutinas (`mockWorkouts.js`) referencian ejercicios de la biblioteca (`exercises.js`) por `exerciseId`**
- **Cada ejercicio puede tener un video de YouTube embebido, visible desde el modal de detalle**
- **Entrenamiento activo global con cronómetro en tiempo real**
- Los videos se muestran ejercicio por ejercicio con botón de YouTube

---

## 🎯 Próximas Funcionalidades
- Sistema de notificaciones para entrenamientos programados
- Creación de rutinas personalizadas desde el usuario
- Sistema de metas y objetivos personalizados
- Integración con APIs externas de fitness (Strava, Garmin, etc.)
- Exportación de datos de progreso
- Chat en vivo con entrenador
- Compartir logros en redes sociales
- Modo offline con sincronización

---

## 👤 Autor
Desarrollado por Kevin Marcos Ramirez

## 📄 Licencia
Este proyecto es privado y confidencial.

---
**PULSO 100** © 2025 - Tu límite es el siguiente pulso

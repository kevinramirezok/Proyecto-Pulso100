# PULSO 100 🏃‍♂️

**Tu límite es el siguiente pulso**

Plataforma web para gestión de entrenamiento fitness con sistema de roles (Usuario, Entrenadora, Admin).

## 🚀 Tecnologías

- **React 18** + **Vite**
- **TailwindCSS** (v3.4.1) para estilos
- **React Router** para navegación
- **Lucide React** para iconos

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
│   │   │   └── Badge.jsx
│   │   ├── features/           # Componentes específicos
│   │   └── calendar/           # Componentes de calendario
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── usuario/
│   │   │   └── Home.jsx
│   │   ├── entrenadora/
│   │   │   └── Dashboard.jsx
│   │   └── admin/
│   │       └── Dashboard.jsx
│   ├── context/                # Context API
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilidades
│   ├── data/                   # Datos mock/estáticos
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

## 📝 Notas de Desarrollo

- Utiliza **React Router** para la navegación entre roles
- Sistema de autenticación con **Context API**
- Componentes UI reutilizables con TailwindCSS
- Diseño mobile-first con navegación inferior

---

**PULSO 100** © 2025

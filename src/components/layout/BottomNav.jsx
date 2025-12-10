import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Dumbbell, TrendingUp, User, Users, Settings, PlusCircle } from 'lucide-react';

const TABS = {
  usuario: [
    { label: 'Home', icon: Home, to: '/usuario/home' },
    { label: 'Calendario', icon: Calendar, to: '/usuario/calendario' },
    { label: 'Rutinas', icon: Dumbbell, to: '/usuario/rutinas' },
    { label: 'Progreso', icon: TrendingUp, to: '/usuario/progreso' },
    { label: 'Perfil', icon: User, to: '/usuario/perfil' },
  ],
  admin: [
    { label: 'Dashboard', icon: Home, to: '/admin/dashboard' },
    { label: 'Usuarios', icon: Users, to: '/admin/usuarios' },
    { label: 'Rutinas', icon: Dumbbell, to: '/admin/rutinas' },
    { label: 'Calendario', icon: Calendar, to: '/admin/calendario' },
    { label: 'Config', icon: Settings, to: '/admin/config' },
  ],
};

export default function BottomNav({ role = 'usuario' }) {
  const location = useLocation();
  const tabs = TABS[role] || TABS.usuario;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-pulso-negroSec border-t border-gray-800 z-50">
      <ul className="flex justify-around items-center py-2">
        {tabs.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors
                  ${isActive ? 'text-pulso-rojo' : 'text-gray-400 hover:text-white'}
                `}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
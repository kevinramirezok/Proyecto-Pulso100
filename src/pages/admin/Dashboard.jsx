import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, UserCheck, Activity, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Hola, {user?.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Salir
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <div className="bg-purple-500/10 p-3 rounded-lg">
            <Users className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Total Usuarios</p>
            <p className="text-white text-2xl font-bold">156</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <UserCheck className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Entrenadores</p>
            <p className="text-white text-2xl font-bold">8</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-white font-bold text-lg mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full">
            <Users size={18} className="mr-2" />
            Usuarios
          </Button>
          <Button variant="secondary" className="w-full">
            <Activity size={18} className="mr-2" />
            Actividad
          </Button>
          <Button variant="secondary" className="w-full">
            <UserCheck size={18} className="mr-2" />
            Entrenadores
          </Button>
          <Button variant="secondary" className="w-full">
            <Settings size={18} className="mr-2" />
            Configuración
          </Button>
        </div>
      </Card>
    </div>
  );
}
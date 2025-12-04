import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Bienvenida, {user?.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Salir
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <Users className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Usuarios Activos</p>
            <p className="text-white text-2xl font-bold">24</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="bg-green-500/10 p-3 rounded-lg">
            <Activity className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Rutinas Creadas</p>
            <p className="text-white text-2xl font-bold">48</p>
          </div>
        </Card>
      </div>

      {/* Usuarios Recientes */}
      <Card>
        <h3 className="text-white font-bold text-lg mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {['Juan Pérez', 'María López', 'Carlos Gómez'].map((nombre) => (
            <div key={nombre} className="flex items-center justify-between p-3 bg-pulso-negro rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pulso-rojo rounded-full flex items-center justify-center text-white font-bold">
                  {nombre[0]}
                </div>
                <div>
                  <p className="text-white font-medium">{nombre}</p>
                  <p className="text-gray-400 text-xs">Completó rutina hace 2h</p>
                </div>
              </div>
              <TrendingUp className="text-green-500" size={18} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
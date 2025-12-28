import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Users, 
  Dumbbell, 
  ClipboardList, 
  Settings, 
  TrendingUp,
  Youtube,
  ChevronRight,
  LogOut,
  BarChart3
} from 'lucide-react';
import { getUsers, getWorkouts } from '../../services/workoutService';
import { getCompletedWorkouts } from '../../services/progressService';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para datos globales
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [completedCount, setCompletedCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [usersData, workoutsData] = await Promise.all([
          getUsers(),
          getWorkouts()
        ]);
        let totalCompleted = 0;
        // Sumar entrenamientos completados de todos los usuarios
        if (usersData && usersData.length > 0) {
          // Se puede optimizar con una función agregada en el backend, pero aquí se hace por usuario
          const completedArrays = await Promise.all(
            usersData.map(u => getCompletedWorkouts(u.id, 1_000))
          );
          totalCompleted = completedArrays.reduce((acc, arr) => acc + (arr?.length || 0), 0);
        }
        if (isMounted) {
          setUsers(usersData || []);
          setWorkouts(workoutsData || []);
          setCompletedCount(totalCompleted);
        }
      } catch (e) {
        setUsers([]);
        setWorkouts([]);
        setCompletedCount(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Estadísticas globales
  const stats = {
    totalUsers: users.length,
    totalWorkouts: workouts.length,
    totalCompleted: completedCount,
  };

  const menuItems = [
    {
      title: 'Ejercicios',
      description: 'Biblioteca de ejercicios con videos',
      icon: Dumbbell,
      path: '/admin/ejercicios',
      stat: `${stats.totalExercises} ejercicios`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Rutinas',
      description: 'Gestionar rutinas de entrenamiento',
      icon: ClipboardList,
      path: '/admin/rutinas',
      stat: `${stats.totalWorkouts} rutinas`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Usuarios',
      description: 'Ver usuarios registrados',
      icon: Users,
      path: '/admin/usuarios',
      stat: 'Ver todos',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Settings,
      path: '/admin/config',
      stat: 'Próximamente',
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      disabled: true
    }
  ];

  if (loading) {
    // Esqueletos simples
    return (
      <div className="space-y-8 pb-24 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-800 rounded"></div>
          </div>
          <div className="h-8 w-20 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-24 flex items-center justify-center">
              <div className="h-8 w-8 bg-gray-700 rounded-full mr-4"></div>
              <div>
                <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-800 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Panel de Administración</h1>
          <p className="text-gray-400">Bienvenido, {user?.name || 'Admin'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut size={18} className="mr-2" />
          Salir
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-xl">
              <Users className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usuarios</p>
              <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-xl">
              <ClipboardList className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rutinas</p>
              <p className="text-white text-2xl font-bold">{stats.totalWorkouts}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-xl">
              <TrendingUp className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Entrenamientos Completados</p>
              <p className="text-white text-2xl font-bold">{stats.totalCompleted !== null ? stats.totalCompleted : '-'}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <BarChart3 className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Promedio Rutinas/Usuario</p>
              <p className="text-white text-2xl font-bold">
                {stats.totalUsers > 0 ? Math.round(stats.totalWorkouts / stats.totalUsers) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribución por categoría y nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-white font-semibold mb-4">Rutinas por Categoría</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryCounts).length > 0 ? (
              Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-400 capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pulso-rojo rounded-full"
                        style={{ width: `${(count / stats.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay rutinas creadas</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-4">Rutinas por Nivel</h3>
          <div className="space-y-3">
            {Object.entries(stats.levelCounts).length > 0 ? (
              Object.entries(stats.levelCounts).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-gray-400">{level}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(count / stats.totalWorkouts) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay rutinas creadas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Menú de acciones */}
      <div>
        <h3 className="text-white font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.title}
              className={`cursor-pointer transition-all hover:border-pulso-rojo/50 ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !item.disabled && navigate(item.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`${item.bgColor} p-3 rounded-xl`}>
                  <item.icon className={item.color} size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-sm">{item.stat}</span>
                  <ChevronRight className="text-gray-600 ml-auto mt-1" size={20} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
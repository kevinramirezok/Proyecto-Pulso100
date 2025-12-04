import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Flame, Clock, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const { getTotalCompleted, getWeekCompleted } = useProgress();

  return (
    <div className="min-h-screen relative">
      {/* Fondo con overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/logo-runner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pulso-negro/95 via-pulso-negro/85 to-pulso-negro/95"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 space-y-6 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Hola, {user?.name}! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Listo para entrenar hoy?</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex items-center gap-3 backdrop-blur-sm bg-pulso-negroSec/80">
            <div className="bg-pulso-rojo/10 p-3 rounded-lg">
              <Flame className="text-pulso-rojo" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Esta Semana</p>
              <p className="text-white text-2xl font-bold">{getWeekCompleted()}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 backdrop-blur-sm bg-pulso-negroSec/80">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Clock className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-white text-2xl font-bold">{getTotalCompleted()}</p>
            </div>
          </Card>
        </div>

        {/* Rutina del día */}
        <Card className="backdrop-blur-sm bg-pulso-negroSec/80">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">Rutina de Hoy</h3>
              <p className="text-gray-400 text-sm">Lunes, 2 Diciembre</p>
            </div>
            <Badge variant="fuerza">Fuerza</Badge>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Target size={16} />
              <span>Full Body Workout</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Clock size={16} />
              <span>45 minutos</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Flame size={16} />
              <span>450 kcal</span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Comenzar Entrenamiento
          </Button>
        </Card>

        {/* Progreso Semanal */}
        <Card className="backdrop-blur-sm bg-pulso-negroSec/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Progreso Semanal</h3>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Entrenamientos completados</span>
              <span className="text-white font-bold">{getWeekCompleted()}/6</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-pulso-rojo h-2 rounded-full transition-all" 
                style={{ width: `${Math.min((getWeekCompleted() / 6) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ROLES = [
  { key: 'usuario', label: 'Usuario', icon: User },
  { key: 'admin', label: 'Administrador', icon: Shield },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('usuario');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userData = {
      id: Date.now(),
      name: 'Demo ' + role.charAt(0).toUpperCase() + role.slice(1),
      email,
      role,
    };
    
    login(userData);
    setLoading(false);
    
    if (role === 'usuario') navigate('/usuario/home');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pulso-negro px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img 
          src="/logo-completo-sinbackground.png" 
          alt="Pulso 100" 
          className="w-80 max-w-full mx-auto mb-4"
        />
      </div>

      {/* Card de Login */}
      <div className="bg-pulso-negroSec rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Bienvenido
        </h2>
        <p className="text-gray-400 text-sm mb-8 text-center">
          Ingresá tus credenciales para continuar
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-pulso-rojo transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <label className="block mb-3 text-gray-400 font-medium text-sm">
              Seleccioná tu rol
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`
                    flex flex-col items-center justify-center gap-2 py-4 rounded-lg
                    border-2 transition-all duration-200
                    ${role === key 
                      ? 'bg-pulso-rojo/10 border-pulso-rojo text-pulso-rojo' 
                      : 'bg-pulso-negro border-gray-700 text-gray-400 hover:border-pulso-rojo/50'
                    }
                  `}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            variant="primary" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>

      <p className="text-gray-500 text-xs mt-8">
        PULSO 100 © 2025
      </p>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = role === 'admin' ? '/admin/dashboard' : '/usuario/home';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Debes confirmar tu email antes de iniciar sesión');
      } else {
        setError(signInError.message || 'Error al iniciar sesión');
      }
      setLoading(false);
      return;
    }

    // Login exitoso - esperar a que se cargue el perfil
    if (data.user) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pulso-negro px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img 
          src="/logo.png" 
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

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} />}
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock size={18} />}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-pulso-rojo transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-gray-400 hover:text-pulso-rojo transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
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

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-pulso-rojo hover:text-pulso-rojo/80 font-medium">
              Registrate
            </Link>
          </p>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-8">
        PULSO 100 © 2025
      </p>
    </div>
  );
}
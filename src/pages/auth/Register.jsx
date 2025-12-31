    import { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
    import { useAuth } from '../../context/AuthContext';
    import Input from '../../components/ui/Input';
    import Button from '../../components/ui/Button';

    export default function Register() {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useAuth();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/usuario/home', { replace: true });
        }
    }, [isAuthenticated, role, navigate]);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
        setError('El nombre es requerido');
        return false;
        }
        if (!formData.email.trim()) {
        setError('El email es requerido');
        return false;
        }
        if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
        }
        if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
        return;
        }
        
        setLoading(true);
        setError('');

        try {
          const result = await signUp(
            formData.email,
            formData.password,
            formData.name
          );
          
          const { data, error: signUpError } = result;

          if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                setError('Este email ya está registrado');
            } else if (signUpError.message.includes('invalid email')) {
                setError('Email inválido');
            } else {
                setError(signUpError.message || 'Error al crear la cuenta');
            }
            setLoading(false);
            return;
          }

          // Registro exitoso - Mantener loading hasta redirección automática
          if (!data.user) {
            setLoading(false);
          }
        } catch (err) {
          console.error('Error inesperado al registrar:', err);
          setError('Error inesperado al registrar');
          setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pulso-negro px-4 py-8">
        {/* Logo */}
        <div className="mb-6 text-center">
            <img 
            src="/logo.png" 
            alt="Pulso 100" 
            className="w-64 max-w-full mx-auto mb-4"
            />
        </div>

        {/* Card de Registro */}
        <div className="bg-pulso-negroSec rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-6">
            <UserPlus className="text-pulso-rojo" size={32} />
            <h2 className="text-3xl font-bold text-white">
                Crear Cuenta
            </h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 text-center">
            Completá los datos para comenzar
            </p>

            {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
            </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
            <Input
                type="text"
                name="name"
                label="Nombre completo"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                required
                icon={<User size={18} />}
            />

            <Input
                type="email"
                name="email"
                label="Email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                icon={<Mail size={18} />}
            />

            <div className="relative">
                <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
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

            <div className="relative">
                <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirmar contraseña"
                placeholder="Repetí tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                icon={<Lock size={18} />}
                />
                <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-400 hover:text-pulso-rojo transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <Button 
                type="submit" 
                size="lg" 
                variant="primary" 
                disabled={loading}
                className="w-full"
            >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
            </form>

            <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
                ¿Ya tenés cuenta?{' '}
                <Link to="/" className="text-pulso-rojo hover:text-pulso-rojo/80 font-medium">
                Iniciá sesión
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

    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
    import { useAuth } from '../../context/AuthContext';
    import Input from '../../components/ui/Input';
    import Button from '../../components/ui/Button';

    export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar que estamos en un flujo de recuperación válido
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        
        if (type !== 'recovery') {
        navigate('/');
        }
    }, [navigate]);

    const validateForm = () => {
        if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
        }
        if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const { error: updateError } = await updatePassword(password);

        if (updateError) {
        setError(updateError.message || 'Error al actualizar la contraseña');
        setLoading(false);
        return;
        }

        setSuccess(true);
        setLoading(false);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
        navigate('/');
        }, 3000);
    };

    if (success) {
        return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pulso-negro px-4 py-8">
            <div className="mb-8 text-center">
            <img 
                src="/logo.png" 
                alt="Pulso 100" 
                className="w-64 max-w-full mx-auto mb-4"
            />
            </div>

            <div className="bg-pulso-negroSec rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle className="text-green-500" size={64} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
                Contraseña actualizada
            </h2>
            
            <p className="text-gray-400 mb-6">
                Tu contraseña ha sido actualizada exitosamente.
            </p>
            
            <p className="text-gray-500 text-sm">
                Redirigiendo al inicio de sesión...
            </p>
            </div>

            <p className="text-gray-500 text-xs mt-8">
            PULSO 100 © 2025
            </p>
        </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pulso-negro px-4 py-8">
        <div className="mb-8 text-center">
            <img 
            src="/logo.png" 
            alt="Pulso 100" 
            className="w-64 max-w-full mx-auto mb-4"
            />
        </div>

        <div className="bg-pulso-negroSec rounded-2xl shadow-2xl border border-gray-800 p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-white mb-2">
            Nueva contraseña
            </h2>
            
            <p className="text-gray-400 text-sm mb-8">
            Ingresá tu nueva contraseña
            </p>

            {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <Input
                type={showPassword ? 'text' : 'password'}
                label="Nueva contraseña"
                placeholder="Mínimo 6 caracteres"
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

            <div className="relative">
                <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmar contraseña"
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
            </form>
        </div>

        <p className="text-gray-500 text-xs mt-8">
            PULSO 100 © 2025
        </p>
        </div>
    );
    }

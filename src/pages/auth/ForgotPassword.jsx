    import { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
    import { useAuth } from '../../context/AuthContext';
    import Input from '../../components/ui/Input';
    import Button from '../../components/ui/Button';

    export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
        setError('El email es requerido');
        return;
        }

        setLoading(true);
        setError('');

        const { error: resetError } = await resetPassword(email);

        if (resetError) {
        setError(resetError.message || 'Error al enviar el email de recuperación');
        setLoading(false);
        return;
        }

        setSuccess(true);
        setLoading(false);
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
                Email enviado
            </h2>
            
            <p className="text-gray-400 mb-6">
                Te enviamos un email a <span className="text-white font-medium">{email}</span> con las instrucciones para recuperar tu contraseña.
            </p>
            
            <p className="text-gray-500 text-sm mb-6">
                Revisá tu bandeja de entrada y también la carpeta de spam.
            </p>

            <Button 
                onClick={() => navigate('/')}
                variant="primary"
                size="lg"
                className="w-full"
            >
                Volver al inicio
            </Button>
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
            <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-pulso-rojo transition-colors mb-6"
            >
            <ArrowLeft size={20} />
            <span className="text-sm">Volver</span>
            </Link>

            <h2 className="text-3xl font-bold text-white mb-2">
            Recuperar contraseña
            </h2>
            
            <p className="text-gray-400 text-sm mb-8">
            Ingresá tu email y te enviaremos instrucciones para restablecer tu contraseña
            </p>

            {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                type="email"
                label="Email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail size={18} />}
            />

            <Button 
                type="submit" 
                size="lg" 
                variant="primary" 
                disabled={loading}
                className="w-full"
            >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </Button>
            </form>
        </div>

        <p className="text-gray-500 text-xs mt-8">
            PULSO 100 © 2025
        </p>
        </div>
    );
    }

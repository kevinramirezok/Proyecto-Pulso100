import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar perfil del usuario desde user_profiles
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error cargando perfil:', error);
        return null;
      }
      
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error cargando perfil:', error);
      return null;
    }
  };

  // Verificar sesión al cargar la app
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user && isMounted) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // ✅ CRÍTICO: Mostrar UI INMEDIATAMENTE sin esperar perfil
          setLoading(false);
          
          // Cargar perfil en background (no bloqueante)
          loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error inicializando auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          setLoading(false);
          
          // Cargar perfil en background
          loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Registro de nuevo usuario
  const signUp = (email, password, name) => {
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
    });
    
    const resultPromise = signUpPromise.then(({ data: authData, error: authError }) => {
      if (authError) {
        return { data: null, error: authError };
      }

      // Crear perfil en background (el rol se asignará automáticamente en la BD)
      if (authData.user) {
        supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            name,
            email,
          }, {
            onConflict: 'id'
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error creando perfil:', error);
            }
          });
      }

      return { data: authData, error: null };
    }).catch((error) => {
      console.error('Error inesperado en signUp:', error);
      return { data: null, error };
    });
    
    return resultPromise;
  };

  // Inicio de sesión
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en login:', error);
      return { data: null, error };
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      
      return { error: null };
    } catch (error) {
      console.error('Error en logout:', error);
      return { error };
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error en recuperación:', error);
      return { error };
    }
  };

  // Actualizar contraseña
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      return { error };
    }
  };

  // Actualizar perfil
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signOut,
    logout: signOut, // Alias para compatibilidad
    resetPassword,
    updatePassword,
    updateProfile,
    role: profile?.role || 'usuario',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
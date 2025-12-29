import { createContext, useContext, useState, useEffect } from 'react';
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
      console.log('🟢 [AUTH] loadUserProfile() iniciado:', userId);
      console.log('🟢 [AUTH] Ejecutando query a user_profiles...');
      
      // Timeout de 5 segundos para evitar colgado infinito
      const queryPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Query tardó más de 5 segundos')), 5000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      console.log('🟢 [AUTH] Query completada! Resultado:', { data, error });
      
      if (error) {
        console.error('❌ [AUTH] Error en query:', error);
        throw error;
      }
      
      const profileData = data?.[0] || data;
      
      console.log('🟢 [AUTH] Guardando perfil en estado:', profileData);
      setProfile(profileData);
      console.log('✅ [AUTH] Perfil cargado exitosamente');
      return profileData;
    } catch (error) {
      console.error('❌ [AUTH] Error cargando perfil:', error);
      console.log('⚠️ [AUTH] Continuando sin perfil...');
      return null;
    }
  };

  // Verificar sesión al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🟢 [AUTH] initializeAuth() INICIO - obteniendo sesión...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🟢 [AUTH] getSession() completado:', { session, error });
        
        if (error) throw error;

        if (session?.user) {
          console.log('🟢 [AUTH] Sesión encontrada, cargando perfil...');
          setUser(session.user);
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
        } else {
          console.log('🟢 [AUTH] No hay sesión activa');
        }
      } catch (error) {
        console.error('❌ [AUTH] Error inicializando auth:', error);
      } finally {
        console.log('🟢 [AUTH] initializeAuth() FIN - setLoading(false)');
        setLoading(false);
      }
    };

    initializeAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🟡 [LISTENER] DISPARADO - evento:', event, 'user:', session?.user?.id);
        if (session?.user) {
          console.log('🟡 [LISTENER] Sesión detectada, actualizando estados...');
          setUser(session.user);
          setIsAuthenticated(true);
          console.log('🟡 [LISTENER] Llamando loadUserProfile...');
          await loadUserProfile(session.user.id);
          console.log('✅ [LISTENER] loadUserProfile completado, isAuthenticated=true');
        } else {
          console.log('🟡 [LISTENER] Sin sesión, limpiando estados...');
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
        console.log('🟡 [LISTENER] FIN - loading=false');
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Registro de nuevo usuario
  const signUp = (email, password, name) => {
    console.log('🟢 [AUTH] signUp() iniciado:', { email, name });
    console.log('🟢 [AUTH] PASO 1: Creando objeto de signUp...');
    
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
    });
    
    console.log('🟢 [AUTH] PASO 2: Promesa creada, agregando .then()...');
    
    const resultPromise = signUpPromise.then(({ data: authData, error: authError }) => {
      console.log('🟢 [AUTH] PASO 3: .then() EJECUTADO - Respuesta recibida:', { authData, authError });
      
      if (authError) {
        console.error('❌ [AUTH] PASO 4A: Error en signUp:', authError);
        return { data: null, error: authError };
      }

      console.log('🟢 [AUTH] PASO 4B: Sin error, procesando usuario...');
      
      // Crear perfil en background (el rol se asignará automáticamente en la BD)
      if (authData.user) {
        console.log('🟢 [AUTH] PASO 5: Usuario existe, creando perfil...');
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
              console.error('❌ [AUTH] Error creando perfil:', error);
            } else {
              console.log('✅ [AUTH] Perfil creado exitosamente');
            }
          });
      }

      console.log('✅ [AUTH] PASO 6: Retornando resultado exitoso');
      return { data: authData, error: null };
    }).catch((error) => {
      console.error('❌ [AUTH] PASO X: .catch() EJECUTADO - Error inesperado:', error);
      return { data: null, error };
    });
    
    console.log('🟢 [AUTH] PASO 7: Retornando promesa al Register...');
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
      console.log('🟢 [AUTH] signOut() iniciado...');
      const { error } = await supabase.auth.signOut();
      
      console.log('🟢 [AUTH] supabase.auth.signOut() completado:', { error });
      
      if (error) throw error;
      
      console.log('🟢 [AUTH] Limpiando estados locales...');
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      
      console.log('✅ [AUTH] Logout completado - estados limpiados');
      return { error: null };
    } catch (error) {
      console.error('❌ [AUTH] Error en logout:', error);
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
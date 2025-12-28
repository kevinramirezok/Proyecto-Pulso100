import { useState, useEffect } from 'react';
import { getUsers, getUserScheduledWorkouts, updateUserRole, deleteUser } from '../../services/workoutService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { 
  Users, Search, X, Mail, Calendar, Target, Clock, 
  Flame, TrendingUp, Shield, ShieldCheck, Trash2, Eye,
  CheckCircle, XCircle
} from 'lucide-react';

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    usuarios: users.filter(u => u.role === 'usuario').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const openUserDetail = async (user) => {
    setSelectedUser(user);
    setLoadingStats(true);
    
    const workouts = await getUserScheduledWorkouts(user.id);
    const completados = workouts.filter(w => w.status === 'completed');
    const totalMinutos = completados.reduce((acc, w) => acc + (w.workout_duration || 0), 0);
    
    setUserStats({
      totalProgramados: workouts.length,
      completados: completados.length,
      pendientes: workouts.filter(w => w.status === 'pending').length,
      totalMinutos,
      totalCalorias: totalMinutos * 10,
      ultimaActividad: workouts.length > 0 ? workouts[0].scheduled_date : null
    });
    setLoadingStats(false);
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`¿Cambiar rol a "${newRole}"?`)) return;
    
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      alert('Rol actualizado');
    } catch (error) {
      alert('Error al actualizar rol');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`¿Eliminar a "${user.name}"? Esta acción no se puede deshacer.`)) return;
    
    try {
      await deleteUser(user.id);
      setUsers(users.filter(u => u.id !== user.id));
      setSelectedUser(null);
      alert('Usuario eliminado');
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin actividad';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Usuarios</h1>
          <p className="text-gray-400 text-sm">Gestión de usuarios registrados</p>
        </div>
        <div className="bg-purple-500/10 px-4 py-2 rounded-xl text-center">
          <p className="text-purple-500 text-2xl font-bold">{stats.total}</p>
          <p className="text-gray-400 text-xs">Total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-3">
          <Users className="mx-auto text-purple-500 mb-1" size={20} />
          <p className="text-white text-xl font-bold">{stats.total}</p>
          <p className="text-gray-500 text-xs">Total</p>
        </Card>
        <Card className="text-center py-3">
          <Shield className="mx-auto text-blue-500 mb-1" size={20} />
          <p className="text-white text-xl font-bold">{stats.usuarios}</p>
          <p className="text-gray-500 text-xs">Usuarios</p>
        </Card>
        <Card className="text-center py-3">
          <ShieldCheck className="mx-auto text-green-500 mb-1" size={20} />
          <p className="text-white text-xl font-bold">{stats.admins}</p>
          <p className="text-gray-500 text-xs">Admins</p>
        </Card>
      </div>

      {/* Buscador y filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-pulso-negroSec border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pulso-rojo transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-pulso-negroSec border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pulso-rojo"
        >
          <option value="todos">Todos los roles</option>
          <option value="usuario">Usuarios</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Lista de usuarios */}
      <Card className="overflow-hidden p-0">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-400">No se encontraron usuarios</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-sm text-gray-400">
                <th className="py-3 px-4 font-medium">Usuario</th>
                <th className="py-3 px-4 font-medium hidden sm:table-cell">Rol</th>
                <th className="py-3 px-4 font-medium hidden md:table-cell">Registro</th>
                <th className="py-3 px-4 font-medium w-20 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pulso-rojo to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{user.name || 'Sin nombre'}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-400 text-sm">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => openUserDetail(user)}
                    >
                      <Eye size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Contador */}
      {searchTerm && filteredUsers.length > 0 && (
        <p className="text-gray-500 text-sm text-center">
          {filteredUsers.length} de {users.length} usuarios
        </p>
      )}

      {/* Modal detalle usuario */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setUserStats(null);
        }}
        title="Detalle de Usuario"
      >
        {selectedUser && (
          <div className="space-y-5">
            {/* Info usuario */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pulso-rojo to-red-700 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{selectedUser.name}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1 truncate">
                  <Mail size={12} />
                  {selectedUser.email}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  Registro: {formatDate(selectedUser.created_at)}
                </p>
              </div>
            </div>

            {/* Rol actual */}
            <div className="flex items-center justify-between p-3 bg-pulso-negro rounded-xl">
              <span className="text-gray-400 text-sm">Rol actual</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                selectedUser.role === 'admin' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-blue-500/20 text-blue-500'
              }`}>
                {selectedUser.role}
              </span>
            </div>

            {/* Stats del usuario */}
            {loadingStats ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-pulso-rojo border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : userStats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pulso-negro rounded-xl p-3 text-center">
                  <Target className="mx-auto text-pulso-rojo mb-1" size={18} />
                  <p className="text-white font-bold">{userStats.completados}</p>
                  <p className="text-gray-500 text-xs">Completados</p>
                </div>
                <div className="bg-pulso-negro rounded-xl p-3 text-center">
                  <Clock className="mx-auto text-yellow-500 mb-1" size={18} />
                  <p className="text-white font-bold">{userStats.pendientes}</p>
                  <p className="text-gray-500 text-xs">Pendientes</p>
                </div>
                <div className="bg-pulso-negro rounded-xl p-3 text-center">
                  <TrendingUp className="mx-auto text-blue-500 mb-1" size={18} />
                  <p className="text-white font-bold">{userStats.totalMinutos}</p>
                  <p className="text-gray-500 text-xs">Minutos</p>
                </div>
                <div className="bg-pulso-negro rounded-xl p-3 text-center">
                  <Flame className="mx-auto text-orange-500 mb-1" size={18} />
                  <p className="text-white font-bold">{userStats.totalCalorias}</p>
                  <p className="text-gray-500 text-xs">Calorías</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedUser.role === 'usuario' ? 'primary' : 'secondary'}
                  onClick={() => handleChangeRole(selectedUser.id, 'usuario')}
                  disabled={selectedUser.role === 'usuario'}
                >
                  <Shield size={14} className="mr-1" />
                  Usuario
                </Button>
                <Button
                  variant={selectedUser.role === 'admin' ? 'primary' : 'secondary'}
                  onClick={() => handleChangeRole(selectedUser.id, 'admin')}
                  disabled={selectedUser.role === 'admin'}
                >
                  <ShieldCheck size={14} className="mr-1" />
                  Admin
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full text-red-500 hover:bg-red-500/10"
                onClick={() => handleDeleteUser(selectedUser)}
              >
                <Trash2 size={14} className="mr-1" />
                Eliminar Usuario
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { UserProfile, DatabaseStats } from '@/types/user';
import Icon from '@/components/ui/icon';

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = await userService.getAllUsers();
      // Фильтруем только реальных пользователей (исключаем тестовых)
      const realUsers = allUsers.filter(user => 
        !user.email.includes('@example.com') && 
        user.email !== 'admin@gorkhon.online'
      );
      setUsers(realUsers);
      setStats(userService.getDatabaseStats());
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (userId: string, newStatus: UserProfile['status']) => {
    const result = await userService.updateUserStatus(userId, newStatus);
    if (result.success) {
      await loadData();
      alert('Статус пользователя изменен');
    } else {
      alert(`Ошибка: ${result.error}`);
    }
  };

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    const result = await userService.verifyUser(userId, verified);
    if (result.success) {
      await loadData();
      alert(verified ? 'Пользователь верифицирован' : 'Верификация снята');
    } else {
      alert(`Ошибка: ${result.error}`);
    }
  };

  const exportData = () => {
    const data = userService.exportUsers();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Icon name="Users" className="w-6 h-6 text-white" />
              </div>
              Управление пользователями
            </h1>
            <p className="text-gray-600 mt-2">Зарегистрированные пользователи платформы</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium"
            >
              <Icon name="Download" size={16} />
              <span className="hidden sm:inline">Экспорт</span>
            </button>
          </div>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Icon name="Users" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-600">Всего пользователей</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Icon name="CheckCircle" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Активных</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Icon name="BadgeCheck" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.isVerified).length}
                  </div>
                  <div className="text-sm text-gray-600">Верифицированных</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Icon name="Calendar" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter(u => {
                      const today = new Date().toDateString();
                      return new Date(u.createdAt).toDateString() === today;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">Новых сегодня</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Фильтры */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-0 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
                <option value="banned">Заблокированные</option>
                <option value="pending">Ожидающие</option>
              </select>
            </div>
          </div>
        </div>

        {/* Список пользователей */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedStatus !== 'all' ? 'Пользователи не найдены' : 'Нет зарегистрированных пользователей'}
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedStatus !== 'all' ? 
                'Попробуйте изменить параметры поиска' : 
                'Пользователи появятся здесь после регистрации'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Информация о пользователе */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      {user.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        {user.isVerified && (
                          <Icon name="BadgeCheck" size={20} className="text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>Регистрация: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                        <span>•</span>
                        <span>Входов: {user.loginCount}</span>
                        {user.phone && (
                          <>
                            <span>•</span>
                            <span>{user.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Статус и роль */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2">
                      {/* Статус */}
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as UserProfile['status'])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer transition-all ${
                          user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          user.status === 'banned' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <option value="active">Активный</option>
                        <option value="inactive">Неактивный</option>
                        <option value="banned">Заблокирован</option>
                        <option value="pending">Ожидает</option>
                      </select>

                      {/* Роль */}
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 
                         user.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                      </span>
                    </div>

                    {/* Верификация */}
                    <button
                      onClick={() => handleVerifyUser(user.id, !user.isVerified)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {user.isVerified ? (
                        <div className="flex items-center gap-1.5">
                          <Icon name="CheckCircle" size={14} />
                          <span>Верифицирован</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Icon name="Circle" size={14} />
                          <span>Верифицировать</span>
                        </div>
                      )}
                    </button>

                    {/* Действия */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Просмотр профиля: ${user.name}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Просмотр профиля"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => alert(`Редактирование: ${user.name}`)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Редактировать"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить пользователя ${user.name}?`)) {
                            alert('Функция удаления будет реализована');
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
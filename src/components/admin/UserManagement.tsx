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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок - адаптивный */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span className="truncate">Управление пользователями</span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">Зарегистрированные пользователи платформы</p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium text-sm flex-shrink-0"
            >
              <Icon name="Download" size={14} className="sm:w-4 sm:h-4" />
              <span>Экспорт</span>
            </button>
          </div>
        </div>

        {/* Статистика - мобильная адаптация */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 lg:mb-0 flex-shrink-0">
                  <Icon name="Users" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Всего</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 lg:mb-0 flex-shrink-0">
                  <Icon name="CheckCircle" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Активных</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 lg:mb-0 flex-shrink-0">
                  <img 
                    src="https://cdn.poehali.dev/files/2531de9e-0943-461a-8734-65d54bf1d5f7.png" 
                    alt="Verified" 
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                    {users.filter(u => u.isVerified).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Верифи</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-3 lg:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 lg:mb-0 flex-shrink-0">
                  <Icon name="Calendar" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">
                    {users.filter(u => {
                      const today = new Date().toDateString();
                      return new Date(u.createdAt).toDateString() === today;
                    }).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-tight">Новых</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Фильтры - адаптивные */}
        <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border-0 bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-medium transition-all"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border-0 bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-medium"
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

        {/* Список пользователей - мобильная адаптация */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-8 sm:p-12 border border-white/20 shadow-lg text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-gray-400 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedStatus !== 'all' ? 'Пользователи не найдены' : 'Нет зарегистрированных пользователей'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery || selectedStatus !== 'all' ? 
                'Попробуйте изменить параметры поиска' : 
                'Пользователи появятся здесь после регистрации'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col gap-4">
                  {/* Информация о пользователе */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl overflow-hidden shadow-lg">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      {user.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        {user.isVerified && (
                          <img 
                            src="https://cdn.poehali.dev/files/2531de9e-0943-461a-8734-65d54bf1d5f7.png" 
                            alt="Verified" 
                            className="w-4 h-4 flex-shrink-0 sm:w-5 sm:h-5"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>Регистрация: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Входов: {user.loginCount}</span>
                        {user.phone && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{user.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Статус, роль и действия */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Статус */}
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as UserProfile['status'])}
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer transition-all ${
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
                      <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Админ' : 
                         user.role === 'moderator' ? 'Модер' : 'Пользователь'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Верификация */}
                      <button
                        onClick={() => handleVerifyUser(user.id, !user.isVerified)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        {user.isVerified ? (
                          <div className="flex items-center gap-1">
                            <Icon name="CheckCircle" size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>Верифицирован</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Icon name="Circle" size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>Верифицировать</span>
                          </div>
                        )}
                      </button>

                      {/* Действия */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => alert(`Просмотр профиля: ${user.name}`)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Просмотр профиля"
                        >
                          <Icon name="Eye" size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Редактирование: ${user.name}`)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Редактировать"
                        >
                          <Icon name="Edit" size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить пользователя ${user.name}?`)) {
                              alert('Функция удаления будет реализована');
                            }
                          }}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
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
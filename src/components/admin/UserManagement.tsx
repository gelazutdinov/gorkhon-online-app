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
      setUsers(allUsers);
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

  const createTestUsers = async () => {
    await userService.createTestUsers();
    await loadData();
    alert('Тестовые пользователи созданы');
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

  const clearDatabase = () => {
    if (confirm('Вы уверены, что хотите очистить всю базу данных?')) {
      userService.clearDatabase();
      loadData();
      alert('База данных очищена');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
        <div className="flex gap-2">
          <button
            onClick={createTestUsers}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Создать тестовых пользователей
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Icon name="Download" size={16} className="inline mr-2" />
            Экспорт
          </button>
          <button
            onClick={clearDatabase}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Icon name="Trash2" size={16} className="inline mr-2" />
            Очистить БД
          </button>
        </div>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Всего пользователей</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-sm text-gray-600">Активных</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{stats.verifiedUsers}</div>
            <div className="text-sm text-gray-600">Верифицированных</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">{stats.newUsersToday}</div>
            <div className="text-sm text-gray-600">Новых сегодня</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">{stats.bannedUsers}</div>
            <div className="text-sm text-gray-600">Заблокированных</div>
          </div>
        </div>
      )}

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="banned">Заблокированные</option>
            <option value="pending">Ожидающие</option>
          </select>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Пользователь</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Роль</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Верификация</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Регистрация</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          {user.name}
                          {user.isVerified && (
                            <Icon name="BadgeCheck" size={16} className="text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{user.middleName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-600">ID: {user.id.slice(-8)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as UserProfile['status'])}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        user.status === 'banned' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="active">Активный</option>
                      <option value="inactive">Неактивный</option>
                      <option value="banned">Заблокирован</option>
                      <option value="pending">Ожидает</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Админ' : 
                       user.role === 'moderator' ? 'Модер' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleVerifyUser(user.id, !user.isVerified)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        user.isVerified 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {user.isVerified ? 'Верифицирован' : 'Не верифицирован'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-600">
                      Входов: {user.loginCount}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Просмотр профиля: ${user.name}`)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Просмотр профиля"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => alert(`Редактирование: ${user.name}`)}
                        className="p-1 text-gray-600 hover:text-green-600 transition-colors"
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
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
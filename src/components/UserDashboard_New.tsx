import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';
import ProfileEditModal from '@/components/ProfileEditModal';
import UserManagement from '@/components/admin/UserManagement';

const UserDashboard_New = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Заголовок с приветствием */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {user.avatar || (user.gender === 'female' ? '👩' : '👨')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Добро пожаловать, {user.name}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Icon name="Shield" className="w-3 h-3 mr-1" />
                  Администратор
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="LogOut" className="w-4 h-4" />
            Выйти
          </button>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowProfileEdit(true)}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Icon name="User" className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Редактировать профиль</p>
              <p className="text-sm text-gray-600">Изменить личные данные</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Icon name="Settings" className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Настройки</p>
              <p className="text-sm text-gray-600">Конфиденциальность, уведомления</p>
            </div>
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Icon name="Shield" className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Админ-панель</p>
                <p className="text-sm text-gray-600">Управление пользователями</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Информация о профиле */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="User" className="w-5 h-5" />
            Информация о профиле
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Имя:</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Телефон:</span>
              <span className="font-medium">{user.phone || 'Не указан'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Дата рождения:</span>
              <span className="font-medium">{user.birthDate || 'Не указана'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className={`font-medium ${user.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                {user.status === 'active' ? 'Активен' : 'Неактивен'}
              </span>
            </div>
            {user.isVerified && (
              <div className="flex items-center justify-center pt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Icon name="CheckCircle" className="w-3 h-3 mr-1" />
                  Верифицированный аккаунт
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Activity" className="w-5 h-5" />
            Статистика активности
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Дата регистрации:</span>
              <span className="font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Последняя активность:</span>
              <span className="font-medium">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ru-RU') : 'Сейчас'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Роль:</span>
              <span className="font-medium capitalize">
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка редактирования профиля */}
      {showProfileEdit && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowProfileEdit(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Админ-панель */}
      {showAdminPanel && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Shield" className="w-6 h-6 text-purple-600" />
                Админ-панель
              </h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <UserManagement />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard_New;
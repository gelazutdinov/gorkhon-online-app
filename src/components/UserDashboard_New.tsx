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
    <div className="min-h-screen bg-gray-100">
      {/* VK-style Header with cover photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 overflow-hidden rounded-t-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/0e65e83e-1fcf-4edf-88f3-1506ccc9f6f7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Кнопка выхода в правом углу */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-colors"
        >
          <Icon name="LogOut" className="w-4 h-4" />
          Выйти
        </button>
      </div>

      {/* Profile info on white background */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b rounded-t-3xl -mt-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl">
                  {user.gender === 'female' ? '👩' : '👨'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Name and status */}
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              {user.name}
              {(user.isVerified || isAdmin) && (
                <Icon name="BadgeCheck" size={20} className="text-blue-500" />
              )}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm">
              <span>Последняя активность: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ru-RU') : 'сегодня'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b mx-4 sm:mx-0 rounded-2xl sm:rounded-none">
        <div className="flex rounded-2xl sm:rounded-none overflow-hidden">
          <button 
            className="flex-1 py-3 px-4 font-medium border-b-2 border-blue-500 text-blue-500"
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="User" size={20} />
              <span className="hidden sm:inline">Профиль</span>
            </div>
          </button>
          <button 
            className="flex-1 py-3 px-4 font-medium text-gray-500"
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Settings" size={20} />
              <span className="hidden sm:inline">Настройки</span>
            </div>
          </button>
          {isAdmin && (
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="flex-1 py-3 px-4 font-medium text-gray-500"
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="Shield" size={20} />
                <span className="hidden sm:inline">Админ</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Status card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-600 space-y-1">
            <p>Статус: <span className="text-blue-600 font-medium">Активный пользователь</span></p>
            <p>Дата регистрации: <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}</span></p>
            <p>Роль: <span className="font-medium">{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span></p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowProfileEdit(true)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="User" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Редактировать профиль</p>
              <p className="text-sm text-gray-600">Изменить личные данные</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Settings" className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Настройки</p>
              <p className="text-sm text-gray-600">Конфиденциальность, уведомления</p>
            </div>
          </button>
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
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';
import ProfileEditModal from '@/components/ProfileEditModal';
import UserManagement from '@/components/admin/UserManagement';

const UserDashboard_New = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

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
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="User" size={20} />
              <span className="hidden sm:inline">Профиль</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Settings" size={20} />
              <span className="hidden sm:inline">Настройки</span>
            </div>
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 px-4 font-medium ${activeTab === 'admin' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
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
        {activeTab === 'profile' && (
          <>
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

              <button 
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="Settings" className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Настройки</p>
                  <p className="text-sm text-gray-600">Конфиденциальность, уведомления</p>
                </div>
              </button>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Настройки профиля */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="User" className="w-5 h-5 text-blue-600" />
                Настройки профиля
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowProfileEdit(true)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Edit" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Редактировать профиль</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                </button>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Eye" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Приватность профиля</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Двухфакторная аутентификация</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Настройки уведомлений */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Bell" className="w-5 h-5 text-green-600" />
                Уведомления
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Email уведомления</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="MessageCircle" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Push уведомления</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Newspaper" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Новости и обновления</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Настройки платформы */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Palette" className="w-5 h-5 text-purple-600" />
                Настройки платформы
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Moon" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Темная тема</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Smartphone" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Компактный вид</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Languages" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Язык интерфейса</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Русский</span>
                    <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Безопасность */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Lock" className="w-5 h-5 text-red-600" />
                Безопасность
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Key" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Сменить пароль</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Activity" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">История активности</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon name="Trash2" className="w-5 h-5 text-red-600" />
                    <span className="text-red-900">Удалить аккаунт</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <UserManagement />
          </div>
        )}
      </div>



      {/* Модалка редактирования профиля */}
      {showProfileEdit && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowProfileEdit(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default UserDashboard_New;
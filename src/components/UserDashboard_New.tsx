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
  
  // Настройки состояния
  const [settings, setSettings] = useState({
    profilePrivate: true,
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    newsUpdates: true,
    darkTheme: false,
    compactView: false,
    language: 'ru'
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
  };

  // Функции для работы с настройками
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = (newLang: string) => {
    setSettings(prev => ({ ...prev, language: newLang }));
    setShowLanguageSelect(false);
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(true);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
      setShowDeleteAccount(true);
    }
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
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.profilePrivate}
                      onChange={() => toggleSetting('profilePrivate')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Двухфакторная аутентификация</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.twoFactorAuth}
                      onChange={() => toggleSetting('twoFactorAuth')}
                    />
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
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.emailNotifications}
                      onChange={() => toggleSetting('emailNotifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="MessageCircle" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Push уведомления</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.pushNotifications}
                      onChange={() => toggleSetting('pushNotifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Newspaper" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Новости и обновления</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.newsUpdates}
                      onChange={() => toggleSetting('newsUpdates')}
                    />
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
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.darkTheme}
                      onChange={() => toggleSetting('darkTheme')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Smartphone" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Компактный вид</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.compactView}
                      onChange={() => toggleSetting('compactView')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowLanguageSelect(!showLanguageSelect)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="Languages" className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">Язык интерфейса</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {settings.language === 'ru' ? 'Русский' : 
                         settings.language === 'en' ? 'English' : 'Русский'}
                      </span>
                      <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  
                  {showLanguageSelect && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10">
                      <button 
                        onClick={() => handleLanguageChange('ru')}
                        className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg ${
                          settings.language === 'ru' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        Русский
                      </button>
                      <button 
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full p-3 text-left hover:bg-gray-50 last:rounded-b-lg ${
                          settings.language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Безопасность */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Lock" className="w-5 h-5 text-red-600" />
                Безопасность
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={handlePasswordChange}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Key" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Сменить пароль</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                </button>

                <button 
                  onClick={() => setShowActivityHistory(true)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Activity" className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">История активности</span>
                  </div>
                  <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                </button>

                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
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

      {/* Модалка смены пароля */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Key" className="w-5 h-5 text-blue-600" />
                Сменить пароль
              </h2>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => {
                    alert('Пароль изменен!');
                    setShowPasswordChange(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка истории активности */}
      {showActivityHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Activity" className="w-5 h-5 text-green-600" />
                История активности
              </h2>
              <button
                onClick={() => setShowActivityHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {[
                { action: 'Вход в систему', time: 'Сегодня, 14:30', ip: '192.168.1.1' },
                { action: 'Изменение профиля', time: 'Вчера, 16:20', ip: '192.168.1.1' },
                { action: 'Смена пароля', time: '3 дня назад', ip: '192.168.1.1' },
                { action: 'Вход в систему', time: '5 дней назад', ip: '192.168.1.5' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time} • IP: {activity.ip}</p>
                  </div>
                  <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard_New;
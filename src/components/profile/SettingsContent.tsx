import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Settings {
  profilePrivate: boolean;
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsUpdates: boolean;
  darkTheme: boolean;
  compactView: boolean;
  language: string;
}

interface SettingsContentProps {
  settings: Settings;
  onToggleSetting: (key: keyof Settings) => void;
  onEditProfile: () => void;
  onPasswordChange: () => void;
  onShowActivityHistory: () => void;
  onDeleteAccount: () => void;
  onLogout?: () => void;
}

const SettingsContent = ({ 
  settings, 
  onToggleSetting, 
  onEditProfile,
  onPasswordChange,
  onShowActivityHistory,
  onDeleteAccount,
  onLogout
}: SettingsContentProps) => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const handleLanguageChange = (newLang: string) => {
    onToggleSetting('language' as keyof Settings);
    setShowLanguageSelect(false);
  };

  return (
    <div className="space-y-4">
      {/* Настройки профиля */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="User" className="w-5 h-5 text-blue-600" />
          Настройки профиля
        </h3>
        <div className="space-y-3">
          <button
            onClick={onEditProfile}
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
                onChange={() => onToggleSetting('profilePrivate')}
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
                onChange={() => onToggleSetting('twoFactorAuth')}
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
                onChange={() => onToggleSetting('emailNotifications')}
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
                onChange={() => onToggleSetting('pushNotifications')}
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
                onChange={() => onToggleSetting('newsUpdates')}
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
                onChange={() => onToggleSetting('darkTheme')}
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
                onChange={() => onToggleSetting('compactView')}
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
            onClick={onPasswordChange}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="Key" className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Сменить пароль</span>
            </div>
            <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={onShowActivityHistory}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="Activity" className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">История активности</span>
            </div>
            <Icon name="ChevronRight" className="w-4 h-4 text-gray-400" />
          </button>

          {onLogout && (
            <button 
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                  onLogout();
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="LogOut" className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">Выйти из аккаунта</span>
              </div>
              <Icon name="ChevronRight" className="w-4 h-4 text-blue-400" />
            </button>
          )}

          <button 
            onClick={onDeleteAccount}
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
  );
};

export default SettingsContent;
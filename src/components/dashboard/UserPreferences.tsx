import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/types/user';

interface UserPreferencesProps {
  user: UserProfile;
  onClose: () => void;
  onUserUpdate?: (user: UserProfile) => void;
}

interface UserSettings {
  notifications: {
    push: boolean;
    email: boolean;
    scheduleUpdates: boolean;
    systemNews: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showActivity: boolean;
    allowDataCollection: boolean;
  };
  interface: {
    compactMode: boolean;
    showWeather: boolean;
    defaultSection: string;
    language: string;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
  };
}

const UserPreferences = ({ user, onClose, onUserUpdate }: UserPreferencesProps) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'interface' | 'accessibility'>('notifications');
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      push: true,
      email: false,
      scheduleUpdates: true,
      systemNews: true,
      weeklyReport: false
    },
    privacy: {
      showOnlineStatus: true,
      showActivity: true,
      allowDataCollection: true
    },
    interface: {
      compactMode: false,
      showWeather: true,
      defaultSection: 'home',
      language: 'ru'
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Загружаем сохраненные настройки
    const savedSettings = localStorage.getItem('gorkhon_user_preferences');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('gorkhon_user_preferences', JSON.stringify(settings));
      
      // Применяем настройки интерфейса
      if (settings.accessibility.highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }

      if (settings.accessibility.largeText) {
        document.body.classList.add('large-text');
      } else {
        document.body.classList.remove('large-text');
      }

      if (settings.accessibility.reduceMotion) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }

      // Создаем уведомление об успешном сохранении
      const notifications = JSON.parse(localStorage.getItem('gorkhon_notifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: 'Настройки сохранены',
        message: 'Ваши предпочтения успешно обновлены',
        type: 'success',
        timestamp: Date.now(),
        read: false
      });
      localStorage.setItem('gorkhon_notifications', JSON.stringify(notifications));

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'notifications', name: 'Уведомления', icon: 'Bell' },
    { id: 'privacy', name: 'Приватность', icon: 'Shield' },
    { id: 'interface', name: 'Интерфейс', icon: 'Monitor' },
    { id: 'accessibility', name: 'Доступность', icon: 'Eye' }
  ];

  const sections = [
    { value: 'home', label: 'Главная' },
    { value: 'news', label: 'Новости' },
    { value: 'support', label: 'Поддержка' },
    { value: 'profile', label: 'Личный кабинет' }
  ];

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  const renderToggle = (checked: boolean, onChange: (checked: boolean) => void, disabled = false) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-gorkhon-pink' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-gray-800">Настройки профиля</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Табы */}
      <div className="flex bg-gray-100 p-1 m-4 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon name={tab.icon as any} size={16} />
            <span className="hidden sm:block">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="p-6 pt-0">
        {/* Уведомления */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Push-уведомления</div>
                <div className="text-sm text-gray-600">Получать уведомления в браузере</div>
              </div>
              {renderToggle(
                settings.notifications.push,
                (checked) => updateSetting('notifications', 'push', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Email-уведомления</div>
                <div className="text-sm text-gray-600">Получать важные новости на почту</div>
              </div>
              {renderToggle(
                settings.notifications.email,
                (checked) => updateSetting('notifications', 'email', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Изменения расписания</div>
                <div className="text-sm text-gray-600">Уведомления о транспорте</div>
              </div>
              {renderToggle(
                settings.notifications.scheduleUpdates,
                (checked) => updateSetting('notifications', 'scheduleUpdates', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Системные новости</div>
                <div className="text-sm text-gray-600">Обновления платформы</div>
              </div>
              {renderToggle(
                settings.notifications.systemNews,
                (checked) => updateSetting('notifications', 'systemNews', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Еженедельный отчет</div>
                <div className="text-sm text-gray-600">Статистика вашей активности</div>
              </div>
              {renderToggle(
                settings.notifications.weeklyReport,
                (checked) => updateSetting('notifications', 'weeklyReport', checked)
              )}
            </div>
          </div>
        )}

        {/* Приватность */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Показывать статус "онлайн"</div>
                <div className="text-sm text-gray-600">Другие увидят, что вы активны</div>
              </div>
              {renderToggle(
                settings.privacy.showOnlineStatus,
                (checked) => updateSetting('privacy', 'showOnlineStatus', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Показывать активность</div>
                <div className="text-sm text-gray-600">Статистика использования</div>
              </div>
              {renderToggle(
                settings.privacy.showActivity,
                (checked) => updateSetting('privacy', 'showActivity', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Сбор данных для улучшения</div>
                <div className="text-sm text-gray-600">Анонимная аналитика использования</div>
              </div>
              {renderToggle(
                settings.privacy.allowDataCollection,
                (checked) => updateSetting('privacy', 'allowDataCollection', checked)
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">О приватности</h4>
                  <p className="text-sm text-blue-700">
                    Все ваши данные хранятся локально в браузере. Мы не передаем 
                    персональную информацию третьим лицам.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Интерфейс */}
        {activeTab === 'interface' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Компактный режим</div>
                <div className="text-sm text-gray-600">Уменьшенные отступы и элементы</div>
              </div>
              {renderToggle(
                settings.interface.compactMode,
                (checked) => updateSetting('interface', 'compactMode', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Показывать погоду</div>
                <div className="text-sm text-gray-600">Виджет погоды на главной</div>
              </div>
              {renderToggle(
                settings.interface.showWeather,
                (checked) => updateSetting('interface', 'showWeather', checked)
              )}
            </div>

            <div className="py-3">
              <div className="font-medium text-gray-800 mb-2">Раздел по умолчанию</div>
              <div className="text-sm text-gray-600 mb-3">Куда переходить при запуске</div>
              <select
                value={settings.interface.defaultSection}
                onChange={(e) => updateSetting('interface', 'defaultSection', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="py-3">
              <div className="font-medium text-gray-800 mb-2">Язык интерфейса</div>
              <div className="text-sm text-gray-600 mb-3">Основной язык приложения</div>
              <select
                value={settings.interface.language}
                onChange={(e) => updateSetting('interface', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Доступность */}
        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Высокий контраст</div>
                <div className="text-sm text-gray-600">Улучшенная читаемость текста</div>
              </div>
              {renderToggle(
                settings.accessibility.highContrast,
                (checked) => updateSetting('accessibility', 'highContrast', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Крупный текст</div>
                <div className="text-sm text-gray-600">Увеличенный размер шрифта</div>
              </div>
              {renderToggle(
                settings.accessibility.largeText,
                (checked) => updateSetting('accessibility', 'largeText', checked)
              )}
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">Уменьшить движение</div>
                <div className="text-sm text-gray-600">Отключить анимации и переходы</div>
              </div>
              {renderToggle(
                settings.accessibility.reduceMotion,
                (checked) => updateSetting('accessibility', 'reduceMotion', checked)
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
              <div className="flex items-start gap-3">
                <Icon name="Heart" size={16} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Инклюзивность</h4>
                  <p className="text-sm text-green-700">
                    Мы стремимся сделать платформу удобной для всех пользователей. 
                    Если у вас есть предложения по улучшению доступности, напишите нам.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Сохранение...
              </div>
            ) : (
              'Сохранить настройки'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
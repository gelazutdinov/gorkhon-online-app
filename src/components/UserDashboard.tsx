import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import ThemeSelector from '@/components/features/ThemeSelector';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import DataManager from '@/components/dashboard/DataManager';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout, onUserUpdate, onSectionChange }: UserDashboardProps) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Инициализация темы и подсчет непрочитанных уведомлений
  useEffect(() => {
    const savedTheme = localStorage.getItem('gorkhon_theme');
    if (savedTheme && savedTheme !== 'default') {
      const themes = {
        nature: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        ocean: { primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8' },
        sunset: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' },
        purple: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
        dark: { primary: '#374151', secondary: '#1F2937', accent: '#6B7280' }
      };
      
      const theme = themes[savedTheme as keyof typeof themes];
      if (theme) {
        const root = document.documentElement;
        root.style.setProperty('--color-gorkhon-pink', theme.primary);
        root.style.setProperty('--color-gorkhon-green', theme.secondary);
        root.style.setProperty('--color-gorkhon-blue', theme.accent);
      }
    }

    // Подсчет непрочитанных уведомлений
    const savedNotifications = localStorage.getItem('gorkhon_notifications');
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);
  
  const getRegistrationDate = () => {
    return new Date(user.registeredAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMostUsedFeature = () => {
    const features = user.stats?.featuresUsed || {};
    const entries = Object.entries(features);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [featureName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const featureNames: Record<string, string> = {
      importantNumbers: 'Важные номера',
      schedule: 'Расписание транспорта',
      donation: 'Помощь поселку',
      workSchedule: 'Режим работы',
      pvz: 'Пункты выдачи',
      notifications: 'Уведомления'
    };
    
    return featureNames[featureName] || featureName;
  };

  const getMostVisitedSection = () => {
    const sections = user.stats?.sectionsVisited || {};
    const entries = Object.entries(sections);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [sectionName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const sectionNames: Record<string, string> = {
      home: 'Главная',
      news: 'Новости',
      support: 'Поддержка',
      profile: 'Личный кабинет'
    };
    
    return sectionNames[sectionName] || sectionName;
  };

  const getActivityLevel = () => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    if (totalActions < 10) return { level: 'Новичок', color: 'text-gray-600', bg: 'bg-gray-100', icon: 'User' };
    if (totalActions < 50) return { level: 'Активный пользователь', color: 'text-blue-600', bg: 'bg-blue-100', icon: 'UserCheck' };
    if (totalActions < 100) return { level: 'Опытный житель', color: 'text-green-600', bg: 'bg-green-100', icon: 'Crown' };
    return { level: 'Мастер платформы', color: 'text-purple-600', bg: 'bg-purple-100', icon: 'Award' };
  };

  const updateNotificationCount = () => {
    const savedNotifications = localStorage.getItem('gorkhon_notifications');
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error updating notification count:', error);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{getGreeting()}, {user.name}!</h2>
            <p className="text-white/90">Добро пожаловать в личный кабинет</p>
          </div>
          <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-full`}>
            <Icon name={activityLevel.icon as any} size={32} className="text-white" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm`}>
            <Icon name="Calendar" size={16} />
            <span>С нами {daysWithUs} дней</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm`}>
            <Icon name="Clock" size={16} />
            <span>Активность: {formattedTimeSpent}</span>
          </div>
        </div>
      </div>

      {/* Статус активности */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ваш статус</h3>
          <div className={`px-3 py-1 ${activityLevel.bg} ${activityLevel.color} rounded-full text-sm font-medium flex items-center gap-2`}>
            <Icon name={activityLevel.icon as any} size={16} />
            {activityLevel.level}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gorkhon-pink">{user.stats.totalSessions}</div>
            <div className="text-sm text-gray-600">посещений</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gorkhon-green">{user.stats.daysActive}</div>
            <div className="text-sm text-gray-600">активных дней</div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowStatistics(true)}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Icon name="BarChart3" size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Статистика</div>
              <div className="text-sm text-blue-600">Ваша активность</div>
            </div>
          </button>
          
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors relative"
          >
            <Icon name="Bell" size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Уведомления</div>
              <div className="text-sm text-green-600">
                {unreadNotifications > 0 ? `${unreadNotifications} новых` : 'Все прочитаны'}
              </div>
            </div>
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </div>
            )}
          </button>
          
          <button
            onClick={() => setShowThemeSelector(true)}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
          >
            <Icon name="Palette" size={20} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Оформление</div>
              <div className="text-sm text-purple-600">Темы интерфейса</div>
            </div>
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Icon name="Settings" size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Настройки</div>
              <div className="text-sm text-gray-600">Конфигурация</div>
            </div>
          </button>
        </div>
      </div>

      {/* Дополнительные инструменты */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Инструменты</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowDataManager(true)}
            className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
          >
            <Icon name="Database" size={20} className="text-orange-600" />
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800">Управление данными</div>
              <div className="text-sm text-orange-600">Экспорт и очистка данных</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-gray-400" />
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Icon name="LogOut" size={20} className="text-red-600" />
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800">Выйти из аккаунта</div>
              <div className="text-sm text-red-600">Завершить сессию</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Модальные окна */}
      
      {/* Статистика */}
      {showStatistics && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowStatistics(false)}></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-gray-800">Статистика активности</h2>
              <button
                onClick={() => setShowStatistics(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Общая статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{user.stats.totalSessions}</div>
                  <div className="text-sm text-blue-600">всего посещений</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{user.stats.daysActive}</div>
                  <div className="text-sm text-green-600">активных дней</div>
                </div>
              </div>

              {/* Детальная информация */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Зарегистрированы</span>
                  <span className="font-medium">{getRegistrationDate()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Часто используете</span>
                  <span className="font-medium">{getMostUsedFeature()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Любимый раздел</span>
                  <span className="font-medium">{getMostVisitedSection()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Время в приложении</span>
                  <span className="font-medium">{formattedTimeSpent}</span>
                </div>
              </div>

              {/* Статус */}
              <div className={`p-4 ${activityLevel.bg} rounded-xl border-2 border-gray-200`}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon name={activityLevel.icon as any} size={24} className={activityLevel.color} />
                  <span className={`font-bold text-lg ${activityLevel.color}`}>{activityLevel.level}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Продолжайте пользоваться платформой, чтобы повысить свой статус!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Уведомления */}
      {showNotifications && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowNotifications(false)}></div>
          <div className="relative">
            <NotificationCenter 
              onClose={() => setShowNotifications(false)}
              onUpdateCount={updateNotificationCount}
            />
          </div>
        </div>
      )}

      {/* Темы */}
      {showThemeSelector && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowThemeSelector(false)}></div>
          <div className="relative">
            <ThemeSelector onClose={() => setShowThemeSelector(false)} />
          </div>
        </div>
      )}

      {/* Управление данными */}
      {showDataManager && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowDataManager(false)}></div>
          <div className="relative">
            <DataManager 
              user={user}
              onClose={() => setShowDataManager(false)}
            />
          </div>
        </div>
      )}

      {/* Настройки */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowSettings(false)}></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-gray-800">Настройки</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center text-gray-600">
                <Icon name="Settings" size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Настройки в разработке</h3>
                <p className="text-sm">
                  Скоро здесь появятся дополнительные настройки приложения
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
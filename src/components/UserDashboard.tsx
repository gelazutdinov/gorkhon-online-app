import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';
import ProfileSettings from '@/components/profile/ProfileSettings';
import NotificationCenter from '@/components/features/NotificationCenter';
import DataExportImport from '@/components/features/DataExportImport';
import ThemeSelector from '@/components/features/ThemeSelector';
import QuickActions from '@/components/features/QuickActions';
import SocialProfile from '@/components/social/SocialProfile';
import ResidentsFeed from '@/components/social/ResidentsFeed';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout, onUserUpdate, onSectionChange }: UserDashboardProps) => {
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSocialProfile, setShowSocialProfile] = useState(false);
  const [showResidentsFeed, setShowResidentsFeed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Инициализация темы и подсчет непрочитанных уведомлений
  useEffect(() => {
    // Применяем сохраненную тему
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
    if (totalActions < 10) return { level: 'Новичок', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (totalActions < 50) return { level: 'Активный пользователь', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (totalActions < 100) return { level: 'Опытный житель', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Мастер платформы', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const getAvatarEmoji = (avatar: string): string => {
    const avatarMap: Record<string, string> = {
      default_male: '👨',
      default_female: '👩',
      businessman: '👨‍💼',
      businesswoman: '👩‍💼',
      worker: '👨‍🔧',
      worker_woman: '👩‍🔧',
      farmer: '👨‍🌾',
      farmer_woman: '👩‍🌾',
      teacher: '👨‍🏫',
      teacher_woman: '👩‍🏫',
      doctor: '👨‍⚕️',
      doctor_woman: '👩‍⚕️',
      artist: '👨‍🎨',
      artist_woman: '👩‍🎨',
      chef: '👨‍🍳',
      chef_woman: '👩‍🍳',
      oldman: '👴',
      oldwoman: '👵',
      boy: '👦',
      girl: '👧'
    };
    return avatarMap[avatar] || '👤';
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Заголовок профиля */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <div className={`rounded-full w-full h-full flex items-center justify-center text-3xl overflow-hidden ${
            user.gender === 'female' ? 'bg-gradient-to-br from-gorkhon-pink to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
          }`}>
            <div className={`w-12 h-12 ${
              user.gender === 'female' ? 'text-blue-100' : 'text-pink-100'
            } flex items-center justify-center`}>
              <svg width="48" height="48" viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 8c-6.627 0-12 5.373-12 12 0 4.411 2.387 8.257 5.926 10.361C21.724 32.768 18 37.187 18 42.5V56h28V42.5c0-5.313-3.724-9.732-7.926-12.139C41.613 28.257 44 24.411 44 20c0-6.627-5.373-12-12-12z"/>
                {user.gender === 'female' && (
                  <>
                    <path d="M24 24c0 2 1 4 2 5s3 1 6 1 5 0 6-1 2-3 2-5" strokeWidth="1" stroke="currentColor" fill="none"/>
                    <circle cx="28" cy="22" r="1"/>
                    <circle cx="36" cy="22" r="1"/>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать, {user.name}!</h2>
        <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
        
        {/* Поздравление с днем рождения */}
        {user.birthDate && (
          <div className="mt-4 text-sm text-gray-600">
            День рождения: {new Date(user.birthDate).toLocaleDateString('ru-RU')}
          </div>
        )}
        
        {/* Уровень активности */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${activityLevel.bg}`}>
          <Icon name="Award" size={14} className={activityLevel.color} />
          <span className={`text-sm font-medium ${activityLevel.color}`}>
            {activityLevel.level}
          </span>
        </div>
        
        {/* Кнопки действий */}
        <div className="grid grid-cols-3 gap-2 mt-4 max-w-xs mx-auto">
          <button
            onClick={() => setShowSocialProfile(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
          >
            <Icon name="User" size={16} />
            <span className="text-xs">Профиль</span>
          </button>
          <button
            onClick={() => setShowResidentsFeed(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-green text-white rounded-lg hover:bg-gorkhon-green/90 transition-colors"
          >
            <Icon name="Users" size={16} />
            <span className="text-xs">Жители</span>
          </button>
          <button
            onClick={() => setShowStatistics(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Icon name="BarChart3" size={16} />
            <span className="text-xs">Статистика</span>
          </button>
        </div>

        {/* Дополнительные функции */}
        <div className="grid grid-cols-2 gap-2 mt-3 max-w-xs mx-auto">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Icon name="Bell" size={16} className="text-gray-600" />
            <span className="text-gray-700">Уведомления</span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowProfileSettings(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Icon name="Settings" size={16} className="text-gray-600" />
            <span className="text-gray-700">Настройки</span>
          </button>
        </div>

        {/* Управление данными */}
        <div className="grid grid-cols-2 gap-2 mt-3 max-w-xs mx-auto">
          <button
            onClick={() => setShowThemeSelector(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Icon name="Palette" size={16} className="text-gray-600" />
            <span className="text-gray-700">Темы</span>
          </button>
          <button
            onClick={() => setShowDataManager(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Icon name="Database" size={16} className="text-gray-600" />
            <span className="text-gray-700">Данные</span>
          </button>
        </div>
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
      >
        <Icon name="LogOut" size={18} />
        <span>Выйти из аккаунта</span>
      </button>

      {/* Модальное окно настроек */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Жидкое стекло iOS фон */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ProfileSettings
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfileSettings(false)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {showStatistics && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Жидкое стекло iOS фон */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Статистика активности</h2>
              <button
                onClick={() => setShowStatistics(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Основная статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Calendar" size={24} className="text-gorkhon-pink mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{daysWithUs}</div>
                  <div className="text-sm text-gray-600">дней с нами</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Clock" size={24} className="text-gorkhon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{formattedTimeSpent}</div>
                  <div className="text-sm text-gray-600">времени в сервисе</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="BarChart3" size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{user.stats?.totalSessions || 0}</div>
                  <div className="text-sm text-gray-600">сессий</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Target" size={24} className="text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{user.stats?.daysActive || 0}</div>
                  <div className="text-sm text-gray-600">активных дней</div>
                </div>
              </div>

              {/* Детальная статистика */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-gorkhon-pink" />
                  Ваша активность
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Любимый раздел:</span>
                    <span className="font-medium text-gray-800">{getMostVisitedSection()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Часто используете:</span>
                    <span className="font-medium text-gray-800">{getMostUsedFeature()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Дата регистрации:</span>
                    <span className="font-medium text-gray-800">{getRegistrationDate()}</span>
                  </div>
                </div>
              </div>

              {/* Использование функций */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Activity" size={20} className="text-gorkhon-green" />
                  Использование функций
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(user.stats?.featuresUsed || {}).map(([feature, count]) => {
                    const featureNames: Record<string, string> = {
                      importantNumbers: 'Важные номера',
                      schedule: 'Расписание транспорта',
                      donation: 'Помощь поселку',
                      workSchedule: 'Режим работы',
                      pvz: 'Пункты выдачи',
                      notifications: 'Уведомления'
                    };
                    
                    const allCounts = Object.values(user.stats?.featuresUsed || {});
                    const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={feature}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{featureNames[feature]}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно уведомлений */}
      {showNotifications && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <NotificationCenter
              onClose={() => {
                setShowNotifications(false);
                // Обновляем счетчик непрочитанных
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
              }}
            />
          </div>
        </div>
      )}

      {/* Модальное окно управления данными */}
      {showDataManager && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <DataExportImport
              user={user}
              onClose={() => setShowDataManager(false)}
              onImportSuccess={(importedUser) => {
                if (onUserUpdate) {
                  onUserUpdate(importedUser);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Модальное окно выбора темы */}
      {showThemeSelector && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ThemeSelector
              onClose={() => setShowThemeSelector(false)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно быстрых действий */}
      {showQuickActions && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <QuickActions
              onClose={() => setShowQuickActions(false)}
              onSectionChange={onSectionChange}
            />
          </div>
        </div>
      )}

      {/* Модальное окно социального профиля */}
      {showSocialProfile && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <SocialProfile
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={() => setShowSocialProfile(false)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно ленты жителей */}
      {showResidentsFeed && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-gray-800">Жители Горхона</h2>
              <button
                onClick={() => setShowResidentsFeed(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <ResidentsFeed
                currentUser={user}
                onViewProfile={(resident: any) => {
                  console.log('Viewing profile:', resident);
                  // Здесь можно добавить логику просмотра профиля другого жителя
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
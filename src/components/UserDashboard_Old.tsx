import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import LinaAssistant from '@/components/features/LinaAssistant';
import DataManager from '@/components/dashboard/DataManager';
import UserGreeting from '@/components/dashboard/UserGreeting';
import QuickActions from '@/components/dashboard/QuickActions';
import AdditionalTools from '@/components/dashboard/AdditionalTools';
import StatisticsModal from '@/components/dashboard/StatisticsModal';
import BackupModal from '@/components/dashboard/BackupModal';
import AccessibilityModal from '@/components/dashboard/AccessibilityModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import SecuritySettings from '@/components/security/SecuritySettings';

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
  const [showLina, setShowLina] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Инициализация темы
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
  }, []);

  const getActivityLevel = () => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    if (totalActions < 10) return { level: 'Новичок', color: 'text-gray-600', bg: 'bg-gray-100', icon: 'User' };
    if (totalActions < 50) return { level: 'Активный пользователь', color: 'text-blue-600', bg: 'bg-blue-100', icon: 'UserCheck' };
    if (totalActions < 100) return { level: 'Опытный житель', color: 'text-green-600', bg: 'bg-green-100', icon: 'Crown' };
    return { level: 'Мастер платформы', color: 'text-purple-600', bg: 'bg-purple-100', icon: 'Award' };
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* СТАРАЯ ВЕРСИЯ ПРОФИЛЯ - Основная карточка профиля */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-6">
          {/* Аватар пользователя - большего размера */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-gorkhon-pink via-purple-500 to-gorkhon-blue rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.firstName ? user.firstName[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {user?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} className="text-white" />
              </div>
            )}
          </div>

          {/* Информация о пользователе */}
          <div className="flex-1">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username
                }
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="Calendar" size={16} />
                <span>Зарегистрирован {daysWithUs} {daysWithUs === 1 ? 'день' : daysWithUs < 5 ? 'дня' : 'дней'} назад</span>
              </div>
            </div>

            {/* Статистика в строку */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gorkhon-pink">{user.stats?.totalSessions || 0}</div>
                <div className="text-xs text-gray-500">Сессий</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gorkhon-green">{user.stats?.daysActive || 0}</div>
                <div className="text-xs text-gray-500">Активных дней</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gorkhon-blue">{formattedTimeSpent}</div>
                <div className="text-xs text-gray-500">Время в системе</div>
              </div>
            </div>

            {/* Уровень активности */}
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 ${activityLevel.bg} ${activityLevel.color} rounded-full text-sm font-medium flex items-center gap-2`}>
                <Icon name={activityLevel.icon as any} size={16} />
                <span>{activityLevel.level}</span>
              </div>
              <div className="text-sm text-gray-500">
                ID: {user.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <QuickActions 
        onShowStatistics={() => setShowStatistics(true)}
        onShowLina={() => setShowLina(true)}
        onShowBackup={() => setShowBackup(true)}
        onShowAccessibility={() => setShowAccessibility(true)}
      />

      {/* Дополнительные инструменты */}
      <AdditionalTools 
        onShowDataManager={() => setShowDataManager(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowSecurity={() => setShowSecurity(true)}
        onLogout={onLogout}
      />

      {/* Модальные окна */}
      {showStatistics && (
        <StatisticsModal 
          user={user}
          formattedTimeSpent={formattedTimeSpent}
          activityLevel={activityLevel}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {showLina && (
        <LinaAssistant onClose={() => setShowLina(false)} />
      )}

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

      {showBackup && (
        <BackupModal 
          onClose={() => setShowBackup(false)}
          onShowDataManager={() => setShowDataManager(true)}
        />
      )}

      {showAccessibility && (
        <AccessibilityModal onClose={() => setShowAccessibility(false)} />
      )}

      {showSecurity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowSecurity(false)}></div>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white rounded-t-2xl p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">Настройки безопасности</h2>
                <button
                  onClick={() => setShowSecurity(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="p-6">
                <SecuritySettings />
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
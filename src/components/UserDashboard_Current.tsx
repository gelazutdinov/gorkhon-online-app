import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import LinaAssistant from '@/components/features/LinaAssistant';
import DataManager from '@/components/dashboard/DataManager';
import UserGreeting from '@/components/dashboard/UserGreeting';

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
  const [activeSection, setActiveSection] = useState('profile');

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

  const sidebarItems = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'security', label: 'Безопасность', icon: 'Shield' },
    { id: 'statistics', label: 'Статистика', icon: 'BarChart3' },
    { id: 'backup', label: 'Резервная копия', icon: 'Database' },
    { id: 'accessibility', label: 'Доступность', icon: 'Eye' },
    { id: 'data', label: 'Управление данными', icon: 'FolderOpen' },
    { id: 'lina', label: 'Ассистент Лина', icon: 'Bot' }
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Открываем соответствующие модалы
    switch(sectionId) {
      case 'statistics':
        setShowStatistics(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'security':
        setShowSecurity(true);
        break;
      case 'backup':
        setShowBackup(true);
        break;
      case 'accessibility':
        setShowAccessibility(true);
        break;
      case 'data':
        setShowDataManager(true);
        break;
      case 'lina':
        setShowLina(true);
        break;
    }
  };

  return (
    <div className="flex gap-6 px-4 sm:px-0">
      {/* Левая панель навигации */}
      <div className="w-64 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Функции</h3>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-gorkhon-pink/10 text-gorkhon-pink'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gorkhon-pink'
              }`}
            >
              <Icon name={item.icon as any} size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Кнопка выхода */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <Icon name="LogOut" size={18} />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 space-y-6">
        {/* Приветствие с именем и верификацией */}
        <div className="bg-gradient-to-r from-gorkhon-pink/10 to-gorkhon-blue/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-gorkhon-pink to-gorkhon-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.firstName ? user.firstName[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username
                    }
                  </h2>
                  {user?.isVerified && (
                    <span className="text-blue-500 text-lg">✓</span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">
                  С нами {daysWithUs} {daysWithUs === 1 ? 'день' : daysWithUs < 5 ? 'дня' : 'дней'} • 
                  Время в системе: {formattedTimeSpent}
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Дополнительные инструменты */}
        <AdditionalTools 
          onShowDataManager={() => setShowDataManager(true)}
          onShowSettings={() => setShowSettings(true)}
          onShowSecurity={() => setShowSecurity(true)}
          onLogout={onLogout}
        />

      </div>

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
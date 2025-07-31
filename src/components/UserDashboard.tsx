import { useState } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import LinaAssistant from '@/components/features/LinaAssistant';
import DataManager from '@/components/dashboard/DataManager';
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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'утро';
    if (hour < 17) return 'день';
    return 'вечер';
  };

  const getActivityLevel = () => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    if (totalActions < 10) return 'Новичок';
    if (totalActions < 50) return 'Активный пользователь';
    if (totalActions < 100) return 'Опытный житель';
    return 'Мастер платформы';
  };

  const userName = user?.firstName || user?.username || 'Виктор';

  return (
    <div className="space-y-6">
      {/* Приветственная карточка */}
      <div className="bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Добрый {getTimeOfDay()}, {userName}!
            </h1>
            <p className="text-blue-100">
              Добро пожаловать в личный кабинет
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="User" size={24} />
          </div>
        </div>
      </div>

      {/* Статус пользователя */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ваш статус</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Icon name="User" size={16} />
            <span className="text-sm">{getActivityLevel()}</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-1">
              {user.stats?.totalSessions || 238}
            </div>
            <div className="text-gray-600 text-sm">посещений</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {user.stats?.daysActive || 7}
            </div>
            <div className="text-gray-600 text-sm">активных дней</div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} />
            <span>С нами {daysWithUs} дней</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} />
            <span>Активность: {formattedTimeSpent}</span>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setShowStatistics(true)}
            className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Icon name="BarChart3" size={24} className="text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Статистика</span>
          </button>

          <button
            onClick={() => setShowLina(true)}
            className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Icon name="Home" size={24} className="text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Главная</span>
          </button>

          <button
            onClick={() => setShowBackup(true)}
            className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Icon name="FileText" size={24} className="text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Документы</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors relative"
          >
            <Icon name="User" size={24} className="text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Профиль</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          </button>
        </div>
      </div>

      {/* Модальные окна */}
      {showStatistics && (
        <StatisticsModal 
          user={user}
          formattedTimeSpent={formattedTimeSpent}
          activityLevel={{ level: getActivityLevel(), color: 'text-blue-600', bg: 'bg-blue-100', icon: 'User' }}
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
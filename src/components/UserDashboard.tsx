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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Шапка профиля */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Добрый {getTimeOfDay()}, {userName}!
              </h1>
              <p className="text-white/80 text-lg">
                {getActivityLevel()}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon name="User" size={28} />
            </div>
          </div>
          
          {/* Мини-статистика в шапке */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {user.stats?.totalSessions || 238}
              </div>
              <div className="text-white/70 text-sm">сессий</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {daysWithUs}
              </div>
              <div className="text-white/70 text-sm">дней с нами</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {user.stats?.daysActive || 7}
              </div>
              <div className="text-white/70 text-sm">активных дней</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основные разделы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Быстрые действия */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
            Быстрые действия
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowStatistics(true)}
              className="group flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 text-left transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <Icon name="BarChart3" size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Статистика</h3>
              <p className="text-sm text-blue-600">Ваша активность</p>
            </button>

            <button
              onClick={() => setShowLina(true)}
              className="group flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 transition-all duration-300 text-left transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <Icon name="MessageCircle" size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Лина</h3>
              <p className="text-sm text-green-600">Цифровой помощник</p>
            </button>

            <button
              onClick={() => setShowBackup(true)}
              className="group flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 text-left transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Резервно...</h3>
              <p className="text-sm text-purple-600">Сохранени...</p>
            </button>

            <button
              onClick={() => setShowAccessibility(true)}
              className="group flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 transition-all duration-300 text-left transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <Icon name="Eye" size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Доступно...</h3>
              <p className="text-sm text-orange-600">Настройки ...</p>
            </button>
          </div>
        </div>

        {/* Инструменты и настройки */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={16} className="text-white" />
            </div>
            Инструменты
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowDataManager(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 transition-all duration-300 text-left group transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Icon name="Database" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Управление данными</h3>
                  <p className="text-sm text-yellow-600">Экспорт и очистка данных</p>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-yellow-600 transition-colors" />
            </button>

            <button
              onClick={() => setShowSecurity(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 transition-all duration-300 text-left group transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Icon name="Shield" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Безопасность</h3>
                  <p className="text-sm text-green-600">2FA и защита данных</p>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/50 transition-all duration-300 text-left group transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Icon name="Settings" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Настройки</h3>
                  <p className="text-sm text-gray-600">Конфигурация аккаунта</p>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Выход из системы */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50 transition-all duration-300 text-left group transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <Icon name="LogOut" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Выйти из аккаунта</h3>
              <p className="text-sm text-red-600">Завершить текущую сессию</p>
            </div>
          </div>
          <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
        </button>
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
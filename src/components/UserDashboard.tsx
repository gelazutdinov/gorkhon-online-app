import { useState, memo, useCallback, useMemo } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

import DataManager from '@/components/dashboard/DataManager';
import StatisticsModal from '@/components/dashboard/StatisticsModal';
import BackupModal from '@/components/dashboard/BackupModal';
import AccessibilityModal from '@/components/dashboard/AccessibilityModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import SecuritySettings from '@/components/security/SecuritySettings';

import ActivityChart from '@/components/analytics/ActivityChart';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = memo(({ user, daysWithUs, formattedTimeSpent, onLogout, onSectionChange }: UserDashboardProps) => {
  const [showStatistics, setShowStatistics] = useState(false);

  const [showDataManager, setShowDataManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const getTimeOfDay = useCallback(() => {
    // Иркутск UTC+8
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const irkutskTime = new Date(utc + (8 * 3600000));
    const hour = irkutskTime.getHours();
    
    if (hour >= 6 && hour < 12) return 'утро';
    if (hour >= 12 && hour < 18) return 'день';
    if (hour >= 18 && hour < 24) return 'вечер';
    return 'ночь';
  }, []);

  const { activityLevel, userName } = useMemo(() => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    let level;
    if (totalActions < 10) level = 'Новичок';
    else if (totalActions < 50) level = 'Активный пользователь';
    else if (totalActions < 100) level = 'Опытный житель';
    else level = 'Мастер платформы';

    return {
      activityLevel: level,
      userName: user?.firstName || user?.username || 'Виктор'
    };
  }, [user]);

  const handleCloseModal = useCallback((setter: (value: boolean) => void) => {
    return () => setter(false);
  }, []);

  return (
    <div className="space-y-3 md:space-y-4 pb-16 md:pb-24">
      {/* Профиль пользователя - Мобильная адаптация */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Анимированные декоративные элементы */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12 md:-translate-y-20 md:translate-x-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10 md:translate-y-16 md:-translate-x-16 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full -translate-x-8 -translate-y-8 md:-translate-x-12 md:-translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4 md:mb-8">
            <div className="flex-1 pr-3">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 leading-tight">
                {getTimeOfDay() === 'утро' ? 'Доброе утро' : 
                 getTimeOfDay() === 'день' ? 'Добрый день' : 
                 getTimeOfDay() === 'вечер' ? 'Добрый вечер' : 
                 'Доброй ночи'}, {userName}!
              </h1>
              <div className="flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-3 w-fit border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                <Icon name="Award" size={16} className="md:w-5 md:h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm md:text-lg font-semibold">{activityLevel}</span>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 hover:scale-110 hover:rotate-3 transition-all duration-500 flex-shrink-0">
              <Icon name="User" size={24} className="md:w-9 md:h-9 text-white" />
            </div>
          </div>
        </div>
      </div>





      {/* Основные функции */}
      <div className="grid gap-3 md:gap-6">
        {/* Аналитика и статистика */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon name="BarChart3" size={18} className="md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Аналитика</h2>
              <p className="text-xs md:text-sm text-gray-600">Статистика использования и активности</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStatistics(true)}
            className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 transition-all duration-300 text-left border border-blue-200 hover:border-indigo-300 hover:shadow-lg group/button"
          >
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-lg md:rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
              <Icon name="TrendingUp" size={16} className="md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm md:text-base font-bold text-gray-900 mb-1">Подробная статистика</div>
              <div className="text-xs md:text-sm text-blue-700">Анализ активности и использования функций</div>
            </div>
            <Icon name="ChevronRight" size={16} className="md:w-5 md:h-5 text-gray-400 group-hover/button:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Поддержка */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon name="MessageSquare" size={18} className="md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Поддержка</h2>
              <p className="text-xs md:text-sm text-gray-600">Помощь и обратная связь</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <a
              href="https://t.me/+QgiLIa1gFRY4Y2Iy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50 to-blue-100 hover:from-blue-100 hover:via-blue-100 hover:to-blue-200 transition-all duration-300 text-left border border-blue-200 hover:border-blue-300 hover:shadow-lg group/button"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
                <Icon name="MessageCircle" size={16} className="md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm md:text-base font-bold text-gray-900 mb-1">Сообщество в Telegram</div>
                <div className="text-xs md:text-sm text-blue-700">Задать вопрос или предложить идею</div>
              </div>
              <Icon name="ExternalLink" size={16} className="md:w-5 md:h-5 text-gray-400 group-hover/button:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="mailto:support@poehali.dev"
              className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 hover:from-green-100 hover:via-emerald-100 hover:to-green-200 transition-all duration-300 text-left border border-green-200 hover:border-green-300 hover:shadow-lg group/button"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
                <Icon name="Mail" size={16} className="md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm md:text-base font-bold text-gray-900 mb-1">Написать на email</div>
                <div className="text-xs md:text-sm text-green-700">support@poehali.dev</div>
              </div>
              <Icon name="ExternalLink" size={16} className="md:w-5 md:h-5 text-gray-400 group-hover/button:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
      
      {/* Выход из системы */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300 group">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon name="LogOut" size={18} className="md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Завершение работы</h2>
            <p className="text-xs md:text-sm text-gray-600">Безопасный выход из системы</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 hover:from-red-100 hover:via-rose-100 hover:to-pink-100 transition-all duration-300 text-left border-2 border-red-200 hover:border-red-300 hover:shadow-lg group/button"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
              <Icon name="Power" size={16} className="md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <div className="text-sm md:text-base font-bold text-red-700 mb-1">Выйти из аккаунта</div>
              <div className="text-xs md:text-sm text-red-600">Завершить текущую сессию</div>
            </div>
          </div>
          <Icon name="ArrowRight" size={16} className="md:w-5 md:h-5 text-red-500 group-hover/button:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Модальные окна */}
      {showStatistics && (
        <StatisticsModal 
          user={user}
          formattedTimeSpent={formattedTimeSpent}
          activityLevel={{ level: activityLevel, color: 'text-blue-600', bg: 'bg-blue-100', icon: 'User' }}
          onClose={handleCloseModal(setShowStatistics)}
        />
      )}



      {showDataManager && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={handleCloseModal(setShowDataManager)}></div>
          <div className="relative">
            <DataManager 
              user={user}
              onClose={handleCloseModal(setShowDataManager)}
            />
          </div>
        </div>
      )}

      {showBackup && (
        <BackupModal 
          onClose={handleCloseModal(setShowBackup)}
          onShowDataManager={() => setShowDataManager(true)}
        />
      )}

      {showAccessibility && (
        <AccessibilityModal onClose={handleCloseModal(setShowAccessibility)} />
      )}

      {showSecurity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={handleCloseModal(setShowSecurity)}></div>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white rounded-t-2xl p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">Настройки безопасности</h2>
                <button
                  onClick={handleCloseModal(setShowSecurity)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Закрыть окно настроек безопасности"
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
        <SettingsModal onClose={handleCloseModal(setShowSettings)} />
      )}
    </div>
  );
});

UserDashboard.displayName = 'UserDashboard';

export default UserDashboard;
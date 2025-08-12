import { useState, memo, useCallback, useMemo } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import LinaAssistant from '@/components/features/LinaAssistant';
import DataManager from '@/components/dashboard/DataManager';
import StatisticsModal from '@/components/dashboard/StatisticsModal';
import BackupModal from '@/components/dashboard/BackupModal';
import AccessibilityModal from '@/components/dashboard/AccessibilityModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import SecuritySettings from '@/components/security/SecuritySettings';
import StatsOverview from '@/components/analytics/StatsOverview';
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
  const [showLina, setShowLina] = useState(false);
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
    <div className="space-y-4 pb-24">
      {/* Заголовок с навигацией */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSectionChange('home')}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <Icon name="ArrowLeft" size={18} />
          <span className="font-medium">На главную</span>
        </button>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Icon name="User" size={16} />
          <span>Личный кабинет</span>
        </div>
      </div>

      {/* Профиль пользователя - Обновленный дизайн */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Анимированные декоративные элементы */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                {getTimeOfDay() === 'утро' ? 'Доброе утро' : 
                 getTimeOfDay() === 'день' ? 'Добрый день' : 
                 getTimeOfDay() === 'вечер' ? 'Добрый вечер' : 
                 'Доброй ночи'}, {userName}!
              </h1>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 w-fit border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                <Icon name="Award" size={20} className="text-yellow-300 animate-pulse" />
                <span className="text-lg font-semibold">{activityLevel}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 hover:scale-110 hover:rotate-3 transition-all duration-500">
              <Icon name="User" size={36} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Современная статистика */}
      <StatsOverview 
        stats={[
          {
            label: 'Всего сессий',
            value: '263',
            change: '+12%',
            trend: 'up',
            icon: 'Activity',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            label: 'Дней с нами',
            value: '6',
            change: '+1',
            trend: 'up', 
            icon: 'Calendar',
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            label: 'Активных дней',
            value: '7',
            change: '+2',
            trend: 'up',
            icon: 'Zap',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
          {
            label: 'Время онлайн',
            value: formattedTimeSpent,
            change: '+5ч',
            trend: 'up',
            icon: 'Clock',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
          }
        ]}
        className="mb-6"
      />



      {/* Основные функции */}
      <div className="grid gap-6">
        {/* Аналитика и статистика */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon name="BarChart3" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Аналитика</h2>
              <p className="text-sm text-gray-600">Статистика использования и активности</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStatistics(true)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 transition-all duration-300 text-left border border-blue-200 hover:border-indigo-300 hover:shadow-lg group/button"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
              <Icon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 mb-1">Подробная статистика</div>
              <div className="text-sm text-blue-700">Анализ активности и использования функций</div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover/button:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Поддержка Лина */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-gorkhon-blue via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon name="MessageSquare" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Поддержка</h2>
              <p className="text-sm text-gray-600">Виртуальная помощница службы поддержки</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowLina(true)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gorkhon-blue/10 via-blue-50 to-cyan-50 hover:from-gorkhon-blue/20 hover:via-blue-100 hover:to-cyan-100 transition-all duration-300 text-left border border-gorkhon-blue/30 hover:border-gorkhon-blue/50 hover:shadow-lg group/button"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md group-hover/button:scale-110 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b332c792?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                alt="Лина" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">Лина</span>
                <img 
                  src="https://cdn.poehali.dev/files/8371ad18-b8e1-4b43-98dc-dd6b47da6cfa.png" 
                  alt="Верифицирован" 
                  className="w-5 h-5"
                />
              </div>
              <div className="text-sm text-gorkhon-blue font-medium">Начать диалог с ИИ-помощником</div>
            </div>
            <Icon name="MessageCircle" size={20} className="text-gorkhon-blue group-hover/button:scale-110 transition-transform" />
          </button>
        </div>
        

      </div>
      
      {/* Выход из системы */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300 group">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon name="LogOut" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Завершение работы</h2>
            <p className="text-sm text-gray-600">Безопасный выход из системы</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 hover:from-red-100 hover:via-rose-100 hover:to-pink-100 transition-all duration-300 text-left border-2 border-red-200 hover:border-red-300 hover:shadow-lg group/button"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-md group-hover/button:scale-110 transition-transform duration-300">
              <Icon name="Power" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-red-700 mb-1">Выйти из аккаунта</div>
              <div className="text-sm text-red-600">Завершить текущую сессию</div>
            </div>
          </div>
          <Icon name="ArrowRight" size={20} className="text-red-500 group-hover/button:translate-x-1 transition-transform" />
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

      {showLina && (
        <LinaAssistant onClose={handleCloseModal(setShowLina)} />
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
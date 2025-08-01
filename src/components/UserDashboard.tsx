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

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = memo(({ user, daysWithUs, formattedTimeSpent, onLogout }: UserDashboardProps) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showLina, setShowLina] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const getTimeOfDay = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'утро';
    if (hour < 17) return 'день';
    return 'вечер';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Шапка профиля */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Добрый {getTimeOfDay()}, {userName}!
                </h1>
                <p className="text-white/80 text-lg font-medium">
                  {activityLevel}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Icon name="User" size={28} />
              </div>
            </div>
            
            {/* Статистика в шапке */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {user.stats?.totalSessions || 2591}
                </div>
                <div className="text-white/70 text-sm font-medium">сессий</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {daysWithUs}
                </div>
                <div className="text-white/70 text-sm font-medium">дней с нами</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {user.stats?.daysActive || 7}
                </div>
                <div className="text-white/70 text-sm font-medium">активных дней</div>
              </div>
            </div>
          </div>
        </div>

        {/* Основные разделы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Быстрые действия */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Быстрые действия</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowStatistics(true)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/80 hover:from-blue-100 hover:to-blue-200/80 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
                aria-label="Открыть статистику активности"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-xl transition-shadow">
                  <Icon name="BarChart3" size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Статистика</h3>
                <p className="text-sm text-blue-600 font-medium">Ваша активность</p>
              </button>

              <button
                onClick={() => setShowLina(true)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/80 hover:from-green-100 hover:to-green-200/80 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
                aria-label="Открыть цифрового помощника Лина"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-xl transition-shadow">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Лина</h3>
                <p className="text-sm text-green-600 font-medium">Цифровой помощник</p>
              </button>

              <button
                onClick={() => setShowBackup(true)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/80 hover:from-purple-100 hover:to-purple-200/80 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
                aria-label="Открыть резервное копирование"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-xl transition-shadow">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Резервно...</h3>
                <p className="text-sm text-purple-600 font-medium">Сохранени...</p>
              </button>

              <button
                onClick={() => setShowAccessibility(true)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/80 hover:from-orange-100 hover:to-orange-200/80 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
                aria-label="Открыть настройки доступности"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-xl transition-shadow">
                  <Icon name="Eye" size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Доступно...</h3>
                <p className="text-sm text-orange-600 font-medium">Настройки ...</p>
              </button>
            </div>
          </div>

          {/* Инструменты */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Settings" size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Инструменты</h2>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowDataManager(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-lg"
                aria-label="Открыть управление данными"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Icon name="Database" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Управление данными</h3>
                    <p className="text-sm text-yellow-600 font-medium">Экспорт и очистка данных</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-yellow-600 transition-colors" />
              </button>

              <button
                onClick={() => setShowSecurity(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-lg"
                aria-label="Открыть настройки безопасности"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Icon name="Shield" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Безопасность</h3>
                    <p className="text-sm text-green-600 font-medium">2FA и защита данных</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-lg"
                aria-label="Открыть настройки аккаунта"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Icon name="Settings" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Настройки</h3>
                    <p className="text-sm text-gray-600 font-medium">Конфигурация аккаунта</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Выход из системы */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-red-100/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-lg"
            aria-label="Выйти из аккаунта и завершить сессию"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Icon name="LogOut" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Выйти из аккаунта</h3>
                <p className="text-sm text-red-600 font-medium">Завершить текущую сессию</p>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
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
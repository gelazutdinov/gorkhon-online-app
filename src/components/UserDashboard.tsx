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

const UserDashboard = memo(({ user, daysWithUs, formattedTimeSpent, onLogout, onSectionChange }: UserDashboardProps) => {
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
    <div className="max-w-md mx-auto">

      {/* Шапка профиля */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg mb-6">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Добрый {getTimeOfDay()}, {userName}!
              </h1>
              <p className="text-white/80 text-base">
                {activityLevel}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon name="User" size={24} />
            </div>
          </div>
          
          {/* Статистика в шапке */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">2630</div>
              <div className="text-white/70 text-sm">сессий</div>
            </div>
            <div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-white/70 text-sm">дней с нами</div>
            </div>
            <div>
              <div className="text-2xl font-bold">7</div>
              <div className="text-white/70 text-sm">активных дней</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент - два блока рядом */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Быстрые действия */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-sm">Быстрые действия</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowStatistics(true)}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-2">
                <Icon name="BarChart3" size={20} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-800">Статистика</div>
              <div className="text-xs text-blue-600">Ваша активность</div>
            </button>

            <button
              onClick={() => setShowLina(true)}
              className="p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-2">
                <Icon name="MessageCircle" size={20} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-800">Лина</div>
              <div className="text-xs text-green-600">Цифровой помощник</div>
            </button>

            <button
              onClick={() => setShowBackup(true)}
              className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-2">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-800">Резервно...</div>
              <div className="text-xs text-purple-600">Сохранени...</div>
            </button>

            <button
              onClick={() => setShowAccessibility(true)}
              className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-2">
                <Icon name="Eye" size={20} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-800">Доступно...</div>
              <div className="text-xs text-orange-600">Настройки ...</div>
            </button>
          </div>
        </div>

        {/* Инструменты */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={12} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-sm">Инструменты</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowDataManager(true)}
              className="w-full p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Database" size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800">Управление данными</div>
                  <div className="text-xs text-yellow-600">Экспорт и очистка данных</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowSecurity(true)}
              className="w-full p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800">Безопасность</div>
                  <div className="text-xs text-green-600">2FA и защита данных</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Settings" size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800">Настройки</div>
                  <div className="text-xs text-gray-600">Конфигурация аккаунта</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* Кнопка возврата */}
      <div className="text-center">
        <button
          onClick={() => onSectionChange('home')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="font-medium">На главную</span>
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
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
    <div className="space-y-6">
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

      {/* Профиль пользователя */}
      <div className="bg-gradient-to-br from-gorkhon-pink via-purple-500 to-gorkhon-blue rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              Добрый {getTimeOfDay()}, {userName}! 👋
            </h1>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
              <Icon name="Award" size={16} />
              <span className="text-sm font-medium">{activityLevel}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="User" size={28} className="text-white" />
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">2630</div>
            <div className="text-white/80 text-sm">сессий</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">6</div>
            <div className="text-white/80 text-sm">дней с нами</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">7</div>
            <div className="text-white/80 text-sm">активных дней</div>
          </div>
        </div>
      </div>

      {/* Основные функции */}
      <div className="grid gap-6">
        {/* Аналитика и статистика */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Аналитика</h2>
              <p className="text-sm text-gray-600">Статистика использования</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStatistics(true)}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-left border border-blue-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Подробная статистика</div>
              <div className="text-sm text-blue-700">Анализ активности и использования функций</div>
            </div>
            <Icon name="ChevronRight" size={18} className="text-gray-400" />
          </button>
        </div>
        
        {/* ИИ-Помощник Лина */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gorkhon-blue rounded-xl flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ИИ-Помощник</h2>
              <p className="text-sm text-gray-600">Умный цифровой ассистент</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowLina(true)}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gorkhon-blue/10 to-gorkhon-blue/5 hover:from-gorkhon-blue/20 hover:to-gorkhon-blue/10 transition-all duration-200 text-left border border-gorkhon-blue/20"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b332c792?w=100&h=100&fit=crop&crop=face" 
                alt="Лина" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Лина</span>
                <img 
                  src="https://cdn.poehali.dev/files/8371ad18-b8e1-4b43-98dc-dd6b47da6cfa.png" 
                  alt="Верифицирован" 
                  className="w-4 h-4"
                />
              </div>
              <div className="text-sm text-gorkhon-blue">Начать диалог с ИИ-помощником</div>
            </div>
            <Icon name="MessageCircle" size={18} className="text-gorkhon-blue" />
          </button>
        </div>
        
        {/* Безопасность и конфиденциальность */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Безопасность</h2>
              <p className="text-sm text-gray-600">Защита данных и конфиденциальность</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSecurity(true)}
              className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 text-left"
            >
              <Icon name="Lock" size={18} className="text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Настройки</div>
                <div className="text-xs text-green-600">2FA и защита</div>
              </div>
            </button>
            
            <button
              onClick={() => setShowBackup(true)}
              className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 text-left"
            >
              <Icon name="HardDriveUpload" size={18} className="text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Резервные копии</div>
                <div className="text-xs text-purple-600">Сохранение данных</div>
              </div>
            </button>
          </div>
        </div>

        {/* Управление и настройки */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Управление</h2>
              <p className="text-sm text-gray-600">Настройки и инструменты</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowDataManager(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-200 text-left border border-yellow-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Icon name="Database" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Управление данными</div>
                  <div className="text-sm text-yellow-700">Экспорт и очистка данных</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-200 text-left border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                  <Icon name="Cog" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Настройки профиля</div>
                  <div className="text-sm text-gray-600">Конфигурация аккаунта</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
            
            <button
              onClick={() => setShowAccessibility(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 text-left border border-blue-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Icon name="Accessibility" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Доступность</div>
                  <div className="text-sm text-blue-700">Настройки для удобства</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Выход из системы */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Icon name="LogOut" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Завершение работы</h2>
            <p className="text-sm text-gray-600">Безопасный выход из системы</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200 text-left border-2 border-red-200 hover:border-red-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Icon name="Power" size={16} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-red-700">Выйти из аккаунта</div>
              <div className="text-sm text-red-600">Завершить текущую сессию</div>
            </div>
          </div>
          <Icon name="ArrowRight" size={18} className="text-red-500" />
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={handleCloseModal(setShowLina)}></div>
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-gorkhon-blue rounded-t-2xl p-4 border-b border-gray-200 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b332c792?w=100&h=100&fit=crop&crop=face" 
                      alt="Лина" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Лина</h2>
                      <img 
                        src="https://cdn.poehali.dev/files/8371ad18-b8e1-4b43-98dc-dd6b47da6cfa.png" 
                        alt="Верифицирован" 
                        className="w-4 h-4 filter brightness-0 invert"
                      />
                    </div>
                    <p className="text-white/80 text-sm">ИИ-Помощник</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal(setShowLina)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Закрыть чат с Линой"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="p-6">
                <LinaAssistant onClose={handleCloseModal(setShowLina)} />
              </div>
            </div>
          </div>
        </div>
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
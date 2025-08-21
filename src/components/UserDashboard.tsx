import { useState, memo, useCallback, useMemo } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import LinaAssistant from '@/components/LinaAssistant';

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
    // Иркутск UTC+8
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const irkutskTime = new Date(utc + (8 * 3600000));
    const hour = irkutskTime.getHours();

    if (hour >= 6 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    if (hour >= 18 && hour < 23) return 'Добрый вечер';
    return 'Доброй ночи';
  }, []);

  const timeOfDay = useMemo(() => getTimeOfDay(), [getTimeOfDay]);

  const handleCloseModal = useCallback((setter: (value: boolean) => void) => () => {
    setter(false);
  }, []);

  const activityLevel = useMemo(() => {
    if (daysWithUs < 7) return 'Новичок';
    if (daysWithUs < 30) return 'Активный';
    if (daysWithUs < 90) return 'Опытный';
    return 'Эксперт';
  }, [daysWithUs]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Icon name="User" size={32} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{timeOfDay}, {user.name}!</h1>
            <p className="text-blue-100 text-lg">
              Рады видеть вас в космическом центре разработки
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={16} />
                <span>С нами {daysWithUs} дней</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={16} />
                <span>{formattedTimeSpent} в полете</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Trophy" size={16} />
                <span>{activityLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Data Management */}
        <button 
          onClick={() => setShowDataManager(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Icon name="Database" size={24} className="text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Управление данными</h3>
              <p className="text-sm text-gray-500">Импорт, экспорт и резервные копии</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Открыть панель</span>
          </div>
        </button>

        {/* Statistics */}
        <button 
          onClick={() => setShowStatistics(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Icon name="BarChart3" size={24} className="text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Статистика использования</h3>
              <p className="text-sm text-gray-500">Анализ активности и времени в системе</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Посмотреть аналитику</span>
          </div>
        </button>

        {/* Backup */}
        <button 
          onClick={() => setShowBackup(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <Icon name="Download" size={24} className="text-yellow-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Резервные копии</h3>
              <p className="text-sm text-gray-500">Создание и восстановление бэкапов</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Управлять копиями</span>
          </div>
        </button>

        {/* Accessibility */}
        <button 
          onClick={() => setShowAccessibility(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Icon name="Eye" size={24} className="text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Специальные возможности</h3>
              <p className="text-sm text-gray-500">Настройки доступности интерфейса</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Настроить доступность</span>
          </div>
        </button>

        {/* Security */}
        <button 
          onClick={() => setShowSecurity(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Icon name="Shield" size={24} className="text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Безопасность</h3>
              <p className="text-sm text-gray-500">Настройки приватности и защиты</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Настроить безопасность</span>
          </div>
        </button>

        {/* General Settings */}
        <button 
          onClick={() => setShowSettings(true)}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Icon name="Settings" size={24} className="text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Общие настройки</h3>
              <p className="text-sm text-gray-500">Основные параметры приложения</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="ArrowRight" size={14} />
            <span>Открыть настройки</span>
          </div>
        </button>
      </div>

      {/* Support Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Поддержка и помощь</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lina AI Assistant */}
          <button
            onClick={() => setShowLina(true)}
            className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={24} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-lg">Лина - ИИ помощник</h3>
              <p className="text-purple-100 text-sm">Решение проблем и техническая поддержка онлайн</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </button>

          {/* Feedback Form */}
          <a
            href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="FileText" size={24} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-lg">Форма обратной связи</h3>
              <p className="text-green-100 text-sm">Оставить отзыв или предложение по платформе</p>
            </div>
            <Icon name="ExternalLink" size={20} className="text-white/80" />
          </a>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Icon name="LogOut" size={24} className="text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-600">Выйти из аккаунта</h3>
              <p className="text-sm text-gray-500">Завершить текущую сессию</p>
            </div>
          </div>
          <Icon name="ArrowRight" size={20} className="text-red-500" />
        </button>
      </div>

      {/* Modals */}
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
          <div className="relative z-10 w-full max-w-4xl">
            <DataManager onClose={handleCloseModal(setShowDataManager)} />
          </div>
        </div>
      )}

      {showBackup && (
        <BackupModal onClose={handleCloseModal(setShowBackup)} />
      )}

      {showAccessibility && (
        <AccessibilityModal onClose={handleCloseModal(setShowAccessibility)} />
      )}

      {showSecurity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={handleCloseModal(setShowSecurity)}></div>
          <div className="relative z-10 w-full max-w-2xl">
            <SecuritySettings onClose={handleCloseModal(setShowSecurity)} />
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal onClose={handleCloseModal(setShowSettings)} />
      )}

      {showLina && (
        <LinaAssistant onClose={() => setShowLina(false)} />
      )}
    </div>
  );
});

UserDashboard.displayName = 'UserDashboard';

export default UserDashboard;
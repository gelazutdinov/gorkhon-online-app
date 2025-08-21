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
  const [activeTab, setActiveTab] = useState('profile');

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
    <div className="min-h-screen bg-gray-100">
      {/* VK-style Header with cover photo */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/0e65e83e-1fcf-4edf-88f3-1506ccc9f6f7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* VK-style header bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Icon name="ArrowLeft" size={24} />
            <span className="text-lg font-medium">Профиль</span>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="QrCode" size={24} />
            <Icon name="MoreHorizontal" size={24} />
          </div>
        </div>

        {/* Profile info section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end gap-4">
            {/* Avatar with online indicator */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <Icon name="User" size={32} className="text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Name and status */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {user.name}
                <Icon name="Globe" size={16} className="text-blue-200" />
                <Icon name="Check" size={16} className="text-green-400" />
              </h1>
              <p className="text-blue-100 text-lg">Космонавт-разработчик 🚀</p>
              <p className="text-blue-200 text-sm mt-1">https://poehali.dev/user/{user.id}</p>
            </div>
          </div>

          {/* Location and work info */}
          <div className="flex items-center gap-4 mt-3 text-blue-200 text-sm">
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={16} />
              <span>Космос</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Briefcase" size={16} />
              <span>Космонавт-разработчик</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={16} />
              <span>{daysWithUs} дней с нами</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe button */}
      <div className="bg-white px-6 py-4 border-b">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <Icon name="Plus" size={20} />
          Подписаться
        </button>
      </div>

      {/* Stats section */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold">{daysWithUs * 11}</div>
            <div className="text-gray-500 text-sm">друзей</div>
            <div className="flex justify-center -space-x-2 mt-2">
              <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.floor(daysWithUs / 2) + 57}</div>
            <div className="text-gray-500 text-sm">подписчиков</div>
            <div className="flex justify-center -space-x-2 mt-2">
              <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.floor(daysWithUs * 1.5)}</div>
            <div className="text-gray-500 text-sm">записей</div>
            <div className="flex justify-center -space-x-2 mt-2">
              <div className="w-8 h-8 bg-indigo-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-teal-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="User" size={20} />
              <span>Профиль</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Settings" size={20} />
              <span>Настройки</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'support' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Bot" size={20} />
              <span>Поддержка</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 space-y-4">
        {activeTab === 'profile' && (
          <>
            {/* Welcome card */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{timeOfDay}, {user.name}!</h3>
                <Icon name="Star" size={20} className="text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Статус: <span className="text-blue-600 font-medium">{activityLevel}</span></p>
                <p>Дней с нами: <span className="font-medium">{daysWithUs}</span></p>
                <p>Времени в платформе: <span className="font-medium">{formattedTimeSpent}</span></p>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-3">Последняя активность</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="Code" size={16} className="text-green-600" />
                  </div>
                  <span className="text-gray-600">Создал новый проект</span>
                  <span className="text-gray-400 text-xs ml-auto">2 часа назад</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="MessageCircle" size={16} className="text-blue-600" />
                  </div>
                  <span className="text-gray-600">Обратился в поддержку</span>
                  <span className="text-gray-400 text-xs ml-auto">1 день назад</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon name="Globe" size={16} className="text-purple-600" />
                  </div>
                  <span className="text-gray-600">Опубликовал сайт</span>
                  <span className="text-gray-400 text-xs ml-auto">3 дня назад</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-2">
            {/* Data Management */}
            <button 
              onClick={() => setShowDataManager(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="Database" size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Управление данными</div>
                  <div className="text-sm text-gray-500">Импорт, экспорт и резервные копии</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* Statistics */}
            <button 
              onClick={() => setShowStatistics(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={20} className="text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Статистика использования</div>
                  <div className="text-sm text-gray-500">Анализ активности и времени в системе</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* Backup */}
            <button 
              onClick={() => setShowBackup(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Icon name="Download" size={20} className="text-yellow-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Резервные копии</div>
                  <div className="text-sm text-gray-500">Создание и восстановление бэкапов</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* Accessibility */}
            <button 
              onClick={() => setShowAccessibility(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon name="Eye" size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Специальные возможности</div>
                  <div className="text-sm text-gray-500">Настройки доступности интерфейса</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* Security Settings */}
            <button 
              onClick={() => setShowSecurity(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Безопасность</div>
                  <div className="text-sm text-gray-500">Настройки приватности и защиты</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* General Settings */}
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon name="Settings" size={20} className="text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Общие настройки</div>
                  <div className="text-sm text-gray-500">Основные параметры приложения</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-4">
            {/* Support section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-3">Поддержка и помощь</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowLina(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="Bot" size={16} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Лина - ИИ помощник</div>
                    <div className="text-xs text-purple-700">Решение проблем и техническая поддержка онлайн</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Icon name="ChevronRight" size={16} className="text-gray-400" />
                </button>
                
                <a
                  href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={16} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Горячая линия</div>
                    <div className="text-xs text-green-700">Оставить отзыв или сообщить о проблеме</div>
                  </div>
                  <Icon name="ExternalLink" size={16} className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* FAQ section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-3">Часто задаваемые вопросы</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900 mb-1">Как опубликовать сайт?</p>
                  <p className="text-gray-600">Нажмите "Опубликовать" в редакторе и выберите домен</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900 mb-1">Как подключить GitHub?</p>
                  <p className="text-gray-600">В меню "Скачать" → "Подключить GitHub"</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Где скачать код проекта?</p>
                  <p className="text-gray-600">В разделе "Скачать" → "Скачать код"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="LogOut" size={20} className="text-red-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-red-600">Выйти из аккаунта</div>
              <div className="text-sm text-gray-500">Завершить текущую сессию</div>
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
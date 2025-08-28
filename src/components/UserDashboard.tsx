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
import ProfileEditModal from '@/components/ProfileEditModal';

interface UserDashboardProps {
  user?: UserProfile;
  daysWithUs?: number;
  formattedTimeSpent?: string;
  onLogout?: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange?: (section: string) => void;
}

const UserDashboard = memo(({ 
  user = {
    id: '1',
    username: 'user123',
    email: 'user@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
    name: 'Алексей Иванов',
    bio: 'Разработчик и любитель космоса',
    isVerified: true,
    followers: 1234,
    following: 567,
    posts: 89
  }, 
  daysWithUs = 45, 
  formattedTimeSpent = '2ч 30м', 
  onLogout = () => console.log('logout'), 
  onSectionChange = () => {} 
}: UserDashboardProps) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showLina, setShowLina] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [showDataManager, setShowDataManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(user);
  const [isVerified, setIsVerified] = useState(false);
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
      <div className="relative h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 overflow-hidden rounded-t-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/0e65e83e-1fcf-4edf-88f3-1506ccc9f6f7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        


        {/* Profile info section - moved to white background */}
      </div>

      {/* Profile info on white background */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b rounded-t-3xl -mt-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Icon name="User" size={24} className="text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Name and status */}
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              {userProfile.name}
              {isVerified && (
                <Icon name="BadgeCheck" size={20} className="text-blue-500" />
              )}
            </h1>
            <p className="text-gray-600">{userProfile.bio || 'Участник Горхон.Online'}</p>
            <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm">
              <span>Последняя активность: сегодня</span>
            </div>
          </div>
        </div>
      </div>



      {/* Navigation tabs */}
      <div className="bg-white border-b mx-4 sm:mx-0 rounded-2xl sm:rounded-none">
        <div className="flex rounded-2xl sm:rounded-none overflow-hidden">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="User" size={20} />
              <span className="hidden sm:inline">Профиль</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Settings" size={20} />
              <span className="hidden sm:inline">Настройки</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'support' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Bot" size={20} />
              <span className="hidden sm:inline">Поддержка</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'profile' && (
          <>
            {/* Status card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 space-y-1">
                <p>Статус: <span className="text-blue-600 font-medium">{activityLevel}</span></p>
                <p>Дней с нами: <span className="font-medium">{daysWithUs}</span></p>
                <p>Времени в платформе: <span className="font-medium">{formattedTimeSpent}</span></p>
              </div>
            </div>


          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-2">
            {/* Statistics */}
            <button 
              onClick={() => setShowStatistics(true)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow active:scale-98"
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

            {/* Profile Settings */}
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Редактировать профиль</div>
                  <div className="text-sm text-gray-500">Изменить информацию о себе</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>

            {/* General Settings */}
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow active:scale-98"
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
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium mb-3">Поддержка и помощь</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowLina(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="Bot" size={16} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Лина - ИИ помощник</div>
                    <div className="text-xs text-purple-700">Помощь по платформе Горхон.Online</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Icon name="ChevronRight" size={16} className="text-gray-400" />
                </button>
                
                <a
                  href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors active:scale-98"
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
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium mb-3">Часто задаваемые вопросы</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900 mb-1">Что такое Горхон.Online?</p>
                  <p className="text-gray-600">Платформа для социального взаимодействия и обмена контентом</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900 mb-1">Как изменить настройки профиля?</p>
                  <p className="text-gray-600">Перейдите в раздел "Настройки" → "Общие настройки"</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Где посмотреть мою активность?</p>
                  <p className="text-gray-600">В разделе "Профиль" отображается последняя активность</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow active:scale-98"
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
        <SettingsModal 
          onClose={handleCloseModal(setShowSettings)}
          isVerified={isVerified}
          onVerificationToggle={setIsVerified}
        />
      )}

      {showLina && (
        <LinaAssistant onClose={() => setShowLina(false)} />
      )}

      {showProfileEdit && (
        <ProfileEditModal 
          user={userProfile}
          onClose={() => setShowProfileEdit(false)}
          onSave={(updatedProfile) => {
            console.log('📝 Обновляю профиль в UserDashboard:', updatedProfile);
            
            // Обновляем локальное состояние профиля
            setUserProfile(prev => {
              const updated = { ...prev, ...updatedProfile };
              console.log('🔄 Новое состояние профиля:', updated);
              return updated;
            });
            
            // Обновляем глобальное состояние useAuth если нужно
            try {
              // Принудительно обновляем данные в localStorage
              const currentUserData = localStorage.getItem('currentUser');
              if (currentUserData) {
                const userData = JSON.parse(currentUserData);
                const fullyUpdatedProfile = {
                  ...userData,
                  ...updatedProfile,
                  updatedAt: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(fullyUpdatedProfile));
                console.log('✅ currentUser обновлен в localStorage');
              }
            } catch (error) {
              console.error('❌ Ошибка обновления currentUser:', error);
            }
            
            setShowProfileEdit(false);
            
            // Показываем уведомление об успехе
            setTimeout(() => {
              alert('✅ Профиль успешно обновлен и сохранен!');
            }, 100);
          }}
        />
      )}
    </div>
  );
});

UserDashboard.displayName = 'UserDashboard';

export default UserDashboard;
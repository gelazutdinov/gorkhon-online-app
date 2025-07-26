import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';
import AdminPanel from '@/components/verification/AdminPanel';
import ProfileSettings from '@/components/profile/ProfileSettings';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
  onSectionChange: (section: string) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout, onUserUpdate, onSectionChange }: UserDashboardProps) => {
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Проверяем, является ли пользователь администратором
  const isAdmin = user.email === 'admin@gorkhon.ru' || user.name.toLowerCase().includes('админ');
  
  const getRegistrationDate = () => {
    return new Date(user.registeredAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMostUsedFeature = () => {
    const features = user.stats?.featuresUsed || {};
    const entries = Object.entries(features);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [featureName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const featureNames: Record<string, string> = {
      importantNumbers: 'Важные номера',
      schedule: 'Расписание транспорта',
      donation: 'Помощь поселку',
      workSchedule: 'Режим работы',
      pvz: 'Пункты выдачи',
      notifications: 'Уведомления'
    };
    
    return featureNames[featureName] || featureName;
  };

  const getMostVisitedSection = () => {
    const sections = user.stats?.sectionsVisited || {};
    const entries = Object.entries(sections);
    if (entries.length === 0) return 'Пока нет данных';
    
    const [sectionName] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const sectionNames: Record<string, string> = {
      home: 'Главная',
      news: 'Новости',
      support: 'Поддержка',
      profile: 'Личный кабинет'
    };
    
    return sectionNames[sectionName] || sectionName;
  };

  const getActivityLevel = () => {
    const totalActions = Object.values(user.stats?.featuresUsed || {}).reduce((sum, count) => sum + count, 0);
    if (totalActions < 10) return { level: 'Новичок', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (totalActions < 50) return { level: 'Активный пользователь', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (totalActions < 100) return { level: 'Опытный житель', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Мастер платформы', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const getAvatarEmoji = (avatar: string): string => {
    const avatarMap: Record<string, string> = {
      default_male: '👨',
      default_female: '👩',
      businessman: '👨‍💼',
      businesswoman: '👩‍💼',
      worker: '👨‍🔧',
      worker_woman: '👩‍🔧',
      farmer: '👨‍🌾',
      farmer_woman: '👩‍🌾',
      teacher: '👨‍🏫',
      teacher_woman: '👩‍🏫',
      doctor: '👨‍⚕️',
      doctor_woman: '👩‍⚕️',
      artist: '👨‍🎨',
      artist_woman: '👩‍🎨',
      chef: '👨‍🍳',
      chef_woman: '👩‍🍳',
      oldman: '👴',
      oldwoman: '👵',
      boy: '👦',
      girl: '👧'
    };
    return avatarMap[avatar] || '👤';
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Заголовок профиля */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full w-full h-full flex items-center justify-center text-3xl overflow-hidden">
            {user.avatar && user.avatar.startsWith('data:') ? (
              <img src={user.avatar} alt="Аватар" className="w-full h-full object-cover rounded-full" />
            ) : (
              getAvatarEmoji(user.avatar)
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-800">Добро пожаловать, {user.name}!</h2>
          {user.verification?.status === 'approved' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Icon name="CheckCircle" size={16} className="text-blue-600" />
              <span>Житель</span>
            </div>
          )}
        </div>
        <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
        
        {/* Поздравление с днем рождения */}
        {user.birthDate && (
          <div className="mt-4 text-sm text-gray-600">
            День рождения: {new Date(user.birthDate).toLocaleDateString('ru-RU')}
          </div>
        )}
        
        {/* Уровень активности */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${activityLevel.bg}`}>
          <Icon name="Award" size={14} className={activityLevel.color} />
          <span className={`text-sm font-medium ${activityLevel.color}`}>
            {activityLevel.level}
          </span>
        </div>
        
        {/* Кнопки действий */}
        <div className={`grid gap-2 mt-4 max-w-xs mx-auto ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <button
            onClick={() => setShowProfileSettings(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
          >
            <Icon name="Settings" size={16} />
            <span className="text-xs">Настройки</span>
          </button>
          <button
            onClick={() => setShowStatistics(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Icon name="BarChart3" size={16} />
            <span className="text-xs">Статистика</span>
          </button>
          <button
            onClick={() => onSectionChange('support')}
            className="flex flex-col items-center gap-1 px-3 py-2 bg-gorkhon-green text-white rounded-lg hover:bg-gorkhon-green/90 transition-colors"
          >
            <Icon name="MessageCircle" size={16} />
            <span className="text-xs">Поддержка</span>
          </button>
          
          {/* Админ кнопка */}
          {isAdmin && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icon name="Shield" size={16} />
              <span className="text-xs">Админ</span>
            </button>
          )}
        </div>
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
      >
        <Icon name="LogOut" size={18} />
        <span>Выйти из аккаунта</span>
      </button>

      {/* Модальное окно настроек */}
      {showProfileSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Жидкое стекло iOS фон */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative">
            <ProfileSettings
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfileSettings(false)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {showStatistics && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Жидкое стекло iOS фон */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Статистика активности</h2>
              <button
                onClick={() => setShowStatistics(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Основная статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Calendar" size={24} className="text-gorkhon-pink mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{daysWithUs}</div>
                  <div className="text-sm text-gray-600">дней с нами</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Clock" size={24} className="text-gorkhon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{formattedTimeSpent}</div>
                  <div className="text-sm text-gray-600">времени в сервисе</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="BarChart3" size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{user.stats?.totalSessions || 0}</div>
                  <div className="text-sm text-gray-600">сессий</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 text-center">
                  <Icon name="Target" size={24} className="text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{user.stats?.daysActive || 0}</div>
                  <div className="text-sm text-gray-600">активных дней</div>
                </div>
              </div>

              {/* Детальная статистика */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-gorkhon-pink" />
                  Ваша активность
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Любимый раздел:</span>
                    <span className="font-medium text-gray-800">{getMostVisitedSection()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Часто используете:</span>
                    <span className="font-medium text-gray-800">{getMostUsedFeature()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Дата регистрации:</span>
                    <span className="font-medium text-gray-800">{getRegistrationDate()}</span>
                  </div>
                </div>
              </div>

              {/* Использование функций */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Activity" size={20} className="text-gorkhon-green" />
                  Использование функций
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(user.stats?.featuresUsed || {}).map(([feature, count]) => {
                    const featureNames: Record<string, string> = {
                      importantNumbers: 'Важные номера',
                      schedule: 'Расписание транспорта',
                      donation: 'Помощь поселку',
                      workSchedule: 'Режим работы',
                      pvz: 'Пункты выдачи',
                      notifications: 'Уведомления'
                    };
                    
                    const allCounts = Object.values(user.stats?.featuresUsed || {});
                    const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={feature}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{featureNames[feature]}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно админ-панели */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowAdminPanel(false)}></div>
          <div className="relative z-10">
            <AdminPanel
              onClose={() => setShowAdminPanel(false)}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
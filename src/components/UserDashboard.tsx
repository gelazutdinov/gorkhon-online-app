import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';
import SocialNetwork from '@/components/SocialNetwork';
import PhotoUpload from '@/components/PhotoUpload';
import AvatarSelector from '@/components/AvatarSelector';
import BirthdayGreeting from '@/components/BirthdayGreeting';
import InterestsEditor from '@/components/InterestsEditor';
import BirthdayWishesAI from '@/components/BirthdayWishesAI';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout, onUserUpdate }: UserDashboardProps) => {
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'social'>('stats');
  const [showInterestsEditor, setShowInterestsEditor] = useState(false);
  const getRegistrationDate = () => {
    return new Date(user.registeredAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMostUsedFeature = () => {
    const features = user.stats.featuresUsed;
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
    const sections = user.stats.sectionsVisited;
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
    const totalActions = Object.values(user.stats.featuresUsed).reduce((sum, count) => sum + count, 0);
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

  const handleSaveInterests = (interests: string[]) => {
    // Обновляем профиль пользователя с новыми интересами
    const updatedUser = { ...user, interests };
    localStorage.setItem('gorkhon_user_profile', JSON.stringify(updatedUser));
    setShowInterestsEditor(false);
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Заголовок профиля */}
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          {showAvatarEditor ? (
            <div className="absolute inset-0">
              <PhotoUpload
                currentPhoto={user.avatar.startsWith('data:') ? user.avatar : undefined}
                onPhotoChange={(photo) => {
                  if (photo) {
                    // Обновляем аватар пользователя
                    const updatedUser = { ...user, avatar: photo };
                    localStorage.setItem('gorkhon_user_profile', JSON.stringify(updatedUser));
                    window.location.reload(); // Перезагружаем для обновления
                  }
                  setShowAvatarEditor(false);
                }}
                className="w-full h-full"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAvatarEditor(true)}
              className="relative w-full h-full group"
            >
              {user.avatar.startsWith('data:') ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full w-full h-full flex items-center justify-center text-3xl">
                  {getAvatarEmoji(user.avatar)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <Icon name="Camera" size={20} className="text-white" />
              </div>
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать, {user.name}!</h2>
        <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
        
        {/* Поздравление с днем рождения */}
        {user.birthDate && (
          <div className="mt-4">
            <BirthdayGreeting
              name={user.name}
              birthDate={user.birthDate}
              gender={user.gender}
            />
          </div>
        )}
        
        {/* Уровень активности */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${activityLevel.bg}`}>
          <Icon name="Award" size={14} className={activityLevel.color} />
          <span className={`text-sm font-medium ${activityLevel.color}`}>
            {activityLevel.level}
          </span>
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'stats'
              ? 'bg-white text-gorkhon-pink shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="BarChart3" size={18} />
            <span>Статистика</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'social'
              ? 'bg-white text-gorkhon-pink shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="Users" size={18} />
            <span>Друзья</span>
          </div>
        </button>
      </div>

      {/* Контент в зависимости от таба */}
      {activeTab === 'stats' ? (
        <>
          {/* Основная статистика */}
          <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <Icon name="Calendar" size={24} className="text-gorkhon-pink mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{daysWithUs}</div>
          <div className="text-sm text-gray-600">дней с нами</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <Icon name="Clock" size={24} className="text-gorkhon-green mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{formattedTimeSpent}</div>
          <div className="text-sm text-gray-600">времени в сервисе</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <Icon name="BarChart3" size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{user.stats.totalSessions}</div>
          <div className="text-sm text-gray-600">сессий</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <Icon name="Target" size={24} className="text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{user.stats.daysActive}</div>
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
          {Object.entries(user.stats.featuresUsed).map(([feature, count]) => {
            const featureNames: Record<string, string> = {
              importantNumbers: 'Важные номера',
              schedule: 'Расписание транспорта',
              donation: 'Помощь поселку',
              workSchedule: 'Режим работы',
              pvz: 'Пункты выдачи',
              notifications: 'Уведомления'
            };
            
            const maxCount = Math.max(...Object.values(user.stats.featuresUsed));
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

      {/* Поздравления AI */}
      <BirthdayWishesAI user={user} />

      {/* Информация профиля */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-gray-600" />
          Информация профиля
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Icon name="Mail" size={16} className="text-gray-400" />
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Phone" size={16} className="text-gray-400" />
            <span className="text-gray-600">{user.phone}</span>
          </div>
          
          {/* Интересы */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Heart" size={16} className="text-gray-400" />
                <span className="text-gray-600">Интересы:</span>
              </div>
              <button
                onClick={() => setShowInterestsEditor(true)}
                className="text-gorkhon-pink hover:text-gorkhon-pink/80 text-sm"
              >
                {user.interests && user.interests.length > 0 ? 'Изменить' : 'Добавить'}
              </button>
            </div>
            
            {user.interests && user.interests.length > 0 ? (
              <div className="flex flex-wrap gap-1 ml-6">
                {user.interests.slice(0, 5).map((interest, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 5 && (
                  <span className="text-xs text-gray-400">
                    +{user.interests.length - 5}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 ml-6">Не указаны</p>
            )}
          </div>
        </div>
        
        {/* Модальное окно редактора интересов */}
        {showInterestsEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <InterestsEditor
                interests={user.interests || []}
                onSave={handleSaveInterests}
                onCancel={() => setShowInterestsEditor(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
      >
        <Icon name="LogOut" size={18} />
        <span>Выйти из аккаунта</span>
      </button>
        </>
      ) : (
        /* Социальная сеть */
        <SocialNetwork currentUser={user} />
      )}
    </div>
  );
};

export default UserDashboard;
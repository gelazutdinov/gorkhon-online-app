import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout }: UserDashboardProps) => {
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

  const activityLevel = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Заголовок профиля */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Icon name="User" size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать, {user.name}!</h2>
        <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
        
        {/* Уровень активности */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${activityLevel.bg}`}>
          <Icon name="Award" size={14} className={activityLevel.color} />
          <span className={`text-sm font-medium ${activityLevel.color}`}>
            {activityLevel.level}
          </span>
        </div>
      </div>

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
    </div>
  );
};

export default UserDashboard;
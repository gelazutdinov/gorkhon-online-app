import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface StatisticsModalProps {
  user: UserProfile;
  formattedTimeSpent: string;
  activityLevel: {
    level: string;
    color: string;
    bg: string;
    icon: string;
  };
  onClose: () => void;
}

const StatisticsModal = ({ user, formattedTimeSpent, activityLevel, onClose }: StatisticsModalProps) => {
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-gray-800">Статистика активности</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Общая статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{user.stats.totalSessions}</div>
              <div className="text-sm text-blue-600">всего посещений</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">{user.stats.daysActive}</div>
              <div className="text-sm text-green-600">активных дней</div>
            </div>
          </div>

          {/* Детальная информация */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Зарегистрированы</span>
              <span className="font-medium">{getRegistrationDate()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Часто используете</span>
              <span className="font-medium">{getMostUsedFeature()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Любимый раздел</span>
              <span className="font-medium">{getMostVisitedSection()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Время в приложении</span>
              <span className="font-medium">{formattedTimeSpent}</span>
            </div>
          </div>

          {/* Статус */}
          <div className={`p-4 ${activityLevel.bg} rounded-xl border-2 border-gray-200`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon name={activityLevel.icon as any} size={24} className={activityLevel.color} />
              <span className={`font-bold text-lg ${activityLevel.color}`}>{activityLevel.level}</span>
            </div>
            <p className="text-sm text-gray-600">
              Продолжайте пользоваться платформой, чтобы повысить свой статус!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
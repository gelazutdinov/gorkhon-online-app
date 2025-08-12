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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" onClick={onClose}></div>
      <div className="relative bg-gradient-to-br from-white via-white/98 to-blue-50/80 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl border border-white/30">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gradient-to-r from-blue-100/50 to-purple-100/50 sticky top-0 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-xl">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
              <Icon name="BarChart3" size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">Статистика активности</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Общая статистика с анимацией */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Activity" size={16} className="text-white sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 group-hover:scale-105 transition-transform">{user.stats.totalSessions}</div>
              <div className="text-xs sm:text-sm font-medium text-blue-600/80 break-words">всего посещений</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Calendar" size={16} className="text-white sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 group-hover:scale-105 transition-transform">{user.stats.daysActive}</div>
              <div className="text-xs sm:text-sm font-medium text-green-600/80 break-words">активных дней</div>
            </div>
          </div>

          {/* Мини-график прогресса */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
              <span className="truncate">Прогресс активности</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Посещения</span>
                  <span className="text-sm font-bold text-blue-600">{user.stats.totalSessions}/300</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((user.stats.totalSessions / 300) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Дни активности</span>
                  <span className="text-sm font-bold text-green-600">{user.stats.daysActive}/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((user.stats.daysActive / 30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Детальная информация */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-purple-600 sm:w-[18px] sm:h-[18px]" />
              <span className="truncate">Подробная информация</span>
            </h3>
            <div className="grid gap-3 sm:gap-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Icon name="Calendar" size={14} className="text-blue-600 flex-shrink-0 sm:w-4 sm:h-4" />
                  <span className="text-gray-700 font-medium text-sm sm:text-base truncate">Зарегистрированы</span>
                </div>
                <span className="font-bold text-gray-800 text-xs sm:text-sm text-right flex-shrink-0">{getRegistrationDate()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-green-50/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Icon name="Heart" size={16} className="text-green-600" />
                  <span className="text-gray-700 font-medium">Часто используете</span>
                </div>
                <span className="font-bold text-gray-800 text-right">{getMostUsedFeature()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-purple-50/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Icon name="Star" size={16} className="text-purple-600" />
                  <span className="text-gray-700 font-medium">Любимый раздел</span>
                </div>
                <span className="font-bold text-gray-800 text-right">{getMostVisitedSection()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-orange-50/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={16} className="text-orange-600" />
                  <span className="text-gray-700 font-medium">Время в приложении</span>
                </div>
                <span className="font-bold text-gray-800 text-right">{formattedTimeSpent}</span>
              </div>
            </div>
          </div>

          {/* Статус - обновленный дизайн */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-gradient-to-r from-yellow-200 to-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                  <Icon name="Award" size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{activityLevel.level}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Активный пользователь</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                🎆 Продолжайте пользоваться платформой, чтобы повысить свой статус до <strong>Мастера платформы</strong>!
              </p>
              <div className="mt-4 bg-white/60 rounded-xl p-3">
                <div className="text-xs text-gray-600 mb-2">До следующего уровня</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
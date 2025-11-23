import { UserProfile } from '@/types/user';
import Icon from '@/components/ui/icon';
import { getGreetingByTime } from '@/utils/timezone';

interface UserGreetingProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  activityLevel: {
    level: string;
    color: string;
    bg: string;
    icon: string;
  };
}

const UserGreeting = ({ user, daysWithUs, formattedTimeSpent, activityLevel }: UserGreetingProps) => {

  return (
    <>
      {/* Приветствие с новым градиентом */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 text-white" style={{
        background: 'linear-gradient(135deg, #005BFF 0%, #F1117E 100%)'
      }}>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <h2 className="text-lg sm:text-2xl font-bold mb-1">{getGreetingByTime()}, {user.name}!</h2>

              <p className="text-white/90 text-sm sm:text-base">Добро пожаловать!</p>
            </div>
            <div className="ml-4 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full flex-shrink-0">
              <Icon name={activityLevel.icon as any} size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
        {/* Декоративные элементы */}
        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Статус активности с перенесенной информацией */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Ваш статус</h3>
          <div className={`px-3 py-1 ${activityLevel.bg} ${activityLevel.color} rounded-full text-sm font-medium flex items-center gap-2 self-start sm:self-center`}>
            <Icon name={activityLevel.icon as any} size={16} />
            <span className="truncate">{activityLevel.level}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gorkhon-pink">{user.stats.totalSessions}</div>
            <div className="text-xs sm:text-sm text-gray-600">посещений</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gorkhon-green">{user.stats.daysActive}</div>
            <div className="text-xs sm:text-sm text-gray-600">активных дней</div>
          </div>
        </div>
        {/* Перенесенная информация */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Icon name="Calendar" size={16} className="flex-shrink-0" />
            <span>С нами {daysWithUs} дней</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Icon name="Clock" size={16} className="flex-shrink-0" />
            <span className="truncate">Активность: {formattedTimeSpent}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGreeting;
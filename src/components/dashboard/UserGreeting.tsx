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
      <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-xl" style={{
        background: 'linear-gradient(135deg, #005BFF 0%, #F1117E 100%)'
      }}>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">{getGreetingByTime()}, {user.name}!</h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">Добро пожаловать!</p>
            </div>
            <div className="ml-3 p-3 sm:p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0 shadow-lg">
              <Icon name={activityLevel.icon as any} size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
        {/* Декоративные элементы */}
        <div className="absolute -top-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Статус активности с перенесенной информацией */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <h3 className="text-xl font-bold text-gray-800">Ваш статус</h3>
          <div className={`px-4 py-2 ${activityLevel.bg} ${activityLevel.color} rounded-xl text-sm font-semibold flex items-center gap-2 self-start sm:self-center shadow-sm`}>
            <Icon name={activityLevel.icon as any} size={18} />
            <span className="truncate">{activityLevel.level}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
          <div className="text-center p-4 bg-gradient-to-br from-gorkhon-pink/10 to-gorkhon-pink/5 rounded-xl border border-gorkhon-pink/10">
            <div className="text-2xl sm:text-3xl font-bold text-gorkhon-pink">{user.stats.totalSessions}</div>
            <div className="text-sm sm:text-sm text-gray-600 mt-1 font-medium">посещений</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-gorkhon-green/10 to-gorkhon-green/5 rounded-xl border border-gorkhon-green/10">
            <div className="text-2xl sm:text-3xl font-bold text-gorkhon-green">{user.stats.daysActive}</div>
            <div className="text-sm sm:text-sm text-gray-600 mt-1 font-medium">активных дней</div>
          </div>
        </div>
        {/* Перенесенная информация */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5 text-sm sm:text-sm text-gray-600">
            <div className="p-1.5 rounded-lg bg-gray-100">
              <Icon name="Calendar" size={16} className="flex-shrink-0" />
            </div>
            <span className="font-medium">С нами {daysWithUs} дней</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm sm:text-sm text-gray-600">
            <div className="p-1.5 rounded-lg bg-gray-100">
              <Icon name="Clock" size={16} className="flex-shrink-0" />
            </div>
            <span className="truncate font-medium">Активность: {formattedTimeSpent}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGreeting;
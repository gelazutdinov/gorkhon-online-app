import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <>
      {/* Приветствие с новым градиентом */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{
        background: 'linear-gradient(135deg, #005BFF 0%, #F1117E 100%)'
      }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{getGreeting()}, {user.name}!</h2>
              <p className="text-white/90">Добро пожаловать в личный кабинет</p>
            </div>
            <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-full`}>
              <Icon name={activityLevel.icon as any} size={32} className="text-white" />
            </div>
          </div>
        </div>
        {/* Декоративные элементы */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Статус активности с перенесенной информацией */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ваш статус</h3>
          <div className={`px-3 py-1 ${activityLevel.bg} ${activityLevel.color} rounded-full text-sm font-medium flex items-center gap-2`}>
            <Icon name={activityLevel.icon as any} size={16} />
            {activityLevel.level}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gorkhon-pink">{user.stats.totalSessions}</div>
            <div className="text-sm text-gray-600">посещений</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gorkhon-green">{user.stats.daysActive}</div>
            <div className="text-sm text-gray-600">активных дней</div>
          </div>
        </div>
        {/* Перенесенная информация */}
        <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Calendar" size={16} />
            <span>С нами {daysWithUs} дней</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Clock" size={16} />
            <span>Активность: {formattedTimeSpent}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGreeting;
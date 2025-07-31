import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout }: UserDashboardProps) => {



  return (
    <div className="space-y-6">
      {/* СТАРАЯ ВЕРСИЯ ПРОФИЛЯ - Основная карточка профиля */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-6">
          {/* Аватар пользователя - большего размера */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.firstName ? user.firstName[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>

          {/* Информация о пользователе */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.username || 'Пользователь'
              }
            </h2>
            <div className="text-sm text-gray-600 mb-3">
              С нами {daysWithUs} {daysWithUs === 1 ? 'день' : daysWithUs < 5 ? 'дня' : 'дней'} • Время в системе: {formattedTimeSpent}
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name="LogOut" size={16} />
              Выйти
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default UserDashboard;
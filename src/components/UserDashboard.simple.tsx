import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface UserDashboardProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
  onLogout: () => void;
  onUserUpdate?: (user: UserProfile) => void;
}

const UserDashboard = ({ user, daysWithUs, formattedTimeSpent, onLogout }: UserDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Заголовок профиля */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full w-full h-full flex items-center justify-center text-3xl">
            {user.avatar || '👤'}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать, {user.name}!</h2>
        <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
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
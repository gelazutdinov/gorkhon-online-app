import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface ProfileActivityProps {
  user: UserProfile;
}

const ProfileActivity = ({ user }: ProfileActivityProps) => {
  return (
    <>
      {/* Активность в поселке */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Активность в Горхоне</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xl font-bold text-blue-600">{user.stats.daysActive}</div>
            <div className="text-xs text-blue-600">дней активности</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-xl font-bold text-green-600">{user.stats.totalSessions}</div>
            <div className="text-xs text-green-600">посещений</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-xl font-bold text-purple-600">
              {Math.floor((Date.now() - user.registeredAt) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-purple-600">дней с нами</div>
          </div>
        </div>
      </div>

      {/* Информация о безопасности */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Icon name="Shield" size={16} />
          О безопасности ваших данных
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          Мы серьезно относимся к защите вашей приватности. Все персональные данные 
          хранятся локально в вашем браузере и передаются только по защищенному 
          соединению. Подробнее в наших документах о конфиденциальности.
        </p>
      </div>
    </>
  );
};

export default ProfileActivity;
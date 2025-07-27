import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface UserProfileHeaderProps {
  user: UserProfile;
  activityLevel: {
    level: string;
    color: string;
    bg: string;
  };
}

const UserProfileHeader = ({ user, activityLevel }: UserProfileHeaderProps) => {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-4">
        <div className={`rounded-full w-full h-full flex items-center justify-center text-3xl overflow-hidden ${
          user.gender === 'female' ? 'bg-gradient-to-br from-gorkhon-pink to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
        }`}>
          <div className={`w-12 h-12 ${
            user.gender === 'female' ? 'text-blue-100' : 'text-pink-100'
          } flex items-center justify-center`}>
            <svg width="48" height="48" viewBox="0 0 64 64" fill="currentColor">
              <path d="M32 8c-6.627 0-12 5.373-12 12 0 4.411 2.387 8.257 5.926 10.361C21.724 32.768 18 37.187 18 42.5V56h28V42.5c0-5.313-3.724-9.732-7.926-12.139C41.613 28.257 44 24.411 44 20c0-6.627-5.373-12-12-12z"/>
              {user.gender === 'female' && (
                <>
                  <path d="M24 24c0 2 1 4 2 5s3 1 6 1 5 0 6-1 2-3 2-5" strokeWidth="1" stroke="currentColor" fill="none"/>
                  <circle cx="28" cy="22" r="1"/>
                  <circle cx="36" cy="22" r="1"/>
                </>
              )}
            </svg>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Добро пожаловать, {user.name}!</h2>
      <p className="text-gray-600">Ваш личный кабинет жителя Горхона</p>
      
      {/* Поздравление с днем рождения */}
      {user.birthDate && (
        <div className="mt-4 text-sm text-gray-600">
          День рождения: {new Date(user.birthDate).toLocaleDateString('ru-RU')}
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
  );
};

export default UserProfileHeader;
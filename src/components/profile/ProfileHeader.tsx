import Icon from '@/components/ui/icon';

interface User {
  name: string;
  email: string;
  avatar?: string;
  gender?: string;
  isVerified?: boolean;
  lastLoginAt?: string;
}

interface ProfileHeaderProps {
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
}

const ProfileHeader = ({ user, isAdmin, onLogout }: ProfileHeaderProps) => {
  return (
    <>
      {/* VK-style Header with cover photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 overflow-hidden rounded-t-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/0e65e83e-1fcf-4edf-88f3-1506ccc9f6f7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Кнопка выхода в правом углу */}
        <button
          onClick={onLogout}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg transition-colors"
        >
          <Icon name="LogOut" className="w-4 h-4" />
          Выйти
        </button>
      </div>

      {/* Profile info on white background */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b rounded-t-3xl -mt-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl">
                  {user.gender === 'female' ? '👩' : '👨'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Name and status */}
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              {user.name}
              {(user.isVerified || isAdmin) && (
                <Icon name="BadgeCheck" size={20} className="text-blue-500" />
              )}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm">
              <span>Последняя активность: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ru-RU') : 'сегодня'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
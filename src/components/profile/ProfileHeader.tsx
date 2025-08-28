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
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 overflow-hidden rounded-t-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/0e65e83e-1fcf-4edf-88f3-1506ccc9f6f7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Кнопка выхода в правом углу - адаптивная */}
        <button
          onClick={() => {
            if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
              onLogout();
            }
          }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600/90 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 shadow-lg"
          title="Выйти из аккаунта"
        >
          <Icon name="LogOut" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>

      {/* Profile info on white background */}
      <div className="bg-white px-3 sm:px-6 py-3 sm:py-4 border-b rounded-t-3xl -mt-4 sm:-mt-6 relative z-10">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          {/* Avatar with online indicator - адаптивный размер */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-lg sm:text-2xl">
                  {user.gender === 'female' ? '👩' : '👨'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Name and status - адаптивный текст */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-1.5 sm:gap-2 text-gray-900">
              <span className="truncate">{user.name}</span>
              <img 
                src="https://cdn.poehali.dev/files/2531de9e-0943-461a-8734-65d54bf1d5f7.png" 
                alt="Verified" 
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
            </h1>
            <p className="text-gray-600 text-sm sm:text-base truncate">{user.email}</p>
            <div className="flex items-center mt-1 text-gray-500 text-xs sm:text-sm">
              <span className="truncate">
                Последняя активность: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ru-RU') : 'сегодня'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
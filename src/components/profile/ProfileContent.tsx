import Icon from '@/components/ui/icon';

interface User {
  createdAt?: string;
  role?: string;
}

interface ProfileContentProps {
  user: User;
  onEditProfile: () => void;
  onOpenSettings: () => void;
}

const ProfileContent = ({ user, onEditProfile, onOpenSettings }: ProfileContentProps) => {
  return (
    <>
      {/* Status card - адаптивная карточка статуса */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
          <p className="flex flex-wrap items-center gap-1">
            <span>Статус:</span> 
            <span className="text-green-600 font-medium break-words">Верифицированный пользователь</span>
          </p>
          <p className="flex flex-wrap items-center gap-1">
            <span>Дата регистрации:</span> 
            <span className="font-medium break-words">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-1">
            <span>Роль:</span> 
            <span className="font-medium break-words">
              {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </p>
        </div>
        
        {/* Верификационный бейдж - адаптивный */}
        <div className="flex items-center justify-center pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Icon name="CheckCircle" className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Верифицированный аккаунт</span>
          </span>
        </div>
      </div>

      {/* Quick actions - адаптивная сетка */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full min-w-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Редактировать профиль</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">Изменить личные данные</p>
          </div>
        </button>

        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full min-w-0"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Settings" className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Настройки</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">Конфиденциальность, уведомления</p>
          </div>
        </button>
      </div>
    </>
  );
};

export default ProfileContent;
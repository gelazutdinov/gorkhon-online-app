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
      {/* Status card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="text-sm text-gray-600 space-y-1">
          <p>Статус: <span className="text-green-600 font-medium">Верифицированный пользователь</span></p>
          <p>Дата регистрации: <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}</span></p>
          <p>Роль: <span className="font-medium">{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span></p>
        </div>
        
        {/* Верификационный бейдж */}
        <div className="flex items-center justify-center pt-3 mt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Icon name="CheckCircle" className="w-3 h-3 mr-1" />
            Верифицированный аккаунт
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="User" className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Редактировать профиль</p>
            <p className="text-sm text-gray-600">Изменить личные данные</p>
          </div>
        </button>

        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="Settings" className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Настройки</p>
            <p className="text-sm text-gray-600">Конфиденциальность, уведомления</p>
          </div>
        </button>
      </div>
    </>
  );
};

export default ProfileContent;
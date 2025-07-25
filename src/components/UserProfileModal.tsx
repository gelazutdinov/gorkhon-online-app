import Icon from '@/components/ui/icon';
import { ResidentProfile } from '@/hooks/useSocialNetwork';
import { birthdayAI } from '@/utils/birthdaySystem';

interface UserProfileModalProps {
  user: ResidentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSendFriendRequest?: (userId: string) => void;
  onAcceptRequest?: (userId: string) => void;
  onRemoveFriend?: (userId: string) => void;
  friendshipStatus: 'friends' | 'request_sent' | 'request_received' | 'none';
}

const UserProfileModal = ({
  user,
  isOpen,
  onClose,
  onSendFriendRequest,
  onAcceptRequest,
  onRemoveFriend,
  friendshipStatus
}: UserProfileModalProps) => {
  if (!isOpen) return null;

  const getAvatarEmoji = (avatar: string): string => {
    const avatarMap: Record<string, string> = {
      default_male: '👨',
      default_female: '👩',
      businessman: '👨‍💼',
      businesswoman: '👩‍💼',
      worker: '👨‍🔧',
      worker_woman: '👩‍🔧',
      farmer: '👨‍🌾',
      farmer_woman: '👩‍🌾',
      teacher: '👨‍🏫',
      teacher_woman: '👩‍🏫',
      doctor: '👨‍⚕️',
      doctor_woman: '👩‍⚕️',
      artist: '👨‍🎨',
      artist_woman: '👩‍🎨',
      chef: '👨‍🍳',
      chef_woman: '👩‍🍳',
      oldman: '👴',
      oldwoman: '👵',
      boy: '👦',
      girl: '👧'
    };
    return avatarMap[avatar] || '👤';
  };

  const getAge = (): number => {
    const today = new Date();
    const birth = new Date(user.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} д. назад`;
    if (diffHours > 0) return `${diffHours} ч. назад`;
    if (diffMins > 0) return `${diffMins} мин. назад`;
    return 'только что';
  };

  const zodiac = birthdayAI.getZodiacSign(user.birthDate);
  const nextBirthday = birthdayAI.getNextBirthday(user.birthDate);

  const renderActionButton = () => {
    switch (friendshipStatus) {
      case 'friends':
        return (
          <button
            onClick={() => onRemoveFriend?.(user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Icon name="UserX" size={16} />
            <span>Удалить из друзей</span>
          </button>
        );
      case 'request_sent':
        return (
          <button
            disabled
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-not-allowed flex items-center gap-2"
          >
            <Icon name="Clock" size={16} />
            <span>Заявка отправлена</span>
          </button>
        );
      case 'request_received':
        return (
          <button
            onClick={() => onAcceptRequest?.(user.id)}
            className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors flex items-center gap-2"
          >
            <Icon name="UserPlus" size={16} />
            <span>Принять заявку</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => onSendFriendRequest?.(user.id)}
            className="px-4 py-2 bg-gorkhon-blue text-white rounded-lg hover:bg-gorkhon-blue/90 transition-colors flex items-center gap-2"
          >
            <Icon name="UserPlus" size={16} />
            <span>Добавить в друзья</span>
          </button>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              {user.avatar.startsWith('data:') ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full w-full h-full flex items-center justify-center text-4xl">
                  {getAvatarEmoji(user.avatar)}
                </div>
              )}
              
              {/* Статус онлайн */}
              {user.isOnline && (
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
            {user.status && (
              <p className="text-gray-600 mb-2">{user.status}</p>
            )}
            
            <div className="text-sm text-gray-500">
              {user.isOnline ? (
                <span className="text-green-600 font-medium">Онлайн</span>
              ) : (
                <span>Был(а) {getTimeAgo(user.lastActive)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="p-6 space-y-6">
          {/* Возраст и знак зодиака */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="Calendar" size={18} className="text-gorkhon-pink" />
              Личная информация
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Возраст:</span>
                <span className="font-medium">{getAge()} лет</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Знак зодиака:</span>
                <div className="flex items-center gap-1">
                  <span>{zodiac.emoji}</span>
                  <span className="font-medium">{zodiac.sign}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {zodiac.description}
              </div>
            </div>
          </div>

          {/* До дня рождения */}
          {nextBirthday.daysLeft > 0 && nextBirthday.daysLeft <= 365 && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Icon name="Gift" size={18} className="text-pink-500" />
                День рождения
              </h3>
              <p className="text-sm text-gray-700">
                До дня рождения осталось <span className="font-bold text-pink-600">{nextBirthday.daysLeft}</span> дней
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {nextBirthday.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          )}

          {/* Интересы */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Heart" size={18} className="text-gorkhon-pink" />
                Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gorkhon-pink/10 text-gorkhon-pink rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Статистика */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="BarChart3" size={18} className="text-gorkhon-blue" />
              На платформе
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gorkhon-blue">
                  {Math.floor((Date.now() - new Date(user.registrationDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-gray-600">дней с нами</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gorkhon-green">{user.friends.length}</div>
                <div className="text-xs text-gray-600">друзей</div>
              </div>
            </div>
          </div>

          {/* Кнопка действия */}
          <div className="pt-4 border-t border-gray-200">
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
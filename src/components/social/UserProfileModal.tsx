import Icon from '@/components/ui/icon';
import { UserProfileWithFriendship } from './types';

interface UserProfileModalProps {
  user: UserProfileWithFriendship;
  friendsCount: number;
  getAge: (birthDate: string) => number;
  onClose: () => void;
  onSendFriendRequest?: (userId: string) => void;
  onRemoveFriend?: (userId: string) => void;
}

const UserProfileModal = ({ 
  user, 
  friendsCount, 
  getAge, 
  onClose, 
  onSendFriendRequest, 
  onRemoveFriend 
}: UserProfileModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Профиль пользователя</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl mx-auto mb-4">
              {user.avatar.startsWith('data:') ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.avatar
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">{getAge(user.birthDate)} лет</p>
            {user.status && (
              <p className="text-gray-600 mt-2">{user.status}</p>
            )}
          </div>

          {user.interests && user.interests.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Интересы:</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Статистика:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600">Время на платформе</p>
                <p className="font-semibold">{Math.round(user.stats.totalTimeSpent / 60)} часов</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600">Друзей</p>
                <p className="font-semibold">{friendsCount}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Закрыть
            </button>
            
            {user.friendshipStatus === 'none' && onSendFriendRequest && (
              <button
                onClick={() => {
                  onSendFriendRequest(user.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
              >
                Добавить в друзья
              </button>
            )}
            
            {user.friendshipStatus === 'friends' && onRemoveFriend && (
              <button
                onClick={() => {
                  onRemoveFriend(user.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Удалить из друзей
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
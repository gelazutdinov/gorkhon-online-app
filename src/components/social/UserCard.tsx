import Icon from '@/components/ui/icon';
import { UserProfileWithFriendship } from './types';

interface UserCardProps {
  user: UserProfileWithFriendship;
  getAge: (birthDate: string) => number;
  onViewProfile: (user: UserProfileWithFriendship) => void;
  onSendFriendRequest?: (userId: string) => void;
  onRemoveFriend?: (userId: string) => void;
  showActions?: boolean;
}

const UserCard = ({ 
  user, 
  getAge, 
  onViewProfile, 
  onSendFriendRequest, 
  onRemoveFriend,
  showActions = true 
}: UserCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
          {user.avatar.startsWith('data:') ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.avatar
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{getAge(user.birthDate)} лет</p>
              {user.status && (
                <p className="text-sm text-gray-600 mt-1">{user.status}</p>
              )}
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <button
                  onClick={() => onViewProfile(user)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Посмотреть профиль"
                >
                  <Icon name="Eye" size={16} />
                </button>
                
                {user.friendshipStatus === 'none' && onSendFriendRequest && (
                  <button
                    onClick={() => onSendFriendRequest(user.id)}
                    className="px-3 py-1 bg-gorkhon-pink text-white text-sm rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
                  >
                    Добавить в друзья
                  </button>
                )}
                
                {user.friendshipStatus === 'pending_sent' && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg">
                    Заявка отправлена
                  </span>
                )}
                
                {user.friendshipStatus === 'friends' && (
                  <>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                      В друзьях
                    </span>
                    {onRemoveFriend && (
                      <button
                        onClick={() => onRemoveFriend(user.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить из друзей"
                      >
                        <Icon name="UserMinus" size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          
          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {user.interests.slice(0, 4).map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{user.interests.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
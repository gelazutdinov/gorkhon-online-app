import Icon from '@/components/ui/icon';
import { ResidentProfile, FriendRequest } from '@/hooks/useSocialNetwork';

interface FriendsListProps {
  friends: ResidentProfile[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onViewProfile: (user: ResidentProfile) => void;
}

const FriendsList = ({
  friends,
  incomingRequests,
  outgoingRequests,
  onAcceptRequest,
  onDeclineRequest,
  onRemoveFriend,
  onViewProfile
}: FriendsListProps) => {
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

  return (
    <div className="space-y-6">
      {/* Входящие заявки */}
      {incomingRequests.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Icon name="UserPlus" size={20} />
            Входящие заявки в друзья ({incomingRequests.length})
          </h3>
          <div className="space-y-2">
            {incomingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-3 flex items-center gap-3"
              >
                <button
                  onClick={() => onViewProfile(request.fromUser)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform"
                >
                  {request.fromUser.avatar.startsWith('data:') ? (
                    <img 
                      src={request.fromUser.avatar} 
                      alt={request.fromUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getAvatarEmoji(request.fromUser.avatar)
                  )}
                </button>
                <div className="flex-1">
                  <button
                    onClick={() => onViewProfile(request.fromUser)}
                    className="font-medium text-gray-800 hover:text-gorkhon-pink transition-colors"
                  >
                    {request.fromUser.name}
                  </button>
                  <div className="text-xs text-gray-500">{getTimeAgo(request.timestamp)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAcceptRequest(request.id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Icon name="Check" size={16} />
                  </button>
                  <button
                    onClick={() => onDeclineRequest(request.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Исходящие заявки */}
      {outgoingRequests.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="Clock" size={20} />
            Отправленные заявки ({outgoingRequests.length})
          </h3>
          <div className="space-y-2">
            {outgoingRequests.map((request) => {
              const toUser = friends.find(f => f.id === request.toUserId);
              if (!toUser) return null;
              
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {toUser.avatar.startsWith('data:') ? (
                      <img 
                        src={toUser.avatar} 
                        alt={toUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getAvatarEmoji(toUser.avatar)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{toUser.name}</div>
                    <div className="text-xs text-gray-500">Ожидает ответа • {getTimeAgo(request.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Список друзей */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Мои друзья {friends.length > 0 && `(${friends.length})`}
        </h3>
        
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">У вас пока нет друзей</p>
            <p className="text-sm text-gray-400 mt-1">Найдите других жителей через поиск</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gorkhon-pink/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onViewProfile(friend)}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                  >
                    {friend.avatar.startsWith('data:') ? (
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getAvatarEmoji(friend.avatar)
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <button
                      onClick={() => onViewProfile(friend)}
                      className="font-medium text-gray-800 hover:text-gorkhon-pink transition-colors text-left"
                    >
                      {friend.name}
                    </button>
                    {friend.status && (
                      <p className="text-sm text-gray-500">{friend.status}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {friend.isOnline ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-xs">онлайн</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        был(а) {getTimeAgo(friend.lastActive)}
                      </span>
                    )}
                    
                    <button
                      onClick={() => onRemoveFriend(friend.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Удалить из друзей"
                    >
                      <Icon name="UserX" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
import { SocialUser, FriendRequest } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface FriendsTabProps {
  socialUsers: SocialUser[];
  currentUser: UserProfile;
  currentSocialUser: SocialUser | null;
  friendRequests: FriendRequest[];
  onSendFriendRequest: (userId: string) => void;
  onRespondToFriendRequest: (requestId: string, response: 'accepted' | 'rejected') => void;
}

const FriendsTab = ({ 
  socialUsers, 
  currentUser, 
  currentSocialUser, 
  friendRequests, 
  onSendFriendRequest, 
  onRespondToFriendRequest 
}: FriendsTabProps) => {
  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Заявки в друзья */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Заявки в друзья ({pendingRequests.length})</h3>
          <div className="space-y-3">
            {pendingRequests.map(request => {
              const sender = socialUsers.find(u => u.id === request.fromUserId);
              if (!sender) return null;

              return (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg">
                      {sender.avatar}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{sender.name}</h4>
                      <p className="text-sm text-gray-600">{sender.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRespondToFriendRequest(request.id, 'accepted')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => onRespondToFriendRequest(request.id, 'rejected')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Список пользователей */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Жители Горхона</h3>
        <div className="space-y-3">
          {socialUsers.filter(u => u.id !== currentUser.id).map(user => {
            const isFollowing = currentSocialUser?.following.includes(user.id);
            const hasPendingRequest = friendRequests.some(r => 
              r.fromUserId === currentUser.id && r.toUserId === user.id && r.status === 'pending'
            );

            return (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{user.name}</h4>
                      {user.id === 'gorkhon_official' && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Icon name="Check" size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.followers.length} подписчиков • {user.following.length} подписок
                    </div>
                  </div>
                </div>
                <div>
                  {isFollowing ? (
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                      Друг
                    </button>
                  ) : hasPendingRequest ? (
                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed">
                      Заявка отправлена
                    </button>
                  ) : (
                    <button
                      onClick={() => onSendFriendRequest(user.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Добавить в друзья
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
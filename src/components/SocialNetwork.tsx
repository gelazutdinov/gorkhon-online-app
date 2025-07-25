import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import FriendsSearch from '@/components/FriendsSearch';
import FriendsList from '@/components/FriendsList';
import UserProfileModal from '@/components/UserProfileModal';
import { useSocialNetwork, ResidentProfile } from '@/hooks/useSocialNetwork';
import { useUser } from '@/hooks/useUser';

const SocialNetwork = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'friends'>('friends');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<ResidentProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user } = useUser();
  const {
    currentUser,
    searchResidents,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getIncomingFriendRequests,
    getOutgoingFriendRequests,
    getFriendshipStatus,
    removeFriend,
    registerResident
  } = useSocialNetwork();

  // Регистрация пользователя в социальной сети при первом входе
  useEffect(() => {
    if (user && !currentUser) {
      registerResident({
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar
      });
    }
  }, [user, currentUser]);

  const handleSearch = (query: string) => {
    const results = searchResidents(query);
    setSearchResults(results);
  };

  const handleSendRequest = (userId: string) => {
    const success = sendFriendRequest(userId);
    if (success) {
      // Обновляем результаты поиска
      handleSearch(searchResults.length > 0 ? searchResults[0].name : '');
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequest(requestId);
  };

  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId);
  };

  const handleViewProfile = (user: ResidentProfile) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  if (!user || !currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
      </div>
    );
  }

  const friends = getFriends();
  const incomingRequests = getIncomingFriendRequests();
  const outgoingRequests = getOutgoingFriendRequests();

  return (
    <div className="space-y-6">
      {/* Заголовок с счетчиками */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Icon name="Users" size={28} className="text-gorkhon-pink" />
            Социальная сеть
          </h2>
          
          {/* Счетчики */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gorkhon-blue">{friends.length}</div>
              <div className="text-xs text-gray-500">друзей</div>
            </div>
            {incomingRequests.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{incomingRequests.length}</div>
                <div className="text-xs text-gray-500">заявок</div>
              </div>
            )}
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'friends'
                ? 'bg-gorkhon-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Users" size={18} />
              <span>Мои друзья</span>
              {incomingRequests.length > 0 && (
                <span className="bg-white text-gorkhon-pink px-2 py-0.5 rounded-full text-xs font-bold">
                  {incomingRequests.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-gorkhon-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Search" size={18} />
              <span>Поиск жителей</span>
            </div>
          </button>
        </div>

        {/* Контент */}
        {activeTab === 'friends' ? (
          <FriendsList
            friends={friends}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onRemoveFriend={handleRemoveFriend}
            onViewProfile={handleViewProfile}
          />
        ) : (
          <FriendsSearch
            searchResults={searchResults}
            onSearch={handleSearch}
            onSendRequest={handleSendRequest}
            getFriendshipStatus={getFriendshipStatus}
            onAcceptRequest={handleAcceptRequest}
            onViewProfile={handleViewProfile}
          />
        )}
      </div>

      {/* Подсказка */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">О социальной сети</h4>
            <p className="text-sm text-blue-700">
              Находите других жителей поселка, добавляйте в друзья и будьте в курсе событий. 
              Все данные хранятся локально в вашем браузере для максимальной приватности.
            </p>
          </div>
        </div>
      </div>

      {/* Модальное окно профиля */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedUser(null);
          }}
          onSendFriendRequest={handleSendRequest}
          onAcceptRequest={(userId) => {
            // Нужно найти ID заявки для acceptFriendRequest
            const request = incomingRequests.find(req => req.fromUserId === userId);
            if (request) {
              handleAcceptRequest(request.id);
            }
          }}
          onRemoveFriend={handleRemoveFriend}
          friendshipStatus={getFriendshipStatus(selectedUser.id)}
        />
      )}
    </div>
  );
};

export default SocialNetwork;
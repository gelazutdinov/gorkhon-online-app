import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import Icon from '@/components/ui/icon';

// Импорт компонентов
import UserCard from '@/components/social/UserCard';
import UserProfileModal from '@/components/social/UserProfileModal';
import FriendRequestCard from '@/components/social/FriendRequestCard';
import SocialTabs from '@/components/social/SocialTabs';

// Импорт типов и данных
import { FriendRequest, UserProfileWithFriendship } from '@/components/social/types';
import { mockUsers } from '@/components/social/mockData';

interface SocialNetworkProps {
  currentUser: UserProfile;
}

const SocialNetwork = ({ currentUser }: SocialNetworkProps) => {
  const [users, setUsers] = useState<UserProfileWithFriendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'friends' | 'requests'>('search');
  const [selectedUser, setSelectedUser] = useState<UserProfileWithFriendship | null>(null);

  // Утилитарная функция для вычисления возраста
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Утилитарная функция для поиска пользователя по заявке
  const getUserByRequest = (request: FriendRequest) => {
    return users.find(u => u.id === request.fromUserId);
  };

  // Загрузка данных
  useEffect(() => {
    const savedRequests = localStorage.getItem('friendRequests');
    const savedFriends = localStorage.getItem(`friends_${currentUser.id}`);

    if (savedRequests) {
      setFriendRequests(JSON.parse(savedRequests));
    }

    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }

    // Добавляем мокапы пользователей (исключая текущего пользователя)
    const otherUsers = mockUsers.filter(user => user.id !== currentUser.id);
    setUsers(otherUsers);
  }, [currentUser.id]);

  // Обновление статуса дружбы для пользователей
  useEffect(() => {
    const usersWithFriendship = users.map(user => {
      const sentRequest = friendRequests.find(
        req => req.fromUserId === currentUser.id && req.toUserId === user.id
      );
      const receivedRequest = friendRequests.find(
        req => req.fromUserId === user.id && req.toUserId === currentUser.id
      );
      const isFriend = friends.some(friend => friend.id === user.id);

      let friendshipStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends' = 'none';

      if (isFriend) {
        friendshipStatus = 'friends';
      } else if (sentRequest?.status === 'pending') {
        friendshipStatus = 'pending_sent';
      } else if (receivedRequest?.status === 'pending') {
        friendshipStatus = 'pending_received';
      }

      return { ...user, friendshipStatus };
    });

    setUsers(usersWithFriendship);
  }, [friendRequests, friends, currentUser.id]);

  // Отправка заявки в друзья
  const sendFriendRequest = (toUserId: string) => {
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedRequests = [...friendRequests, newRequest];
    setFriendRequests(updatedRequests);
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
  };

  // Принятие заявки в друзья
  const acceptFriendRequest = (requestId: string, fromUserId: string) => {
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    );
    setFriendRequests(updatedRequests);
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));

    // Добавляем друга
    const newFriend = users.find(u => u.id === fromUserId);
    if (newFriend) {
      const updatedFriends = [...friends, newFriend];
      setFriends(updatedFriends);
      localStorage.setItem(`friends_${currentUser.id}`, JSON.stringify(updatedFriends));
    }
  };

  // Отклонение заявки в друзья
  const rejectFriendRequest = (requestId: string) => {
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    setFriendRequests(updatedRequests);
    localStorage.setItem('friendRequests', JSON.stringify(updatedRequests));
  };

  // Удаление из друзей
  const removeFriend = (friendId: string) => {
    const updatedFriends = friends.filter(friend => friend.id !== friendId);
    setFriends(updatedFriends);
    localStorage.setItem(`friends_${currentUser.id}`, JSON.stringify(updatedFriends));
  };

  // Фильтрация пользователей по поиску
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.interests?.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Входящие заявки
  const incomingRequests = friendRequests.filter(
    req => req.toUserId === currentUser.id && req.status === 'pending'
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Социальная сеть Горхона</h2>
        <p className="text-gray-600">Находите единомышленников и заводите новых друзей</p>
      </div>

      {/* Табы */}
      <SocialTabs
        activeTab={activeTab}
        friendsCount={friends.length}
        requestsCount={incomingRequests.length}
        onTabChange={setActiveTab}
      />

      {/* Поиск пользователей */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или интересам..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
            />
          </div>

          <div className="grid gap-4">
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                getAge={getAge}
                onViewProfile={setSelectedUser}
                onSendFriendRequest={sendFriendRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Список друзей */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">У вас пока нет друзей</h3>
              <p className="text-gray-600 mb-4">Начните поиск интересных людей во вкладке "Поиск людей"</p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
              >
                Найти друзей
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {friends.map(friend => (
                <UserCard
                  key={friend.id}
                  user={friend}
                  getAge={getAge}
                  onViewProfile={setSelectedUser}
                  onRemoveFriend={removeFriend}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Заявки в друзья */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Нет новых заявок</h3>
              <p className="text-gray-600">Заявки в друзья будут появляться здесь</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {incomingRequests.map(request => {
                const user = getUserByRequest(request);
                if (!user) return null;

                return (
                  <FriendRequestCard
                    key={request.id}
                    request={request}
                    user={user}
                    getAge={getAge}
                    onAccept={acceptFriendRequest}
                    onReject={rejectFriendRequest}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Модальное окно профиля пользователя */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          friendsCount={friends.length}
          getAge={getAge}
          onClose={() => setSelectedUser(null)}
          onSendFriendRequest={sendFriendRequest}
          onRemoveFriend={removeFriend}
        />
      )}
    </div>
  );
};

export default SocialNetwork;
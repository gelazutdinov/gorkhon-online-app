import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface SocialNetworkProps {
  currentUser: UserProfile;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface UserProfileWithFriendship extends UserProfile {
  friendshipStatus?: 'none' | 'pending_sent' | 'pending_received' | 'friends';
}

const SocialNetwork = ({ currentUser }: SocialNetworkProps) => {
  const [users, setUsers] = useState<UserProfileWithFriendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'friends' | 'requests'>('search');
  const [selectedUser, setSelectedUser] = useState<UserProfileWithFriendship | null>(null);

  // Мокапы пользователей для демонстрации
  const mockUsers: UserProfile[] = [
    {
      id: 'user1',
      name: 'Анна Петрова',
      email: 'anna@example.com',
      phone: '+7 (999) 123-45-67',
      gender: 'female',
      birthDate: '1995-03-15',
      avatar: '👩‍💼',
      interests: ['Путешествия', 'Фотография', 'Книги', 'Кулинария'],
      status: 'Люблю исследовать новые места 🌍',
      registeredAt: Date.now() - 86400000 * 30,
      lastActiveAt: Date.now() - 3600000,
      stats: {
        totalSessions: 45,
        totalTimeSpent: 1200,
        sectionsVisited: { home: 20, news: 15, support: 5, profile: 8 },
        featuresUsed: { importantNumbers: 10, schedule: 8, donation: 2, workSchedule: 5, pvz: 7, notifications: 15 },
        daysActive: 25
      }
    },
    {
      id: 'user2',
      name: 'Михаил Сидоров',
      email: 'mikhail@example.com',
      phone: '+7 (999) 987-65-43',
      gender: 'male',
      birthDate: '1988-07-22',
      avatar: '👨‍💻',
      interests: ['Программирование', 'Спорт', 'Музыка', 'Технологии'],
      status: 'Код - это поэзия 💻',
      registeredAt: Date.now() - 86400000 * 60,
      lastActiveAt: Date.now() - 7200000,
      stats: {
        totalSessions: 80,
        totalTimeSpent: 2400,
        sectionsVisited: { home: 35, news: 25, support: 10, profile: 15 },
        featuresUsed: { importantNumbers: 20, schedule: 15, donation: 5, workSchedule: 12, pvz: 18, notifications: 30 },
        daysActive: 50
      }
    },
    {
      id: 'user3',
      name: 'Елена Коваленко',
      email: 'elena@example.com',
      phone: '+7 (999) 111-22-33',
      gender: 'female',
      birthDate: '1992-12-08',
      avatar: '🎨',
      interests: ['Искусство', 'Дизайн', 'Йога', 'Природа'],
      status: 'Творчество - моя страсть ✨',
      registeredAt: Date.now() - 86400000 * 15,
      lastActiveAt: Date.now() - 1800000,
      stats: {
        totalSessions: 25,
        totalTimeSpent: 800,
        sectionsVisited: { home: 12, news: 8, support: 3, profile: 5 },
        featuresUsed: { importantNumbers: 5, schedule: 4, donation: 1, workSchedule: 2, pvz: 6, notifications: 8 },
        daysActive: 12
      }
    },
    {
      id: 'user4',
      name: 'Дмитрий Волков',
      email: 'dmitry@example.com',
      phone: '+7 (999) 444-55-66',
      gender: 'male',
      birthDate: '1990-05-30',
      avatar: '🏃‍♂️',
      interests: ['Бег', 'Здоровье', 'Медитация', 'Путешествия'],
      status: 'В здоровом теле - здоровый дух 💪',
      registeredAt: Date.now() - 86400000 * 45,
      lastActiveAt: Date.now() - 5400000,
      stats: {
        totalSessions: 60,
        totalTimeSpent: 1800,
        sectionsVisited: { home: 28, news: 18, support: 7, profile: 12 },
        featuresUsed: { importantNumbers: 15, schedule: 12, donation: 3, workSchedule: 8, pvz: 14, notifications: 22 },
        daysActive: 35
      }
    }
  ];

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

  const getUserByRequest = (request: FriendRequest) => {
    return users.find(u => u.id === request.fromUserId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Социальная сеть Горхона</h2>
        <p className="text-gray-600">Находите единомышленников и заводите новых друзей</p>
      </div>

      {/* Табы */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'search'
              ? 'border-gorkhon-pink text-gorkhon-pink'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon name="Search" size={16} />
            Поиск людей
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'friends'
              ? 'border-gorkhon-pink text-gorkhon-pink'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} />
            Друзья ({friends.length})
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors relative ${
            activeTab === 'requests'
              ? 'border-gorkhon-pink text-gorkhon-pink'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon name="UserPlus" size={16} />
            Заявки
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {incomingRequests.length}
              </span>
            )}
          </div>
        </button>
      </div>

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
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
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
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Посмотреть профиль"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        
                        {user.friendshipStatus === 'none' && (
                          <button
                            onClick={() => sendFriendRequest(user.id)}
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
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                            В друзьях
                          </span>
                        )}
                      </div>
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
                <div
                  key={friend.id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                      {friend.avatar.startsWith('data:') ? (
                        <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        friend.avatar
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                          <p className="text-sm text-gray-600">{getAge(friend.birthDate)} лет</p>
                          {friend.status && (
                            <p className="text-sm text-gray-600 mt-1">{friend.status}</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedUser(friend)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Посмотреть профиль"
                          >
                            <Icon name="Eye" size={16} />
                          </button>
                          <button
                            onClick={() => removeFriend(friend.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить из друзей"
                          >
                            <Icon name="UserMinus" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                  >
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
                            <p className="text-sm text-gray-500 mt-1">
                              Отправил заявку {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptFriendRequest(request.id, request.fromUserId)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Принять
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(request.id)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                            >
                              Отклонить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Модальное окно профиля пользователя */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Профиль пользователя</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl mx-auto mb-4">
                  {selectedUser.avatar.startsWith('data:') ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    selectedUser.avatar
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h3>
                <p className="text-gray-600">{getAge(selectedUser.birthDate)} лет</p>
                {selectedUser.status && (
                  <p className="text-gray-600 mt-2">{selectedUser.status}</p>
                )}
              </div>

              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Интересы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests.map((interest, idx) => (
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
                    <p className="font-semibold">{Math.round(selectedUser.stats.totalTimeSpent / 60)} часов</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600">Друзей</p>
                    <p className="font-semibold">{friends.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Закрыть
                </button>
                
                {selectedUser.friendshipStatus === 'none' && (
                  <button
                    onClick={() => {
                      sendFriendRequest(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
                  >
                    Добавить в друзья
                  </button>
                )}
                
                {selectedUser.friendshipStatus === 'friends' && (
                  <button
                    onClick={() => {
                      removeFriend(selectedUser.id);
                      setSelectedUser(null);
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
      )}
    </div>
  );
};

export default SocialNetwork;
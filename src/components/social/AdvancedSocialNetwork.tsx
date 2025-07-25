import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface SocialUser extends UserProfile {
  followers: string[];
  following: string[];
  posts: SocialPost[];
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  timestamp: string;
  likes: string[];
  comments: Comment[];
  shares: number;
}

interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: string[];
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface AdvancedSocialNetworkProps {
  currentUser: UserProfile;
}

const AdvancedSocialNetwork = ({ currentUser }: AdvancedSocialNetworkProps) => {
  const [socialUsers, setSocialUsers] = useState<SocialUser[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'profile'>('feed');
  const [currentSocialUser, setCurrentSocialUser] = useState<SocialUser | null>(null);

  // Инициализация данных
  useEffect(() => {
    const initializeSocialData = () => {
      // Создаем социального пользователя из текущего
      const socialUser: SocialUser = {
        ...currentUser,
        followers: [],
        following: ['gorkhon_official'],
        posts: [],
        bio: 'Житель поселка Горхон 🏘️',
        isOnline: true,
        lastSeen: new Date().toISOString()
      };

      // Официальное сообщество Горхон
      const officialAccount: SocialUser = {
        id: 'gorkhon_official',
        name: 'Горхон',
        email: 'info@gorkhon.ru',
        phone: '+7 (30132) 2-XX-XX',
        gender: 'male' as const,
        birthDate: '',
        avatar: '🏘️',
        interests: ['администрация', 'объявления', 'новости'],
        status: 'Официальное сообщество поселка',
        registeredAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
        lastActiveAt: Date.now(),
        stats: {
          totalSessions: 1000,
          totalTimeSpent: 50000,
          sectionsVisited: { home: 500, news: 300, support: 200, profile: 100 },
          featuresUsed: { importantNumbers: 50, schedule: 80, donation: 30, workSchedule: 60, pvz: 40, notifications: 100 },
          daysActive: 365
        },
        followers: [currentUser.id],
        following: [],
        posts: [],
        bio: 'Официальное сообщество поселка Горхон. Следите за новостями и объявлениями! 📢',
        isOnline: true
      };

      // Демо пользователи
      const demoUsers: SocialUser[] = [
        {
          id: 'user_demo_1',
          name: 'Анна Петрова',
          email: 'anna@example.com',
          phone: '+7 999 123 45 67',
          gender: 'female' as const,
          birthDate: '1985-06-15',
          avatar: '👩',
          interests: ['садоводство', 'рукоделие', 'кулинария'],
          status: 'Люблю наш уютный поселок',
          registeredAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          lastActiveAt: Date.now() - 2 * 60 * 60 * 1000,
          stats: {
            totalSessions: 45,
            totalTimeSpent: 1200,
            sectionsVisited: { home: 20, news: 15, support: 5, profile: 10 },
            featuresUsed: { importantNumbers: 5, schedule: 8, donation: 3, workSchedule: 6, pvz: 4, notifications: 10 },
            daysActive: 25
          },
          followers: [],
          following: ['gorkhon_official'],
          posts: [],
          bio: 'Мама двоих детей, увлекаюсь садоводством 🌸',
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];

      const allUsers = [socialUser, officialAccount, ...demoUsers];
      setSocialUsers(allUsers);
      setCurrentSocialUser(socialUser);

      // Загружаем данные из localStorage
      const savedRequests = localStorage.getItem('gorkhon_friend_requests');
      if (savedRequests) {
        setFriendRequests(JSON.parse(savedRequests));
      }

      const savedPosts = localStorage.getItem('gorkhon_social_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    };

    initializeSocialData();
  }, [currentUser]);

  // Интеграция с ВК виджетом для официальных постов
  useEffect(() => {
    // Симуляция получения постов из ВК виджета
    const fetchVkPosts = () => {
      // В реальном приложении здесь будет интеграция с VK API
      const vkPosts: SocialPost[] = [
        {
          id: 'vk_post_1',
          authorId: 'gorkhon_official',
          content: '🎄 НОВОГОДНИЕ МЕРОПРИЯТИЯ В ГОРХОНЕ\n\n📅 30 декабря, 15:00 - Детский утренник в клубе\n📅 31 декабря, 23:00 - Новогодняя елка на площади\n\nПриглашаем всех жителей! Горячий чай и сладости для детей! ☕🍪',
          images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: [currentUser.id],
          comments: [],
          shares: 15
        },
        {
          id: 'vk_post_2',
          authorId: 'gorkhon_official',
          content: '⚠️ ВАЖНОЕ ОБЪЯВЛЕНИЕ\n\nЗавтра, 26 декабря, с 9:00 до 15:00 планируется отключение электроэнергии на улицах:\n\n• Центральная\n• Молодежная\n• Садовая\n\nПриносим извинения за неудобства.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: [],
          comments: [],
          shares: 8
        }
      ];

      setPosts(prev => {
        const existingIds = prev.map(p => p.id);
        const newPosts = vkPosts.filter(p => !existingIds.includes(p.id));
        return [...newPosts, ...prev];
      });
    };

    fetchVkPosts();
  }, [currentUser.id]);

  const sendFriendRequest = (toUserId: string) => {
    const request: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const updatedRequests = [...friendRequests, request];
    setFriendRequests(updatedRequests);
    localStorage.setItem('gorkhon_friend_requests', JSON.stringify(updatedRequests));
  };

  const respondToFriendRequest = (requestId: string, response: 'accepted' | 'rejected') => {
    const updatedRequests = friendRequests.map(req => 
      req.id === requestId ? { ...req, status: response } : req
    );
    setFriendRequests(updatedRequests);
    localStorage.setItem('gorkhon_friend_requests', JSON.stringify(updatedRequests));

    if (response === 'accepted') {
      const request = friendRequests.find(r => r.id === requestId);
      if (request && currentSocialUser) {
        // Добавляем в друзья
        const updatedUser = {
          ...currentSocialUser,
          following: [...currentSocialUser.following, request.fromUserId]
        };
        setCurrentSocialUser(updatedUser);
      }
    }
  };

  const createPost = () => {
    if (!newPost.trim() || !currentSocialUser) return;

    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
    setNewPost('');
  };

  const toggleLike = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const postTime = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ч назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} дн назад`;
  };

  const getUserById = (userId: string) => socialUsers.find(u => u.id === userId);

  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигационные табы */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'feed'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="Home" size={18} />
            <span>Лента</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all relative ${
            activeTab === 'friends'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="Users" size={18} />
            <span>Друзья</span>
            {pendingRequests.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{pendingRequests.length}</span>
              </div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="User" size={18} />
            <span>Профиль</span>
          </div>
        </button>
      </div>

      {/* Контент в зависимости от активного таба */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Форма создания поста */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
                {currentUser.avatar}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Что у вас нового?"
                  className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg p-3 min-h-[80px]"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Icon name="Camera" size={16} />
                      <span className="text-sm">Фото</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Icon name="MapPin" size={16} />
                      <span className="text-sm">Место</span>
                    </button>
                  </div>
                  <button
                    onClick={createPost}
                    disabled={!newPost.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Лента постов */}
          <div className="space-y-4">
            {posts.map(post => {
              const author = getUserById(post.authorId);
              if (!author) return null;

              return (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Заголовок поста */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
                        {author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{author.name}</h3>
                          {author.id === 'gorkhon_official' && (
                            <>
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Icon name="Check" size={12} className="text-white" />
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                Официальный
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Содержимое поста */}
                  <div className="p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Изображения */}
                    {post.images && post.images.length > 0 && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img 
                          src={post.images[0]} 
                          alt="Post attachment" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Статистика и кнопки действий */}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-4">
                        {post.likes.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Icon name="Heart" size={14} className="text-red-500" />
                            {post.likes.length}
                          </span>
                        )}
                        {post.comments.length > 0 && (
                          <span>{post.comments.length} комментариев</span>
                        )}
                        {post.shares > 0 && (
                          <span>{post.shares} репостов</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          post.likes.includes(currentUser.id)
                            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon name="Heart" size={16} className={post.likes.includes(currentUser.id) ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">Нравится</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Icon name="MessageCircle" size={16} />
                        <span className="text-sm font-medium">Комментировать</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Icon name="Share" size={16} />
                        <span className="text-sm font-medium">Поделиться</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="space-y-6">
          {/* Заявки в друзья */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Заявки в друзья ({pendingRequests.length})</h3>
              <div className="space-y-3">
                {pendingRequests.map(request => {
                  const sender = getUserById(request.fromUserId);
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
                          onClick={() => respondToFriendRequest(request.id, 'accepted')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Принять
                        </button>
                        <button
                          onClick={() => respondToFriendRequest(request.id, 'rejected')}
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
                          onClick={() => sendFriendRequest(user.id)}
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
      )}

      {activeTab === 'profile' && currentSocialUser && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4">
              {currentSocialUser.avatar}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{currentSocialUser.name}</h2>
            <p className="text-gray-600">{currentSocialUser.bio}</p>
            
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.posts.length}</div>
                <div className="text-sm text-gray-600">публикаций</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.followers.length}</div>
                <div className="text-sm text-gray-600">подписчиков</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.following.length}</div>
                <div className="text-sm text-gray-600">подписок</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="Calendar" size={24} className="text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Присоединился</div>
              <div className="font-medium text-gray-800">
                {new Date(currentSocialUser.registeredAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="MapPin" size={24} className="text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Местоположение</div>
              <div className="font-medium text-gray-800">п. Горхон</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSocialNetwork;
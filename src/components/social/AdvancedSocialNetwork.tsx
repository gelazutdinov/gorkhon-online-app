import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import { SocialUser, SocialPost, FriendRequest } from './types/SocialTypes';
import PostCreator from './components/PostCreator';
import PostItem from './components/PostItem';
import FriendsTab from './components/FriendsTab';
import ProfileTab from './components/ProfileTab';
import SocialNavTabs from './components/SocialNavTabs';

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

  const getUserById = (userId: string) => socialUsers.find(u => u.id === userId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигационные табы */}
      <SocialNavTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        friendRequests={friendRequests}
        currentUser={currentUser}
      />

      {/* Контент в зависимости от активного таба */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Форма создания поста */}
          <PostCreator
            currentUser={currentUser}
            newPost={newPost}
            onPostChange={setNewPost}
            onCreatePost={createPost}
          />

          {/* Лента постов */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                author={getUserById(post.authorId)}
                currentUser={currentUser}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <FriendsTab
          socialUsers={socialUsers}
          currentUser={currentUser}
          currentSocialUser={currentSocialUser}
          friendRequests={friendRequests}
          onSendFriendRequest={sendFriendRequest}
          onRespondToFriendRequest={respondToFriendRequest}
        />
      )}

      {activeTab === 'profile' && currentSocialUser && (
        <ProfileTab currentSocialUser={currentSocialUser} />
      )}
    </div>
  );
};

export default AdvancedSocialNetwork;
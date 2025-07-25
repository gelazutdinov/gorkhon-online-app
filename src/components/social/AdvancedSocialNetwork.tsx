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
  const [postImages, setPostImages] = useState<string[]>([]);
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

      // Загружаем сохраненные данные профиля
      const savedProfile = localStorage.getItem('gorkhon_current_social_user');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setCurrentSocialUser(profile);
        // Обновляем пользователя в списке
        setSocialUsers(prev => 
          prev.map(user => user.id === currentUser.id ? profile : user)
        );
      }
    };

    initializeSocialData();
  }, [currentUser]);

  // Интеграция с ВК виджетом для официальных постов
  useEffect(() => {
    const fetchVkPosts = () => {
      const currentTime = Date.now();
      const vkPosts: SocialPost[] = [
        {
          id: 'vk_post_1',
          authorId: 'gorkhon_official',
          content: '🎉 ДОБРО ПОЖАЛОВАТЬ В СОЦИАЛЬНУЮ СЕТЬ ГОРХОНА!\n\nТеперь жители поселка могут:\n• Делиться новостями и фотографиями\n• Общаться друг с другом\n• Быть в курсе всех событий\n\nПриглашаем всех присоединиться к нашему сообществу! 🏘️',
          images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'],
          timestamp: new Date(currentTime - 30 * 60 * 1000).toISOString(),
          likes: [],
          comments: [],
          shares: 5
        },
        {
          id: 'vk_post_2',
          authorId: 'gorkhon_official',
          content: '📢 РАСПИСАНИЕ РАБОТЫ СЛУЖБ НА ПРАЗДНИКИ\n\n🏪 Магазин: с 9:00 до 18:00\n🏥 Медпункт: с 8:00 до 16:00\n📮 Почта: с 10:00 до 15:00\n\nОстальные службы работают в обычном режиме.',
          timestamp: new Date(currentTime - 2 * 60 * 60 * 1000).toISOString(),
          likes: [],
          comments: [],
          shares: 12
        },
        {
          id: 'vk_post_3',
          authorId: 'gorkhon_official',
          content: '🌟 БЛАГОДАРНОСТЬ ЖИТЕЛЯМ\n\nВыражаем искреннюю благодарность всем жителям поселка за активное участие в благоустройстве территории!\n\nВместе мы делаем наш Горхон еще красивее! 💪',
          images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'],
          timestamp: new Date(currentTime - 4 * 60 * 60 * 1000).toISOString(),
          likes: [],
          comments: [],
          shares: 8
        }
      ];

      setPosts(prev => {
        const existingIds = prev.map(p => p.id);
        const newPosts = vkPosts.filter(p => !existingIds.includes(p.id));
        const updatedPosts = [...newPosts, ...prev];
        
        // Сохраняем в localStorage
        localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
        
        return updatedPosts;
      });
    };

    // Загружаем посты только если их еще нет
    const savedPosts = localStorage.getItem('gorkhon_social_posts');
    if (!savedPosts || JSON.parse(savedPosts).length === 0) {
      fetchVkPosts();
    }
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
      images: postImages.length > 0 ? postImages : undefined,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
    setNewPost('');
    setPostImages([]);

    // Обновляем счетчик постов пользователя
    if (currentSocialUser) {
      const updatedUser = {
        ...currentSocialUser,
        posts: [...currentSocialUser.posts, post.id]
      };
      setCurrentSocialUser(updatedUser);
    }
  };

  const addImageToPost = (image: string) => {
    setPostImages(prev => [...prev, image]);
  };

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));

    // Обновляем счетчик постов пользователя
    if (currentSocialUser) {
      const updatedUser = {
        ...currentSocialUser,
        posts: currentSocialUser.posts.filter(id => id !== postId)
      };
      setCurrentSocialUser(updatedUser);
    }
  };

  const updateProfile = (updates: Partial<SocialUser>) => {
    if (!currentSocialUser) return;

    const updatedUser = { ...currentSocialUser, ...updates };
    setCurrentSocialUser(updatedUser);
    
    // Обновляем в списке пользователей
    setSocialUsers(prev => 
      prev.map(user => user.id === currentUser.id ? updatedUser : user)
    );

    // Сохраняем в localStorage
    localStorage.setItem('gorkhon_current_social_user', JSON.stringify(updatedUser));
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
            onAddImage={addImageToPost}
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
                onDeletePost={deletePost}
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
        <ProfileTab 
          currentSocialUser={currentSocialUser} 
          onUpdateProfile={updateProfile}
        />
      )}
    </div>
  );
};

export default AdvancedSocialNetwork;
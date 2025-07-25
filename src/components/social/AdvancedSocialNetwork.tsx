import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import { 
  SocialUser, 
  SocialPost, 
  FriendRequest, 
  Comment, 
  Story, 
  DirectMessage, 
  Chat 
} from './types/SocialTypes';
import { useVkIntegration } from '@/hooks/useVkIntegration';
import PostCreator from './components/PostCreator';
import PostItem from './components/PostItem';
import FriendsTab from './components/FriendsTab';
import ProfileTab from './components/ProfileTab';
import SocialNavTabs from './components/SocialNavTabs';
import Stories from './components/Stories';
import DirectMessages from './components/DirectMessages';

interface AdvancedSocialNetworkProps {
  currentUser: UserProfile;
}

const AdvancedSocialNetwork = ({ currentUser }: AdvancedSocialNetworkProps) => {
  const [socialUsers, setSocialUsers] = useState<SocialUser[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'messages' | 'profile'>('feed');
  const [currentSocialUser, setCurrentSocialUser] = useState<SocialUser | null>(null);

  // Интеграция с ВК
  const { vkPosts, isLoading: vkLoading, refetchVkPosts } = useVkIntegration();

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
        },
        {
          id: 'user_demo_2',
          name: 'Михаил Иванов',
          email: 'mikhail@example.com',
          phone: '+7 999 987 65 43',
          gender: 'male' as const,
          birthDate: '1980-03-20',
          avatar: '👨',
          interests: ['рыбалка', 'спорт', 'техника'],
          status: 'Активный житель поселка',
          registeredAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
          lastActiveAt: Date.now() - 30 * 60 * 1000,
          stats: {
            totalSessions: 80,
            totalTimeSpent: 2400,
            sectionsVisited: { home: 40, news: 25, support: 10, profile: 15 },
            featuresUsed: { importantNumbers: 8, schedule: 12, donation: 5, workSchedule: 10, pvz: 7, notifications: 15 },
            daysActive: 45
          },
          followers: [],
          following: ['gorkhon_official'],
          posts: [],
          bio: 'Помогаю с организацией спортивных мероприятий ⚽',
          isOnline: true
        }
      ];

      const allUsers = [socialUser, officialAccount, ...demoUsers];
      setSocialUsers(allUsers);
      setCurrentSocialUser(socialUser);

      // Загружаем сохраненные данные
      const savedRequests = localStorage.getItem('gorkhon_friend_requests');
      if (savedRequests) {
        setFriendRequests(JSON.parse(savedRequests));
      }

      const savedPosts = localStorage.getItem('gorkhon_social_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }

      const savedProfile = localStorage.getItem('gorkhon_current_social_user');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setCurrentSocialUser(profile);
        setSocialUsers(prev => 
          prev.map(user => user.id === currentUser.id ? profile : user)
        );
      }

      // Инициализируем чаты
      const demoChats: Chat[] = [
        {
          id: 'chat_1',
          participants: [currentUser.id, 'user_demo_1'],
          lastMessage: {
            id: 'msg_1',
            fromUserId: 'user_demo_1',
            toUserId: currentUser.id,
            content: 'Привет! Как дела в нашем поселке?',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isRead: false
          },
          unreadCount: 1
        }
      ];

      const demoMessages: DirectMessage[] = [
        {
          id: 'msg_1',
          fromUserId: 'user_demo_1',
          toUserId: currentUser.id,
          content: 'Привет! Как дела в нашем поселке?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false
        }
      ];

      setChats(demoChats);
      setMessages(demoMessages);
    };

    initializeSocialData();
  }, [currentUser]);

  // Интеграция постов из ВК
  useEffect(() => {
    if (vkPosts.length > 0) {
      setPosts(prev => {
        const existingIds = prev.map(p => p.id);
        const newVkPosts = vkPosts.filter(p => !existingIds.includes(p.id));
        return [...newVkPosts, ...prev];
      });
    }
  }, [vkPosts]);

  // Функции для работы с постами
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

    if (currentSocialUser) {
      const updatedUser = {
        ...currentSocialUser,
        posts: [...currentSocialUser.posts, post.id]
      };
      setCurrentSocialUser(updatedUser);
    }
  };

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));

    if (currentSocialUser) {
      const updatedUser = {
        ...currentSocialUser,
        posts: currentSocialUser.posts.filter(id => id !== postId)
      };
      setCurrentSocialUser(updatedUser);
    }
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

  const addComment = (postId: string, content: string) => {
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      authorId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      likes: []
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              const hasLiked = comment.likes.includes(currentUser.id);
              return {
                ...comment,
                likes: hasLiked
                  ? comment.likes.filter(id => id !== currentUser.id)
                  : [...comment.likes, currentUser.id]
              };
            }
            return comment;
          })
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
  };

  const deleteComment = (postId: string, commentId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('gorkhon_social_posts', JSON.stringify(updatedPosts));
  };

  // Функции для Stories
  const createStory = (image: string, text?: string) => {
    const story: Story = {
      id: `story_${Date.now()}`,
      authorId: currentUser.id,
      image,
      text,
      timestamp: new Date().toISOString(),
      views: [],
      isActive: true
    };

    setStories(prev => [story, ...prev]);
  };

  const viewStory = (storyId: string) => {
    setStories(prev => 
      prev.map(story => {
        if (story.id === storyId && !story.views.includes(currentUser.id)) {
          return {
            ...story,
            views: [...story.views, currentUser.id]
          };
        }
        return story;
      })
    );
  };

  // Функции для сообщений
  const sendMessage = (toUserId: string, content: string, image?: string) => {
    const message: DirectMessage = {
      id: `msg_${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      content,
      image,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);

    // Обновляем чат или создаем новый
    setChats(prev => {
      const existingChat = prev.find(chat => 
        chat.participants.includes(currentUser.id) && chat.participants.includes(toUserId)
      );

      if (existingChat) {
        return prev.map(chat => 
          chat.id === existingChat.id 
            ? { ...chat, lastMessage: message, unreadCount: 0 }
            : chat
        );
      } else {
        const newChat: Chat = {
          id: `chat_${Date.now()}`,
          participants: [currentUser.id, toUserId],
          lastMessage: message,
          unreadCount: 0
        };
        return [newChat, ...prev];
      }
    });
  };

  const markAsRead = (chatId: string) => {
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setMessages(prev => 
        prev.map(msg => {
          const isInChat = chat.participants.includes(msg.fromUserId) && 
                          chat.participants.includes(msg.toUserId);
          return isInChat && msg.toUserId === currentUser.id
            ? { ...msg, isRead: true }
            : msg;
        })
      );
    }
  };

  // Функции для друзей
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
        const updatedUser = {
          ...currentSocialUser,
          following: [...currentSocialUser.following, request.fromUserId]
        };
        setCurrentSocialUser(updatedUser);
      }
    }
  };

  const updateProfile = (updates: Partial<SocialUser>) => {
    if (!currentSocialUser) return;

    const updatedUser = { ...currentSocialUser, ...updates };
    setCurrentSocialUser(updatedUser);
    
    setSocialUsers(prev => 
      prev.map(user => user.id === currentUser.id ? updatedUser : user)
    );

    localStorage.setItem('gorkhon_current_social_user', JSON.stringify(updatedUser));
  };

  const addImageToPost = (image: string) => {
    setPostImages(prev => [...prev, image]);
  };

  const getUserById = (userId: string) => socialUsers.find(u => u.id === userId);

  // Подсчет непрочитанных сообщений
  const unreadMessagesCount = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигационные табы */}
      <SocialNavTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        friendRequests={friendRequests}
        unreadMessages={unreadMessagesCount}
        currentUser={currentUser}
      />

      {/* Контент в зависимости от активного таба */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Stories */}
          <Stories
            stories={stories}
            currentUser={currentUser}
            socialUsers={socialUsers}
            onCreateStory={createStory}
            onViewStory={viewStory}
          />

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
            {vkLoading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500">Загружаем новости из ВК...</p>
              </div>
            )}
            
            {posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                author={getUserById(post.authorId)}
                currentUser={currentUser}
                socialUsers={socialUsers}
                onToggleLike={toggleLike}
                onDeletePost={deletePost}
                onAddComment={addComment}
                onToggleCommentLike={toggleCommentLike}
                onDeleteComment={deleteComment}
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

      {activeTab === 'messages' && (
        <DirectMessages
          chats={chats}
          messages={messages}
          socialUsers={socialUsers}
          currentUser={currentUser}
          onSendMessage={sendMessage}
          onMarkAsRead={markAsRead}
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
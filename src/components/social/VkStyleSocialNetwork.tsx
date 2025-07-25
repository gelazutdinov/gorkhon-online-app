import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface VkPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
    isOfficial?: boolean;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

interface VkStyleSocialNetworkProps {
  currentUser: UserProfile;
}

const VkStyleSocialNetwork = ({ currentUser }: VkStyleSocialNetworkProps) => {
  const [posts, setPosts] = useState<VkPost[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    // Инициализируем примеры постов
    const officialPosts: VkPost[] = [
      {
        id: 'official_1',
        author: {
          id: 'gorkhon_official',
          name: 'Горхон',
          avatar: '🏘️',
          isVerified: true,
          isOfficial: true
        },
        content: 'Уважаемые жители! Напоминаем о графике работы администрации:\n\nПонедельник-Пятница: 8:00 - 17:00\nОбеденный перерыв: 12:00 - 13:00\nСуббота, Воскресенье: выходной\n\nПо всем вопросам обращайтесь в рабочее время.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 23,
        comments: 5,
        shares: 8,
        isLiked: false
      },
      {
        id: 'official_2',
        author: {
          id: 'gorkhon_official',
          name: 'Горхон',
          avatar: '🏘️',
          isVerified: true,
          isOfficial: true
        },
        content: '🎄 НОВОГОДНИЕ МЕРОПРИЯТИЯ В ГОРХОНЕ\n\n📅 30 декабря, 15:00 - Детский утренник в клубе\n📅 31 декабря, 23:00 - Новогодняя елка на площади\n\nПриглашаем всех жителей! Горячий чай и сладости для детей! ☕🍪',
        images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 45,
        comments: 12,
        shares: 15,
        isLiked: true
      },
      {
        id: 'official_3',
        author: {
          id: 'gorkhon_official',
          name: 'Горхон',
          avatar: '🏘️',
          isVerified: true,
          isOfficial: true
        },
        content: '⚠️ ВНИМАНИЕ!\n\nЗавтра, 26 декабря, с 9:00 до 15:00 планируется отключение электроэнергии на улицах:\n\n• Центральная\n• Молодежная\n• Садовая\n\nПриносим извинения за неудобства.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        likes: 18,
        comments: 8,
        shares: 12,
        isLiked: false
      }
    ];

    setPosts(officialPosts);
  }, []);

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

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const createPost = () => {
    if (!newPost.trim()) return;

    const post: VkPost = {
      id: `user_${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: false,
        isOfficial: false
      },
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Форма создания поста */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green flex items-center justify-center text-lg flex-shrink-0">
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
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gorkhon-pink transition-colors">
                  <Icon name="Camera" size={16} />
                  <span className="text-sm">Фото</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gorkhon-pink transition-colors">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">Место</span>
                </button>
              </div>
              <button
                onClick={createPost}
                disabled={!newPost.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Лента постов */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Заголовок поста */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                  {post.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    {post.author.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                    )}
                    {post.author.isOfficial && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        Официальный
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Icon name="MoreHorizontal" size={20} />
                </button>
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
                  {post.likes > 0 && (
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={14} className="text-red-500" />
                      {post.likes}
                    </span>
                  )}
                  {post.comments > 0 && (
                    <span>{post.comments} комментариев</span>
                  )}
                  {post.shares > 0 && (
                    <span>{post.shares} репостов</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    post.isLiked 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon name="Heart" size={16} className={post.isLiked ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">Нравится</span>
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <Icon name="MessageCircle" size={16} />
                  <span className="text-sm font-medium">Комментировать</span>
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <Icon name="Share" size={16} />
                  <span className="text-sm font-medium">Поделиться</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VkStyleSocialNetwork;
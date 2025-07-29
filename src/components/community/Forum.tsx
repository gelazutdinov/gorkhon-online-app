import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  replies: number;
  likes: number;
  category: string;
  isSticky?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: ForumPost[];
  color: string;
}

const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });

  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'Общие вопросы',
      description: 'Обсуждение повседневных вопросов жизни в Горхоне',
      icon: 'MessageSquare',
      color: 'bg-blue-100 text-blue-700',
      posts: [
        {
          id: '1',
          title: 'Режим работы аптеки',
          content: 'Подскажите, пожалуйста, когда работает аптека в центре поселка?',
          author: 'Мария К.',
          timestamp: new Date('2024-07-28T10:30:00'),
          replies: 3,
          likes: 5,
          category: 'general'
        },
        {
          id: '2',
          title: 'Проблемы с водоснабжением',
          content: 'Уже третий день проблемы с водой на улице Школьной. Кто-нибудь знает причину?',
          author: 'Владимир С.',
          timestamp: new Date('2024-07-29T08:15:00'),
          replies: 7,
          likes: 12,
          category: 'general',
          isSticky: true
        }
      ]
    },
    {
      id: 'transport',
      name: 'Транспорт',
      description: 'Расписание автобусов, попутчики, транспортные вопросы',
      icon: 'Bus',
      color: 'bg-green-100 text-green-700',
      posts: [
        {
          id: '3',
          title: 'Поиск попутчиков до Улан-Удэ',
          content: 'Завтра 30 июля еду в Улан-Удэ на 14:00 автобусе. Есть свободные места в машине.',
          author: 'Андрей П.',
          timestamp: new Date('2024-07-29T14:20:00'),
          replies: 1,
          likes: 3,
          category: 'transport'
        }
      ]
    },
    {
      id: 'trade',
      name: 'Торговля',
      description: 'Покупка, продажа, обмен товаров между жителями',
      icon: 'ShoppingBag',
      color: 'bg-purple-100 text-purple-700',
      posts: [
        {
          id: '4',
          title: 'Продам картофель',
          content: 'Свежий картофель, собственное хозяйство. 50 руб/кг. Звонить: 8-xxx-xxx-xxxx',
          author: 'Николай И.',
          timestamp: new Date('2024-07-28T16:45:00'),
          replies: 2,
          likes: 8,
          category: 'trade'
        }
      ]
    },
    {
      id: 'events',
      name: 'События и мероприятия',
      description: 'Анонсы мероприятий, праздники, культурные события',
      icon: 'Calendar',
      color: 'bg-orange-100 text-orange-700',
      posts: [
        {
          id: '5',
          title: 'День поселка - 15 августа',
          content: 'Готовимся к празднованию Дня поселка! Концерт, ярмарка, спортивные соревнования.',
          author: 'Администрация',
          timestamp: new Date('2024-07-25T12:00:00'),
          replies: 15,
          likes: 25,
          category: 'events',
          isSticky: true
        }
      ]
    },
    {
      id: 'help',
      name: 'Взаимопомощь',
      description: 'Помощь соседям, волонтерство, добрые дела',
      icon: 'Heart',
      color: 'bg-red-100 text-red-700',
      posts: [
        {
          id: '6',
          title: 'Нужна помощь пожилой соседке',
          content: 'Ищу волонтеров для помощи пожилой женщине с покупками и уборкой.',
          author: 'Елена В.',
          timestamp: new Date('2024-07-29T09:30:00'),
          replies: 4,
          likes: 18,
          category: 'help'
        }
      ]
    }
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'только что';
    if (hours < 24) return `${hours}ч назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) return;
    
    // Здесь была бы логика сохранения поста
    console.log('Новый пост:', newPost);
    setNewPost({ title: '', content: '', category: '' });
    setShowNewPost(false);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Заголовок форума */}
      <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">💬 Форум жителей Горхона</h1>
            <p className="text-white/90">Обсуждайте, делитесь опытом, помогайте друг другу</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon name="Plus" size={20} />
            <span className="hidden sm:inline">Создать тему</span>
          </button>
        </div>
      </div>

      {!selectedCategory ? (
        /* Список категорий */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${category.color}`}>
                  <Icon name={category.icon as any} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="MessageSquare" size={16} />
                      {category.posts.length} тем
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      {category.posts.reduce((sum, post) => sum + post.replies, 0)} ответов
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Просмотр категории */
        <div className="space-y-4">
          {/* Навигация назад */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-gorkhon-pink hover:text-gorkhon-green transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад к разделам
          </button>

          {/* Заголовок категории */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${selectedCategoryData?.color}`}>
                <Icon name={selectedCategoryData?.icon as any} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedCategoryData?.name}</h2>
                <p className="text-gray-600">{selectedCategoryData?.description}</p>
              </div>
            </div>
          </div>

          {/* Список постов */}
          <div className="space-y-3">
            {selectedCategoryData?.posts
              .sort((a, b) => (b.isSticky ? 1 : 0) - (a.isSticky ? 1 : 0))
              .map((post) => (
              <div
                key={post.id}
                className={`bg-white rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl ${
                  post.isSticky 
                    ? 'border-gorkhon-pink bg-gradient-to-r from-pink-50 to-white' 
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {post.isSticky && (
                      <div className="bg-gorkhon-pink text-white px-2 py-1 rounded-full text-xs font-medium">
                        📌 Закреплено
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(post.timestamp)}</span>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={16} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MessageCircle" size={16} />
                      {post.replies} ответов
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-gorkhon-pink hover:text-gorkhon-green transition-colors">
                    <Icon name="Heart" size={16} />
                    {post.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно создания поста */}
      {showNewPost && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewPost(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">✍️ Создать новую тему</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                >
                  <option value="">Выберите категорию...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Заголовок темы</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Кратко опишите суть вопроса..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Подробно расскажите о вашем вопросе или предложении..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content || !newPost.category}
                  className="flex-1 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Опубликовать
                </button>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
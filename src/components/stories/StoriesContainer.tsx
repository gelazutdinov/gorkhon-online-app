import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Story {
  id: string;
  title: string;
  content: string;
  backgroundImage?: string;
  backgroundColor: string;
  icon: string;
  createdAt: number;
  expiresAt: number;
}

const StoriesContainer = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Инициализируем stories при загрузке
  useEffect(() => {
    const now = Date.now();
    const expiryTime = now + (24 * 60 * 60 * 1000); // 24 часа

    // Проверяем, есть ли уже stories в localStorage
    const savedStories = localStorage.getItem('app-stories');
    if (savedStories) {
      const parsed = JSON.parse(savedStories);
      // Фильтруем только не истекшие stories
      const activeStories = parsed.filter((story: Story) => story.expiresAt > now);
      setStories(activeStories);
    } else {
      // Создаем новую story о погоде
      const weatherStory: Story = {
        id: 'weather-beta-release',
        title: '🌤️ Новая функция!',
        content: 'Теперь доступна погода в Горхоне на основе данных Гидрометеоцентра Бурятии. Попробуйте прямо сейчас!',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        icon: 'CloudSun',
        createdAt: now,
        expiresAt: expiryTime
      };
      
      setStories([weatherStory]);
      localStorage.setItem('app-stories', JSON.stringify([weatherStory]));
    }
  }, []);

  // Очистка истекших stories каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const activeStories = stories.filter(story => story.expiresAt > now);
      
      if (activeStories.length !== stories.length) {
        setStories(activeStories);
        localStorage.setItem('app-stories', JSON.stringify(activeStories));
      }
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [stories]);

  const openStory = (story: Story) => {
    setActiveStory(story);
    setIsModalOpen(true);
  };

  const closeStory = () => {
    setActiveStory(null);
    setIsModalOpen(false);
  };

  const getTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    return hours > 0 ? `${hours}ч` : 'Скоро исчезнет';
  };

  const getProgressPercentage = (createdAt: number, expiresAt: number) => {
    const now = Date.now();
    const total = expiresAt - createdAt;
    const elapsed = now - createdAt;
    return Math.min((elapsed / total) * 100, 100);
  };

  if (stories.length === 0) {
    return null;
  }

  return (
    <>
      {/* Stories Ring */}
      <div className="flex space-x-4 px-4 py-3 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => openStory(story)}
            className="flex-shrink-0 cursor-pointer"
          >
            {/* Story Avatar with Progress Ring */}
            <div className="relative">
              {/* Progress Ring */}
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-xl"
                    style={{ background: story.backgroundColor }}
                  >
                    <Icon name={story.icon} size={24} />
                  </div>
                </div>
              </div>
              
              {/* Platform Logo Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-xs font-bold">🚀</span>
              </div>
            </div>
            
            {/* Story Label */}
            <p className="text-xs text-gray-600 mt-1 text-center w-16 truncate">
              {getTimeRemaining(story.expiresAt)}
            </p>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {isModalOpen && activeStory && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white bg-opacity-30">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: `${getProgressPercentage(activeStory.createdAt, activeStory.expiresAt)}%` 
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={closeStory}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
          >
            <Icon name="X" size={24} />
          </button>

          {/* Story Content */}
          <div 
            className="h-full flex items-center justify-center text-white p-8"
            style={{ background: activeStory.backgroundColor }}
          >
            <div className="text-center max-w-sm">
              {/* Story Icon */}
              <div className="mb-6">
                <Icon name={activeStory.icon} size={80} className="mx-auto opacity-90" />
              </div>

              {/* Story Title */}
              <h2 className="text-3xl font-bold mb-4">
                {activeStory.title}
              </h2>

              {/* Story Content */}
              <p className="text-lg opacity-90 leading-relaxed mb-8">
                {activeStory.content}
              </p>

              {/* Call to Action */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    closeStory();
                    // Переключаемся на вкладку погоды
                    const event = new CustomEvent('navigate-to-weather');
                    window.dispatchEvent(event);
                  }}
                  className="w-full bg-white text-gray-900 py-3 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Посмотреть погоду 🌤️
                </button>
                
                <button
                  onClick={closeStory}
                  className="w-full border border-white border-opacity-50 text-white py-3 px-6 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Позже
                </button>
              </div>

              {/* Time Remaining */}
              <p className="text-sm opacity-60 mt-6">
                Исчезнет через {getTimeRemaining(activeStory.expiresAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesContainer;
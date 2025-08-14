import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Story {
  id: string;
  title: string;
  backgroundImage: string;
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
        title: 'Теперь и погода есть',
        backgroundImage: 'https://cdn.poehali.dev/files/458c390f-ac64-41e1-bb68-f699667bb38b.png',
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
                    className="w-full h-full rounded-full bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url(${story.backgroundImage})` }}
                  >
                    {/* Overlay with icon */}
                    <div className="w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                      <Icon name="CloudSun" size={20} className="text-white opacity-90" />
                    </div>
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

      {/* Story Modal - Fullscreen with proper mobile aspect ratio */}
      {isModalOpen && activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Story Container with aspect ratio 9:16 (1080x1920) */}
          <div 
            className="relative w-full h-full max-w-[540px]"
            style={{
              backgroundImage: `url(${activeStory.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-white bg-opacity-30 rounded-full">
              <div 
                className="h-full bg-white transition-all duration-100 rounded-full"
                style={{ 
                  width: `${getProgressPercentage(activeStory.createdAt, activeStory.expiresAt)}%` 
                }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black bg-opacity-20 rounded-full p-2"
            >
              <Icon name="X" size={20} />
            </button>

            {/* Bottom Action Area - positioned to not overlap with bottom navigation (80px from bottom) */}
            <div className="absolute bottom-20 left-4 right-4 pb-4">
              <button
                onClick={() => {
                  closeStory();
                  // Переключаемся на вкладку погоды
                  const event = new CustomEvent('navigate-to-weather');
                  window.dispatchEvent(event);
                }}
                className="w-full bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 py-4 px-6 rounded-2xl font-medium hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              >
                Посмотреть погоду 🌤️
              </button>
            </div>

            {/* Skip button */}
            <button
              onClick={closeStory}
              className="absolute bottom-24 right-6 text-white text-sm opacity-70 hover:opacity-100 transition-opacity bg-black bg-opacity-20 px-3 py-1 rounded-full"
            >
              Пропустить
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesContainer;
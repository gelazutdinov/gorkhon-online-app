import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализируем stories при загрузке
  useEffect(() => {
    const now = Date.now();
    const STORY_ID = 'weather-beta-release-gorhon-online';
    
    // Проверяем localStorage на наличие этой stories
    const savedStories = localStorage.getItem('platform-stories');
    let existingStories: Story[] = [];
    
    if (savedStories) {
      try {
        existingStories = JSON.parse(savedStories);
        // Фильтруем только не истекшие stories
        existingStories = existingStories.filter(story => story.expiresAt > now);
      } catch (e) {
        console.error('Ошибка парсинга stories из localStorage:', e);
        existingStories = [];
      }
    }
    
    // Проверяем, есть ли уже наша story
    const hasWeatherStory = existingStories.some(story => story.id === STORY_ID);
    
    if (!hasWeatherStory) {
      // Создаем новую story если её еще нет
      const expiryTime = now + (24 * 60 * 60 * 1000); // 24 часа
      const weatherStory: Story = {
        id: STORY_ID,
        title: 'Теперь и погода есть',
        backgroundImage: 'https://cdn.poehali.dev/files/458c390f-ac64-41e1-bb68-f699667bb38b.png',
        createdAt: now,
        expiresAt: expiryTime
      };
      
      existingStories.push(weatherStory);
      console.log('🚀 Новая Stories создана для всех пользователей:', weatherStory);
    } else {
      console.log('📱 Stories уже существует, показываем существующую');
    }
    
    // Сохраняем и устанавливаем stories
    localStorage.setItem('platform-stories', JSON.stringify(existingStories));
    setStories(existingStories);
  }, []);

  // Очистка истекших stories каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const activeStories = stories.filter(story => story.expiresAt > now);
      
      if (activeStories.length !== stories.length) {
        setStories(activeStories);
        localStorage.setItem('platform-stories', JSON.stringify(activeStories));
        
        if (activeStories.length === 0) {
          console.log('🗑️ Все Stories истекли и были удалены');
        } else {
          console.log(`📱 Удалено ${stories.length - activeStories.length} истекших Stories`);
        }
      }
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [stories]);

  const openStory = (story: Story) => {
    console.log('🎬 Открываем Stories:', story);
    setActiveStory(story);
    setIsModalOpen(true);
    
    // Очищаем предыдущий таймер если есть
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current);
    }
    
    // Автозакрытие через 15 секунд
    storyTimerRef.current = setTimeout(() => {
      console.log('⏰ Автозакрытие Stories через 15 сек');
      closeStory();
    }, 15000);
  };

  const closeStory = () => {
    console.log('❌ Закрываем Stories');
    setActiveStory(null);
    setIsModalOpen(false);
    
    // Очищаем таймер при закрытии
    if (storyTimerRef.current) {
      clearTimeout(storyTimerRef.current);
      storyTimerRef.current = null;
    }
  };

  const getTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Истекла';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else if (minutes > 0) {
      return `${minutes}м`;
    } else {
      return 'Меньше минуты';
    }
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
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                <img 
                  src="https://cdn.poehali.dev/files/b249e2e9-d1e0-4ed3-b2a4-7e16c50cade7.png" 
                  alt="Verified" 
                  className="w-4 h-4"
                />
              </div>
            </div>
            
            {/* Story Label */}
            <p className="text-xs text-gray-600 mt-1 text-center w-16 truncate">
              Горхон.Online
            </p>
          </div>
        ))}
      </div>

      {/* Story Modal - Rendered in portal to ensure it's on top */}
      {isModalOpen && activeStory && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeStory}
        >
          {/* Story Container with mobile aspect ratio 9:16 for all devices */}
          <div 
            className="relative w-full h-full max-w-[400px] max-h-[711px] sm:w-[400px] sm:h-[711px] rounded-lg overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `url(${activeStory.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '9/16'
            }}
            onClick={(e) => e.stopPropagation()}
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

            {/* Close Button - back to top right */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black bg-opacity-20 rounded-full p-2"
            >
              <Icon name="X" size={20} />
            </button>

            {/* Bottom Action Area - positioned at the very bottom */}
            <div className="absolute bottom-6 left-4 right-4">
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
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default StoriesContainer;
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';

interface Story {
  id: string;
  title: string;
  backgroundImage: string;
  createdAt: number;
  expiresAt: number;
  action?: string;
  buttonText?: string;
  icon?: string;
}

const StoriesContainer = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализируем stories при загрузке
  useEffect(() => {
    const now = Date.now();
    
    // Проверяем localStorage на наличие stories
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
    
    // Список доступных stories
    const availableStories = [
      {
        id: 'weather-beta-release-gorhon-online',
        title: 'Теперь и погода есть',
        backgroundImage: 'https://cdn.poehali.dev/files/458c390f-ac64-41e1-bb68-f699667bb38b.png',
        icon: 'CloudSun',
        buttonText: 'Посмотреть погоду 🌤️',
        action: 'navigate-to-weather'
      },
      {
        id: 'mobile-optimization-update-v2',
        title: 'Мобильная версия обновлена',
        backgroundImage: '/img/20c99e19-6bd9-45e0-84c2-39933305af97.jpg',
        icon: 'Smartphone',
        buttonText: 'Попробовать сейчас! 📱',
        action: 'close-story'
      }
    ];
    
    // Проверяем, какие stories нужно добавить
    availableStories.forEach(storyTemplate => {
      const hasThisStory = existingStories.some(story => story.id === storyTemplate.id);
      
      if (!hasThisStory) {
        // Создаем новую story
        const expiryTime = now + (24 * 60 * 60 * 1000); // 24 часа
        const newStory: Story = {
          id: storyTemplate.id,
          title: storyTemplate.title,
          backgroundImage: storyTemplate.backgroundImage,
          createdAt: now,
          expiresAt: expiryTime,
          action: storyTemplate.action,
          buttonText: storyTemplate.buttonText,
          icon: storyTemplate.icon
        };
        
        existingStories.push(newStory);
        console.log('🚀 Новая Stories создана:', newStory);
      }
    });
    
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
      {/* VK-style Stories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-3 md:mb-4">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => openStory(story)}
              className="flex-shrink-0 cursor-pointer flex flex-col items-center"
            >
              {/* VK-style Story Avatar */}
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5" style={{background: `linear-gradient(to bottom right, #F1117E, #E10E73)`}}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <div 
                      className="w-full h-full rounded-full bg-cover bg-center overflow-hidden"
                      style={{ backgroundImage: `url(${story.backgroundImage})` }}
                    >
                      <div className="w-full h-full bg-black bg-opacity-10 flex items-center justify-center">
                        <Icon name={story.icon as any || "CloudSun"} size={14} className="md:w-4 md:h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* VK-style Online Badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* VK-style Story Label */}
              <p className="text-xs text-gray-700 mt-1 md:mt-2 text-center w-12 md:w-14 truncate font-medium">
                Горхон
              </p>
            </div>
          ))}
        </div>
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
                  if (activeStory.action === 'navigate-to-weather') {
                    // Переключаемся на вкладку погоды
                    const event = new CustomEvent('navigate-to-weather');
                    window.dispatchEvent(event);
                  }
                  // Если action === 'close-story', то просто закрываем
                }}
                className="w-full bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 py-4 px-6 rounded-2xl font-medium hover:bg-opacity-100 transition-all duration-200 shadow-lg"
              >
                {activeStory.buttonText || 'Закрыть'}
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
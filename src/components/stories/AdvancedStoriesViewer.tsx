import { useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Story, TextElement, StickerElement } from './advanced-types';
import { filters } from './advanced-constants';

interface AdvancedStoriesViewerProps {
  stories: Story[];
  selectedStoryIndex: number;
  progress: number;
  selectedFilter: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  setProgress: (progress: number) => void;
}

const AdvancedStoriesViewer = ({
  stories,
  selectedStoryIndex,
  progress,
  selectedFilter,
  onClose,
  onPrevious,
  onNext,
  setProgress
}: AdvancedStoriesViewerProps) => {
  const currentStory = stories[selectedStoryIndex];

  const renderTextElement = (textEl: TextElement) => {
    const sizeClasses = {
      small: 'text-lg',
      medium: 'text-2xl',
      large: 'text-4xl'
    };

    const animationClasses = {
      fade: 'animate-fade-in',
      slide: 'animate-slide-in',
      pulse: 'animate-pulse',
      rotate: 'animate-spin',
      zoom: 'animate-zoom-in'
    };

    return (
      <div
        key={textEl.id}
        className={`absolute cursor-move ${sizeClasses[textEl.size]} ${animationClasses[textEl.animation || 'fade']}`}
        style={{
          left: `${textEl.x}%`,
          top: `${textEl.y}%`,
          color: textEl.color,
          fontFamily: textEl.style === 'classic' ? 'Arial' :
                     textEl.style === 'modern' ? 'Helvetica' :
                     textEl.style === 'neon' ? 'Impact' :
                     textEl.style === 'typewriter' ? 'Courier' : 'Arial',
          fontWeight: textEl.style === 'modern' ? '300' : 'bold',
          letterSpacing: textEl.style === 'modern' ? '2px' : 'normal',
          textShadow: textEl.style === 'neon' ? `0 0 10px ${textEl.color}` :
                     textEl.style === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
          background: textEl.style === 'gradient' ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'none',
          WebkitBackgroundClip: textEl.style === 'gradient' ? 'text' : 'initial',
          WebkitTextFillColor: textEl.style === 'gradient' ? 'transparent' : 'initial'
        }}
      >
        {textEl.text}
      </div>
    );
  };

  const renderStickerElement = (sticker: StickerElement) => {
    return (
      <div
        key={sticker.id}
        className="absolute cursor-move"
        style={{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          transform: `rotate(${sticker.rotation || 0}deg) scale(${sticker.size})`,
          fontSize: sticker.type === 'emoji' ? '2rem' : '1.2rem'
        }}
      >
        {sticker.content}
      </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [selectedStoryIndex, setProgress, onNext]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black">
        {/* Прогресс бар */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Заголовок */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm overflow-hidden">
              {currentStory.userAvatar.startsWith('data:') ? (
                <img src={currentStory.userAvatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                currentStory.userAvatar
              )}
            </div>
            <div>
              <span className="text-white font-medium text-sm">
                {currentStory.userName}
              </span>
              <div className="text-white/70 text-xs">
                {Math.floor((Date.now() - currentStory.timestamp.getTime()) / (1000 * 60))}м
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Контент истории */}
        <div className="w-full h-full relative overflow-hidden">
          <img 
            src={currentStory.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: selectedFilter === 'none' ? 'none' : filters.find(f => f.name === selectedFilter)?.filter }}
          />
          
          {/* Градиент для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
          
          {/* Текстовые элементы */}
          {currentStory.text?.map(renderTextElement)}
          
          {/* Стикеры */}
          {currentStory.stickers?.map(renderStickerElement)}

          {/* Музыкальный виджет */}
          {currentStory.music && (
            <div className="absolute bottom-20 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <span className="text-lg">{currentStory.music.cover}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">
                    {currentStory.music.title}
                  </div>
                  <div className="text-white/70 text-xs">
                    {currentStory.music.artist}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Контролы навигации */}
          <div className="absolute inset-0 flex">
            <div 
              className="flex-1 h-full"
              onClick={onPrevious}
            />
            <div 
              className="flex-1 h-full"
              onClick={onNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStoriesViewer;
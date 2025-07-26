import { useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  text?: TextElement[];
  stickers?: StickerElement[];
  music?: MusicElement;
  timestamp: Date;
  viewed: boolean;
}

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  style: 'classic' | 'modern' | 'neon' | 'typewriter' | 'shadow' | 'gradient';
  color: string;
  size: 'small' | 'medium' | 'large';
  animation?: 'fade' | 'slide' | 'pulse' | 'rotate' | 'zoom';
}

interface StickerElement {
  id: string;
  type: 'emoji' | 'location' | 'time' | 'weather' | 'poll' | 'mention' | 'hashtag' | 'gif';
  content: string;
  x: number;
  y: number;
  size: number;
  rotation?: number;
}

interface MusicElement {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
}

interface AdvancedInstagramStoriesProps {
  currentUser?: any;
}

const AdvancedInstagramStories = ({ currentUser }: AdvancedInstagramStoriesProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  
  // Story Creator State
  const [creatorStep, setCreatorStep] = useState<'capture' | 'edit'>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [stickerElements, setStickerElements] = useState<StickerElement[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicElement | null>(null);
  const [activeTextEditor, setActiveTextEditor] = useState<string | null>(null);
  const [activeStickerPanel, setActiveStickerPanel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filters = [
    { name: 'none', label: 'Оригинал', filter: 'none' },
    { name: 'vivid', label: 'Яркий', filter: 'saturate(1.5) contrast(1.2)' },
    { name: 'vintage', label: 'Винтаж', filter: 'sepia(0.8) contrast(1.2)' },
    { name: 'bw', label: 'Ч/Б', filter: 'grayscale(1)' },
    { name: 'warm', label: 'Теплый', filter: 'hue-rotate(15deg) saturate(1.3)' },
    { name: 'cool', label: 'Холодный', filter: 'hue-rotate(-15deg) saturate(1.1)' },
    { name: 'dramatic', label: 'Драма', filter: 'contrast(1.5) brightness(0.9)' }
  ];

  const textStyles = [
    { id: 'classic', name: 'Классик', style: 'font-family: Arial; font-weight: bold;' },
    { id: 'modern', name: 'Модерн', style: 'font-family: Helvetica; font-weight: 300; letter-spacing: 2px;' },
    { id: 'neon', name: 'Неон', style: 'font-family: Impact; text-shadow: 0 0 10px currentColor;' },
    { id: 'typewriter', name: 'Печатная', style: 'font-family: Courier; font-weight: bold;' },
    { id: 'shadow', name: 'С тенью', style: 'font-family: Arial; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);' },
    { id: 'gradient', name: 'Градиент', style: 'font-family: Arial; font-weight: bold; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' }
  ];

  const stickerCategories = {
    emoji: ['😍', '🔥', '💯', '🎉', '❤️', '😂', '🙌', '✨', '💪', '🌟', '👏', '🥳', '😎', '💕', '🌈', '⚡'],
    location: ['📍 Горхон', '🏠 Дом', '🏢 Работа', '🌲 Парк', '🏪 Магазин', '🚌 Остановка'],
    time: ['🕐 Сейчас', '⏰ Утром', '🌅 Рассвет', '🌇 Закат', '🌙 Вечером', '⭐ Ночью'],
    weather: ['☀️ Солнечно', '☁️ Облачно', '🌧️ Дождь', '❄️ Снег', '🌪️ Ветрено', '🌈 После дождя'],
    poll: ['📊 Да/Нет', '🗳️ Опрос', '❓ Вопрос', '📈 Рейтинг'],
    mention: ['@друг', '@admin', '@семья'],
    hashtag: ['#горхон', '#дом', '#семья', '#природа', '#отдых', '#работа']
  };

  const musicTracks = [
    { id: '1', title: 'Летний день', artist: 'Местная группа', cover: '🎵', duration: 30 },
    { id: '2', title: 'Вечер в Горхоне', artist: 'Фольклор', cover: '🎶', duration: 45 },
    { id: '3', title: 'Природа зовет', artist: 'Инструментал', cover: '🎼', duration: 60 },
    { id: '4', title: 'Дружеские встречи', artist: 'Популярное', cover: '🎤', duration: 30 }
  ];

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setCreatorStep('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newText: TextElement = {
      id: Date.now().toString(),
      text: 'Новый текст',
      x: 50,
      y: 50,
      style: 'classic',
      color: '#ffffff',
      size: 'medium',
      animation: 'fade'
    };
    setTextElements([...textElements, newText]);
    setActiveTextEditor(newText.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const addSticker = (category: string, content: string) => {
    const newSticker: StickerElement = {
      id: Date.now().toString(),
      type: category as any,
      content,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      size: 1,
      rotation: 0
    };
    setStickerElements([...stickerElements, newSticker]);
    setActiveStickerPanel(null);
  };

  const publishStory = () => {
    if (!capturedImage || !currentUser) return;

    const newStory: Story = {
      id: Date.now().toString(),
      userId: currentUser.id || 'user',
      userName: currentUser.name || 'Пользователь',
      userAvatar: currentUser.avatar || '👤',
      image: capturedImage,
      text: textElements,
      stickers: stickerElements,
      music: selectedMusic || undefined,
      timestamp: new Date(),
      viewed: false
    };

    setStories([...stories, newStory]);
    
    // Сбрасываем состояние
    setShowStoryCreator(false);
    setCreatorStep('capture');
    setCapturedImage('');
    setTextElements([]);
    setStickerElements([]);
    setSelectedMusic(null);
    setSelectedFilter('none');
    setActiveTextEditor(null);
    setActiveStickerPanel(null);
  };

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSelectedStoryIndex(null);
          return 0;
        }
        return prev + 1;
      });
    }, 50);
  };

  const closeStoryViewer = () => {
    setSelectedStoryIndex(null);
    setProgress(0);
  };

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
        onClick={() => setActiveTextEditor(textEl.id)}
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

  return (
    <div className="space-y-4">
      {/* Горизонтальный скролл историй */}
      <div className="flex gap-3 overflow-x-auto pb-2 px-1">
        {/* Кнопка добавления истории */}
        {currentUser && (
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowStoryCreator(true)}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-16 h-16">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center border-2 border-white shadow-md">
                  <Icon name="Plus" size={24} className="text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-600 max-w-[70px] truncate">Создать</span>
            </button>
          </div>
        )}

        {/* Пользовательские истории */}
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0">
            <button
              onClick={() => openStoryViewer(index)}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-16 h-16">
                <div className={`w-full h-full rounded-full p-0.5 ${
                  story.viewed 
                    ? 'bg-gray-300' 
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <div 
                      className="w-full h-full rounded-full bg-cover bg-center flex items-center justify-center text-xl overflow-hidden"
                      style={{ 
                        backgroundImage: story.userAvatar.startsWith('http') || story.userAvatar.startsWith('data:') 
                          ? `url(${story.userAvatar})` : undefined
                      }}
                    >
                      {!story.userAvatar.startsWith('http') && !story.userAvatar.startsWith('data:') && story.userAvatar}
                    </div>
                  </div>
                </div>
                {/* Индикатор музыки */}
                {story.music && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Icon name="Music" size={12} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 max-w-[70px] truncate">{story.userName}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Просмотрщик историй */}
      {selectedStoryIndex !== null && (
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
                  {stories[selectedStoryIndex].userAvatar.startsWith('data:') ? (
                    <img src={stories[selectedStoryIndex].userAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    stories[selectedStoryIndex].userAvatar
                  )}
                </div>
                <div>
                  <span className="text-white font-medium text-sm">
                    {stories[selectedStoryIndex].userName}
                  </span>
                  <div className="text-white/70 text-xs">
                    {Math.floor((Date.now() - stories[selectedStoryIndex].timestamp.getTime()) / (1000 * 60))}м
                  </div>
                </div>
              </div>
              <button
                onClick={closeStoryViewer}
                className="text-white/80 hover:text-white"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            {/* Контент истории */}
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={stories[selectedStoryIndex].image}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: selectedFilter === 'none' ? 'none' : filters.find(f => f.name === selectedFilter)?.filter }}
              />
              
              {/* Градиент для читаемости */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
              
              {/* Текстовые элементы */}
              {stories[selectedStoryIndex].text?.map(renderTextElement)}
              
              {/* Стикеры */}
              {stories[selectedStoryIndex].stickers?.map(renderStickerElement)}

              {/* Музыкальный виджет */}
              {stories[selectedStoryIndex].music && (
                <div className="absolute bottom-20 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                      <span className="text-lg">{stories[selectedStoryIndex].music?.cover}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">
                        {stories[selectedStoryIndex].music?.title}
                      </div>
                      <div className="text-white/70 text-xs">
                        {stories[selectedStoryIndex].music?.artist}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Контролы навигации */}
              <div className="absolute inset-0 flex">
                <div 
                  className="flex-1 h-full"
                  onClick={() => {
                    if (selectedStoryIndex > 0) {
                      setSelectedStoryIndex(selectedStoryIndex - 1);
                      setProgress(0);
                    }
                  }}
                />
                <div 
                  className="flex-1 h-full"
                  onClick={() => {
                    if (selectedStoryIndex < stories.length - 1) {
                      setSelectedStoryIndex(selectedStoryIndex + 1);
                      setProgress(0);
                    } else {
                      closeStoryViewer();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Создатель историй */}
      {showStoryCreator && (
        <div className="fixed inset-0 bg-black z-50">
          {creatorStep === 'capture' ? (
            // Этап захвата фото
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between p-4 text-white">
                <button onClick={() => setShowStoryCreator(false)}>
                  <Icon name="X" size={24} />
                </button>
                <h3 className="font-semibold">Создать историю</h3>
                <div></div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-white space-y-6">
                  <div className="w-32 h-32 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Camera" size={48} className="text-white/70" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Добавьте фото</h4>
                    <p className="text-white/70">Выберите фото из галереи или сделайте снимок</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageCapture}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="block w-48 mx-auto py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Выбрать из галереи
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Этап редактирования
            <div className="w-full h-full flex flex-col">
              {/* Верхняя панель */}
              <div className="flex items-center justify-between p-4 text-white bg-black/50 backdrop-blur-sm">
                <button onClick={() => setCreatorStep('capture')}>
                  <Icon name="ArrowLeft" size={24} />
                </button>
                <h3 className="font-semibold">Редактировать</h3>
                <button
                  onClick={publishStory}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-medium"
                >
                  Опубликовать
                </button>
              </div>

              {/* Превью */}
              <div className="flex-1 relative overflow-hidden">
                <img 
                  src={capturedImage}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: selectedFilter === 'none' ? 'none' : filters.find(f => f.name === selectedFilter)?.filter }}
                />
                
                {/* Текстовые элементы */}
                {textElements.map(renderTextElement)}
                
                {/* Стикеры */}
                {stickerElements.map(renderStickerElement)}

                {/* Музыкальный виджет */}
                {selectedMusic && (
                  <div className="absolute bottom-20 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        <span className="text-lg">{selectedMusic.cover}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {selectedMusic.title}
                        </div>
                        <div className="text-white/70 text-xs">
                          {selectedMusic.artist}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedMusic(null)}
                        className="text-white/70 hover:text-white"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Нижняя панель инструментов */}
              <div className="bg-black/90 backdrop-blur-sm p-4">
                {/* Фильтры */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {filters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => setSelectedFilter(filter.name)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedFilter === filter.name
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/30'
                      }`}
                      style={{ 
                        backgroundImage: `url(${capturedImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: filter.filter
                      }}
                    />
                  ))}
                </div>

                {/* Основные инструменты */}
                <div className="flex items-center justify-around text-white">
                  <button
                    onClick={addTextElement}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Type" size={20} />
                    </div>
                    <span className="text-xs">Текст</span>
                  </button>

                  <button
                    onClick={() => setActiveStickerPanel(activeStickerPanel ? null : 'emoji')}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Smile" size={20} />
                    </div>
                    <span className="text-xs">Стикеры</span>
                  </button>

                  <button
                    onClick={() => setActiveStickerPanel(activeStickerPanel === 'music' ? null : 'music')}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Music" size={20} />
                    </div>
                    <span className="text-xs">Музыка</span>
                  </button>

                  <button
                    onClick={() => setActiveStickerPanel(activeStickerPanel === 'location' ? null : 'location')}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="MapPin" size={20} />
                    </div>
                    <span className="text-xs">Место</span>
                  </button>

                  <button
                    onClick={() => setActiveStickerPanel(activeStickerPanel === 'gif' ? null : 'gif')}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Image" size={20} />
                    </div>
                    <span className="text-xs">GIF</span>
                  </button>
                </div>
              </div>

              {/* Панели редактирования */}
              {/* Текстовый редактор */}
              {activeTextEditor && (
                <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={textElements.find(t => t.id === activeTextEditor)?.text || ''}
                      onChange={(e) => updateTextElement(activeTextEditor, { text: e.target.value })}
                      className="w-full bg-white/20 text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/30"
                      placeholder="Введите текст"
                    />
                    
                    {/* Стили текста */}
                    <div className="flex gap-2 overflow-x-auto">
                      {textStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateTextElement(activeTextEditor, { style: style.id as any })}
                          className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
                            textElements.find(t => t.id === activeTextEditor)?.style === style.id
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/20 text-white/70'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>

                    {/* Цвета */}
                    <div className="flex gap-2">
                      {['#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateTextElement(activeTextEditor, { color })}
                          className="w-8 h-8 rounded-full border-2 border-white/50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTextEditor(null)}
                      className="w-full py-2 bg-purple-500 text-white rounded-lg"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              )}

              {/* Панель стикеров */}
              {activeStickerPanel && activeStickerPanel !== 'music' && (
                <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-3">
                    {stickerCategories[activeStickerPanel as keyof typeof stickerCategories]?.map((sticker, index) => (
                      <button
                        key={index}
                        onClick={() => addSticker(activeStickerPanel!, sticker)}
                        className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
                      >
                        <span className="text-xl">{sticker}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Панель музыки */}
              {activeStickerPanel === 'music' && (
                <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {musicTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setSelectedMusic(track);
                          setActiveStickerPanel(null);
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                          <span className="text-lg">{track.cover}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{track.title}</div>
                          <div className="text-white/70 text-xs">{track.artist}</div>
                        </div>
                        <div className="text-white/50 text-xs">{track.duration}с</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedInstagramStories;
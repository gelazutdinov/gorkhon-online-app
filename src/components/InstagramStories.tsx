import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

interface StoryElement {
  id: string;
  type: 'text' | 'sticker' | 'music';
  content: string;
  x: number;
  y: number;
  style?: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    textAlign?: string;
    animation?: string;
    textShadow?: string;
    background?: string;
  };
  stickerType?: string;
}

interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  elements: StoryElement[];
  filter: string;
  music?: {
    title: string;
    artist: string;
    duration: number;
    cover: string;
  };
}

const INITIAL_USERS: User[] = [
  {
    id: 'current_user',
    username: 'Ваша история',
    avatar: 'https://cdn.poehali.dev/files/fd12f1e7-210f-419c-a05c-e739fb08162d.jpg',
    hasStory: false,
    isViewed: false,
  }
];

const STICKER_CATEGORIES = {
  'Местоположение': [
    { id: 'loc_gorkhon', emoji: '📍', text: 'Горхон' },
    { id: 'loc_home', emoji: '🏠', text: 'Дом' },
    { id: 'loc_work', emoji: '🏢', text: 'Работа' },
    { id: 'loc_park', emoji: '🌲', text: 'Парк' },
    { id: 'loc_shop', emoji: '🏪', text: 'Магазин' },
    { id: 'loc_stop', emoji: '🚌', text: 'Остановка' }
  ],
  'Упоминание': [
    { id: 'mention_friend', emoji: '@', text: 'друг' },
    { id: 'mention_admin', emoji: '@', text: 'admin' },
    { id: 'mention_family', emoji: '@', text: 'семья' }
  ],
  'Музыка': [
    { id: 'music_note', emoji: '🎵', text: 'Музыка' },
    { id: 'music_dance', emoji: '💃', text: 'Танцы' },
    { id: 'music_party', emoji: '🎉', text: 'Вечеринка' }
  ],
  'Фото': [
    { id: 'photo_camera', emoji: '📷', text: 'Фото' },
    { id: 'photo_selfie', emoji: '🤳', text: 'Селфи' },
    { id: 'photo_memories', emoji: '📸', text: 'Воспоминания' }
  ],
  'GIF': [
    { id: 'gif_fire', emoji: '🔥', text: 'Fire' },
    { id: 'gif_heart', emoji: '❤️', text: 'Love' },
    { id: 'gif_laugh', emoji: '😂', text: 'LOL' }
  ],
  'Ваш ответ': [
    { id: 'response_yes', emoji: '✅', text: 'Да' },
    { id: 'response_no', emoji: '❌', text: 'Нет' },
    { id: 'response_maybe', emoji: '🤔', text: 'Может быть' }
  ],
  'Рамки': [
    { id: 'frame_1', emoji: '🖼️', text: 'Рамка 1', image: 'https://cdn.poehali.dev/files/b20af71f-0789-4747-8abb-7106428db9fe.jpg' },
    { id: 'frame_2', emoji: '🎨', text: 'Рамка 2' },
    { id: 'frame_3', emoji: '✨', text: 'Рамка 3' }
  ],
  'Размытие': [
    { id: 'blur_soft', emoji: '🌫️', text: 'Мягкое' },
    { id: 'blur_strong', emoji: '💨', text: 'Сильное' }
  ],
  'Вопросы': [
    { id: 'question_poll', emoji: '📊', text: 'Опрос' },
    { id: 'question_quiz', emoji: '❓', text: 'Викторина' },
    { id: 'question_ask', emoji: '💭', text: 'Задать вопрос' }
  ],
  'Вырезки': [
    { id: 'cut_heart', emoji: '💖', text: 'Сердце' },
    { id: 'cut_star', emoji: '⭐', text: 'Звезда' },
    { id: 'cut_circle', emoji: '⭕', text: 'Круг' }
  ],
  'Уведомить': [
    { id: 'notify_bell', emoji: '🔔', text: 'Напомнить' },
    { id: 'notify_alert', emoji: '⚠️', text: 'Важно' }
  ],
  'Шаблоны "Ваш ответ"': [
    { id: 'template_rate', emoji: '⭐', text: 'Оценить' },
    { id: 'template_choose', emoji: '🎯', text: 'Выбрать' }
  ],
  'Опрос': [
    { id: 'poll_ab', emoji: '🗳️', text: 'А или Б' },
    { id: 'poll_scale', emoji: '📊', text: 'Шкала' }
  ],
  'Ссылка': [
    { id: 'link_url', emoji: '🔗', text: 'Ссылка' },
    { id: 'link_site', emoji: '🌐', text: 'Сайт' }
  ],
  'Хэштег': [
    { id: 'hashtag_trend', emoji: '#', text: 'хэштег' },
    { id: 'hashtag_popular', emoji: '#', text: 'тренд' }
  ],
  'Обратный отсчет': [
    { id: 'countdown_timer', emoji: '⏰', text: 'Таймер' },
    { id: 'countdown_event', emoji: '📅', text: 'Событие' }
  ],
  'Текст': [
    { id: 'text_classic', emoji: 'Аа', text: 'Классический' },
    { id: 'text_modern', emoji: 'Аа', text: 'Современный' },
    { id: 'text_neon', emoji: 'Аа', text: 'Неоновый' }
  ],
  'Заказы еды': [
    { id: 'food_pizza', emoji: '🍕', text: 'Пицца' },
    { id: 'food_burger', emoji: '🍔', text: 'Бургер' },
    { id: 'food_sushi', emoji: '🍣', text: 'Суши' }
  ]
};

const MUSIC_TRACKS = [
  {
    id: 'track_1',
    title: 'Летний день',
    artist: 'Местная группа',
    duration: 30,
    cover: '🎵'
  },
  {
    id: 'track_2', 
    title: 'Вечер в Горхоне',
    artist: 'Фольклор',
    duration: 45,
    cover: '🎶'
  },
  {
    id: 'track_3',
    title: 'Природа зовет',
    artist: 'Инструментал',
    duration: 60,
    cover: '🌲'
  },
  {
    id: 'track_4',
    title: 'Дружеские встречи',
    artist: 'Популярное',
    duration: 30,
    cover: '🎉'
  }
];

const PHOTO_FILTERS = [
  { id: 'original', name: 'Оригинал', className: '' },
  { id: 'vivid', name: 'Яркий', className: 'filter-vivid' },
  { id: 'vintage', name: 'Винтаж', className: 'filter-vintage' },
  { id: 'bw', name: 'Ч/Б', className: 'filter-bw' },
  { id: 'warm', name: 'Теплый', className: 'filter-warm' },
  { id: 'cool', name: 'Холодный', className: 'filter-cool' },
  { id: 'dramatic', name: 'Драма', className: 'filter-dramatic' }
];

const TEXT_STYLES = [
  { id: 'classic', name: 'Классик', style: { fontFamily: 'Arial, sans-serif', fontWeight: 'bold' } },
  { id: 'modern', name: 'Модерн', style: { fontFamily: 'Helvetica, sans-serif', fontWeight: '300', letterSpacing: '2px' } },
  { id: 'neon', name: 'Неон', style: { fontFamily: 'Impact, sans-serif', textShadow: '0 0 10px currentColor' } },
  { id: 'typewriter', name: 'Печатная', style: { fontFamily: 'Courier, monospace' } },
  { id: 'shadow', name: 'С тенью', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } },
  { id: 'gradient', name: 'Градиент', style: { background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }
];

const TEXT_COLORS = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', 
  '#F9CA24', '#F0932B', '#EB4D4B', '#6C5CE7', '#A29BFE'
];

const TEXT_ANIMATIONS = [
  { id: 'fade', name: 'Fade', className: 'animate-fade-in' },
  { id: 'slide', name: 'Slide', className: 'animate-slide-in' },
  { id: 'pulse', name: 'Pulse', className: 'animate-pulse' },
  { id: 'rotate', name: 'Rotate', className: 'animate-spin' },
  { id: 'zoom', name: 'Zoom', className: 'animate-zoom-in' }
];

const InstagramStories: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentView, setCurrentView] = useState<'main' | 'create' | 'edit' | 'view'>('main');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // Creation/editing state
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const [activePanel, setActivePanel] = useState<'filters' | 'text' | 'stickers' | 'music' | null>('filters');
  
  // Text editing
  const [textInput, setTextInput] = useState('');
  const [selectedTextStyle, setSelectedTextStyle] = useState('classic');
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF');
  const [selectedTextSize, setSelectedTextSize] = useState(24);
  const [selectedTextAnimation, setSelectedTextAnimation] = useState('');
  
  // Music
  const [selectedMusic, setSelectedMusic] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUsers(prev => prev.map(user => 
        user.id === 'current_user' 
          ? { ...user, avatar: savedAvatar }
          : user
      ));
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        
        // Save as user avatar
        localStorage.setItem('userAvatar', imageUrl);
        setUsers(prev => prev.map(user => 
          user.id === 'current_user' 
            ? { ...user, avatar: imageUrl, hasStory: true }
            : user
        ));
        
        setCurrentView('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    if (!textInput.trim()) return;
    
    const newElement: StoryElement = {
      id: Date.now().toString(),
      type: 'text',
      content: textInput,
      x: 50,
      y: 30,
      style: {
        fontSize: selectedTextSize,
        color: selectedTextColor,
        ...TEXT_STYLES.find(s => s.id === selectedTextStyle)?.style,
        animation: selectedTextAnimation
      }
    };
    
    setStoryElements(prev => [...prev, newElement]);
    setTextInput('');
    setActivePanel(null);
  };

  const addStickerElement = (sticker: any) => {
    const newElement: StoryElement = {
      id: Date.now().toString(),
      type: 'sticker',
      content: sticker.text,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      stickerType: sticker.emoji
    };
    
    setStoryElements(prev => [...prev, newElement]);
    setActivePanel(null);
  };

  const addMusicElement = (track: any) => {
    setSelectedMusic(track);
    setActivePanel(null);
  };

  const publishStory = () => {
    if (!selectedImage) return;
    
    const newStory: Story = {
      id: Date.now().toString(),
      userId: 'current_user',
      imageUrl: selectedImage,
      timestamp: Date.now(),
      elements: storyElements,
      filter: selectedFilter,
      music: selectedMusic
    };
    
    setStories(prev => [...prev, newStory]);
    setUsers(prev => prev.map(user => 
      user.id === 'current_user' 
        ? { ...user, hasStory: true }
        : user
    ));
    
    // Reset state
    setCurrentView('main');
    setSelectedImage('');
    setStoryElements([]);
    setSelectedMusic(null);
    setSelectedFilter('original');
  };

  const viewStory = (userId: string) => {
    const userStories = stories.filter(s => s.userId === userId);
    if (userStories.length > 0) {
      setSelectedStory(userStories[0]);
      setCurrentStoryIndex(0);
      setCurrentView('view');
    }
  };

  if (currentView === 'view' && selectedStory) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-[progress_5s_linear_forwards]" />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 mt-6">
          <div className="flex items-center gap-3">
            <img 
              src={users.find(u => u.id === selectedStory.userId)?.avatar} 
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-white/50"
            />
            <div>
              <p className="text-white text-sm font-medium">
                {users.find(u => u.id === selectedStory.userId)?.username}
              </p>
              <p className="text-white/70 text-xs">
                {Math.floor((Date.now() - selectedStory.timestamp) / 1000 / 60)}м
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('main')}
            className="text-white hover:bg-white/20"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Story Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={selectedStory.imageUrl}
            alt="Story"
            className={`w-full h-full object-cover ${PHOTO_FILTERS.find(f => f.id === selectedStory.filter)?.className || ''}`}
          />
          
          {/* Story Elements */}
          {selectedStory.elements.map(element => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {element.type === 'text' && (
                <div
                  className={`text-center px-3 py-1 rounded ${element.style?.animation || ''}`}
                  style={element.style}
                >
                  {element.content}
                </div>
              )}
              {element.type === 'sticker' && (
                <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-sm">
                  <span>{element.stickerType}</span>
                  <span className="text-gray-800">{element.content}</span>
                </div>
              )}
            </div>
          ))}

          {/* Music Widget */}
          {selectedStory.music && (
            <div className="absolute bottom-20 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">{selectedStory.music.cover}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{selectedStory.music.title}</p>
                <p className="text-white/70 text-xs">{selectedStory.music.artist}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          onClick={() => setCurrentView('main')}
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-10"
          onClick={() => setCurrentView('main')}
        />
      </div>
    );
  }

  if (currentView === 'edit' && selectedImage) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('create')}
            className="text-white hover:bg-white/20"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-white font-medium">Редактировать</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={publishStory}
            className="text-white hover:bg-white/20"
          >
            Опубликовать
          </Button>
        </div>

        {/* Story Preview */}
        <div className="relative w-full h-full pt-16 pb-32">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage}
              alt="Story preview"
              className={`w-full h-full object-cover ${PHOTO_FILTERS.find(f => f.id === selectedFilter)?.className || ''}`}
            />
            
            {/* Story Elements */}
            {storyElements.map(element => (
              <div
                key={element.id}
                className="absolute cursor-move"
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {element.type === 'text' && (
                  <div
                    className={`text-center px-3 py-1 rounded ${element.style?.animation || ''}`}
                    style={element.style}
                  >
                    {element.content}
                  </div>
                )}
                {element.type === 'sticker' && (
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-sm">
                    <span>{element.stickerType}</span>
                    <span className="text-gray-800">{element.content}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Music Widget */}
            {selectedMusic && (
              <div className="absolute bottom-20 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">{selectedMusic.cover}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{selectedMusic.title}</p>
                  <p className="text-white/70 text-xs">{selectedMusic.artist}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMusic(null)}
                  className="text-white hover:bg-white/20 ml-2"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        {activePanel === 'filters' && (
          <div className="absolute bottom-32 left-0 right-0 p-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {PHOTO_FILTERS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedFilter === filter.id ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={selectedImage}
                    alt={filter.name}
                    className={`w-full h-full object-cover ${filter.className}`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tools Bar */}
        <div className="absolute bottom-16 left-4 right-4 flex justify-center gap-6">
          <Button
            variant={activePanel === 'text' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActivePanel(activePanel === 'text' ? null : 'text')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="Type" size={20} />
            <span className="text-xs">Текст</span>
          </Button>
          <Button
            variant={activePanel === 'stickers' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActivePanel(activePanel === 'stickers' ? null : 'stickers')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="Smile" size={20} />
            <span className="text-xs">Стикеры</span>
          </Button>
          <Button
            variant={activePanel === 'music' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActivePanel(activePanel === 'music' ? null : 'music')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Icon name="Music" size={20} />
            <span className="text-xs">Музыка</span>
          </Button>
        </div>

        {/* Text Panel */}
        {activePanel === 'text' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl">
            <div className="space-y-4">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Введите текст..."
                className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20"
              />
              
              <div className="flex gap-2 overflow-x-auto">
                {TEXT_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedTextStyle(style.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm ${
                      selectedTextStyle === style.id ? 'bg-white text-black' : 'bg-white/20 text-white'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {TEXT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedTextColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedTextColor === color ? 'border-white' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <Button onClick={addTextElement} className="w-full">
                Готово
              </Button>
            </div>
          </div>
        )}

        {/* Stickers Panel */}
        {activePanel === 'stickers' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
                <div key={category}>
                  <h3 className="text-white font-medium mb-2">{category}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {stickers.map(sticker => (
                      <button
                        key={sticker.id}
                        onClick={() => addStickerElement(sticker)}
                        className="flex items-center gap-2 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                      >
                        <span>{sticker.emoji}</span>
                        <span className="text-sm">{sticker.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Music Panel */}
        {activePanel === 'music' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl">
            <div className="space-y-3">
              {MUSIC_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => addMusicElement(track)}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white hover:bg-white/20"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{track.cover}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-white/70">{track.artist} • {track.duration}с</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'create') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
            <Icon name="Camera" size={48} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-medium">Создать историю</h2>
          <p className="text-white/70 text-sm max-w-xs">
            Выберите фото или видео из галереи, чтобы создать новую историю
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Icon name="Image" size={20} className="mr-2" />
              Выбрать из галереи
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView('main')}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    );
  }

  // Main Stories View
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Instagram Stories
      </h1>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {users.map(user => (
          <div key={user.id} className="flex-shrink-0 text-center">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full p-1 ${
                  user.hasStory 
                    ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' 
                    : 'bg-gray-300'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full bg-white p-0.5"
                />
              </div>
              
              {user.id === 'current_user' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon name="Plus" size={16} />
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mt-2 max-w-[80px] truncate">
              {user.username}
            </p>
            
            {user.hasStory && user.id !== 'current_user' && (
              <button
                onClick={() => viewStory(user.id)}
                className="w-full mt-1"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto" />
              </button>
            )}
            
            {user.hasStory && user.id === 'current_user' && (
              <button
                onClick={() => viewStory(user.id)}
                className="text-xs text-blue-500 mt-1 hover:underline"
              >
                Посмотреть
              </button>
            )}
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Camera" size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Пока нет историй</p>
          <p className="text-sm">Создайте свою первую историю!</p>
        </div>
      )}
    </div>
  );
};

export default InstagramStories;
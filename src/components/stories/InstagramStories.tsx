import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  text?: string;
  timestamp: Date;
  viewed: boolean;
}

interface InstagramStoriesProps {
  currentUser?: any;
}

const InstagramStories = ({ currentUser }: InstagramStoriesProps) => {
  const [stories] = useState<Story[]>([
    {
      id: '1',
      userId: 'admin',
      userName: 'Администрация',
      userAvatar: '🏛️',
      image: '/img/c1976793-03c4-406c-b0f6-33dc852d0c05.jpg',
      text: 'Новое в поселке Горхон',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      viewed: false
    },
    {
      id: '2', 
      userId: 'weather',
      userName: 'Погода',
      userAvatar: '🌤️',
      image: '/img/936f13b2-9e6a-4623-be27-ebc3620009a1.jpg',
      text: 'Сегодня +23°C',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      viewed: false
    },
    {
      id: '3',
      userId: 'transport',
      userName: 'Транспорт',
      userAvatar: '🚌',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
      text: 'Автобус в 14:30',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      viewed: false
    }
  ]);

  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState<string>('');
  const [newStoryText, setNewStoryText] = useState('');

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setProgress(0);
    
    // Автопрогресс для просмотра истории
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSelectedStoryIndex(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

  const closeStoryViewer = () => {
    setSelectedStoryIndex(null);
    setProgress(0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewStoryImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createStory = () => {
    if (!newStoryImage) return;
    
    // В реальном приложении здесь была бы отправка на сервер
    console.log('Создание истории:', { image: newStoryImage, text: newStoryText });
    
    // Закрываем создатель
    setShowStoryCreator(false);
    setNewStoryImage('');
    setNewStoryText('');
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
              <span className="text-xs text-gray-600 max-w-[70px] truncate">Добавить</span>
            </button>
          </div>
        )}

        {/* Истории */}
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
                      className="w-full h-full rounded-full bg-cover bg-center flex items-center justify-center text-2xl"
                      style={{ 
                        backgroundImage: story.userAvatar.startsWith('http') ? `url(${story.userAvatar})` : undefined,
                        backgroundColor: story.userAvatar.startsWith('http') ? undefined : '#f3f4f6'
                      }}
                    >
                      {!story.userAvatar.startsWith('http') && story.userAvatar}
                    </div>
                  </div>
                </div>
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                  {stories[selectedStoryIndex].userAvatar}
                </div>
                <div>
                  <span className="text-white font-medium text-sm">
                    {stories[selectedStoryIndex].userName}
                  </span>
                  <div className="text-white/70 text-xs">
                    {Math.floor((Date.now() - stories[selectedStoryIndex].timestamp.getTime()) / (1000 * 60 * 60))}ч
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
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${stories[selectedStoryIndex].image})` }}
            >
              {/* Градиент для читаемости текста */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
              
              {/* Текст истории */}
              {stories[selectedStoryIndex].text && (
                <div className="absolute bottom-20 left-4 right-4">
                  <p className="text-white text-lg font-medium leading-tight">
                    {stories[selectedStoryIndex].text}
                  </p>
                </div>
              )}

              {/* Контролы навигации (невидимые области для тапа) */}
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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Создать историю</h3>
              <button
                onClick={() => setShowStoryCreator(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Загрузка изображения */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors"
                >
                  {newStoryImage ? (
                    <img 
                      src={newStoryImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Icon name="ImagePlus" size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Выберите фото</span>
                    </>
                  )}
                </button>
              </div>

              {/* Текст */}
              <div>
                <textarea
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  placeholder="Добавьте подпись..."
                  className="w-full h-20 p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStoryCreator(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={createStory}
                  disabled={!newStoryImage}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramStories;
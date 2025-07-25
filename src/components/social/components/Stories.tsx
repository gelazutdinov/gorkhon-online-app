import { useState, useRef } from 'react';
import { Story, SocialUser } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface StoriesProps {
  stories: Story[];
  currentUser: UserProfile;
  socialUsers: SocialUser[];
  onCreateStory: (image: string, text?: string) => void;
  onViewStory: (storyId: string) => void;
}

const Stories = ({ stories, currentUser, socialUsers, onCreateStory, onViewStory }: StoriesProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = () => {
    if (selectedImage) {
      onCreateStory(selectedImage, storyText);
      setShowCreateModal(false);
      setSelectedImage(null);
      setStoryText('');
    }
  };

  const getUserById = (userId: string) => 
    socialUsers.find(u => u.id === userId);

  // Группируем истории по авторам
  const storiesGrouped = stories.reduce((acc, story) => {
    const author = getUserById(story.authorId);
    if (author && story.isActive) {
      if (!acc[story.authorId]) {
        acc[story.authorId] = {
          author,
          stories: []
        };
      }
      acc[story.authorId].stories.push(story);
    }
    return acc;
  }, {} as Record<string, { author: SocialUser; stories: Story[] }>);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {/* Кнопка создания истории */}
          <div className="flex flex-col items-center min-w-[80px]">
            <button
              onClick={() => setShowCreateModal(true)}
              className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
            >
              <Icon name="Plus" size={24} className="text-gray-400" />
            </button>
            <span className="text-xs text-gray-600 mt-2 text-center">Ваша история</span>
          </div>

          {/* Истории пользователей */}
          {Object.values(storiesGrouped).map(({ author, stories: userStories }) => (
            <div key={author.id} className="flex flex-col items-center min-w-[80px]">
              <button
                onClick={() => onViewStory(userStories[0].id)}
                className="relative"
              >
                {author.avatar.startsWith('data:') ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-gradient-to-r from-pink-500 to-orange-500 p-0.5"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white text-xl border-3">
                    {author.avatar}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </button>
              <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {author.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно создания истории */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Создать историю</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Выбор изображения */}
              {!selectedImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
                >
                  <Icon name="Camera" size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-600">Выберите фото</span>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Story preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              )}

              {/* Текст истории */}
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Добавьте подпись к истории..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows={3}
              />

              {/* Кнопки */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateStory}
                  disabled={!selectedImage}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
};

export default Stories;
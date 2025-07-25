import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import { useState, useRef } from 'react';

interface PostCreatorProps {
  currentUser: UserProfile;
  newPost: string;
  onPostChange: (content: string) => void;
  onCreatePost: () => void;
  onAddImage?: (image: string) => void;
}

const PostCreator = ({ currentUser, newPost, onPostChange, onCreatePost, onAddImage }: PostCreatorProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setSelectedImages(prev => [...prev, imageUrl]);
            if (onAddImage) {
              onAddImage(imageUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    onCreatePost();
    setSelectedImages([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
          {currentUser.avatar}
        </div>
        <div className="flex-1">
          <textarea
            value={newPost}
            onChange={(e) => onPostChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Что у вас нового?"
            className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            rows={isExpanded ? 4 : 2}
          />
          
          {/* Предпросмотр изображений */}
          {selectedImages.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Загруженное изображение ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <Icon name="Camera" size={16} />
                <span className="text-sm">Фото</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
                <Icon name="MapPin" size={16} />
                <span className="text-sm">Место</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-600 transition-colors px-3 py-2 rounded-lg hover:bg-yellow-50">
                <Icon name="Smile" size={16} />
                <span className="text-sm">Эмоции</span>
              </button>
            </div>
            <div className="flex gap-2">
              {isExpanded && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onPostChange('');
                    setSelectedImages([]);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Отмена
                </button>
              )}
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default PostCreator;
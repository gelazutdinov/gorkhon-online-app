import { useRef } from 'react';
import Icon from '@/components/ui/icon';

interface AdvancedStoriesCreatorProps {
  onImageCapture: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

const AdvancedStoriesCreator = ({ onImageCapture, onClose }: AdvancedStoriesCreatorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={onClose}>
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
              onChange={onImageCapture}
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
  );
};

export default AdvancedStoriesCreator;
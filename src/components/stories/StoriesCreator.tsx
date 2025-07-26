import React, { useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface StoriesCreatorProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const StoriesCreator: React.FC<StoriesCreatorProps> = ({
  onImageUpload,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            onClick={onCancel}
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
        onChange={onImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default StoriesCreator;
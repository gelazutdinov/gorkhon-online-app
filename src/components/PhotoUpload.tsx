import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoData: string) => void;
  className?: string;
}

const PhotoUpload = ({ currentPhoto, onPhotoChange, className = '' }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Создаем canvas для изменения размера
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Определяем новый размер (макс 300x300, сохраняя пропорции)
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        // Устанавливаем размер canvas
        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение с новым размером
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64 с сжатием
        const compressedData = canvas.toDataURL('image/jpeg', 0.8);
        onPhotoChange(compressedData);
        setIsUploading(false);
      };

      img.onerror = () => {
        setError('Ошибка при загрузке изображения');
        setIsUploading(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setError('Ошибка при чтении файла');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="photo-upload"
      />

      {currentPhoto ? (
        <div className="relative group">
          <img
            src={currentPhoto}
            alt="Фото профиля"
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center gap-2">
            <label
              htmlFor="photo-upload"
              className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              title="Изменить фото"
            >
              <Icon name="Camera" size={16} className="text-gray-700" />
            </label>
            <button
              onClick={handleRemovePhoto}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Удалить фото"
            >
              <Icon name="Trash2" size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="photo-upload"
          className="w-full h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-full cursor-pointer group"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
          ) : (
            <>
              <Icon 
                name="Camera" 
                size={24} 
                className="text-gray-400 group-hover:text-gray-600 transition-colors mb-1" 
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-700">
                Загрузить фото
              </span>
            </>
          )}
        </label>
      )}

      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 flex items-center gap-1">
            <Icon name="AlertCircle" size={14} />
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
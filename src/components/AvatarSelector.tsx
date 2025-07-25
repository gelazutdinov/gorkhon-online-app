import { useState } from 'react';
import Icon from '@/components/ui/icon';
import PhotoUpload from '@/components/PhotoUpload';

interface AvatarSelectorProps {
  selectedAvatar: string;
  gender: 'male' | 'female';
  onAvatarSelect: (avatar: string) => void;
}

const AvatarSelector = ({ selectedAvatar, gender, onAvatarSelect }: AvatarSelectorProps) => {
  const [showSelector, setShowSelector] = useState(false);

  const maleAvatars = [
    { id: 'default_male', emoji: '👨', name: 'Базовый мужской' },
    { id: 'businessman', emoji: '👨‍💼', name: 'Деловой' },
    { id: 'worker', emoji: '👨‍🔧', name: 'Рабочий' },
    { id: 'farmer', emoji: '👨‍🌾', name: 'Фермер' },
    { id: 'teacher', emoji: '👨‍🏫', name: 'Учитель' },
    { id: 'doctor', emoji: '👨‍⚕️', name: 'Врач' },
    { id: 'artist', emoji: '👨‍🎨', name: 'Художник' },
    { id: 'chef', emoji: '👨‍🍳', name: 'Повар' },
    { id: 'oldman', emoji: '👴', name: 'Пожилой' },
    { id: 'boy', emoji: '👦', name: 'Подросток' }
  ];

  const femaleAvatars = [
    { id: 'default_female', emoji: '👩', name: 'Базовый женский' },
    { id: 'businesswoman', emoji: '👩‍💼', name: 'Деловая' },
    { id: 'worker_woman', emoji: '👩‍🔧', name: 'Рабочая' },
    { id: 'farmer_woman', emoji: '👩‍🌾', name: 'Фермер' },
    { id: 'teacher_woman', emoji: '👩‍🏫', name: 'Учитель' },
    { id: 'doctor_woman', emoji: '👩‍⚕️', name: 'Врач' },
    { id: 'artist_woman', emoji: '👩‍🎨', name: 'Художник' },
    { id: 'chef_woman', emoji: '👩‍🍳', name: 'Повар' },
    { id: 'oldwoman', emoji: '👵', name: 'Пожилая' },
    { id: 'girl', emoji: '👧', name: 'Подросток' }
  ];

  const avatars = gender === 'male' ? maleAvatars : femaleAvatars;
  const currentAvatar = avatars.find(a => a.id === selectedAvatar) || avatars[0];
  const isPhotoUploaded = selectedAvatar.startsWith('data:');

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Аватар
      </label>
      
      <button
        type="button"
        onClick={() => setShowSelector(!showSelector)}
        className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-xl hover:border-gorkhon-pink focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-2xl overflow-hidden">
          {isPhotoUploaded ? (
            <img 
              src={selectedAvatar} 
              alt="Фото профиля" 
              className="w-full h-full object-cover"
            />
          ) : (
            currentAvatar.emoji
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-800">
            {isPhotoUploaded ? 'Ваше фото' : currentAvatar.name}
          </div>
          <div className="text-sm text-gray-500">Нажмите, чтобы изменить</div>
        </div>
        <Icon name={showSelector ? 'ChevronUp' : 'ChevronDown'} size={20} className="text-gray-400" />
      </button>

      {showSelector && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Выберите аватар ({gender === 'male' ? 'мужской' : 'женский'}):
            </div>
            
            {/* Загрузка фото */}
            <div className="mb-4 flex items-center gap-3">
              <div className="w-20 h-20">
                <PhotoUpload
                  currentPhoto={isPhotoUploaded ? selectedAvatar : undefined}
                  onPhotoChange={(photo) => {
                    onAvatarSelect(photo || `default_${gender}`);
                    if (photo) setShowSelector(false);
                  }}
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-700">Загрузить своё фото</div>
                <div className="text-xs text-gray-500">JPG, PNG до 5MB</div>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="text-sm text-gray-600 mb-2">Или выберите готовый аватар:</div>
              <div className="grid grid-cols-2 gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    onAvatarSelect(avatar.id);
                    setShowSelector(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                    selectedAvatar === avatar.id
                      ? 'bg-gorkhon-pink/10 border-2 border-gorkhon-pink'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="text-2xl">{avatar.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{avatar.name}</div>
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
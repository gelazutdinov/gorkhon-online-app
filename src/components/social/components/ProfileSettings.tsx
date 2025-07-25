import { useState, useRef } from 'react';
import { SocialUser } from '../types/SocialTypes';
import Icon from '@/components/ui/icon';

interface ProfileSettingsProps {
  currentSocialUser: SocialUser;
  onUpdateProfile: (updates: Partial<SocialUser>) => void;
}

const ProfileSettings = ({ currentSocialUser, onUpdateProfile }: ProfileSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentSocialUser.name);
  const [bio, setBio] = useState(currentSocialUser.bio || '');
  const [avatar, setAvatar] = useState(currentSocialUser.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile({
      name,
      bio,
      avatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentSocialUser.name);
    setBio(currentSocialUser.bio || '');
    setAvatar(currentSocialUser.avatar);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Настройки профиля</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Icon name="Edit" size={16} />
            <span>Редактировать</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Аватар */}
        <div className="text-center">
          <div className="relative inline-block">
            {avatar.startsWith('data:') ? (
              <img
                src={avatar}
                alt="Аватар"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto border-4 border-gray-200">
                {avatar}
              </div>
            )}
            
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Icon name="Camera" size={16} />
              </button>
            )}
          </div>
          
          {isEditing && (
            <p className="text-sm text-gray-500 mt-2">
              Нажмите на камеру, чтобы изменить фото
            </p>
          )}
        </div>

        {/* Имя */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Имя
          </label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ваше имя"
            />
          ) : (
            <p className="text-gray-800">{name}</p>
          )}
        </div>

        {/* Биография */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            О себе
          </label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Расскажите о себе..."
            />
          ) : (
            <p className="text-gray-800">{bio || 'Информация не указана'}</p>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{currentSocialUser.posts.length}</div>
            <div className="text-sm text-gray-600">публикаций</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{currentSocialUser.followers.length}</div>
            <div className="text-sm text-gray-600">подписчиков</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{currentSocialUser.following.length}</div>
            <div className="text-sm text-gray-600">подписок</div>
          </div>
        </div>
      </div>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  );
};

export default ProfileSettings;
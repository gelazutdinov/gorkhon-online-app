import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface ProfileSettingsProps {
  user: UserProfile;
  onUserUpdate?: (user: UserProfile) => void;
  onClose: () => void;
}

const ProfileSettings = ({ user, onUserUpdate, onClose }: ProfileSettingsProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    // Если у пользователя загруженное фото (base64), то selectedAvatar должен быть этим фото
    if (user.avatar && user.avatar.startsWith('data:')) {
      return user.avatar;
    }
    // Иначе используем avatar ID или по умолчанию
    return user.avatar || 'default_male';
  });
  
  const [customAvatar, setCustomAvatar] = useState<string>(() => {
    // Если у пользователя загруженное фото, сохраняем его в customAvatar
    return user.avatar && user.avatar.startsWith('data:') ? user.avatar : '';
  });
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarOptions = [
    { id: 'default_male', emoji: '👨', label: 'Мужчина' },
    { id: 'default_female', emoji: '👩', label: 'Женщина' },
    { id: 'businessman', emoji: '👨‍💼', label: 'Бизнесмен' },
    { id: 'businesswoman', emoji: '👩‍💼', label: 'Бизнесвумен' },
    { id: 'worker', emoji: '👨‍🔧', label: 'Рабочий' },
    { id: 'worker_woman', emoji: '👩‍🔧', label: 'Рабочая' },
    { id: 'farmer', emoji: '👨‍🌾', label: 'Фермер' },
    { id: 'farmer_woman', emoji: '👩‍🌾', label: 'Фермерша' },
    { id: 'teacher', emoji: '👨‍🏫', label: 'Учитель' },
    { id: 'teacher_woman', emoji: '👩‍🏫', label: 'Учительница' },
    { id: 'doctor', emoji: '👨‍⚕️', label: 'Врач' },
    { id: 'doctor_woman', emoji: '👩‍⚕️', label: 'Врач' },
    { id: 'artist', emoji: '👨‍🎨', label: 'Художник' },
    { id: 'artist_woman', emoji: '👩‍🎨', label: 'Художница' },
    { id: 'oldman', emoji: '👴', label: 'Пожилой мужчина' },
    { id: 'oldwoman', emoji: '👵', label: 'Пожилая женщина' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Image loaded, size:', result.length);
        setCustomAvatar(result);
        setSelectedAvatar(result); // Устанавливаем загруженное фото как выбранный аватар
        console.log('Custom avatar set:', result.substring(0, 50) + '...');
      };
      reader.onerror = () => {
        alert('Ошибка при загрузке файла');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const finalAvatar = customAvatar || selectedAvatar;
    
    try {
      console.log('Saving profile with avatar:', finalAvatar ? 'Custom image' : 'Default avatar');
      
      const updates = {
        name,
        email,
        phone,
        birthDate: birthDate || '',
        avatar: finalAvatar,
      };
      
      console.log('Profile updates:', updates);
      
      if (onUserUpdate) {
        const updatedUser: UserProfile = {
          ...user,
          ...updates
        };
        onUserUpdate(updatedUser);
        
        // Дополнительно сохраняем в localStorage для надежности
        localStorage.setItem('gorkhon_user_profile', JSON.stringify(updatedUser));
        console.log('Profile saved to localStorage');
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      alert('Произошла ошибка при сохранении. Попробуйте снова.');
    }
  };

  const getCurrentAvatarDisplay = () => {
    // Проверяем сначала customAvatar, потом selectedAvatar
    if (customAvatar) {
      return (
        <img 
          src={customAvatar} 
          alt="Аватар" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    
    // Если выбранный аватар - это base64 строка (загруженное фото)
    if (selectedAvatar && selectedAvatar.startsWith('data:')) {
      return (
        <img 
          src={selectedAvatar} 
          alt="Аватар" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    
    // Иначе показываем эмодзи
    const avatarOption = avatarOptions.find(option => option.id === selectedAvatar);
    return (
      <span className="text-4xl">
        {avatarOption?.emoji || '👤'}
      </span>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Настройки профиля</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Аватар */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {getCurrentAvatarDisplay()}
            </div>
            
            {/* Загрузка фото */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name="Camera" size={18} />
                <span>Загрузить фото</span>
              </button>
              
              {/* Сетка эмодзи аватаров */}
              <div className="grid grid-cols-4 gap-2">
                {avatarOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedAvatar(option.id);
                      setCustomAvatar('');
                    }}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 backdrop-blur-sm ${
                      selectedAvatar === option.id && !selectedAvatar.startsWith('data:')
                        ? 'border-gorkhon-pink bg-gorkhon-pink/10'
                        : 'border-white/30 bg-white/50 hover:border-white/50 hover:bg-white/70'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                  </button>
                ))}
              </div>
              
              {/* Индикатор загруженного фото */}
              {customAvatar && (
                <div className="mt-4 p-3 bg-gorkhon-green/10 rounded-lg border border-gorkhon-green/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Camera" size={16} className="text-gorkhon-green" />
                      <span className="text-sm text-gorkhon-green font-medium">Загружено ваше фото</span>
                    </div>
                    <button
                      onClick={() => {
                        setCustomAvatar('');
                        setSelectedAvatar('default_male');
                      }}
                      className="text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Сохранить
            </button>
          </div>
        </div>
    </div>
  );
};

export default ProfileSettings;
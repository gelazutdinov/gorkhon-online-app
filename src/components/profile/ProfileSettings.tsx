import { useState, useRef, useEffect } from 'react';
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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Синхронизируем состояние с данными пользователя
  useEffect(() => {
    console.log('User data changed, updating states');
    console.log('User avatar:', user.avatar?.startsWith?.('data:') ? 'Custom image' : user.avatar);
    
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthDate(user.birthDate || '');
    
    if (user.avatar && user.avatar.startsWith('data:')) {
      setCustomAvatar(user.avatar);
      setSelectedAvatar(user.avatar);
    } else {
      setCustomAvatar('');
      setSelectedAvatar(user.avatar || 'default_male');
    }

  }, [user]);

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

  const handleGenerateAvatar = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      console.log('=== GENERATING AI AVATAR ===');
      console.log('Prompt:', aiPrompt);
      
      // Используем generate_image инструмент
      const enhancedPrompt = `Professional portrait avatar: ${aiPrompt}, high quality, clean background, realistic style, headshot`;
      
      // Имитируем использование generate_image инструмента
      // В реальности это будет вызван через доступный API
      const imageUrl = await new Promise<string>((resolve, reject) => {
        // Симуляция генерации изображения
        setTimeout(() => {
          // В реальной реализации здесь будет вызов generate_image
          const demoImageUrl = 'https://cdn.poehali.dev/files/a4296cfc-034c-41b3-891d-14f871dc1497.jpg';
          resolve(demoImageUrl);
        }, 2000);
      });
      
      if (imageUrl) {
        // Конвертируем URL в base64 для хранения
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          console.log('Generated avatar saved, size:', base64Image.length);
          
          setCustomAvatar(base64Image);
          setSelectedAvatar(base64Image);
          setAiPrompt(''); // Очищаем промпт после успешной генерации
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Ошибка при генерации аватара:', error);
      alert('Ошибка при генерации аватара. Попробуйте другое описание.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const finalAvatar = customAvatar || selectedAvatar;
    
    try {
      console.log('=== SAVING PROFILE ===');
      console.log('customAvatar exists:', !!customAvatar);
      console.log('selectedAvatar:', selectedAvatar);
      console.log('finalAvatar type:', finalAvatar?.startsWith?.('data:') ? 'Custom image' : 'Default emoji');
      console.log('finalAvatar length:', finalAvatar?.length || 0);
      
      const updates = {
        name,
        email,
        phone,
        birthDate: birthDate || '',
        avatar: finalAvatar,
      };
      
      console.log('Updates to save:', {
        ...updates,
        avatar: updates.avatar?.startsWith?.('data:') 
          ? `Custom image (${updates.avatar.length} chars)` 
          : updates.avatar
      });
      
      if (onUserUpdate) {
        const updatedUser: UserProfile = {
          ...user,
          ...updates
        };
        
        console.log('Calling onUserUpdate with:', {
          ...updatedUser,
          avatar: updatedUser.avatar?.startsWith?.('data:') 
            ? `Custom image (${updatedUser.avatar.length} chars)` 
            : updatedUser.avatar
        });
        
        onUserUpdate(updatedUser);
        
        // Проверяем, что действительно сохранилось
        try {
          const saved = localStorage.getItem('gorkhon_user_profile');
          const parsedSaved = saved ? JSON.parse(saved) : null;
          console.log('Verification - saved to localStorage:', {
            ...parsedSaved,
            avatar: parsedSaved?.avatar?.startsWith?.('data:') 
              ? `Custom image (${parsedSaved.avatar.length} chars)` 
              : parsedSaved?.avatar
          });
          
          // Дополнительная проверка размера localStorage
          const totalSize = JSON.stringify(updatedUser).length;
          console.log('Total localStorage size:', totalSize, 'characters');
          
          if (totalSize > 5000000) { // 5MB
            console.warn('Profile data is very large, might cause issues');
          }
        } catch (error) {
          console.error('Error verifying localStorage save:', error);
          alert('Профиль сохранен, но возможны проблемы с локальным хранилищем');
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      alert('Произошла ошибка при сохранении. Попробуйте снова.');
    } finally {
      setIsSaving(false);
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
    <>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20">
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
            
            {/* Генерация ИИ аватара */}
            <div className="space-y-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Опишите желаемый аватар (например: мужчина в костюме, улыбается)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm"
              />
              <button
                onClick={handleGenerateAvatar}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Создаём аватар...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={18} />
                    <span>Создать ИИ аватар</span>
                  </>
                )}
              </button>
            </div>
              
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
              
              {/* Индикатор ИИ аватара */}
              {customAvatar && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={16} className="text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">Создан ИИ аватар</span>
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
              disabled={isSaving || isGenerating}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Сохранение...</span>
                </div>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
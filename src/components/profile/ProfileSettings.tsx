import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';
import VerificationRequestComponent from '@/components/verification/VerificationRequest';
import { VerificationRequest } from '@/types/verification';

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
  const [showVerification, setShowVerification] = useState(false);
  const [currentVerificationRequest, setCurrentVerificationRequest] = useState<VerificationRequest | null>(null);

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

    // Загружаем текущую заявку на верификацию
    loadCurrentVerificationRequest();
  }, [user]);

  const loadCurrentVerificationRequest = () => {
    try {
      const stored = localStorage.getItem('gorkhon_verification_requests');
      if (stored) {
        const requests: VerificationRequest[] = JSON.parse(stored);
        const userRequest = requests.find(req => req.userId === user.id && req.status === 'pending');
        setCurrentVerificationRequest(userRequest || null);
      }
    } catch (error) {
      console.error('Ошибка загрузки заявки на верификацию:', error);
    }
  };

  const handleVerificationSubmit = (request: VerificationRequest) => {
    try {
      // Сохраняем или обновляем заявку
      const stored = localStorage.getItem('gorkhon_verification_requests');
      const requests: VerificationRequest[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = requests.findIndex(req => req.id === request.id);
      if (existingIndex >= 0) {
        requests[existingIndex] = request;
      } else {
        requests.push(request);
      }
      
      localStorage.setItem('gorkhon_verification_requests', JSON.stringify(requests));
      
      // Обновляем состояние пользователя
      if (onUserUpdate) {
        const updatedUser = {
          ...user,
          verification: {
            status: 'pending' as const,
            requestId: request.id
          }
        };
        onUserUpdate(updatedUser);
      }
      
      setCurrentVerificationRequest(request);
      setShowVerification(false);
      
      console.log('Заявка на верификацию отправлена:', request.id);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки');
    }
  };

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

          {/* Верификация */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Верификация жителя Горхона</h3>
            
            {user.verification?.status === 'approved' && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                  <span className="text-green-800 font-medium">Вы верифицированы!</span>
                </div>
                <p className="text-green-700 text-sm">
                  Вы подтвердили, что являетесь жителем Лесозаводской (Горхон)
                </p>
                {user.verification.verifiedAt && (
                  <p className="text-green-600 text-xs mt-1">
                    Верифицирован: {new Date(user.verification.verifiedAt).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            )}

            {user.verification?.status === 'pending' && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="Clock" size={24} className="text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Заявка на рассмотрении</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Ваша заявка на верификацию обрабатывается администрацией
                </p>
                <button
                  onClick={() => setShowVerification(true)}
                  className="mt-2 text-sm text-yellow-700 hover:text-yellow-800 underline"
                >
                  Просмотреть заявку
                </button>
              </div>
            )}

            {user.verification?.status === 'rejected' && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="XCircle" size={24} className="text-red-600" />
                  <span className="text-red-800 font-medium">Заявка отклонена</span>
                </div>
                <p className="text-red-700 text-sm">
                  К сожалению, ваша заявка на верификацию была отклонена
                </p>
                <button
                  onClick={() => setShowVerification(true)}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
                >
                  Подать новую заявку
                </button>
              </div>
            )}

            {(!user.verification || user.verification.status === 'none') && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="Shield" size={24} className="text-blue-600" />
                  <span className="text-blue-800 font-medium">Получите галочку жителя</span>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  Подтвердите, что вы живете в Лесозаводской, и получите синюю галочку
                </p>
                <button
                  onClick={() => setShowVerification(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Подать заявку на верификацию
                </button>
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

      {/* Модальное окно верификации */}
      {showVerification && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowVerification(false)}></div>
          <div className="relative z-10">
            <VerificationRequestComponent
              user={user}
              onClose={() => setShowVerification(false)}
              onSubmit={handleVerificationSubmit}
              currentRequest={currentVerificationRequest}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

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
  { id: 'student', emoji: '👨‍🎓', label: 'Студент' },
  { id: 'student_woman', emoji: '👩‍🎓', label: 'Студентка' },
  { id: 'elderly_man', emoji: '👴', label: 'Пожилой мужчина' },
  { id: 'elderly_woman', emoji: '👵', label: 'Пожилая женщина' }
];

interface ProfileSettingsProps {
  user: UserProfile;
  onUserUpdate?: (user: UserProfile) => void;
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const ProfileSettings = ({ user, onUserUpdate, onClose }: ProfileSettingsProps) => {
  // Правильная инициализация selectedAvatar
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    if (user.avatar && user.avatar.startsWith('data:')) {
      return 'custom';
    }
    
    const matchingOption = avatarOptions.find(option => option.emoji === user.avatar);
    return matchingOption ? matchingOption.id : 'default_male';
  });
  
  const [customAvatar, setCustomAvatar] = useState<string>(() => {
    return user.avatar && user.avatar.startsWith('data:') ? user.avatar : '';
  });
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [status, setStatus] = useState(user.status || '');
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Синхронизируем состояние с данными пользователя
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthDate(user.birthDate || '');
    setStatus(user.status || '');
    setInterests(user.interests || []);
    
    if (user.avatar && user.avatar.startsWith('data:')) {
      setCustomAvatar(user.avatar);
      setSelectedAvatar('custom');
    } else {
      setCustomAvatar('');
      const matchingOption = avatarOptions.find(option => option.emoji === user.avatar);
      setSelectedAvatar(matchingOption ? matchingOption.id : 'default_male');
    }
  }, [user]);

  // Валидация полей
  const validateFields = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Некорректный email адрес';
    }
    
    if (phone && !/^[\+]?[0-9\(\)\-\s]+$/.test(phone)) {
      errors.phone = 'Некорректный номер телефона';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Загрузка фото
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCustomAvatar(base64);
      setSelectedAvatar('custom');
    };
    reader.readAsDataURL(file);
  };

  // Сохранение
  const handleSave = () => {
    if (!validateFields()) return;
    
    setIsSaving(true);
    
    let finalAvatar = user.avatar;
    
    if (selectedAvatar === 'custom' && customAvatar) {
      finalAvatar = customAvatar;
    } else if (selectedAvatar !== 'custom') {
      const selectedOption = avatarOptions.find(option => option.id === selectedAvatar);
      finalAvatar = selectedOption ? selectedOption.emoji : '👤';
    }
    
    try {
      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        birthDate,
        status: status.trim(),
        interests,
        avatar: finalAvatar,
      };
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      alert('Произошла ошибка при сохранении. Попробуйте снова.');
    } finally {
      setIsSaving(false);
    }
  };

  // Отображение текущего аватара
  const getCurrentAvatarDisplay = () => {
    if (selectedAvatar === 'custom' && customAvatar) {
      return (
        <img 
          src={customAvatar} 
          alt="Аватар" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    
    const avatarOption = avatarOptions.find(option => option.id === selectedAvatar);
    return (
      <span className="text-4xl">
        {avatarOption?.emoji || '👤'}
      </span>
    );
  };

  // Добавление интереса
  const addInterest = (interest: string) => {
    if (interest.trim() && !interests.includes(interest.trim())) {
      setInterests([...interests, interest.trim()]);
    }
  };

  // Удаление интереса
  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const availableInterests = [
    'Спорт', 'Музыка', 'Кино', 'Чтение', 'Путешествия', 
    'Кулинария', 'Фотография', 'Искусство', 'Технологии', 'Природа'
  ];

  const hasChanges = () => {
    return name !== user.name || 
           email !== user.email || 
           phone !== user.phone || 
           birthDate !== (user.birthDate || '') ||
           status !== (user.status || '') ||
           JSON.stringify(interests) !== JSON.stringify(user.interests || []) ||
           (selectedAvatar === 'custom' && customAvatar !== user.avatar) ||
           (selectedAvatar !== 'custom' && avatarOptions.find(opt => opt.id === selectedAvatar)?.emoji !== user.avatar);
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Настройки профиля</h2>
            {hasChanges() && (
              <p className="text-sm text-orange-600 mt-1">У вас есть несохранённые изменения</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isPreviewMode ? "Режим редактирования" : "Предпросмотр"}
            >
              <Icon name={isPreviewMode ? "Edit" : "Eye"} size={18} className="text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Аватар */}
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
              {getCurrentAvatarDisplay()}
            </div>
            
            {!isPreviewMode && (
              <>
                <div className="flex justify-center gap-2 mb-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Icon name="Upload" size={16} />
                    Загрузить фото
                  </button>
                  {customAvatar && (
                    <button
                      onClick={() => {
                        setCustomAvatar('');
                        setSelectedAvatar('default_male');
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {/* Сетка эмодзи аватаров */}
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedAvatar(option.id);
                        setCustomAvatar('');
                      }}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedAvatar === option.id && !customAvatar
                          ? 'border-gorkhon-pink bg-gorkhon-pink/10'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                      title={option.label}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPreviewMode}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                } ${isPreviewMode ? 'bg-gray-50' : ''}`}
                placeholder="Ваше имя"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPreviewMode}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                } ${isPreviewMode ? 'bg-gray-50' : ''}`}
                placeholder="email@example.com"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPreviewMode}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                } ${isPreviewMode ? 'bg-gray-50' : ''}`}
                placeholder="+7 (999) 123-45-67"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={isPreviewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  isPreviewMode ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isPreviewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  isPreviewMode ? 'bg-gray-50' : ''
                }`}
                placeholder="Ваш статус или девиз"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{status.length}/100</p>
            </div>
          </div>

          {/* Интересы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Интересы
            </label>
            
            {/* Выбранные интересы */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gorkhon-pink/10 text-gorkhon-pink rounded-full text-sm"
                  >
                    {interest}
                    {!isPreviewMode && (
                      <button
                        onClick={() => removeInterest(index)}
                        className="text-gorkhon-pink hover:text-red-600"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            
            {!isPreviewMode && (
              <div className="flex flex-wrap gap-2">
                {availableInterests
                  .filter(interest => !interests.includes(interest))
                  .map(interest => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="px-3 py-1 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors"
                  >
                    + {interest}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          {!isPreviewMode && (
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/95 backdrop-blur-xl pb-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges()}
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
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
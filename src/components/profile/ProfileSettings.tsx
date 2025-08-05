import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

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
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [gender, setGender] = useState<'male' | 'female'>(user.gender);
  
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Синхронизируем состояние с данными пользователя
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthDate(user.birthDate || '');
    setGender(user.gender);
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

  // Сохранение
  const handleSave = () => {
    if (!validateFields()) return;
    
    setIsSaving(true);
    
    try {
      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        birthDate,
        gender,
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

  // Отображение силуэта аватара
  const getAvatarSilhouette = () => {
    const isFemale = gender === 'female';
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center ${
        isFemale ? 'bg-gradient-to-br from-gorkhon-pink to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
      }`}>
        <div className={`w-12 h-12 ${
          isFemale ? 'text-blue-100' : 'text-pink-100'
        } flex items-center justify-center`}>
          <svg width="48" height="48" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8c-6.627 0-12 5.373-12 12 0 4.411 2.387 8.257 5.926 10.361C21.724 32.768 18 37.187 18 42.5V56h28V42.5c0-5.313-3.724-9.732-7.926-12.139C41.613 28.257 44 24.411 44 20c0-6.627-5.373-12-12-12z"/>
            {isFemale && (
              <>
                <path d="M24 24c0 2 1 4 2 5s3 1 6 1 5 0 6-1 2-3 2-5" strokeWidth="1" stroke="currentColor" fill="none"/>
                <circle cx="28" cy="22" r="1"/>
                <circle cx="36" cy="22" r="1"/>
              </>
            )}
          </svg>
        </div>
      </div>
    );
  };

  const hasChanges = () => {
    return name !== user.name || 
           email !== user.email || 
           phone !== user.phone || 
           birthDate !== (user.birthDate || '') ||
           gender !== user.gender;
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Icon name="Settings" size={20} className="text-gorkhon-pink" />
              Профиль
            </h2>
            {hasChanges() && (
              <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                У вас есть несохранённые изменения
              </p>
            )}
          </div>
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
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full overflow-hidden ring-4 ring-white shadow-lg rounded-full">
                {getAvatarSilhouette()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full flex items-center justify-center shadow-lg">
                <Icon name="User" size={14} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Силуэт автоматически обновляется при смене пола
            </p>
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ваше имя"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пол *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    gender === 'male'
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">♂</span>
                    </div>
                    <span className="font-medium">Мужской</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    gender === 'female'
                      ? 'border-gorkhon-pink bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gorkhon-pink to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">♀</span>
                    </div>
                    <span className="font-medium">Женский</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
              />
            </div>
          </div>

          {/* Информация */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="Info" size={14} className="text-white" />
              </div>
              Персонализация аватара
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gorkhon-pink rounded-full"></div>
                <span>Женский силуэт: розовый градиент</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Мужской силуэт: синий градиент</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={12} className="text-purple-500" />
                <span>Аватар обновляется автоматически</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-6 sticky bottom-0 bg-white/95 backdrop-blur-xl pb-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name="X" size={16} />
                <span>Отмена</span>
              </div>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges()}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Сохранение...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Save" size={16} />
                  <span>Сохранить</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
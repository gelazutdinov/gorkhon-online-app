import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface SocialProfileProps {
  user: UserProfile;
  onUserUpdate?: (user: UserProfile) => void;
  onClose: () => void;
}

const SocialProfile = ({ user, onUserUpdate, onClose }: SocialProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [isSaving, setIsSaving] = useState(false);

  // Генерация силуэта на основе пола
  const getAvatarSilhouette = (gender: string) => {
    const isFemale = gender === 'female';
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center ${
        isFemale ? 'bg-gradient-to-br from-gorkhon-pink to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
      }`}>
        <div className={`w-16 h-16 ${
          isFemale ? 'text-blue-100' : 'text-pink-100'
        } flex items-center justify-center`}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
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

  const getAge = () => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser: UserProfile = {
        ...user,
        name: name.trim(),
        status: status.trim(),
        birthDate,
        phone: phone.trim(),
        email: email.trim(),
        interests
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const availableInterests = [
    'Спорт', 'Музыка', 'Кино', 'Чтение', 'Путешествия',
    'Кулинария', 'Фотография', 'Искусство', 'Технологии', 'Природа',
    'Садоводство', 'Рыбалка', 'Охота', 'Рукоделие', 'Танцы'
  ];

  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="relative">
        {/* Фоновая обложка */}
        <div className="h-32 bg-gradient-to-r from-gorkhon-pink via-purple-500 to-gorkhon-green relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Icon name="Edit" size={18} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Icon name="X" size={18} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Icon name="Check" size={18} />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        {/* Аватар */}
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 border-4 border-white rounded-full shadow-lg overflow-hidden">
            {getAvatarSilhouette(user.gender)}
          </div>
        </div>
      </div>

      <div className="pt-16 p-6 space-y-6">
        {/* Основная информация */}
        <div>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-gorkhon-pink focus:outline-none w-full"
              placeholder="Ваше имя"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gorkhon-pink w-full mt-2"
              placeholder="Ваш статус"
              maxLength={100}
            />
          ) : (
            status && <p className="text-gray-600 mt-1">{status}</p>
          )}
        </div>

        {/* Информация */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" size={16} className="text-gorkhon-pink" />
              <span className="text-sm font-medium text-gray-700">Возраст</span>
            </div>
            {isEditing ? (
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gorkhon-pink w-full text-sm"
              />
            ) : (
              <div className="text-gray-800 font-medium">
                {getAge() ? `${getAge()} лет` : 'Не указан'}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="MapPin" size={16} className="text-gorkhon-green" />
              <span className="text-sm font-medium text-gray-700">Город</span>
            </div>
            <div className="text-gray-800 font-medium">Горхон</div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Phone" size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Телефон</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gorkhon-pink w-full text-sm"
                placeholder="+7 (999) 123-45-67"
              />
            ) : (
              <div className="text-gray-800 font-medium text-sm">
                {phone || 'Не указан'}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Mail" size={16} className="text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Email</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gorkhon-pink w-full text-sm"
                placeholder="email@example.com"
              />
            ) : (
              <div className="text-gray-800 font-medium text-sm">
                {email || 'Не указан'}
              </div>
            )}
          </div>
        </div>

        {/* Интересы */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="Heart" size={20} className="text-red-500" />
            Интересы
          </h3>
          
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gorkhon-pink/10 text-gorkhon-pink rounded-full text-sm"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="text-gorkhon-pink hover:text-red-600"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          
          {isEditing && (
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

        {/* Статистика активности */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-green-500" />
            Активность
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user.stats.daysActive}</div>
              <div className="text-xs text-blue-600">дней активности</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user.stats.totalSessions}</div>
              <div className="text-xs text-green-600">посещений</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((Date.now() - user.registeredAt) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-purple-600">дней с нами</div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        {!isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
            >
              <Icon name="Edit" size={18} />
              Редактировать
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon name="ArrowLeft" size={18} />
              Назад
            </button>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Сохранение...
                </div>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialProfile;
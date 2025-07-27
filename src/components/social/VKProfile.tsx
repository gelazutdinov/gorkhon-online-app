import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface VKProfileProps {
  user: UserProfile;
  onUserUpdate?: (user: UserProfile) => void;
  onClose: () => void;
  onLogout?: () => void;
}

const VKProfile = ({ user, onUserUpdate, onClose, onLogout }: VKProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [about, setAbout] = useState(user.about || '');
  const [coverImage, setCoverImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(Math.floor(Math.random() * 50) + 10);
  const [following, setFollowing] = useState(Math.floor(Math.random() * 30) + 5);
  const [posts, setPosts] = useState(Math.floor(Math.random() * 20) + 3);

  // Генерация силуэта на основе пола
  const getAvatarSilhouette = (gender: string) => {
    const isFemale = gender === 'female';
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
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

  // Фоновые изображения для обложки
  const coverImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=300&fit=crop',
    'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop'
  ];

  useEffect(() => {
    // Устанавливаем случайную обложку если её нет
    if (!coverImage) {
      setCoverImage(coverImages[Math.floor(Math.random() * coverImages.length)]);
    }
  }, []);

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
        interests,
        about: about.trim()
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
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

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'logout':
        if (onLogout) {
          onLogout();
        }
        break;
      case 'privacy':
        window.open('/privacy', '_blank');
        break;
      case 'terms':
        window.open('/terms', '_blank');
        break;
      case 'data-protection':
        window.open('/data-protection', '_blank');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
      {/* Обложка */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img 
          src={coverImage} 
          alt="Обложка профиля" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Гамбургер меню */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
          >
            <Icon name="Menu" size={20} />
          </button>
          
          {/* Выпадающее меню */}
          {showMenu && (
            <div className="absolute top-12 left-0 bg-white rounded-xl shadow-xl border border-gray-200 min-w-64 z-50">
              <div className="p-3 space-y-1">
                <button 
                  onClick={() => handleMenuAction('statistics')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="BarChart3" size={16} className="text-gray-600" />
                  <span>Статистика</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('notifications')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="Bell" size={16} className="text-gray-600" />
                  <span>Уведомления</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('themes')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="Palette" size={16} className="text-gray-600" />
                  <span>Темы</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('settings')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="Settings" size={16} className="text-gray-600" />
                  <span>Настройки</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('data')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="Database" size={16} className="text-gray-600" />
                  <span>Данные</span>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={() => handleMenuAction('privacy')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="Shield" size={16} className="text-gray-600" />
                  <span>Политика конфиденциальности</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('terms')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="FileText" size={16} className="text-gray-600" />
                  <span>Пользовательское соглашение</span>
                </button>
                <button 
                  onClick={() => handleMenuAction('data-protection')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                >
                  <Icon name="ShieldCheck" size={16} className="text-gray-600" />
                  <span>Защита данных</span>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={() => handleMenuAction('logout')}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-3"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Выйти из аккаунта</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки управления */}
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
            >
              <Icon name="Edit" size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors disabled:opacity-50"
              >
                <Icon name="Check" size={18} />
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
        </div>

        {/* Аватар */}
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24">
            {getAvatarSilhouette(user.gender)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>

      <div className="pt-16 p-6 space-y-6">
        {/* Основная информация */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
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
            
            {/* Социальные кнопки */}
            <div className="flex gap-2 ml-4">
              <button 
                onClick={handleFollow}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-gorkhon-pink text-white hover:bg-gorkhon-pink/90'
                }`}
              >
                <Icon name={isFollowing ? "UserCheck" : "UserPlus"} size={14} />
                {isFollowing ? 'Подписан' : 'Подписаться'}
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                <Icon name="MessageCircle" size={14} />
                Написать
              </button>
            </div>
          </div>

          {/* Счетчики как в ВК */}
          <div className="flex gap-6 text-sm">
            <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
              <span className="font-bold text-gray-800">{posts}</span>
              <span className="text-gray-600 ml-1">записей</span>
            </div>
            <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
              <span className="font-bold text-gray-800">{followers}</span>
              <span className="text-gray-600 ml-1">подписчиков</span>
            </div>
            <div className="cursor-pointer hover:text-gorkhon-pink transition-colors">
              <span className="font-bold text-gray-800">{following}</span>
              <span className="text-gray-600 ml-1">подписок</span>
            </div>
          </div>
        </div>

        {/* О себе */}
        {(about || isEditing) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">О себе</h3>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent resize-none"
                placeholder="Расскажите о себе..."
                maxLength={300}
              />
            ) : (
              <p className="text-gray-700">{about}</p>
            )}
          </div>
        )}

        {/* Подробная информация */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Icon name="Calendar" size={16} className="text-gray-400" />
            <span className="text-gray-600">
              {getAge() ? `${getAge()} лет` : 'Возраст не указан'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="MapPin" size={16} className="text-gray-400" />
            <span className="text-gray-600">Горхон</span>
          </div>
          {phone && (
            <div className="flex items-center gap-3">
              <Icon name="Phone" size={16} className="text-gray-400" />
              <span className="text-gray-600">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={16} className="text-gray-400" />
              <span className="text-gray-600">{email}</span>
            </div>
          )}
        </div>

        {/* Интересы */}
        {(interests.length > 0 || isEditing) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Интересы</h3>
            
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => removeInterest(interest)}
                        className="text-blue-700 hover:text-red-600"
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
        )}

        {/* Активность в поселке */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Активность в Горхоне</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xl font-bold text-blue-600">{user.stats.daysActive}</div>
              <div className="text-xs text-blue-600">дней активности</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xl font-bold text-green-600">{user.stats.totalSessions}</div>
              <div className="text-xs text-green-600">посещений</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-xl font-bold text-purple-600">
                {Math.floor((Date.now() - user.registeredAt) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-purple-600">дней с нами</div>
            </div>
          </div>
        </div>

        {/* Информация о безопасности */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Icon name="Shield" size={16} />
            О безопасности ваших данных
          </h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Мы серьезно относимся к защите вашей приватности. Все персональные данные 
            хранятся локально в вашем браузере и передаются только по защищенному 
            соединению. Подробнее в наших документах о конфиденциальности.
          </p>
        </div>

        {/* Кнопки действий для редактирования */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
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

      {/* Затемнение фона при открытом меню */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default VKProfile;
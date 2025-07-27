import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface ProfileHeaderProps {
  user: UserProfile;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
  onSave: () => void;
  onClose: () => void;
  onMenuAction: (action: string) => void;
  isSaving: boolean;
}

const ProfileHeader = ({ 
  user, 
  isEditing, 
  onEditToggle, 
  onSave, 
  onClose, 
  onMenuAction,
  isSaving 
}: ProfileHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [coverImage, setCoverImage] = useState('');

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

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    onMenuAction(action);
  };

  return (
    <>
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
              onClick={() => onEditToggle(true)}
              className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
            >
              <Icon name="Edit" size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onEditToggle(false)}
                className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/40 transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
              <button
                onClick={onSave}
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

      {/* Затемнение фона при открытом меню */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;
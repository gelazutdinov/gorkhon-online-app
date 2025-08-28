import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useAuth';

interface ProfileEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave?: (updatedProfile: Partial<UserProfile>) => void;
  onUpdate?: (updatedProfile: Partial<UserProfile>) => void;
}

export default function ProfileEditModal({ user, onClose, onSave, onUpdate }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    middleName: '',
    bio: 'Участник Горхон.Online',
    location: 'Россия',
    website: '',
    birthDate: '',
    phone: '',
    email: user.email || ''
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSave = () => {
    console.log('💾 Сохраняю профиль...', formData);
    
    const updatedProfile = { ...formData };
    if (avatarFile) {
      // В реальном приложении здесь была бы загрузка файла на сервер
      updatedProfile.avatar = avatarPreview;
    }
    
    // КРИТИЧНО: Обновляем данные пользователя в localStorage
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        const updatedUserData = {
          ...userData,
          ...updatedProfile,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        console.log('✅ Профиль сохранен в localStorage:', updatedUserData);
      }
      
      // Также обновляем данные регистрации если они есть
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const updatedRegData = {
          ...regData,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          birthDate: updatedProfile.birthDate
        };
        localStorage.setItem('registrationData', JSON.stringify(updatedRegData));
        console.log('✅ Данные регистрации обновлены:', updatedRegData);
      }
      
    } catch (error) {
      console.error('❌ Ошибка сохранения в localStorage:', error);
    }
    
    // Вызываем onSave или onUpdate, что было передано
    if (onSave) {
      onSave(updatedProfile);
    } else if (onUpdate) {
      onUpdate(updatedProfile);
    }
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Заголовок - адаптивный */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate">Редактировать профиль</h2>
                <p className="text-blue-100 text-xs sm:text-sm truncate">Изменить информацию о себе</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
            >
              <Icon name="X" size={16} className="text-white sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Форма - адаптивная */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Аватар - адаптивный */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Icon name="User" size={28} className="text-white sm:w-8 sm:h-8" />
                )}
              </div>
              <label className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                <Icon name="Camera" size={14} className="text-white sm:w-4 sm:h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setAvatarPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-4">Нажмите на камеру, чтобы изменить фото</p>
          </div>

          {/* Основная информация - адаптивная */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Основная информация</h3>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Имя и фамилия
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Отчество
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Введите отчество (необязательно)"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                О себе
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base sm:rows-3"
                placeholder="Расскажите о себе"
              />
            </div>
          </div>

          {/* Контактная информация - адаптивная */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Контакты</h3>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          </div>

          {/* Дополнительная информация - адаптивная */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Дополнительно</h3>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Местоположение
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Город, страна"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Веб-сайт
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Дата рождения
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Кнопки - адаптивные */}
        <div className="p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-500 text-white rounded-xl sm:rounded-2xl hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface ProfileEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave?: (updatedProfile: Partial<UserProfile>) => void;
}

export default function ProfileEditModal({ user, onClose, onSave }: ProfileEditModalProps) {
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
    const updatedProfile = { ...formData };
    if (avatarFile) {
      // В реальном приложении здесь была бы загрузка файла на сервер
      updatedProfile.avatar = avatarPreview;
    }
    onSave?.(updatedProfile);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon name="User" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Редактировать профиль</h2>
                <p className="text-blue-100 text-sm">Изменить информацию о себе</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Форма */}
        <div className="p-6 space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Icon name="User" size={32} className="text-white" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                <Icon name="Camera" size={16} className="text-white" />
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
            <p className="text-sm text-gray-500 text-center">Нажмите на камеру, чтобы изменить фото</p>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Основная информация</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя и фамилия
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Отчество
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите отчество (необязательно)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                О себе
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Расскажите о себе"
              />
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Контакты</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Дополнительно</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Местоположение
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Город, страна"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Веб-сайт
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата рождения
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="p-6 border-t bg-gray-50 sticky bottom-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
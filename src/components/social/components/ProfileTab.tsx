import { useState } from 'react';
import { SocialUser } from '../types/SocialTypes';
import Icon from '@/components/ui/icon';
import ProfileSettings from './ProfileSettings';

interface ProfileTabProps {
  currentSocialUser: SocialUser;
  onUpdateProfile: (updates: Partial<SocialUser>) => void;
}

const ProfileTab = ({ currentSocialUser, onUpdateProfile }: ProfileTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'settings'>('profile');

  return (
    <div className="space-y-6">
      {/* Подвкладки */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeSubTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Профиль
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeSubTab === 'settings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Настройки
        </button>
      </div>

      {/* Контент */}
      {activeSubTab === 'profile' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            {currentSocialUser.avatar.startsWith('data:') ? (
              <img
                src={currentSocialUser.avatar}
                alt="Аватар"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4">
                {currentSocialUser.avatar}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800">{currentSocialUser.name}</h2>
            <p className="text-gray-600">{currentSocialUser.bio}</p>
            
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.posts.length}</div>
                <div className="text-sm text-gray-600">публикаций</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.followers.length}</div>
                <div className="text-sm text-gray-600">подписчиков</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{currentSocialUser.following.length}</div>
                <div className="text-sm text-gray-600">подписок</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="Calendar" size={24} className="text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Присоединился</div>
              <div className="font-medium text-gray-800">
                {new Date(currentSocialUser.registeredAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Icon name="MapPin" size={24} className="text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Местоположение</div>
              <div className="font-medium text-gray-800">п. Горхон</div>
            </div>
          </div>
        </div>
      ) : (
        <ProfileSettings
          currentSocialUser={currentSocialUser}
          onUpdateProfile={onUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfileTab;
import { SocialUser } from '../types/SocialTypes';
import Icon from '@/components/ui/icon';

interface ProfileTabProps {
  currentSocialUser: SocialUser;
}

const ProfileTab = ({ currentSocialUser }: ProfileTabProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4">
          {currentSocialUser.avatar}
        </div>
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
  );
};

export default ProfileTab;
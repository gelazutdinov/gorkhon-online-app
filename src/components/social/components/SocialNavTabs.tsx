import { FriendRequest } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface SocialNavTabsProps {
  activeTab: 'feed' | 'friends' | 'profile';
  onTabChange: (tab: 'feed' | 'friends' | 'profile') => void;
  friendRequests: FriendRequest[];
  currentUser: UserProfile;
}

const SocialNavTabs = ({ activeTab, onTabChange, friendRequests, currentUser }: SocialNavTabsProps) => {
  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
      <button
        onClick={() => onTabChange('feed')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
          activeTab === 'feed'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Icon name="Home" size={18} />
          <span>Лента</span>
        </div>
      </button>
      <button
        onClick={() => onTabChange('friends')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all relative ${
          activeTab === 'friends'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Icon name="Users" size={18} />
          <span>Друзья</span>
          {pendingRequests.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{pendingRequests.length}</span>
            </div>
          )}
        </div>
      </button>
      <button
        onClick={() => onTabChange('profile')}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
          activeTab === 'profile'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Icon name="User" size={18} />
          <span>Профиль</span>
        </div>
      </button>
    </div>
  );
};

export default SocialNavTabs;
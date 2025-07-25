import Icon from '@/components/ui/icon';

interface SocialTabsProps {
  activeTab: 'search' | 'friends' | 'requests';
  friendsCount: number;
  requestsCount: number;
  onTabChange: (tab: 'search' | 'friends' | 'requests') => void;
}

const SocialTabs = ({ activeTab, friendsCount, requestsCount, onTabChange }: SocialTabsProps) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onTabChange('search')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'search'
            ? 'border-gorkhon-pink text-gorkhon-pink'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon name="Search" size={16} />
          Поиск людей
        </div>
      </button>
      
      <button
        onClick={() => onTabChange('friends')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'friends'
            ? 'border-gorkhon-pink text-gorkhon-pink'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon name="Users" size={16} />
          Друзья ({friendsCount})
        </div>
      </button>
      
      <button
        onClick={() => onTabChange('requests')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors relative ${
          activeTab === 'requests'
            ? 'border-gorkhon-pink text-gorkhon-pink'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon name="UserPlus" size={16} />
          Заявки
          {requestsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {requestsCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default SocialTabs;
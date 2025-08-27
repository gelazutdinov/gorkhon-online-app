import Icon from '@/components/ui/icon';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

const ProfileTabs = ({ activeTab, onTabChange, isAdmin }: ProfileTabsProps) => {
  return (
    <div className="bg-white border-b mx-4 sm:mx-0 rounded-2xl sm:rounded-none">
      <div className="flex rounded-2xl sm:rounded-none overflow-hidden">
        <button 
          onClick={() => onTabChange('profile')}
          className={`flex-1 py-3 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="User" size={20} />
            <span className="hidden sm:inline">Профиль</span>
          </div>
        </button>
        <button 
          onClick={() => onTabChange('settings')}
          className={`flex-1 py-3 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Icon name="Settings" size={20} />
            <span className="hidden sm:inline">Настройки</span>
          </div>
        </button>
        {isAdmin && (
          <button 
            onClick={() => onTabChange('admin')}
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'admin' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Shield" size={20} />
              <span className="hidden sm:inline">Админ</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
import Icon from '@/components/ui/icon';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const menuItems = [
    {
      id: 'home',
      label: 'Главная',
      icon: 'Home'
    },
    {
      id: 'search',
      label: 'Поиск',
      icon: 'Search'
    },
    {
      id: 'news',
      label: 'Новости',
      icon: 'MessageCircle',
      badge: '1'
    },
    {
      id: 'profile',
      label: 'Личный кабинет',
      icon: 'User'
    },
    {
      id: 'support',
      label: 'Поддержка',
      icon: 'Users'
    },
    {
      id: 'menu',
      label: 'Меню',
      icon: 'Menu'
    }
  ];

  return (
    <>
      {/* Фиксированное меню внизу экрана */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                  ${activeSection === item.id 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="relative">
                  <Icon 
                    name={item.icon as any} 
                    size={20} 
                    className={`
                      transition-all duration-200
                      ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}
                    `}
                  />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{item.badge}</span>
                    </div>
                  )}
                </div>
                <span className={`
                  text-xs font-medium transition-all duration-200
                  ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Черная полоса-индикатор */}
      <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
      
      {/* Отступ для контента, чтобы он не перекрывался меню */}
      <div className="h-20"></div>
    </>
  );
};

export default BottomNavigation;
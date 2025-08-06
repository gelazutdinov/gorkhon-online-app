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
      id: 'news',
      label: 'Новости',
      icon: 'Newspaper'
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: 'User'
    }
  ];

  // Показываем навигацию всегда для приложения

  return (
    <>
      {/* Фиксированное меню внизу экрана - жидкое стекло капсула */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 safe-area-bottom">
        <div className="bg-white/25 backdrop-blur-xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl border border-white/30">
          <div className="flex items-center gap-2 sm:gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px]
                  ${activeSection === item.id 
                    ? 'bg-white/40 backdrop-blur-sm scale-110 shadow-lg' 
                    : 'hover:bg-white/20 hover:scale-105 active:scale-95'
                  }
                `}
              >
                <Icon 
                  name={item.icon as any} 
                  size={20} 
                  className={`
                    transition-all duration-300 mb-0.5
                    ${activeSection === item.id ? 'text-gray-800' : 'text-gray-600'}
                  `}
                />
                <span className={`
                  text-xs font-medium transition-all duration-300 hidden sm:block
                  ${activeSection === item.id ? 'text-gray-800' : 'text-gray-600'}
                `}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Отступ для контента, чтобы он не перекрывался меню */}
      <div className="h-20"></div>
    </>
  );
};

export default BottomNavigation;
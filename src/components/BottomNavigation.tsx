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
      id: 'weather',
      label: 'Погода',
      icon: 'Cloud'
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
      {/* Мобильное навигационное меню */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 safe-area-bottom md:hidden">
        <div className="bg-[#005BFF] rounded-full px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex items-center justify-center p-3 rounded-full transition-all duration-300 min-h-[48px] min-w-[48px]
                  ${activeSection === item.id 
                    ? 'bg-[#005BFF] scale-110 shadow-lg' 
                    : 'hover:bg-white/10 hover:scale-105 active:scale-95'
                  }
                `}
              >
                <Icon 
                  name={item.icon as any} 
                  size={24} 
                  className={`transition-all duration-300 ${
                    activeSection === item.id ? 'text-white' : 'text-white/80'
                  }`}
                />
                {item.id === 'weather' && (
                  <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full font-medium shadow-sm">
                    beta
                  </div>
                )}
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
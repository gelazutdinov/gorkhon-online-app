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
      id: 'weather',
      label: 'Погода',
      icon: 'Cloud'
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
      {/* Обновленное навигационное меню */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 safe-area-bottom">
        <div className="bg-[#005BFF] rounded-full px-4 sm:px-6 py-3 sm:py-4 shadow-2xl">
          <div className="flex items-center gap-6 sm:gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-full transition-all duration-300 min-h-[50px] min-w-[50px]
                  ${activeSection === item.id 
                    ? 'bg-white/20 scale-110 shadow-lg' 
                    : 'hover:bg-white/10 hover:scale-105 active:scale-95'
                  }
                `}
              >
                <Icon 
                  name={item.icon as any} 
                  size={22} 
                  className="text-white transition-all duration-300"
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
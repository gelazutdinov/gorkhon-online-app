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
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/30">
          <div className="flex items-center gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex items-center justify-center p-3 rounded-full transition-all duration-300
                  ${activeSection === item.id 
                    ? 'bg-white/40 backdrop-blur-sm scale-110 shadow-lg' 
                    : 'hover:bg-white/20 hover:scale-105'
                  }
                `}
              >
                <Icon 
                  name={item.icon as any} 
                  size={24} 
                  className={`
                    transition-all duration-300
                    ${activeSection === item.id ? 'text-gray-800' : 'text-gray-600'}
                  `}
                />
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
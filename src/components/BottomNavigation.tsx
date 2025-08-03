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
      icon: 'Home',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'news',
      label: 'Новости',
      icon: 'Newspaper',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'support',
      label: 'Поддержка',
      icon: 'MessageCircle',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: 'User',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  // Скрываем навигацию когда активен профиль
  if (activeSection === 'profile') {
    return null;
  }

  return (
    <>
      {/* Современная навигация с брендовыми цветами */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 px-4 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className="relative flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 group"
              >
                <div className={`
                  relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${activeSection === item.id 
                    ? `bg-gradient-to-br ${item.color} shadow-lg transform scale-110` 
                    : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-105'
                  }
                `}>
                  <Icon 
                    name={item.icon as any} 
                    size={20} 
                    className={`
                      transition-all duration-300
                      ${activeSection === item.id ? 'text-white' : 'text-gray-600'}
                    `}
                  />
                  {activeSection === item.id && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-glow"></div>
                  )}
                </div>
                <span className={`
                  text-xs font-medium mt-1 transition-all duration-300
                  ${activeSection === item.id ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Отступ для контента, чтобы он не перекрывался меню */}
      <div className="h-20 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
    </>
  );
};

export default BottomNavigation;
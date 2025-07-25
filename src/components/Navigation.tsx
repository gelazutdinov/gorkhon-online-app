import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {

  const menuItems = [
    {
      id: 'profile',
      label: 'Личный кабинет',
      icon: 'User',
      description: 'О проекте и миссии'
    },
    {
      id: 'home',
      label: 'Главная',
      icon: 'Home',
      description: 'Важная информация'
    },
    {
      id: 'news',
      label: 'Новости',
      icon: 'Newspaper',
      description: 'События поселка'
    },
    {
      id: 'support',
      label: 'Поддержка',
      icon: 'MessageCircle',
      description: 'Чат и помощь'
    }
  ];

  return (
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-white/10 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/20">
        <div className="flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative px-4 py-2 rounded-full transition-all duration-300 group
                ${activeSection === item.id 
                  ? 'bg-white/20 shadow-lg' 
                  : 'hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Icon 
                  name={item.icon as any} 
                  size={16} 
                  className={`
                    transition-all duration-300
                    ${activeSection === item.id 
                      ? 'text-white scale-110' 
                      : 'text-white/80 group-hover:text-white group-hover:scale-105'
                    }
                  `} 
                />
                <span className={`
                  text-xs font-medium transition-all duration-300
                  ${activeSection === item.id 
                    ? 'text-white' 
                    : 'text-white/80 group-hover:text-white'
                  }
                `}>
                  {item.label}
                </span>
              </div>
              
              {/* Active indicator */}
              {activeSection === item.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
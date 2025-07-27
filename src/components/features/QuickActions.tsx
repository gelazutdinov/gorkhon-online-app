import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  category: 'contacts' | 'navigation' | 'help' | 'info';
  color: string;
}

interface QuickActionsProps {
  onClose: () => void;
  onSectionChange: (section: string) => void;
}

const QuickActions = ({ onClose, onSectionChange }: QuickActionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quickActions: QuickAction[] = [
    // Контакты
    {
      id: 'call-emergency',
      title: 'Экстренные службы',
      description: 'Быстрый доступ к номерам 112, 101, 102, 103',
      icon: 'Phone',
      action: () => {
        onSectionChange('home');
        onClose();
        // Скролл к важным номерам
        setTimeout(() => {
          const element = document.querySelector('[data-tutorial="important-numbers"]');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'contacts',
      color: 'bg-red-500'
    },
    {
      id: 'call-admin',
      title: 'Администрация',
      description: 'Связаться с администрацией поселка',
      icon: 'Building',
      action: () => {
        window.open('tel:+73012345678');
      },
      category: 'contacts',
      color: 'bg-blue-500'
    },
    {
      id: 'check-schedule',
      title: 'Расписание транспорта',
      description: 'Узнать время отправления автобуса',
      icon: 'Bus',
      action: () => {
        onSectionChange('home');
        onClose();
        setTimeout(() => {
          const element = document.querySelector('[data-tutorial="schedule"]');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'navigation',
      color: 'bg-green-500'
    },
    {
      id: 'find-pvz',
      title: 'Пункты выдачи',
      description: 'Найти ближайший пункт выдачи товаров',
      icon: 'Package',
      action: () => {
        onSectionChange('home');
        onClose();
        setTimeout(() => {
          const element = document.querySelector('[data-tutorial="pvz-section"]');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'navigation',
      color: 'bg-purple-500'
    },
    {
      id: 'work-hours',
      title: 'Режим работы',
      description: 'Время работы учреждений и служб',
      icon: 'Clock',
      action: () => {
        onSectionChange('home');
        onClose();
        setTimeout(() => {
          const element = document.querySelector('[data-tutorial="work-schedule"]');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'info',
      color: 'bg-orange-500'
    },
    {
      id: 'support',
      title: 'Техподдержка',
      description: 'Получить помощь по работе с платформой',
      icon: 'HelpCircle',
      action: () => {
        onSectionChange('support');
        onClose();
      },
      category: 'help',
      color: 'bg-gorkhon-pink'
    },
    {
      id: 'donation',
      title: 'Помочь поселку',
      description: 'Сделать пожертвование на развитие',
      icon: 'Heart',
      action: () => {
        onSectionChange('home');
        onClose();
        setTimeout(() => {
          const element = document.querySelector('[data-tutorial="donation-section"]');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'help',
      color: 'bg-gorkhon-green'
    },
    {
      id: 'weather',
      title: 'Погода',
      description: 'Узнать текущую погоду в Горхоне',
      icon: 'Cloud',
      action: () => {
        window.open('https://yandex.ru/pogoda/gorkhon', '_blank');
      },
      category: 'info',
      color: 'bg-sky-500'
    },
    {
      id: 'news',
      title: 'Новости',
      description: 'Последние новости поселка',
      icon: 'Newspaper',
      action: () => {
        onSectionChange('news');
        onClose();
      },
      category: 'info',
      color: 'bg-indigo-500'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid3X3' },
    { id: 'contacts', name: 'Контакты', icon: 'Phone' },
    { id: 'navigation', name: 'Навигация', icon: 'Navigation' },
    { id: 'help', name: 'Помощь', icon: 'Heart' },
    { id: 'info', name: 'Информация', icon: 'Info' }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Быстрые действия</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Категории */}
      <div className="flex p-4 border-b border-gray-100 gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-gorkhon-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon name={category.icon} size={14} />
            {category.name}
          </button>
        ))}
      </div>

      {/* Действия */}
      <div className="p-4">
        {filteredActions.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Нет действий в этой категории</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-left group"
              >
                <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon name={action.icon} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 group-hover:text-gorkhon-pink transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>

                <Icon name="ChevronRight" size={16} className="text-gray-400 group-hover:text-gorkhon-pink transition-colors mt-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Подсказка */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Совет</h4>
              <p className="text-xs text-blue-700 mt-1">
                Используйте быстрые действия для мгновенного доступа к часто используемым функциям
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
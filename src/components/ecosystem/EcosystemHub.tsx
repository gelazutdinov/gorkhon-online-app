import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface EcosystemService {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'maintenance' | 'coming_soon';
  category: 'essential' | 'community' | 'smart' | 'business' | 'government';
  users?: number;
  color: string;
}

interface ServiceStats {
  totalUsers: number;
  activeServices: number;
  dataTransfer: string;
  uptime: string;
}

const EcosystemHub = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  const stats: ServiceStats = {
    totalUsers: 1247,
    activeServices: 15,
    dataTransfer: '2.4 ТБ',
    uptime: '99.8%'
  };

  const services: EcosystemService[] = [
    // Основные сервисы
    {
      id: 'citizen_portal',
      name: 'Портал жителя',
      description: 'Личный кабинет с документами и услугами',
      icon: 'User',
      status: 'active',
      category: 'essential',
      users: 1247,
      color: 'bg-blue-500'
    },
    {
      id: 'digital_ruble',
      name: 'Цифровой рубль',
      description: 'Местная валютная система Горхона',
      icon: 'Coins',
      status: 'active',
      category: 'business',
      users: 892,
      color: 'bg-green-500'
    },
    {
      id: 'smart_transport',
      name: 'Умный транспорт',
      description: 'Отслеживание автобусов и карпулинг',
      icon: 'Bus',
      status: 'active',
      category: 'smart',
      users: 456,
      color: 'bg-purple-500'
    },
    
    // Коммунальные сервисы
    {
      id: 'utilities',
      name: 'ЖКХ Онлайн',
      description: 'Управление коммунальными услугами',
      icon: 'Home',
      status: 'active',
      category: 'essential',
      users: 723,
      color: 'bg-orange-500'
    },
    {
      id: 'waste_management',
      name: 'Умная утилизация',
      description: 'Система управления отходами',
      icon: 'Recycle',
      status: 'active',
      category: 'smart',
      users: 334,
      color: 'bg-emerald-500'
    },
    {
      id: 'energy_grid',
      name: 'Энергосеть',
      description: 'Мониторинг электроснабжения',
      icon: 'Zap',
      status: 'maintenance',
      category: 'smart',
      users: 156,
      color: 'bg-yellow-500'
    },
    
    // Социальные сервисы
    {
      id: 'community_forum',
      name: 'Форум жителей',
      description: 'Обсуждения и взаимопомощь',
      icon: 'MessageSquare',
      status: 'active',
      category: 'community',
      users: 678,
      color: 'bg-pink-500'
    },
    {
      id: 'events_calendar',
      name: 'События Горхона',
      description: 'Календарь мероприятий',
      icon: 'Calendar',
      status: 'active',
      category: 'community',
      users: 543,
      color: 'bg-indigo-500'
    },
    {
      id: 'healthcare',
      name: 'Цифровая медицина',
      description: 'Телемедицина и запись к врачу',
      icon: 'Heart',
      status: 'coming_soon',
      category: 'essential',
      color: 'bg-red-500'
    },
    
    // Бизнес сервисы
    {
      id: 'marketplace',
      name: 'Маркетплейс',
      description: 'Торговая площадка жителей',
      icon: 'ShoppingBag',
      status: 'active',
      category: 'business',
      users: 289,
      color: 'bg-teal-500'
    },
    {
      id: 'coworking',
      name: 'Коворкинг',
      description: 'Бронирование рабочих мест',
      icon: 'Briefcase',
      status: 'coming_soon',
      category: 'business',
      color: 'bg-slate-500'
    },
    {
      id: 'local_business',
      name: 'Бизнес-каталог',
      description: 'Каталог местных предприятий',
      icon: 'Store',
      status: 'active',
      category: 'business',
      users: 67,
      color: 'bg-amber-500'
    },
    
    // Государственные услуги
    {
      id: 'gov_services',
      name: 'Госуслуги',
      description: 'Муниципальные услуги онлайн',
      icon: 'Building',
      status: 'active',
      category: 'government',
      users: 445,
      color: 'bg-blue-700'
    },
    {
      id: 'voting',
      name: 'Электронное голосование',
      description: 'Участие в решениях поселка',
      icon: 'Vote',
      status: 'coming_soon',
      category: 'government',
      color: 'bg-gray-600'
    },
    {
      id: 'emergency',
      name: 'Экстренные службы',
      description: 'Быстрая связь со службами',
      icon: 'Phone',
      status: 'active',
      category: 'essential',
      users: 1247,
      color: 'bg-red-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все сервисы', icon: 'Grid3X3', color: 'bg-gray-100 text-gray-700' },
    { id: 'essential', name: 'Основные', icon: 'Star', color: 'bg-blue-100 text-blue-700' },
    { id: 'community', name: 'Сообщество', icon: 'Users', color: 'bg-pink-100 text-pink-700' },
    { id: 'smart', name: 'Умный город', icon: 'Cpu', color: 'bg-purple-100 text-purple-700' },
    { id: 'business', name: 'Бизнес', icon: 'TrendingUp', color: 'bg-green-100 text-green-700' },
    { id: 'government', name: 'Госуслуги', icon: 'Shield', color: 'bg-blue-100 text-blue-800' }
  ];

  const getStatusInfo = (status: EcosystemService['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Активен', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      case 'maintenance':
        return { label: 'Обслуживание', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' };
      case 'coming_soon':
        return { label: 'Скоро', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const filteredServices = services.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Заголовок экосистемы */}
      <div className="bg-gradient-to-r from-gorkhon-pink via-purple-500 to-gorkhon-green text-white rounded-2xl p-6 overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">🌐 Экосистема Горхон</h1>
              <p className="text-white/90 text-base sm:text-lg">Единая цифровая платформа жизни поселка</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Icon name="BarChart3" size={24} />
            </button>
          </div>
          
          {showStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-white/80">Пользователей</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.activeServices}</div>
                <div className="text-sm text-white/80">Сервисов</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.dataTransfer}</div>
                <div className="text-sm text-white/80">Данных</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.uptime}</div>
                <div className="text-sm text-white/80">Доступность</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Фильтры по категориям */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id 
                  ? category.color + ' scale-105 shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon name={category.icon as any} size={16} />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Сетка сервисов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const statusInfo = getStatusInfo(service.status);
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon name={service.icon as any} size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-gorkhon-pink transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {service.users && service.status === 'active' ? (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Icon name="Users" size={14} />
                    <span>{service.users.toLocaleString()} польз.</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    {service.status === 'coming_soon' ? 'В разработке' : 'Недоступно'}
                  </div>
                )}
                
                <button className="flex items-center gap-1 text-sm text-gorkhon-pink hover:text-gorkhon-green transition-colors">
                  <span>Открыть</span>
                  <Icon name="ExternalLink" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Интеграционная панель */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <Icon name="Workflow" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">🔗 Единая интеграция</h3>
            <p className="text-gray-700 mb-4">
              Все сервисы экосистемы интегрированы между собой. Используйте единый аккаунт 
              для доступа ко всем услугам, синхронизации данных и уведомлений.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                SSO авторизация
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Общие уведомления
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Синхронизация данных
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                API интеграция
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Статус системы */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-lg">📊 Статус экосистемы</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {services.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-green-700">Активных сервисов</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {services.filter(s => s.status === 'maintenance').length}
            </div>
            <div className="text-sm text-yellow-700">На обслуживании</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {services.filter(s => s.status === 'coming_soon').length}
            </div>
            <div className="text-sm text-gray-700">В разработке</div>
          </div>
        </div>
      </div>

      {/* Новости экосистемы */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">📰 Новости экосистемы</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-blue-900">Запуск цифрового рубля Горхона</div>
              <div className="text-sm text-blue-700">Новая местная валютная система начала работу</div>
              <div className="text-xs text-blue-600 mt-1">2 дня назад</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-green-900">Интеграция с умными счетчиками</div>
              <div className="text-sm text-green-700">Автоматическая передача показаний ЖКХ</div>
              <div className="text-xs text-green-600 mt-1">1 неделю назад</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-purple-900">Обновление форума жителей</div>
              <div className="text-sm text-purple-700">Добавлены новые возможности общения</div>
              <div className="text-xs text-purple-600 mt-1">2 недели назад</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemHub;
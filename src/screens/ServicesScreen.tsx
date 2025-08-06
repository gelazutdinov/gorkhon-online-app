import React from 'react';
import Icon from '@/components/ui/icon';

const ServicesScreen: React.FC = () => {
  const services = [
    {
      id: 'utilities',
      title: 'Коммунальные услуги',
      description: 'Оплата и управление счетами',
      icon: 'Home',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'parking',
      title: 'Парковка',
      description: 'Бронирование парковочных мест',
      icon: 'Car',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'maintenance',
      title: 'Обслуживание',
      description: 'Заявки на ремонт и обслуживание',
      icon: 'Wrench',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'security',
      title: 'Безопасность',
      description: 'Системы безопасности и доступа',
      icon: 'Shield',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'community',
      title: 'Сообщество',
      description: 'События и объявления',
      icon: 'Users',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'amenities',
      title: 'Инфраструктура',
      description: 'Спорт, отдых, общие зоны',
      icon: 'TreePine',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    console.log(`Открываем службу: ${serviceId}`);
  };

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Услуги</h1>
          <p className="text-gray-600">Все сервисы жилого комплекса</p>
        </div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className={`${service.bgColor} rounded-2xl p-4 text-left hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon name={service.icon as any} size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Популярные действия */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Оплатить коммунальные услуги</div>
                <div className="text-sm text-gray-600">Быстрая оплата счетов</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Icon name="Calendar" size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Забронировать парковку</div>
                <div className="text-sm text-gray-600">На сегодня или на будущее</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Icon name="AlertCircle" size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Подать заявку на ремонт</div>
                <div className="text-sm text-gray-600">Сообщить о проблеме</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesScreen;
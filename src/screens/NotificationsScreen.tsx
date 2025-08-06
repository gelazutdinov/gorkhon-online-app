import React from 'react';
import Icon from '@/components/ui/icon';

const NotificationsScreen: React.FC = () => {
  const notifications = [
    {
      id: '1',
      type: 'payment',
      title: 'Счет за коммунальные услуги',
      message: 'Новый счет за декабрь 2024. Сумма к оплате: 8,450 ₽',
      time: '10:30',
      isRead: false,
      icon: 'CreditCard',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Плановое отключение воды',
      message: 'Завтра с 09:00 до 15:00 будет отключена холодная вода в доме №3',
      time: '08:15',
      isRead: false,
      icon: 'Droplets',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: '3',
      type: 'community',
      title: 'Новое объявление',
      message: 'Собрание жильцов состоится 15 декабря в 19:00 в актовом зале',
      time: 'Вчера',
      isRead: true,
      icon: 'Users',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '4',
      type: 'security',
      title: 'Доступ предоставлен',
      message: 'Гостевой пропуск активирован для посетителя на 2 часа',
      time: 'Вчера',
      isRead: true,
      icon: 'Shield',
      color: 'from-green-500 to-green-600'
    },
    {
      id: '5',
      type: 'parking',
      title: 'Парковочное место',
      message: 'Ваше место №45 забронировано на завтра с 08:00 до 18:00',
      time: '2 дня назад',
      isRead: true,
      icon: 'Car',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notificationId: string) => {
    console.log(`Открываем уведомление: ${notificationId}`);
  };

  const handleMarkAllAsRead = () => {
    console.log('Отмечаем все как прочитанные');
  };

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">
                {unreadCount} непрочитанных
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-gorkhon-blue text-sm font-medium hover:text-gorkhon-blue/80"
            >
              Отметить все
            </button>
          )}
        </div>

        {/* Счетчик */}
        {unreadCount > 0 && (
          <div className="bg-gorkhon-blue/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gorkhon-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{unreadCount}</span>
              </div>
              <div>
                <p className="text-gorkhon-blue font-medium">Новые уведомления</p>
                <p className="text-sm text-gorkhon-blue/80">Требуют вашего внимания</p>
              </div>
            </div>
          </div>
        )}

        {/* Список уведомлений */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                notification.isRead 
                  ? 'bg-white shadow-sm' 
                  : 'bg-blue-50 shadow-md border-l-4 border-gorkhon-blue'
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon name={notification.icon as any} size={20} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium ${notification.isRead ? 'text-gray-900' : 'text-gray-900 font-bold'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-gorkhon-blue rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Пустое состояние (если уведомлений нет) */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Bell" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
            <p className="text-gray-600">Все важные обновления будут отображаться здесь</p>
          </div>
        )}

        {/* Настройки уведомлений */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <Icon name="Settings" size={20} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Настройки уведомлений</div>
                <div className="text-sm text-gray-600">Управление типами уведомлений</div>
              </div>
            </div>
            <Icon name="ChevronRight" size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
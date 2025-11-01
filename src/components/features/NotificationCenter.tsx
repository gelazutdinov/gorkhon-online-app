import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
  read: boolean;
  important?: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  useEffect(() => {
    // Загружаем уведомления из localStorage
    const savedNotifications = localStorage.getItem('gorkhon_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Создаем примеры уведомлений
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'Добро пожаловать!',
          message: 'Спасибо за регистрацию в Горхон.Online. Изучите все возможности платформы.',
          type: 'success',
          timestamp: Date.now() - 300000, // 5 минут назад
          read: false,
          important: true
        },
        {
          id: '2',
          title: 'Обновление расписания',
          message: 'Расписание автобуса на завтра изменено. Проверьте актуальную информацию.',
          type: 'info',
          timestamp: Date.now() - 3600000, // 1 час назад
          read: false
        },
        {
          id: '3',
          title: 'Напоминание',
          message: 'Не забудьте проверить важные номера телефонов в разделе контактов.',
          type: 'warning',
          timestamp: Date.now() - 86400000, // 1 день назад
          read: true
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('gorkhon_notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(notif => notif.id !== id);
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'important':
        return notifications.filter(n => n.important);
      default:
        return notifications;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
    return `${Math.floor(diff / 86400000)} дн назад`;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Уведомления</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} непрочитанных</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-gorkhon-pink hover:text-gorkhon-pink/80"
            >
              Прочитать все
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex p-4 border-b border-gray-100 gap-2">
        {[
          { key: 'all', label: 'Все' },
          { key: 'unread', label: 'Непрочитанные' },
          { key: 'important', label: 'Важные' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === key
                ? 'bg-gorkhon-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Список уведомлений */}
      <div className="overflow-y-auto max-h-96">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Нет уведомлений</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 rounded-xl border transition-all hover:shadow-md ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gorkhon-pink/20 shadow-sm'
                }`}
              >
                {/* Индикатор важности */}
                {notification.important && (
                  <div className="absolute top-2 right-2">
                    <Icon name="Star" size={16} className="text-yellow-500" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Иконка типа */}
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    <Icon name={getTypeIcon(notification.type)} size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>

                    {/* Действия */}
                    <div className="flex items-center gap-3 mt-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-gorkhon-pink hover:text-gorkhon-pink/80"
                        >
                          Отметить прочитанным
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
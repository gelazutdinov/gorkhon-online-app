import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
  onUpdateCount: () => void;
}

const NotificationCenter = ({ onClose, onUpdateCount }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const saved = localStorage.getItem('gorkhon_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Создаем дефолтные уведомления если данные повреждены
        createDefaultNotifications();
      }
    } else {
      createDefaultNotifications();
    }
  };

  const createDefaultNotifications = () => {
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        title: 'Добро пожаловать!',
        message: 'Спасибо за регистрацию на платформе Горхон.Online. Изучите все возможности личного кабинета.',
        type: 'success',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 минут назад
        read: false
      },
      {
        id: '2',
        title: 'Обновление расписания',
        message: 'Расписание автобусов на завтра изменено. Проверьте актуальную информацию в разделе "Транспорт".',
        type: 'info',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 часа назад
        read: false
      },
      {
        id: '3',
        title: 'Новая тема оформления',
        message: 'Теперь доступна темная тема! Попробуйте её в настройках оформления.',
        type: 'info',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // день назад
        read: true
      }
    ];
    
    setNotifications(defaultNotifications);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(defaultNotifications));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
    onUpdateCount();
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
    onUpdateCount();
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('gorkhon_notifications', JSON.stringify(updated));
    onUpdateCount();
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('gorkhon_notifications');
    onUpdateCount();
  };

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000 * 60) return 'только что';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))} мин. назад`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))} ч. назад`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))} дн. назад`;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Уведомления</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} непрочитанных</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Фильтры и действия */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-gorkhon-pink text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Все ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'unread' 
                  ? 'bg-gorkhon-pink text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Непрочитанные ({unreadCount})
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Прочитать все
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Очистить все
            </button>
          )}
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="p-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {filter === 'unread' ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
            </h3>
            <p className="text-sm text-gray-500">
              {filter === 'unread' 
                ? 'Все уведомления прочитаны' 
                : 'Уведомления будут появляться здесь'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    <Icon 
                      name={getNotificationIcon(notification.type) as any} 
                      size={16} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium ${
                        notification.read ? 'text-gray-600' : 'text-gray-800'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Отметить как прочитанное"
                          >
                            <Icon name="Check" size={14} className="text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Удалить уведомление"
                        >
                          <Icon name="Trash2" size={14} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-2 ${
                      notification.read ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-gorkhon-pink rounded-full"></div>
                      )}
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
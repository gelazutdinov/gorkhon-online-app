import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useNotifications } from '@/hooks/useNotifications';
import { SystemNotification } from '@/types/notification';

const NotificationBanner: React.FC = () => {
  const { getUnreadNotifications, markAsRead } = useNotifications();
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  
  const unreadNotifications = getUnreadNotifications().filter(
    n => !dismissedNotifications.includes(n.id)
  );

  if (unreadNotifications.length === 0) return null;

  const handleDismiss = (notification: SystemNotification) => {
    setDismissedNotifications(prev => [...prev, notification.id]);
    markAsRead(notification.id);
  };

  const getPriorityIcon = (priority: SystemNotification['priority']) => {
    switch (priority) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'Bell';
      default: return 'Bell';
    }
  };

  const getPriorityColors = (priority: SystemNotification['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'medium': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'low': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeLabel = (type: SystemNotification['type']) => {
    const labels = {
      update: '🔄 Обновление',
      feature: '✨ Новая функция',
      maintenance: '🔧 Технические работы',
      announcement: '📢 Объявление'
    };
    return labels[type];
  };

  return (
    <div className="space-y-2">
      {unreadNotifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-3 md:p-4 ${getPriorityColors(notification.priority)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
              <Icon 
                name={getPriorityIcon(notification.priority) as any} 
                size={16} 
                className="md:w-5 md:h-5 mt-0.5 flex-shrink-0" 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate flex-1">{notification.title}</h3>
                  <span className="text-xs px-2 py-1 bg-white/50 rounded-full whitespace-nowrap flex-shrink-0">
                    {getTypeLabel(notification.type)}
                  </span>
                </div>
                
                <div 
                  className="text-sm opacity-90 mb-2 break-words"
                  dangerouslySetInnerHTML={{ __html: notification.content }}
                />
                
                {notification.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={notification.imageUrl} 
                      alt="Notification" 
                      className="w-full max-w-full sm:max-w-sm h-24 sm:h-32 object-cover rounded border"
                    />
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {notification.createdAt.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDismiss(notification)}
              className="ml-2 p-1.5 md:p-1 hover:bg-white/30 rounded-full transition-colors flex-shrink-0"
              title="Закрыть"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      ))}
      
      {unreadNotifications.length > 3 && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-600">
            и ещё {unreadNotifications.length - 3} уведомлений...
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationBanner;
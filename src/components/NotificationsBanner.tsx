import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useTelegramNotifications } from '@/hooks/useTelegramNotifications';

interface TelegramNotification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'feature' | 'news' | 'important';
  status: 'draft' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

const NotificationsBanner = () => {
  const { getBannerNotifications } = useTelegramNotifications();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const notifications = getBannerNotifications();

  useEffect(() => {
    loadDismissedNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && currentIndex < notifications.length) {
      setIsVisible(true);
      
      // Автоматическое переключение уведомлений каждые 5 секунд
      const timer = setTimeout(() => {
        if (currentIndex < notifications.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, currentIndex]);

  const loadDismissedNotifications = () => {
    try {
      const dismissed = localStorage.getItem('dismissedNotifications');
      if (dismissed) {
        setDismissedIds(JSON.parse(dismissed));
      }
    } catch (error) {
      console.error('Ошибка загрузки скрытых уведомлений:', error);
    }
  };

  const dismissNotification = (notificationId: string) => {
    const updatedDismissed = [...dismissedIds, notificationId];
    setDismissedIds(updatedDismissed);
    
    try {
      localStorage.setItem('dismissedNotifications', JSON.stringify(updatedDismissed));
    } catch (error) {
      console.error('Ошибка сохранения скрытых уведомлений:', error);
    }

    // Переключаемся на следующее уведомление
    if (currentIndex < notifications.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (notifications.length > 1) {
      setCurrentIndex(0);
    } else {
      setIsVisible(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'update': return 'RefreshCw';
      case 'feature': return 'Sparkles';
      case 'news': return 'Newspaper';
      case 'important': return 'AlertTriangle';
      default: return 'Bell';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'update': return 'bg-blue-500';
      case 'feature': return 'bg-purple-500';
      case 'news': return 'bg-green-500';
      case 'important': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'update': return 'Обновление';
      case 'feature': return 'Новая функция';
      case 'news': return 'Новости';
      case 'important': return 'Важное';
      default: return 'Уведомление';
    }
  };

  // Фильтруем уведомления, исключая скрытые
  const visibleNotifications = notifications.filter(n => !dismissedIds.includes(n.id));
  
  if (!isVisible || visibleNotifications.length === 0) {
    return null;
  }

  const currentNotification = visibleNotifications[currentIndex % visibleNotifications.length];
  
  if (!currentNotification) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full md:max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor(currentNotification.type)} flex-shrink-0`}>
            <Icon name={getTypeIcon(currentNotification.type) as any} size={16} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {getTypeLabel(currentNotification.type)}: {currentNotification.title}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(currentNotification.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {currentNotification.message}
            </p>
            
            {/* Индикаторы для нескольких уведомлений */}
            {visibleNotifications.length > 1 && (
              <div className="flex items-center gap-1 mt-2">
                {visibleNotifications.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentIndex ? getTypeColor(currentNotification.type) : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Кнопка перехода к боту */}
            <a
              href="https://t.me/gorhononline_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Подписаться на уведомления в Telegram"
            >
              <Icon name="ExternalLink" size={16} />
            </a>
            
            {/* Кнопка закрытия */}
            <button
              onClick={() => dismissNotification(currentNotification.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Скрыть уведомление"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsBanner;
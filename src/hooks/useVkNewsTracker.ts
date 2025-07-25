import { useState, useEffect, useCallback } from 'react';

interface VkPost {
  id: string;
  text: string;
  date: number;
  url: string;
  images?: string[];
}

export const useVkNewsTracker = () => {
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  const [isTracking, setIsTracking] = useState(false);
  const [notifications, setNotifications] = useState<VkPost[]>([]);

  // Симуляция проверки новых постов ВК
  const checkForNewPosts = useCallback(async (): Promise<VkPost[]> => {
    // В реальном приложении здесь был бы API запрос к VK
    // Сейчас симулируем случайные новые посты
    const mockPosts: VkPost[] = [];
    
    // Генерируем случайный пост с вероятностью 20%
    if (Math.random() < 0.2) {
      const postTexts = [
        'Уважаемые жители! Завтра с 10:00 до 16:00 планируется отключение электроэнергии на ул. Центральная.',
        'Напоминаем о графике работы медпункта: ПН-ПТ 9:00-17:00, СБ 10:00-14:00.',
        'В субботу 28 декабря в 14:00 состоится новогодний концерт в клубе.',
        'Внимание! Изменение расписания автобуса: рейс 15:30 отменен до особого распоряжения.',
        'Приглашаем всех жителей на субботник 30 декабря в 10:00. Место сбора - у администрации.'
      ];
      
      mockPosts.push({
        id: `post_${Date.now()}`,
        text: postTexts[Math.floor(Math.random() * postTexts.length)],
        date: Date.now(),
        url: `https://vk.com/gorkhon_official?w=wall-123456789_${Date.now()}`,
        images: Math.random() < 0.3 ? ['https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400'] : undefined
      });
    }
    
    return mockPosts;
  }, []);

  // Функция для отправки push-уведомления
  const sendNotification = useCallback((post: VkPost) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Новости Горхона', {
        body: post.text.slice(0, 100) + (post.text.length > 100 ? '...' : ''),
        icon: '/favicon.ico',
        tag: `gorkhon-news-${post.id}`,
        requireInteraction: true,
        actions: [
          { action: 'view', title: 'Просмотреть' },
          { action: 'close', title: 'Закрыть' }
        ]
      });
    }
  }, []);

  // Запрос разрешения на уведомления
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Основной цикл проверки
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        const newPosts = await checkForNewPosts();
        
        if (newPosts.length > 0) {
          // Фильтруем только новые посты
          const reallyNewPosts = newPosts.filter(post => post.date > lastChecked);
          
          if (reallyNewPosts.length > 0) {
            setNotifications(prev => [...reallyNewPosts, ...prev].slice(0, 10)); // Храним только последние 10
            
            // Отправляем уведомления
            reallyNewPosts.forEach(post => {
              sendNotification(post);
            });
            
            setLastChecked(Date.now());
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке новостей ВК:', error);
      }
    }, 30000); // Проверяем каждые 30 секунд

    return () => clearInterval(interval);
  }, [isTracking, lastChecked, checkForNewPosts, sendNotification]);

  const startTracking = useCallback(async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      setIsTracking(true);
      setLastChecked(Date.now());
    }
    return hasPermission;
  }, [requestNotificationPermission]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isTracking,
    notifications,
    startTracking,
    stopTracking,
    clearNotifications,
    hasNewNotifications: notifications.length > 0
  };
};
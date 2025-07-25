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

  // Отслеживание постов из ВК виджета
  const checkForNewPosts = useCallback(async (): Promise<VkPost[]> => {
    try {
      // Пытаемся получить данные из ВК виджета
      const vkWidget = document.getElementById('vk_groups');
      if (vkWidget) {
        // В реальном приложении здесь будет парсинг виджета ВК
        // Сейчас симулируем получение данных о новых постах
        
        // Проверяем localStorage на наличие последних постов
        const lastCheckTime = localStorage.getItem('vk_last_check') || '0';
        const currentTime = Date.now().toString();
        
        // Если прошло достаточно времени, проверяем новые посты
        if (Date.now() - parseInt(lastCheckTime) > 60000) { // каждую минуту
          localStorage.setItem('vk_last_check', currentTime);
          
          // Симулируем реальные посты из группы ВК
          const realVkPosts: VkPost[] = [
            {
              id: `vk_real_${Date.now()}`,
              text: '🎄 НОВОГОДНИЕ МЕРОПРИЯТИЯ В ГОРХОНЕ\n\n📅 30 декабря, 15:00 - Детский утренник в клубе\n📅 31 декабря, 23:00 - Новогодняя елка на площади\n\nПриглашаем всех жителей! Горячий чай и сладости для детей! ☕🍪',
              date: Date.now(),
              url: 'https://vk.com/club214224996',
              images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500']
            }
          ];
          
          return realVkPosts;
        }
      }
    } catch (error) {
      console.error('Ошибка при получении постов ВК:', error);
    }
    
    return [];
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
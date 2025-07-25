import { useState, useEffect } from 'react';

interface NewsNotification {
  id: string;
  title: string;
  timestamp: number;
  read: boolean;
}

export const useNewsNotifications = () => {
  const [notifications, setNotifications] = useState<NewsNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Загрузка уведомлений из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gorkhon_news_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: NewsNotification) => !n.read).length);
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
    } else {
      // Первый запуск - добавляем начальное уведомление
      const initialNotification: NewsNotification = {
        id: 'welcome',
        title: 'Добро пожаловать! Здесь будут появляться уведомления о новых новостях',
        timestamp: Date.now(),
        read: false
      };
      setNotifications([initialNotification]);
      setUnreadCount(1);
      localStorage.setItem('gorkhon_news_notifications', JSON.stringify([initialNotification]));
    }
  }, []);

  // Симуляция проверки новых новостей каждые 30 секунд
  useEffect(() => {
    const checkForNews = () => {
      // Имитируем получение новости с 10% вероятностью
      if (Math.random() < 0.1) {
        const newNotification: NewsNotification = {
          id: `news_${Date.now()}`,
          title: getRandomNewsTitle(),
          timestamp: Date.now(),
          read: false
        };

        setNotifications(prev => {
          const updated = [newNotification, ...prev].slice(0, 10); // Храним максимум 10 уведомлений
          localStorage.setItem('gorkhon_news_notifications', JSON.stringify(updated));
          return updated;
        });

        setUnreadCount(prev => prev + 1);
      }
    };

    const interval = setInterval(checkForNews, 30000); // Проверка каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  // Отметить уведомление как прочитанное
  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('gorkhon_news_notifications', JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Отметить все как прочитанные
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('gorkhon_news_notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  };

  // Добавить новое уведомление вручную (для тестирования)
  const addTestNotification = () => {
    const newNotification: NewsNotification = {
      id: `test_${Date.now()}`,
      title: 'Тестовое уведомление о новости',
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 10);
      localStorage.setItem('gorkhon_news_notifications', JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(prev => prev + 1);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addTestNotification
  };
};

// Генератор случайных заголовков новостей
const getRandomNewsTitle = (): string => {
  const titles = [
    'Новое объявление от администрации поселка',
    'Изменения в расписании автобусов',
    'Плановые работы на водопроводе',
    'Субботник в центральном парке',
    'Открытие нового пункта выдачи',
    'Важная информация для жителей',
    'Обновление режима работы поликлиники',
    'Праздничные мероприятия в поселке',
    'Ремонт дорожного покрытия',
    'Новые услуги для жителей'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};
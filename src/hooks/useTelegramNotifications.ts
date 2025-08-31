import { useState, useEffect, useCallback } from 'react';
import { telegramMockService as telegramService, type TelegramMessage } from '@/services/telegramMockService';

interface TelegramNotification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'feature' | 'news' | 'important';
  status: 'draft' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  recipientsCount?: number;
}

export const useTelegramNotifications = () => {
  const [notifications, setNotifications] = useState<TelegramNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Загрузка уведомлений из localStorage
  const loadNotifications = useCallback(() => {
    try {
      const saved = localStorage.getItem('telegramNotifications');
      if (saved) {
        const allNotifications: TelegramNotification[] = JSON.parse(saved);
        setNotifications(allNotifications);
        
        // Подсчитываем новые уведомления (за последние 24 часа)
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);
        
        const recentNotifications = allNotifications.filter(
          n => n.status === 'sent' && new Date(n.createdAt) > oneDayAgo
        );
        
        setUnreadCount(recentNotifications.length);
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  }, []);

  // Получение последних уведомлений для отображения
  const getRecentNotifications = useCallback((limit: number = 5): TelegramNotification[] => {
    return notifications
      .filter(n => n.status === 'sent')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [notifications]);

  // Получение уведомлений для баннера (за последнюю неделю)
  const getBannerNotifications = useCallback((): TelegramNotification[] => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return notifications
      .filter(n => n.status === 'sent' && new Date(n.createdAt) > weekAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [notifications]);

  // Отметить уведомления как прочитанные
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
    // Можно также сохранить время последнего просмотра в localStorage
    try {
      localStorage.setItem('lastNotificationCheck', new Date().toISOString());
    } catch (error) {
      console.error('Ошибка сохранения времени просмотра:', error);
    }
  }, []);

  // Обновить статус уведомления
  const updateNotificationStatus = useCallback((id: string, status: 'sent' | 'failed', recipientsCount?: number) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id 
        ? { 
            ...n, 
            status, 
            sentAt: status === 'sent' ? new Date().toISOString() : n.sentAt,
            recipientsCount: recipientsCount || n.recipientsCount
          }
        : n
    );
    
    setNotifications(updatedNotifications);
    
    try {
      localStorage.setItem('telegramNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Ошибка обновления уведомления:', error);
    }
  }, [notifications]);

  // Отправить уведомление всем подписчикам
  const sendNotification = useCallback(async (notificationData: Omit<TelegramMessage, 'id'>): Promise<{success: boolean, recipientsCount?: number, errors?: string[]}> => {
    const notification: TelegramNotification = {
      id: Date.now().toString(),
      ...notificationData,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    
    // Сначала добавляем как черновик
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    
    try {
      localStorage.setItem('telegramNotifications', JSON.stringify(updatedNotifications));
      
      // Отправляем через массовую рассылку
      const result = await telegramService.sendBulkNotification(notificationData);
      
      if (result.success > 0) {
        // Обновляем статус на отправленный
        updateNotificationStatus(notification.id, 'sent', result.success);
        return { 
          success: true, 
          recipientsCount: result.success,
          errors: result.errors 
        };
      } else {
        // Обновляем статус на ошибку
        updateNotificationStatus(notification.id, 'failed');
        return { 
          success: false, 
          errors: result.errors 
        };
      }
    } catch (error) {
      updateNotificationStatus(notification.id, 'failed');
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Неизвестная ошибка'] 
      };
    }
  }, [notifications, updateNotificationStatus]);

  // Добавить новое уведомление (используется в админке)
  const addNotification = useCallback((notification: TelegramNotification) => {
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    
    try {
      localStorage.setItem('telegramNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Ошибка сохранения уведомления:', error);
    }
  }, [notifications]);

  // Проверка новых уведомлений при загрузке
  useEffect(() => {
    loadNotifications();
    
    // Периодически проверяем новые уведомления
    const interval = setInterval(loadNotifications, 30000); // каждые 30 секунд
    
    return () => clearInterval(interval);
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    getRecentNotifications,
    getBannerNotifications,
    markAsRead,
    sendNotification,
    addNotification,
    updateNotificationStatus,
    loadNotifications
  };
};
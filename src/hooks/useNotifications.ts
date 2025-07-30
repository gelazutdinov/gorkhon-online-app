import { useState, useEffect } from 'react';
import { SystemNotification, NotificationFormData } from '@/types/notification';

const NOTIFICATIONS_KEY = 'system-notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt)
        })));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    setIsLoading(false);
  };

  const saveNotifications = (newNotifications: SystemNotification[]) => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const createNotification = (data: NotificationFormData): SystemNotification => {
    const notification: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'developer', // В реальном приложении это будет ID разработчика
      readBy: []
    };

    const updated = [notification, ...notifications];
    saveNotifications(updated);
    return notification;
  };

  const updateNotification = (id: string, data: Partial<NotificationFormData>): boolean => {
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) return false;

    const updated = [...notifications];
    updated[index] = {
      ...updated[index],
      ...data,
      updatedAt: new Date()
    };

    saveNotifications(updated);
    return true;
  };

  const deleteNotification = (id: string): boolean => {
    const updated = notifications.filter(n => n.id !== id);
    if (updated.length === notifications.length) return false;
    
    saveNotifications(updated);
    return true;
  };

  const markAsRead = (notificationId: string, userId: string = 'current-user') => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.readBy.includes(userId)) return;

    const updated = notifications.map(n => 
      n.id === notificationId 
        ? { ...n, readBy: [...n.readBy, userId] }
        : n
    );

    saveNotifications(updated);
  };

  const getActiveNotifications = () => {
    return notifications
      .filter(n => n.isActive)
      .sort((a, b) => {
        // Сортировка по приоритету, затем по дате
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const getUnreadNotifications = (userId: string = 'current-user') => {
    return getActiveNotifications().filter(n => !n.readBy.includes(userId));
  };

  return {
    notifications,
    isLoading,
    createNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    getActiveNotifications,
    getUnreadNotifications,
    refreshNotifications: loadNotifications
  };
};
import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import IOSNotification from '@/components/IOSNotification';

interface NotificationOptions {
  title: string;
  message: string;
  icon?: string;
  duration?: number;
}

export const useIOSNotification = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const showNotification = useCallback(({ 
    title, 
    message, 
    icon = "Bell",
    duration = 4000 
  }: NotificationOptions) => {
    // Создаем контейнер для уведомления
    const notificationContainer = document.createElement('div');
    document.body.appendChild(notificationContainer);
    
    const root = createRoot(notificationContainer);

    const handleClose = () => {
      root.unmount();
      document.body.removeChild(notificationContainer);
    };

    root.render(
      <IOSNotification
        title={title}
        message={message}
        icon={icon}
        duration={duration}
        onClose={handleClose}
      />
    );

    setContainer(notificationContainer);
  }, []);

  return { showNotification };
};

// Глобальная функция для показа уведомлений из любого места
export const showIOSNotification = (options: NotificationOptions) => {
  const notificationContainer = document.createElement('div');
  document.body.appendChild(notificationContainer);
  
  const root = createRoot(notificationContainer);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(notificationContainer);
  };

  root.render(
    <IOSNotification
      title={options.title}
      message={options.message}
      icon={options.icon || "Bell"}
      duration={options.duration || 4000}
      onClose={handleClose}
    />
  );
};

const PUSH_NOTIFICATIONS_URL = 'https://functions.poehali.dev/43f28296-30ca-4b8a-8f97-18a00f923b6a';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Push notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const registerPushSubscription = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      return false;
    }

    const pushToken = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const response = await fetch(PUSH_NOTIFICATIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pushToken,
        userInfo: {
          browser: navigator.userAgent,
          platform: navigator.platform,
          registeredAt: new Date().toISOString()
        }
      })
    });

    if (response.ok) {
      localStorage.setItem('pushToken', pushToken);
      localStorage.setItem('pushSubscribed', 'true');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to register push subscription:', error);
    return false;
  }
};

export const isPushSubscribed = (): boolean => {
  return localStorage.getItem('pushSubscribed') === 'true';
};

export const showWelcomeNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('Горхон.Online', {
      body: 'Уведомления подключены! Теперь вы не пропустите важные новости.',
      icon: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
      badge: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png'
    });
  }
};

const PUBLIC_VAPID_KEY = 'BFGk7fINvW4s0HJwYIU9Z8Y8vBcBqVqG5X7-8RY3fvNz9XH8LkWj3YQ7_K5vH8fN9jK7vL8wM9xN6vK5jH8gF4s';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker не поддерживается');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker зарегистрирован');
    return registration;
  } catch (error) {
    console.error('Ошибка регистрации Service Worker:', error);
    return null;
  }
}

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

export async function subscribeToPush(userId: string): Promise<PushSubscriptionData | null> {
  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      console.error('Service Worker не зарегистрирован');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Пользователь отклонил разрешение на уведомления');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!)
      }
    };

    await saveSubscription(userId, subscriptionData);
    
    localStorage.setItem('pushSubscribed', 'true');
    localStorage.setItem('pushUserId', userId);

    return subscriptionData;
  } catch (error) {
    console.error('Ошибка подписки на push:', error);
    if (error instanceof Error) {
      console.error('Детали ошибки:', error.message);
    }
    return null;
  }
}

export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscription(userId);
      
      localStorage.removeItem('pushSubscribed');
      localStorage.removeItem('pushUserId');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка отписки от push:', error);
    return false;
  }
}

export async function checkPushSubscription(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return subscription !== null;
  } catch (error) {
    console.error('Ошибка проверки подписки:', error);
    return false;
  }
}

export const isPushSubscribed = (): boolean => {
  return localStorage.getItem('pushSubscribed') === 'true';
};

async function saveSubscription(userId: string, subscription: PushSubscriptionData): Promise<void> {
  const response = await fetch('https://functions.poehali.dev/ed08bc5f-7996-422a-9404-6cd2f1d3df29', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      subscription
    })
  });

  if (!response.ok) {
    throw new Error('Ошибка сохранения подписки');
  }
}

async function removeSubscription(userId: string): Promise<void> {
  const response = await fetch('https://functions.poehali.dev/ed08bc5f-7996-422a-9404-6cd2f1d3df29', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId })
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления подписки');
  }
}

export const showWelcomeNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('Горхон.Online', {
      body: 'Уведомления подключены! Теперь вы не пропустите важные новости.',
      icon: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
      badge: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
      vibrate: [200, 100, 200]
    });
  }
};

export async function sendTestNotification(): Promise<void> {
  const permission = await requestNotificationPermission();
  
  if (permission) {
    new Notification('Тестовое уведомление', {
      body: 'Push-уведомления работают!',
      icon: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
      badge: 'https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png',
      vibrate: [200, 100, 200]
    });
  }
}
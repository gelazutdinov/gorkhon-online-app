import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { subscribeToPush, unsubscribeFromPush, checkPushSubscription, showWelcomeNotification } from '@/utils/pushNotifications';

const PushNotificationToggle = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', id);
    }
    return id;
  });

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const subscribed = await checkPushSubscription();
    setIsSubscribed(subscribed);
  };

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSubscribed) {
        const success = await unsubscribeFromPush(userId);
        if (success) {
          setIsSubscribed(false);
        }
      } else {
        const subscription = await subscribeToPush(userId);
        if (subscription) {
          setIsSubscribed(true);
          showWelcomeNotification();
        }
      }
    } catch (error) {
      console.error('Ошибка переключения уведомлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          group relative overflow-hidden rounded-full shadow-2xl transition-all duration-300
          ${isSubscribed 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
          }
          ${isLoading ? 'scale-95 opacity-70' : 'hover:scale-105'}
        `}
        size="lg"
      >
        <div className="flex items-center gap-3 px-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon 
              name={isSubscribed ? "BellRing" : "Bell"} 
              size={20} 
              className={`transition-transform ${isSubscribed ? 'animate-pulse' : ''}`}
            />
          )}
          <span className="font-semibold">
            {isLoading 
              ? 'Загрузка...' 
              : isSubscribed 
                ? 'Уведомления включены' 
                : 'Включить уведомления'
            }
          </span>
        </div>
        
        {isSubscribed && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 rounded-full">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Icon name="BellOff" size={20} />
              <span>Отключить</span>
            </div>
          </div>
        )}
      </Button>
    </div>
  );
};

export default PushNotificationToggle;

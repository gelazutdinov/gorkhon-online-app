import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { subscribeToPush, isPushSubscribed, showWelcomeNotification } from '@/utils/pushNotifications';

const PushNotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
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
    const checkAndShow = async () => {
      const dismissed = localStorage.getItem('pushBannerDismissed');
      const subscribed = isPushSubscribed();
      
      if (!dismissed && !subscribed) {
        setTimeout(() => setIsVisible(true), 2000);
      }
    };
    
    checkAndShow();
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPush(userId);
      if (subscription) {
        showWelcomeNotification();
        setIsVisible(false);
        localStorage.setItem('pushBannerDismissed', 'true');
      }
    } catch (error) {
      console.error('Ошибка включения уведомлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pushBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slideDown">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon name="Bell" size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">Не пропускайте важное!</h3>
          <p className="text-xs text-white/90">Включите уведомления о новостях</p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleEnable}
            disabled={isLoading}
            className="px-4 py-2 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Включить'
            )}
          </button>
          
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationBanner;

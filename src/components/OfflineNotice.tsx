import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
      <Icon name="WifiOff" size={18} />
      <span className="text-sm font-medium">Офлайн режим — некоторые функции недоступны</span>
    </div>
  );
};

export default OfflineNotice;

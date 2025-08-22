import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import Icon from '@/components/ui/icon';

const ServerStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      const connected = await apiClient.checkServerConnection();
      setIsConnected(connected);
      setIsChecking(false);
    };

    checkConnection();
    
    // Проверяем каждые 30 секунд
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="Loader2" className="w-4 h-4 animate-spin" />
        <span>Проверка сервера...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-600 font-medium">Сервер не работает</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm mb-2">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-green-600 font-medium">Сервер работает</span>
    </div>
  );
};

export default ServerStatus;
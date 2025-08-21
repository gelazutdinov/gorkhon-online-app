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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-800">Сервер недоступен</h3>
            <p className="text-sm text-orange-700 mt-1">
              Не удается подключиться к серверу. Работа в автономном режиме.
            </p>
            <p className="text-xs text-orange-600 mt-2">
              Для запуска сервера: <code className="bg-orange-100 px-1 rounded">cd server && tsx src/app.ts</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
      <Icon name="CheckCircle" className="w-4 h-4" />
      <span>Сервер подключен</span>
    </div>
  );
};

export default ServerStatus;
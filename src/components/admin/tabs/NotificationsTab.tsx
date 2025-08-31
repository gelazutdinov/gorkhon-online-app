import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { telegramMockService } from '@/services/telegramMockService';

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

interface NotificationsTabProps {
  onSendNotification: (notification: Omit<TelegramNotification, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
}

const NotificationsTab = ({ onSendNotification }: NotificationsTabProps) => {
  const [notifications, setNotifications] = useState<TelegramNotification[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'news' as const
  });
  const [botStatus, setBotStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    loadNotifications();
    checkBotStatus();
  }, []);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('telegramNotifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  };

  const saveNotifications = (updatedNotifications: TelegramNotification[]) => {
    try {
      localStorage.setItem('telegramNotifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Ошибка сохранения уведомлений:', error);
    }
  };

  const checkBotStatus = async () => {
    setBotStatus('checking');
    try {
      const health = await telegramMockService.checkHealth();
      setBotStatus(health.isOnline && health.botConfigured ? 'connected' : 'disconnected');
    } catch (error) {
      setBotStatus('disconnected');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'update': return 'RefreshCw';
      case 'feature': return 'Sparkles';
      case 'news': return 'Newspaper';
      case 'important': return 'AlertTriangle';
      default: return 'Bell';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'update': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'feature': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'news': return 'text-green-600 bg-green-50 border-green-200';
      case 'important': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'update': return 'Обновление';
      case 'feature': return 'Новая функция';
      case 'news': return 'Новости';
      case 'important': return 'Важное';
      default: return 'Уведомление';
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      return;
    }

    setIsSending(true);
    try {
      const notification: TelegramNotification = {
        id: Date.now().toString(),
        ...newNotification,
        status: 'draft',
        createdAt: new Date().toISOString()
      };

      // Отправляем уведомление через сервер
      const result = await telegramMockService.sendBulkNotification(newNotification);
      
      if (result.success > 0) {
        notification.status = 'sent';
        notification.sentAt = new Date().toISOString();
        notification.recipientsCount = result.success;
      } else {
        notification.status = 'failed';
      }

      const updatedNotifications = [notification, ...notifications];
      saveNotifications(updatedNotifications);

      if (result.success > 0) {
        setNewNotification({ title: '', message: '', type: 'news' });
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    } finally {
      setIsSending(false);
    }
  };

  const retryNotification = async (notification: TelegramNotification) => {
    setIsSending(true);
    try {
      const result = await telegramMockService.sendBulkNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type
      });

      if (result.success > 0) {
        const updatedNotifications = notifications.map(n =>
          n.id === notification.id
            ? { ...n, status: 'sent' as const, sentAt: new Date().toISOString(), recipientsCount: result.success }
            : n
        );
        saveNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Ошибка повторной отправки:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статус бота */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon name="Send" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Telegram уведомления</h2>
            <p className="text-gray-600">Личные сообщения всем подписчикам бота</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            botStatus === 'connected' 
              ? 'bg-green-50 border-green-200 text-green-700'
              : botStatus === 'disconnected'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            {botStatus === 'checking' && <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
            {botStatus === 'connected' && <Icon name="Check" size={16} />}
            {botStatus === 'disconnected' && <Icon name="X" size={16} />}
            <span className="text-sm font-medium">
              {botStatus === 'checking' && 'Проверка...'}
              {botStatus === 'connected' && 'Бот подключен'}
              {botStatus === 'disconnected' && 'Бот отключен'}
            </span>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            disabled={botStatus !== 'connected'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Icon name="Plus" size={16} />
            Новое уведомление
          </button>
        </div>
      </div>

      {/* Информация о боте */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Info" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Система личных уведомлений</h4>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• Пользователи пишут боту /start или любое сообщение</p>
              <p>• Бот автоматически добавляет их в список подписчиков</p>
              <p>• Все уведомления приходят им ЛИЧНО в чат с ботом</p>
              <p>• Никаких каналов - только приватная переписка!</p>
              <p>• Работает через мини-сервер Node.js для обхода CORS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма создания уведомления */}
      {isCreating && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Создать уведомление</h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewNotification({ title: '', message: '', type: 'news' });
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип уведомления
              </label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="news">📰 Новости</option>
                <option value="update">🔄 Обновление</option>
                <option value="feature">✨ Новая функция</option>
                <option value="important">⚠️ Важное</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Краткий заголовок уведомления"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение
              </label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Подробное описание новости или обновления"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newNotification.message.length}/500 символов
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSendNotification}
                disabled={!newNotification.title.trim() || !newNotification.message.trim() || isSending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    Отправить
                  </>
                )}
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* История уведомлений */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="History" size={20} />
          История уведомлений
        </h3>
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Bell" size={48} className="mx-auto mb-3 opacity-50" />
            <p>Уведомления еще не отправлялись</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg border ${getTypeColor(notification.type)}`}>
                      <Icon name={getTypeIcon(notification.type) as any} size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.status === 'sent' 
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : notification.status === 'failed'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          {notification.status === 'sent' && '✅ Отправлено'}
                          {notification.status === 'failed' && '❌ Ошибка'}
                          {notification.status === 'draft' && '📝 Черновик'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Создано: {new Date(notification.createdAt).toLocaleString('ru-RU')}</span>
                        {notification.sentAt && (
                          <span>Отправлено: {new Date(notification.sentAt).toLocaleString('ru-RU')}</span>
                        )}
                        {notification.recipientsCount && (
                          <span>Получателей: {notification.recipientsCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {notification.status === 'failed' && (
                    <button
                      onClick={() => retryNotification(notification)}
                      disabled={isSending}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm flex items-center gap-1"
                    >
                      <Icon name="RotateCcw" size={14} />
                      Повторить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
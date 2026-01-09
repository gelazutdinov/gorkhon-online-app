import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const SYSTEM_MESSAGES_URL = 'https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806';

interface SystemMessage {
  id: string;
  text: string;
  timestamp: string;
}

const SystemChatManagement = () => {
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('systemMessages');
      if (saved) {
        setSystemMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSystemMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      const message: SystemMessage = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      const updated = [message, ...systemMessages];
      setSystemMessages(updated);
      localStorage.setItem('systemMessages', JSON.stringify(updated));
      setNewMessage('');
      alert('✅ Новость отправлена в системный чат! Все жители увидят её при открытии чата.');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('❌ Ошибка при отправке сообщения.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Системный чат — отправка новостей</h2>
      
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="MessageCircle" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Отправить новость жителям</h3>
            <p className="text-sm text-gray-600">Сообщение появится в системном чате у всех пользователей</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Текст новости
        </label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Например: 🎉 Добавлен новый раздел с документами! Теперь все важные бумаги в одном месте."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
          disabled={isSending}
        />
        
        <button
          onClick={handleSendSystemMessage}
          disabled={!newMessage.trim() || isSending}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name={isSending ? "Loader2" : "Send"} size={18} className={isSending ? "animate-spin" : ""} />
          {isSending ? 'Отправка...' : 'Отправить новость'}
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} />
            История сообщений ({systemMessages.length})
          </h3>
          <button
            onClick={loadMessages}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon name={isLoading ? "Loader2" : "RefreshCw"} size={16} className={isLoading ? "animate-spin" : ""} />
            Обновить
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Icon name="Loader2" size={48} className="mx-auto text-gray-300 mb-3 animate-spin" />
            <p className="text-gray-600">Загрузка сообщений...</p>
          </div>
        ) : systemMessages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Icon name="MessageCircle" size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600">Нет отправленных сообщений</p>
            <p className="text-sm text-gray-500 mt-1">Отправьте первую новость жителям посёлка</p>
          </div>
        ) : (
          <div className="space-y-3">
            {systemMessages.map(msg => (
              <div key={msg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 relative">
                        <Icon name="MessageCircle" size={16} className="text-white" />
                        <img 
                          src="https://cdn.poehali.dev/files/dbf46829-41e3-4fcf-956e-f6c84fb50dc3.png" 
                          alt="Verified"
                          className="absolute -bottom-1 -right-1 w-4 h-4"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 ml-11">
                      <Icon name="Clock" size={12} />
                      <span>
                        {new Date(msg.timestamp).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemChatManagement;
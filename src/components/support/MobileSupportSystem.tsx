import { useState, useRef, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import TicketSystem from '../TicketSystem';

interface MobileSupportSystemProps {
  user: UserProfile;
  onSectionChange?: (section: string) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MobileSupportSystem = ({ user, onSectionChange }: MobileSupportSystemProps) => {
  const [showFullSupport, setShowFullSupport] = useState(false);
  const [showLinaChat, setShowLinaChat] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я Лина, ваш обновленный AI-помощник Горхон.Online! 🚀 Готова помочь с любыми вопросами о жизни в нашем поселке. Что вас интересует? 😊',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLinaResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('привет') || message.includes('здравствуй')) {
      return 'Привет! Рада вас видеть! Как дела в Горхоне? 😊';
    }
    
    if (message.includes('помощь') || message.includes('проблема')) {
      return 'Конечно, помогу! Расскажите подробнее о вашей проблеме, и я постараюсь найти решение 🔧';
    }
    
    if (message.includes('транспорт') || message.includes('автобус') || message.includes('расписание')) {
      return 'По вопросам транспорта: автобусы ходят по расписанию в разделе "Главная". Если есть изменения - сообщим через уведомления! 🚌';
    }
    
    if (message.includes('платеж') || message.includes('оплата') || message.includes('помощь поселку')) {
      return 'Для помощи поселку перейдите в раздел "Главная" → "Помощь поселку". Там доступны разные способы поддержки 💝';
    }
    
    if (message.includes('новости') || message.includes('что нового')) {
      return 'Все актуальные новости поселка в разделе "Новости". Там публикуются объявления администрации и важные события! 📰';
    }
    
    if (message.includes('пвз') || message.includes('пункт выдачи') || message.includes('посылка')) {
      return 'Информация о пунктах выдачи доступна в разделе "Главная" → "Пункты выдачи заказов". Там адреса и время работы 📦';
    }
    
    if (message.includes('техподдержка') || message.includes('тикет') || message.includes('жалоба')) {
      return 'Для серьезных вопросов создайте тикет через "Создать тикет". Я переведу вас на живого специалиста 🎫';
    }
    
    if (message.includes('спасибо') || message.includes('благодарю')) {
      return 'Пожалуйста! Всегда рада помочь жителям Горхона! Обращайтесь в любое время 💙';
    }
    
    return 'Интересный вопрос! Если не нашла точный ответ, могу создать тикет для специалиста или попробуйте переформулировать вопрос 🤔';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Имитация задержки ответа Лины
    setTimeout(() => {
      const linaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getLinaResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, linaResponse]);
    }, 1000);
  };

  // Убираем популярные вопросы по запросу

  return (
    <div className="relative">
      {/* Основная система поддержки */}
      {showFullSupport ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Техническая поддержка</h2>
            <button
              onClick={() => setShowFullSupport(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
          <TicketSystem user={user} />
        </div>
      ) : (
        <>
          {/* Мобильная версия с быстрыми вопросами */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Поддержка Горхона</h2>
              <p className="text-gray-600">Лина поможет с любыми вопросами 24/7</p>
            </div>

            {/* Быстрые вопросы убраны по запросу */}

            {/* Кнопки действий */}
            <div className="space-y-3">
              <button
                onClick={() => setShowLinaChat(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                <Icon name="MessageCircle" size={20} />
                <span className="font-medium">Чат с Линой</span>
              </button>
              
              <button
                onClick={() => setShowFullSupport(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Icon name="Settings" size={20} />
                <span className="font-medium">Создать тикет</span>
              </button>
            </div>

            {/* Информация */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Как работает поддержка?</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Лина — AI-помощник, который отвечает мгновенно. Если нужна помощь человека, 
                    она переведет вас на агента или вы можете создать тикет.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Полноэкранный чат с Линой */}
          {showLinaChat && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col pt-20">
              <div className="bg-white h-full flex flex-col shadow-2xl">
                {/* Заголовок чата */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 text-white" style={{backgroundColor: '#F1117E'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-semibold">Лина</h3>
                      <p className="text-xs opacity-80">Онлайн</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSectionChange?.('home')}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>

                {/* Сообщения */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : ''}`}>
                        {!message.isUser && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
                            🤖
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                          message.isUser 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white ml-auto' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        {message.isUser && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-sm flex-shrink-0">
                            {user.avatar ? user.avatar.charAt(0).toUpperCase() : '👤'}
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Поле ввода */}
                <div className="p-4 border-t border-gray-200 pb-20 md:pb-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Напишите сообщение..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="Send" size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Плавающая кнопка Лина - поднята выше меню */}
      {!showLinaChat && !showFullSupport && (
        <button
          onClick={() => setShowLinaChat(true)}
          className="fixed bottom-32 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse z-40"
        >
          <span className="text-xl">🤖</span>
        </button>
      )}
    </div>
  );
};

export default MobileSupportSystem;
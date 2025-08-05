import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

interface LinaAssistantProps {
  onClose: () => void;
}

const LinaAssistant = ({ onClose }: LinaAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const linaResponses = {
    'расписание': '🚌 Расписание автобусов Горхон-Улан-Удэ:\n\n🕖 Из Горхона: 7:00, 14:00, 18:30\n🕘 Из Улан-Удэ: 9:00, 16:00, 20:00\n⏱️ Время в пути: ~1 час',
    'номера': '📞 Важные номера:\n\n🚨 Экстренные службы: 112\n👮 Полиция: 02\n🚑 Скорая помощь: 03\n🚒 Пожарная служба: 01',
    'режим': '🏢 Режим работы:\n\n🏥 Поликлиника: ПН-ПТ 8:00-16:00, СБ 9:00-13:00\n📮 Почта: ПН-ПТ 9:00-17:00',
    'пункты': '📦 Пункты выдачи в Горхоне:\n\n🛍️ ПВЗ Wildberries - ул. Центральная, 15\n📮 Почта России - ул. Советская, 8\n🏪 Магазин "Продукты" - ул. Школьная, 3',
    'техническая': 'Я помогу решить техническую проблему! Опишите подробнее что происходит:\n\n• Ошибка при входе в аккаунт?\n• Проблемы с загрузкой страниц?\n• Не работают уведомления?\n• Другие технические сбои?\n\nИли обратитесь к агенту поддержки: https://forms.yandex.ru/u/687f5b9a84227c08790f3222/',
    'поддержка': 'Для связи с агентом поддержки перейдите по ссылке:\n\n👨‍💻 [Форма обращения в поддержку](https://forms.yandex.ru/u/687f5b9a84227c08790f3222/)\n\nНаши специалисты ответят в течение 24 часов!',
    'default': 'Я помогу вам найти нужную информацию! \n\n📌 Могу рассказать о:\n• Расписании транспорта\n• Важных номерах телефонов\n• Режиме работы организаций\n• Пунктах выдачи заказов\n• Решении технических проблем\n\n💬 Или свяжитесь с поддержкой: https://forms.yandex.ru/u/687f5b9a84227c08790f3222/'
  };

  useEffect(() => {
    // Приветственное сообщение
    const welcomeMessage: Message = {
      id: '1',
      text: '👋 Привет! Я Лина, ваш цифровой помощник по Горхону.\n\n🔧 Помогаю с техническими вопросами и поиском информации о поселке. Все данные беру с главной страницы приложения.\n\n❓ О чем хотите узнать?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Технические проблемы
    if (lowerQuestion.includes('ошибка') || lowerQuestion.includes('не работает') || lowerQuestion.includes('проблема') || 
        lowerQuestion.includes('баг') || lowerQuestion.includes('сломал') || lowerQuestion.includes('зависает') ||
        lowerQuestion.includes('медленно') || lowerQuestion.includes('грузится') || lowerQuestion.includes('тормоз')) {
      return linaResponses.техническая;
    }
    
    // Поддержка
    if (lowerQuestion.includes('поддержк') || lowerQuestion.includes('агент') || lowerQuestion.includes('оператор') ||
        lowerQuestion.includes('человек') || lowerQuestion.includes('живой') || lowerQuestion.includes('жалоба')) {
      return linaResponses.поддержка;
    }
    
    // Информационные запросы
    if (lowerQuestion.includes('расписание') || lowerQuestion.includes('автобус') || lowerQuestion.includes('транспорт')) {
      return linaResponses.расписание;
    }
    if (lowerQuestion.includes('номер') || lowerQuestion.includes('телефон') || lowerQuestion.includes('экстренн')) {
      return linaResponses.номера;
    }
    if (lowerQuestion.includes('режим') || lowerQuestion.includes('работ') || lowerQuestion.includes('час')) {
      return linaResponses.режим;
    }
    if (lowerQuestion.includes('пвз') || lowerQuestion.includes('выдач') || lowerQuestion.includes('заказ')) {
      return linaResponses.пункты;
    }
    
    return linaResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Имитация печатания Лины
    setTimeout(() => {
      const response = findResponse(inputValue);
      const linaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, linaMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };



  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-32 sm:bottom-28 right-4 z-[60]">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gorkhon-blue text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Icon name="MessageCircle" size={20} className="sm:w-6 sm:h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pb-32 sm:pb-0 sm:bottom-28 sm:right-4 sm:inset-auto z-[60] flex sm:block">
      <div className="bg-white sm:rounded-2xl shadow-2xl border border-gray-200 w-full sm:w-96 h-full sm:h-[32rem] flex flex-col overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gorkhon-blue text-white p-4 sm:p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b332c792?w=100&h=100&fit=crop&crop=face" 
                alt="Лина" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Лина</h3>
                <img 
                  src="https://cdn.poehali.dev/files/8371ad18-b8e1-4b43-98dc-dd6b47da6cfa.png" 
                  alt="Верифицирован" 
                  className="w-3 h-3 sm:w-4 sm:h-4 filter brightness-0 invert"
                />
              </div>
              <p className="text-sm text-white/90 sm:block">Цифровой помощник Горхона</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden sm:block"
              title="Свернуть"
            >
              <Icon name="Minus" size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Закрыть"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                  message.isUser
                    ? 'bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white shadow-pink-200'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-2 sm:p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Ввод сообщения */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-white safe-area-bottom">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Спросите что-нибудь..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base shadow-inner"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-105"
            >
              <Icon name="Send" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinaAssistant;
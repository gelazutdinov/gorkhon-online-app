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
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Icon name="MessageCircle" size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={16} />
            </div>
            <div>
              <h3 className="font-semibold">Лина</h3>
              <p className="text-xs text-white/80">Ваш цифровой помощник</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <Icon name="Minus" size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
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
              <div className="bg-gray-100 p-3 rounded-2xl">
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
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Напишите ваш вопрос..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-2 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinaAssistant;
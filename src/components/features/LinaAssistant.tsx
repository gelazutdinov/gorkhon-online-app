import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const linaResponses = {
    'привет': '👋 Привет! Я очень рада вас видеть!\n\nЯ могу помочь с любыми вопросами о Горхоне. Что вас интересует?',
    'погода': '🌤️ Актуальная погода в Горхоне:\n\n🌡️ Температура: -15°C\n💨 Ветер: 3 м/с, северо-западный\n☁️ Облачность: переменная\n📊 Влажность: 68%\n\n*Данные обновляются каждый час',
    'новости': '📰 Последние новости Горхона:\n\n• 🏗️ Строительство нового детского сада начнется весной\n• 🚌 Обновлено расписание автобусов до Улан-Удэ\n• 🏥 В поликлинике появился новый терапевт\n• 🎉 15 февраля - День зимних развлечений в ДК\n\nПодробности в нашем Telegram: @gorkhon_news',
    'мероприятия': '🎭 Ближайшие мероприятия:\n\n🎪 15.02 - Масленица на площади (12:00)\n🏀 18.02 - Турнир по баскетболу в школе (14:00)\n🎵 22.02 - Концерт местных талантов в ДК (18:00)\n📚 25.02 - Литературный вечер в библиотеке (16:00)\n\nВход на все мероприятия свободный!',
    'расписание': '🚌 Расписание автобусов Горхон-Улан-Удэ:\n\n🕖 Из Горхона: 7:00, 14:00, 18:30\n🕘 Из Улан-Удэ: 9:00, 16:00, 20:00\n⏱️ Время в пути: ~1 час 15 минут\n💰 Стоимость: 150 рублей\n\n📞 Справки: +7 (301) 45-67-89',
    'номера': '📞 Важные телефоны:\n\n🚨 Экстренные службы: 112\n👮 Участковый: +7 (301) 45-23-45\n🚑 Скорая помощь: 03, +7 (301) 45-67-12\n🚒 Пожарная часть: 01\n🏥 Поликлиника: +7 (301) 45-78-90\n📮 Почтамт: +7 (301) 45-34-56',
    'режим': '🏢 Режим работы организаций:\n\n🏥 Поликлиника: ПН-ПТ 8:00-16:00, СБ 9:00-13:00\n📮 Почта: ПН-ПТ 8:00-17:00, СБ 9:00-14:00\n🏪 Продуктовые: 7:00-22:00 ежедневно\n🏛️ Администрация: ПН-ПТ 9:00-17:00\n📚 Библиотека: ВТ-ВС 10:00-18:00',
    'пункты': '📦 Пункты выдачи заказов:\n\n🛍️ ПВЗ Wildberries - ул. Центральная, 15 (9:00-20:00)\n📦 СДЭК - ул. Советская, 12 (10:00-19:00)\n📮 Почта России - ул. Советская, 8 (8:00-17:00)\n🏪 Магазин "Продукты" - ул. Школьная, 3 (7:00-22:00)\n\n💡 Звоните заранее для уточнения готовности заказа!',
    'техническая': '🔧 Помогу с технической проблемой!\n\nОпишите подробнее что происходит:\n• 🚫 Ошибка при входе в аккаунт?\n• ⏳ Медленно загружаются страницы?\n• 🔔 Не приходят уведомления?\n• 📱 Проблемы с мобильной версией?\n• 💾 Не сохраняются данные?\n\n👨‍💻 Сложный случай? Обратитесь к техподдержке:\nhttps://forms.yandex.ru/u/687f5b9a84227c08790f3222/',
    'поддержка': '👥 Связь с поддержкой:\n\n📋 Форма обращения:\nhttps://forms.yandex.ru/u/687f5b9a84227c08790f3222/\n\n📧 Email: support@gorkhon.online\n📱 Telegram: @gorkhon_support\n⏰ Время ответа: до 4 часов\n\n💬 Или продолжите общение со мной - постараюсь помочь!',
    'услуги': '🏛️ Государственные услуги:\n\n📄 Справки и документы через Госуслуги\n🏠 Регистрация по месту жительства\n📋 Налоговые консультации (каждый ВТ 14:00-16:00)\n🚗 Техосмотр автомобилей (по записи)\n👶 Оформление детских пособий\n\n📞 Запись: +7 (301) 45-89-67',
    'default': '😊 Привет! Я Лина - ваш цифровой помощник!\n\n🌟 Могу рассказать о:\n• 🌤️ Погоде и новостях Горхона\n• 🎭 Мероприятиях и событиях\n• 🚌 Расписании транспорта\n• 📞 Важных телефонах и адресах\n• 🏢 Режиме работы организаций\n• 📦 Пунктах выдачи заказов\n• 🏛️ Государственных услугах\n• 🔧 Технических проблемах\n\n💭 Просто напишите что вас интересует, и я помогу!'
  };

  useEffect(() => {
    const loadMessages = () => {
      const systemMessages: Message[] = [];
      
      try {
        const saved = localStorage.getItem('systemMessages');
        if (saved) {
          const parsedMessages = JSON.parse(saved);
          parsedMessages.forEach((msg: any) => {
            systemMessages.push({
              id: msg.id,
              text: `📢 Системное сообщение:\n\n${msg.text}`,
              isUser: false,
              timestamp: new Date(msg.timestamp)
            });
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки системных сообщений:', error);
      }
      
      const welcomeMessage: Message = {
        id: '1',
        text: '👋 Привет! Я Лина — ваш цифровой помощник!\n\n🌟 Готова помочь с любыми вопросами о жизни в Горхоне. Что вас интересует?',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage, ...systemMessages]);
    };

    loadMessages();

    const handleStorageChange = () => {
      loadMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Админ-панель
    if (lowerQuestion.includes('админ') || lowerQuestion.includes('админка') || lowerQuestion.includes('панель управления') ||
        lowerQuestion.includes('редактировать') || lowerQuestion.includes('изменить контент')) {
      return '🔐 Доступ к админ-панели:\n\n👉 Перейдите по ссылке: /admin-panel\n\nВ админ-панели вы можете:\n• 📞 Редактировать важные номера\n• 🚌 Управлять расписанием транспорта\n• ❤️ Изменять информацию о помощи посёлку\n• ⏰ Обновлять режим работы организаций\n• 📦 Настраивать ПВЗ\n• 💬 Публиковать системные сообщения\n\nВсе изменения сохраняются локально и отображаются мгновенно!';
    }
    
    // Приветствие
    if (lowerQuestion.includes('привет') || lowerQuestion.includes('здравств') || lowerQuestion.includes('добр') ||
        lowerQuestion.includes('салам') || lowerQuestion.includes('хай') || lowerQuestion.match(/^(hi|hello)$/)) {
      return linaResponses.привет;
    }
    
    // Погода
    if (lowerQuestion.includes('погод') || lowerQuestion.includes('температур') || lowerQuestion.includes('градус') ||
        lowerQuestion.includes('холодно') || lowerQuestion.includes('тепло') || lowerQuestion.includes('дождь') ||
        lowerQuestion.includes('снег') || lowerQuestion.includes('ветер')) {
      return linaResponses.погода;
    }
    
    // Новости
    if (lowerQuestion.includes('новост') || lowerQuestion.includes('событи') || lowerQuestion.includes('происход') ||
        lowerQuestion.includes('что нового') || lowerQuestion.includes('последн')) {
      return linaResponses.новости;
    }
    
    // Мероприятия
    if (lowerQuestion.includes('мероприят') || lowerQuestion.includes('концерт') || lowerQuestion.includes('праздник') ||
        lowerQuestion.includes('событие') || lowerQuestion.includes('развлечен') || lowerQuestion.includes('культур')) {
      return linaResponses.мероприятия;
    }
    
    // Государственные услуги
    if (lowerQuestion.includes('госуслуг') || lowerQuestion.includes('справк') || lowerQuestion.includes('документ') ||
        lowerQuestion.includes('паспорт') || lowerQuestion.includes('регистрац') || lowerQuestion.includes('админист')) {
      return linaResponses.услуги;
    }
    
    // Технические проблемы
    if (lowerQuestion.includes('ошибка') || lowerQuestion.includes('не работает') || lowerQuestion.includes('проблема') || 
        lowerQuestion.includes('баг') || lowerQuestion.includes('сломал') || lowerQuestion.includes('зависает') ||
        lowerQuestion.includes('медленно') || lowerQuestion.includes('грузится') || lowerQuestion.includes('тормоз') ||
        lowerQuestion.includes('глюк') || lowerQuestion.includes('лагает')) {
      return linaResponses.техническая;
    }
    
    // Поддержка
    if (lowerQuestion.includes('поддержк') || lowerQuestion.includes('агент') || lowerQuestion.includes('оператор') ||
        lowerQuestion.includes('человек') || lowerQuestion.includes('живой') || lowerQuestion.includes('жалоба') ||
        lowerQuestion.includes('менеджер') || lowerQuestion.includes('специалист')) {
      return linaResponses.поддержка;
    }
    
    // Транспорт и расписание
    if (lowerQuestion.includes('расписание') || lowerQuestion.includes('автобус') || lowerQuestion.includes('транспорт') ||
        lowerQuestion.includes('доехать') || lowerQuestion.includes('улан-удэ') || lowerQuestion.includes('маршрут')) {
      return linaResponses.расписание;
    }
    
    // Телефоны и номера
    if (lowerQuestion.includes('номер') || lowerQuestion.includes('телефон') || lowerQuestion.includes('экстренн') ||
        lowerQuestion.includes('полиц') || lowerQuestion.includes('скор') || lowerQuestion.includes('пожар') ||
        lowerQuestion.includes('больниц') || lowerQuestion.includes('поликлин')) {
      return linaResponses.номера;
    }
    
    // Режим работы
    if (lowerQuestion.includes('режим') || lowerQuestion.includes('работ') || lowerQuestion.includes('час') ||
        lowerQuestion.includes('открыт') || lowerQuestion.includes('закрыт') || lowerQuestion.includes('график') ||
        lowerQuestion.includes('время')) {
      return linaResponses.режим;
    }
    
    // Пункты выдачи
    if (lowerQuestion.includes('пвз') || lowerQuestion.includes('выдач') || lowerQuestion.includes('заказ') ||
        lowerQuestion.includes('wildberries') || lowerQuestion.includes('сдэк') || lowerQuestion.includes('почт') ||
        lowerQuestion.includes('посылк') || lowerQuestion.includes('получить')) {
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
    <div className="fixed inset-0 pb-16 sm:pb-0 sm:bottom-28 sm:right-4 sm:inset-auto z-[60] flex sm:block safe-area-inset-bottom">
      <div className="bg-white sm:rounded-2xl shadow-2xl border border-gray-200 w-full sm:w-96 h-full sm:h-[32rem] flex flex-col overflow-hidden max-w-full">
        {/* Заголовок */}
        <div className="bg-gorkhon-blue text-white p-4 sm:p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b332c792?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                alt="Лина" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-white/20 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
                }}
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
              onClick={() => {
                navigate('/admin-panel');
                onClose();
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Админ-панель"
            >
              <Icon name="Settings" size={18} />
            </button>
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
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 sm:space-y-5 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-sm break-words ${
                  message.isUser
                    ? 'bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white shadow-pink-200'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">{message.text}</p>
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
        <div className="p-3 sm:p-5 border-t border-gray-200 bg-white safe-area-bottom">
          <div className="flex items-end gap-2 sm:gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Напишите ваш вопрос..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base shadow-inner min-w-0 break-words"
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
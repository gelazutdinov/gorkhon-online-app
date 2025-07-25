import { useState, useEffect, useRef } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface TicketSystemProps {
  user: UserProfile;
}

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'technical' | 'account' | 'billing' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'bot' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

const TicketSystem = ({ user }: TicketSystemProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLinaTyping, setIsLinaTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Новый тикет
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });

  // База знаний бота Лина
  const botKnowledge = {
    greetings: [
      'Привет! Я Лина, виртуальный помощник команды Горхон. Как дела? 👋',
      'Здравствуйте! Меня зовут Лина, и я здесь, чтобы помочь вам с любыми вопросами! 😊',
      'Привет! Лина на связи! Расскажите, с чем нужна помощь? ✨'
    ],
    technical: {
      'не работает': 'Понимаю, что это расстраивает! 😔 Давайте разберемся. Можете описать подробнее, что именно не работает? Также попробуйте обновить страницу (Ctrl+F5) или очистить кэш браузера.',
      'ошибка': 'Ой, ошибки - это неприятно! 🔧 Не могли бы вы скопировать текст ошибки или сделать скриншот? Это поможет мне лучше понять проблему.',
      'медленно': 'Да, медленная работа раздражает! ⏰ Попробуйте закрыть лишние вкладки браузера, проверьте скорость интернета или перезагрузите страницу.',
      'не загружается': 'Проблемы с загрузкой? 📱 Проверьте подключение к интернету и попробуйте открыть сайт в режиме инкогнито. Если не поможет - напишите, я переведу на агента!',
      'пароль': 'С паролями бывают сложности! 🔑 Попробуйте функцию "Забыли пароль?" на странице входа. Если не получается - наш агент поможет восстановить доступ.'
    },
    account: {
      'регистрация': 'Отлично, что решили присоединиться! 🎉 Для регистрации нужны имя, email и телефон. Есть проблемы с каким-то из полей?',
      'профиль': 'Профиль - это ваше лицо на платформе! 👤 Можете добавить фото, интересы, обновить информацию. Что именно хотите изменить?',
      'друзья': 'Социальные функции - это здорово! 👥 Ищите людей по интересам, отправляйте заявки в друзья, общайтесь. Нужна помощь с поиском?',
      'настройки': 'В настройках можно многое настроить! ⚙️ Уведомления, приватность, тема интерфейса. Что конкретно ищете?'
    },
    general: {
      'как': 'Хороший вопрос! 🤔 Я постараюсь объяснить. Можете сформулировать вопрос более конкретно?',
      'где': 'Ищете что-то определенное? 🔍 Подскажите, что именно, и я помогу найти!',
      'когда': 'Время - важный фактор! ⏰ Расскажите подробнее, о каких сроках речь?',
      'почему': 'Отличный вопрос! 🧐 Давайте разберемся в причинах. Опишите ситуацию подробнее.',
      'спасибо': 'Пожалуйста! Всегда рада помочь! 😊 Если еще что-то нужно - обращайтесь!',
      'привет': 'Привет! 👋 Как дела? Чем могу помочь?'
    }
  };

  // Загрузка тикетов пользователя
  useEffect(() => {
    const savedTickets = localStorage.getItem(`tickets_${user.id}`);
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, [user.id]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages, isLinaTyping]);

  // Создание нового тикета
  const createTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;

    const ticket: Ticket = {
      id: Date.now().toString(),
      userId: user.id,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    // Добавляем приветственное сообщение от Лины
    const welcomeMessage: TicketMessage = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      sender: 'bot',
      senderName: 'Лина 🤖',
      content: botKnowledge.greetings[Math.floor(Math.random() * botKnowledge.greetings.length)],
      timestamp: new Date().toISOString()
    };

    ticket.messages = [welcomeMessage];

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem(`tickets_${user.id}`, JSON.stringify(updatedTickets));

    setActiveTicket(ticket);
    setShowCreateTicket(false);
    setNewTicket({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium'
    });
  };

  // Отправка сообщения
  const sendMessage = () => {
    if (!newMessage.trim() || !activeTicket) return;

    const message: TicketMessage = {
      id: Date.now().toString(),
      ticketId: activeTicket.id,
      sender: 'user',
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...activeTicket,
      messages: [...activeTicket.messages, message],
      updatedAt: new Date().toISOString()
    };

    setActiveTicket(updatedTicket);
    setNewMessage('');

    // Автоответ от Лины
    setTimeout(() => {
      setIsLinaTyping(true);
      setTimeout(() => {
        const botResponse = generateBotResponse(newMessage);
        const botMessage: TicketMessage = {
          id: (Date.now() + 1).toString(),
          ticketId: activeTicket.id,
          sender: 'bot',
          senderName: 'Лина 🤖',
          content: botResponse,
          timestamp: new Date().toISOString()
        };

        const finalTicket = {
          ...updatedTicket,
          messages: [...updatedTicket.messages, botMessage],
          updatedAt: new Date().toISOString()
        };

        setActiveTicket(finalTicket);
        
        const updatedTickets = tickets.map(t => 
          t.id === activeTicket.id ? finalTicket : t
        );
        setTickets(updatedTickets);
        localStorage.setItem(`tickets_${user.id}`, JSON.stringify(updatedTickets));
        
        setIsLinaTyping(false);
      }, 1500);
    }, 500);
  };

  // Генерация ответа бота
  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Проверяем ключевые слова
    for (const [category, responses] of Object.entries(botKnowledge)) {
      if (category === 'greetings') continue;
      
      for (const [keyword, response] of Object.entries(responses as Record<string, string>)) {
        if (message.includes(keyword)) {
          return response;
        }
      }
    }

    // Проверяем общие ключевые слова
    for (const [keyword, response] of Object.entries(botKnowledge.general)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Проверяем, нужен ли агент
    const agentKeywords = ['агент', 'человек', 'оператор', 'менеджер', 'сложно', 'не понимаю', 'помощь'];
    if (agentKeywords.some(keyword => message.includes(keyword))) {
      return `Понимаю, что вопрос сложный! 😊 Сейчас переведу вас на живого агента. \n\n📋 **Для связи с агентом заполните форму:** \nhttps://forms.gorkhon.dev/support?ticket=${activeTicket?.id}\n\nНаш агент свяжется с вами в течение рабочего дня!`;
    }

    // Стандартный ответ
    const defaultResponses = [
      'Хм, интересный вопрос! 🤔 Не могли бы вы объяснить подробнее? Или может, стоит связаться с нашим агентом?',
      'Спасибо за сообщение! 😊 Я стараюсь изучить ваш вопрос. Если нужна помощь агента - просто скажите!',
      'Понятно! 💭 Давайте разберемся вместе. Можете описать проблему пошагово?',
      'Благодарю за обращение! 🌟 Если мой ответ не поможет, обязательно переведу на агента!'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return 'Settings';
      case 'account': return 'User';
      case 'billing': return 'CreditCard';
      default: return 'MessageSquare';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Техническая поддержка</h2>
          <p className="text-gray-600">Мы всегда готовы помочь решить ваши вопросы</p>
        </div>
        <button
          onClick={() => setShowCreateTicket(true)}
          className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Создать тикет
        </button>
      </div>

      {/* Лина - AI помощник */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Лина - ваш AI помощник</h3>
            <p className="text-sm text-gray-600">Готова помочь 24/7 с любыми вопросами</p>
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Техническая поддержка и решение проблем</p>
          <p>• Помощь с настройками аккаунта</p>
          <p>• Ответы на общие вопросы</p>
          <p>• При необходимости перевод на живого агента</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Список тикетов */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">Мои тикеты ({tickets.length})</h3>
          
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📨</div>
              <p className="text-gray-500 mb-4">У вас пока нет тикетов</p>
              <button
                onClick={() => setShowCreateTicket(true)}
                className="text-gorkhon-pink hover:text-gorkhon-pink/80 text-sm"
              >
                Создать первый тикет
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    activeTicket?.id === ticket.id
                      ? 'border-gorkhon-pink bg-gorkhon-pink/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={getCategoryIcon(ticket.category)} size={14} className="text-gray-500" />
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {ticket.subject}
                      </h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Открыт' : 
                       ticket.status === 'in_progress' ? 'В работе' :
                       ticket.status === 'resolved' ? 'Решен' : 'Закрыт'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'high' ? 'Высокий' :
                       ticket.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.updatedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  
                  {ticket.messages.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2 truncate">
                      {ticket.messages[ticket.messages.length - 1].content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Чат */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <div className="border border-gray-200 rounded-xl h-96 flex flex-col">
              {/* Заголовок чата */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{activeTicket.subject}</h3>
                    <p className="text-sm text-gray-600">Тикет #{activeTicket.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activeTicket.status)}`}>
                      {activeTicket.status === 'open' ? 'Открыт' : 
                       activeTicket.status === 'in_progress' ? 'В работе' :
                       activeTicket.status === 'resolved' ? 'Решен' : 'Закрыт'}
                    </span>
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Описание тикета */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activeTicket.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{activeTicket.description}</p>
                </div>

                {/* Сообщения */}
                {activeTicket.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                        🤖
                      </div>
                    )}
                    
                    <div className={`max-w-xs ${message.sender === 'user' ? 'bg-gorkhon-pink text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-3 py-2`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm flex-shrink-0">
                        {user.avatar}
                      </div>
                    )}
                  </div>
                ))}

                {/* Индикатор печати */}
                {isLinaTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm">
                      🤖
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
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

              {/* Поле ввода */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Напишите сообщение..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                    disabled={isLinaTyping}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isLinaTyping}
                    className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Send" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Выберите тикет</h3>
                <p className="text-gray-600">Выберите тикет из списка или создайте новый</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно создания тикета */}
      {showCreateTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Создать тикет</h2>
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тема
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                    placeholder="Кратко опишите проблему"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                    placeholder="Подробно опишите проблему или вопрос"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                    >
                      <option value="general">Общие вопросы</option>
                      <option value="technical">Технические проблемы</option>
                      <option value="account">Аккаунт</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Приоритет
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                    >
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={createTicket}
                  disabled={!newTicket.subject.trim() || !newTicket.description.trim()}
                  className="flex-1 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Создать тикет
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSystem;
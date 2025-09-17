import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface LinaAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function LinaAssistant({ onClose }: LinaAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я Лина, ваш ИИ-помощник. Готова помочь с любыми вопросами и проблемами по платформе Горхон.Online!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSmartResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Вопросы о Горхон.Online
    if (lowerInput.includes('горхон') || lowerInput.includes('gorhon') || lowerInput.includes('платформ')) {
      return 'Горхон.Online — это платформа для социального взаимодействия и обмена контентом. Здесь можно общаться, делиться постами, находить интересных людей и следить за их активностью!';
    }
    
    // Вопросы о функционале платформы
    if (lowerInput.includes('как использовать') || lowerInput.includes('что можно') || lowerInput.includes('функции')) {
      return 'На Горхон.Online можно:\n• Создавать и редактировать профиль\n• Публиковать посты и контент\n• Подписываться на других пользователей\n• Общаться в комментариях\n• Просматривать ленту новостей\n\nЧто именно интересует?';
    }
    
    // Вопросы о публикации постов
    if (lowerInput.includes('опубликовать') || lowerInput.includes('пост') || lowerInput.includes('контент')) {
      return 'Для публикации контента:\n1. Перейдите в раздел создания поста\n2. Добавьте текст, изображения или другой контент\n3. Настройте приватность публикации\n4. Нажмите "Опубликовать"\n\nВаш пост появится в ленте!';
    }
    
    // Вопросы о GitHub
    if (lowerInput.includes('github') || lowerInput.includes('гитхаб') || lowerInput.includes('код') || lowerInput.includes('скачать')) {
      return 'Для работы с GitHub:\n• "Скачать → Подключить GitHub" — синхронизация с репозиторием\n• "Скачать → Скачать код" — получить исходники\n• "Скачать → Скачать билд" — статическая версия для хостинга\n\nКод автоматически обновляется в вашем репозитории!';
    }
    
    // Вопросы о редактировании
    if (lowerInput.includes('редактировать') || lowerInput.includes('изменить') || lowerInput.includes('поправить')) {
      return 'В редакторе poehali.dev можно:\n• Изменять текст прямо на странице\n• Загружать и редактировать изображения\n• Менять цвета и стили\n• Добавлять новые компоненты\n\nПросто опишите, что нужно изменить!';
    }
    
    // Вопросы о компонентах
    if (lowerInput.includes('компонент') || lowerInput.includes('кнопка') || lowerInput.includes('форма')) {
      return 'Могу создать любые компоненты:\n• Кнопки, формы, карточки\n• Навигация, модальные окна\n• Слайдеры, галереи\n• Дашборды, таблицы\n\nВсё адаптивно и готово к использованию!';
    }
    
    // Вопросы о помощи
    if (lowerInput.includes('помощь') || lowerInput.includes('как') || lowerInput.includes('что делать')) {
      return 'С удовольствием помогу! Могу:\n• Создавать сайты и приложения\n• Объяснять функции платформы\n• Решать технические проблемы\n• Давать советы по дизайну\n\nРасскажите подробнее, что нужно?';
    }
    
    // Приветствие
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуй') || lowerInput.includes('добр')) {
      return 'Привет! 👋 Очень рада знакомству! Я Лина — ваш персональный помощник по веб-разработке. Готова помочь создать крутой сайт или решить любые вопросы. Что будем делать?';
    }
    
    // Благодарности
    if (lowerInput.includes('спасибо') || lowerInput.includes('благодар')) {
      return 'Пожалуйста! 😊 Всегда рада быть полезной. Если появятся ещё вопросы или идеи — обращайтесь в любое время!';
    }
    
    // Технические вопросы
    if (lowerInput.includes('ошибка') || lowerInput.includes('не работает') || lowerInput.includes('проблема') || lowerInput.includes('баг')) {
      return 'Понимаю, что возникли трудности! 🔧 Чтобы помочь:\n• Опишите, что именно не работает\n• Какую ошибку видите\n• На каком этапе возникла проблема\n\nПостараюсь быстро найти решение!';
    }
    
    // Функциональность
    if (lowerInput.includes('функция') || lowerInput.includes('возможност') || lowerInput.includes('можно ли')) {
      return 'В poehali.dev много крутых функций:\n• Создание сайтов на React\n• Визуальное редактирование\n• Интеграция с GitHub\n• Публикация с SSL\n• SEO-настройки\n• Адаптивный дизайн\n\nЧто именно интересует?';
    }

    // Вопросы о дизайне
    if (lowerInput.includes('дизайн') || lowerInput.includes('красив') || lowerInput.includes('стиль')) {
      return 'С дизайном помогу! 🎨 Могу:\n• Подобрать современные цвета\n• Создать красивые компоненты\n• Сделать адаптивную верстку\n• Добавить анимации и эффекты\n\nОпишите, какой стиль нравится!';
    }

    // Вопросы о мобильной версии
    if (lowerInput.includes('мобил') || lowerInput.includes('телефон') || lowerInput.includes('адаптив')) {
      return 'Все сайты автоматически адаптивные! 📱 Они отлично выглядят на:\n• Телефонах\n• Планшетах\n• Компьютерах\n• Любых экранах\n\nНикаких дополнительных настроек не нужно!';
    }
    
    // Общий умный ответ
    const contextResponses = [
      'Интересный вопрос! 🤔 Расскажите больше деталей, и я подскажу лучшее решение.',
      'Давайте разберёмся! Опишите подробнее, что нужно сделать.',
      'Хорошая идея! Могу помочь воплотить её в жизнь. Что именно планируете?',
      'С удовольствием помогу! Поделитесь подробностями задачи.',
      'Отлично! Готова взяться за работу. Что конкретно нужно создать или изменить?'
    ];
    
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Реалистичная задержка для "размышления"
    const timeoutId = setTimeout(() => {
      const response = getSmartResponse(userInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 секунды

    // Cleanup function будет автоматически вызвана при размонтировании
    return () => clearTimeout(timeoutId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-purple-500 via-violet-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon name="Bot" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Лина - ИИ помощник</h2>
                <p className="text-purple-100 text-sm">Поддержка Горхон.Online • Онлайн</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Сообщения */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-sm ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-violet-600'}`}>
                  <Icon name={message.isUser ? 'User' : 'Bot'} size={16} className="text-white" />
                </div>
                <div className={`px-4 py-3 rounded-2xl ${message.isUser 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <Icon name="Bot" size={16} className="text-white" />
                </div>
                <div className="px-4 py-2 rounded-2xl rounded-bl-md bg-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Задайте любой вопрос о платформе Горхон.Online..."
              rows={2}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-2xl hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <Icon name="Send" size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Лина готова помочь с любыми вопросами по Горхон.Online! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
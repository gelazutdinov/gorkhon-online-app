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
      text: 'Привет! Я Лина, ваш ИИ-помощник. Как дела? Чем могу помочь?',
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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Имитация ответа ИИ
    setTimeout(() => {
      const responses = [
        'Понял вас! Это интересный вопрос. Дайте мне подумать...',
        'Отличная идея! Я могу помочь вам с этим.',
        'Хороший вопрос! Вот что я думаю по этому поводу...',
        'Спасибо за обращение! Постараюсь дать полезный ответ.',
        'Интересно! Давайте разберем это вместе.'
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
                <p className="text-purple-100 text-sm">Онлайн • Готова помочь</p>
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
              <div className={`flex items-end gap-2 max-w-xs ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-violet-600'}`}>
                  <Icon name={message.isUser ? 'User' : 'Bot'} size={16} className="text-white" />
                </div>
                <div className={`px-4 py-2 rounded-2xl ${message.isUser 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-xs">
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
              placeholder="Напишите ваш вопрос..."
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
            Лина находится в разработке. Скоро будет доступна полная функциональность!
          </p>
        </div>
      </div>
    </div>
  );
}
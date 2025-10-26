import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getLinaResponse } from '@/utils/linaKnowledge';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
  quickReplies?: string[];
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
  const [userName, setUserName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      
      const savedName = localStorage.getItem('userName') || '';
      setUserName(savedName);
      
      const greeting = savedName 
        ? `Привет, ${savedName}! Рада снова тебя видеть! 😊\n\nЧем могу помочь сегодня?`
        : 'Привет! Я Лина — твой умный помощник! ✨\n\n🌐 Могу искать информацию в интернете\n💡 Отвечу на вопросы о Горхоне\n🔧 Помогу с техническими проблемами\n\nКак тебя зовут?';
      
      const welcomeMessage: Message = {
        id: '1',
        text: greeting,
        isUser: false,
        timestamp: new Date(),
        quickReplies: savedName ? ['Важные контакты', 'Поиск в интернете', 'О платформе'] : undefined
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

  const performWebSearch = async (query: string): Promise<string[]> => {
    try {
      setIsSearching(true);
      const response = await fetch(`https://functions.poehali.dev/45af682d-92cb-4090-82b9-6ae2eb896eed?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results;
      }
      return [];
    } catch (error) {
      console.error('Web search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const findResponse = async (question: string): Promise<{ text: string; quickReplies?: string[] }> => {
    if (!userName && question.trim().length < 30 && !question.toLowerCase().includes('как') && 
        !question.toLowerCase().includes('что') && !question.toLowerCase().includes('где')) {
      const name = question.trim();
      if (name && !question.toLowerCase().includes('привет')) {
        setUserName(name);
        localStorage.setItem('userName', name);
        return {
          text: `Приятно познакомиться, ${name}! 😊\n\nТеперь я буду обращаться к тебе по имени. Чем могу помочь?`,
          quickReplies: ['Важные контакты', 'Поиск в интернете', 'О платформе']
        };
      }
    }

    const knowledgeResponse = getLinaResponse(question);
    
    if (knowledgeResponse.needsWebSearch && knowledgeResponse.searchQuery) {
      const searchResults = await performWebSearch(knowledgeResponse.searchQuery);
      
      if (searchResults.length > 0) {
        const enhancedText = `${knowledgeResponse.text}\n\n🔍 Найдено в интернете:\n${searchResults.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n\n')}`;
        return { text: enhancedText, quickReplies: ['Ещё вопрос', 'Главная'] };
      }
    }
    
    if (knowledgeResponse.showAdminLink) {
      return { 
        text: knowledgeResponse.text, 
        quickReplies: ['Открыть админ-панель', 'Важные контакты'] 
      };
    }
    
    const quickReplies = knowledgeResponse.category === 'platform' 
      ? ['Важные контакты', 'Поиск в интернете', 'О платформе']
      : knowledgeResponse.category === 'technical'
      ? ['Написать агенту', 'Поиск решения', 'Главная']
      : ['Поиск в интернете', 'Ещё вопрос', 'Главная'];
    
    return { text: knowledgeResponse.text, quickReplies };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    const response = await findResponse(currentInput);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      quickReplies: response.quickReplies
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = async (reply: string) => {
    if (reply === 'Открыть админ-панель') {
      navigate('/admin-panel');
      return;
    }
    if (reply === 'Написать агенту') {
      window.open('https://forms.yandex.ru/u/687f5b9a84227c08790f3222/', '_blank');
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const response = await findResponse(reply);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      quickReplies: response.quickReplies
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized, messages]);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-pulse"
      >
        <div className="relative">
          <Icon name="MessageCircle" size={28} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-purple-100">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Лина</h3>
            <p className="text-xs text-purple-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {isSearching ? 'Ищу в интернете...' : 'Онлайн • ИИ-помощник'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <Icon name="Minus" size={20} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[80%] ${message.isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white border border-purple-100'} rounded-2xl p-3 shadow-md`}>
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              <span className={`text-xs mt-1 block ${message.isUser ? 'text-purple-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.quickReplies && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full transition-colors border border-purple-200"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-purple-100 rounded-2xl p-4 shadow-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-purple-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Send" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinaAssistant;
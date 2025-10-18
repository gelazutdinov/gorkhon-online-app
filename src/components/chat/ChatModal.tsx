import { useState, useEffect } from "react";
import { sanitizeInput, preventXSS } from "@/utils/security";
import Icon from "@/components/ui/icon";
import { getLinaResponse } from "@/utils/linaKnowledge";
import ChannelProfile from "./ChannelProfile";

const SYSTEM_MESSAGES_URL = 'https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806';

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  showAgentButton?: boolean;
  showAdminLink?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSystemChat?: boolean;
}

const ChatModal = ({ isOpen, onClose, isSystemChat = false }: ChatModalProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (!isSystemChat) {
      return [
        {text: 'Привет! Я Лина ✨ — ваш верифицированный ИИ-помощник! 👋\n\nМои возможности:\n🌐 Поиск актуальной информации в интернете\n🏘️ Всё о жизни в Горхоне и платформе\n🔧 Решение технических проблем\n💡 Ответы на любые вопросы\n📚 Справочная информация 24/7\n\nПросто спросите — я найду ответ! 😊', sender: 'support'}
      ];
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Загрузка системных сообщений из backend
  useEffect(() => {
    if (isSystemChat && isOpen && !showProfile) {
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(SYSTEM_MESSAGES_URL);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.messages && data.messages.length > 0) {
            setChatMessages(data.messages.map((msg: any) => ({
              text: msg.text,
              sender: 'support' as const
            })));
          } else {
            setChatMessages([{
              text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
              sender: 'support'
            }]);
          }
        } catch (error) {
          console.error('Failed to load system messages:', error);
          setChatMessages([{
            text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
            sender: 'support'
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadMessages();
    }
  }, [isOpen, isSystemChat, showProfile]);

  const sendMessage = async () => {
    if (chatInput.trim()) {
      const sanitized = sanitizeInput(chatInput.trim());
      const userMsg = preventXSS(sanitized);
      
      if (userMsg.length > 1000) {
        return;
      }
      
      setChatMessages(prev => [...prev, {text: userMsg, sender: 'user'}]);
      setChatInput('');
      
      const aiResponse = getLinaResponse(userMsg);
      
      if (aiResponse.needsWebSearch && aiResponse.searchQuery) {
        setChatMessages(prev => [...prev, {
          text: aiResponse.text,
          sender: 'support'
        }]);
        
        setIsLoading(true);
        
        try {
          const searchResponse = await fetch(`https://functions.poehali.dev/45af682d-92cb-4090-82b9-6ae2eb896eed?q=${encodeURIComponent(aiResponse.searchQuery)}`);
          const searchData = await searchResponse.json();
          
          let resultText = '';
          if (searchData.hasResults && searchData.results && searchData.results.length > 0) {
            resultText = '✅ Вот что мне удалось найти:\n\n';
            searchData.results.forEach((result: string, index: number) => {
              if (index === 0) {
                resultText += result + '\n\n';
              } else {
                resultText += `📌 ${result}\n`;
              }
            });
          } else {
            resultText = '🔍 К сожалению, не нашла актуальной информации в интернете.\n\n💡 Рекомендую:\n• Проверить официальные источники\n• Спросить в местных группах\n• Написать агенту для уточнения';
          }
          
          setChatMessages(prev => [...prev, {
            text: resultText,
            sender: 'support'
          }]);
        } catch (error) {
          setChatMessages(prev => [...prev, {
            text: '⚠️ Не удалось выполнить поиск в интернете.\n\n💡 Попробуйте:\n• Переформулировать запрос\n• Спросить по-другому\n• Написать агенту для помощи',
            sender: 'support',
            showAgentButton: true
          }]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            text: aiResponse.text,
            sender: 'support',
            showAgentButton: aiResponse.showAgentButton,
            showAdminLink: aiResponse.showAdminLink
          }]);
        }, 800);
      }
    }
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setShowProfile(false);
      }
    }
  };

  if (!isOpen) return null;

  if (showProfile) {
    return (
      <ChannelProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)}
        onEnableNotifications={handleEnableNotifications}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md h-[90vh] md:max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b" style={{backgroundColor: isSystemChat ? '#0088CC' : '#F1117E'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center relative">
              {isSystemChat ? (
                <img 
                  src="https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png" 
                  alt="Горхон.Online"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative">
                  <Icon name="Sparkles" size={24} className="text-[#F1117E]" />
                </div>
              )}
            </div>
            <button 
              onClick={() => isSystemChat && setShowProfile(true)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <h3 className="font-semibold text-white text-base">{isSystemChat ? 'Горхон.Online' : 'Лина'}</h3>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="white"/>
                <path d="M14.5 7L8.5 13L5.5 10" stroke={isSystemChat ? "#0088CC" : "#F1117E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, idx) => (
            <div key={idx}>
              <div 
                className={`rounded-lg p-3 max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {msg.sender === 'user' ? 'Вы' : (isSystemChat ? 'Горхон.Online' : 'Лина ✨ (ИИ)')} • сейчас
                </span>
              </div>
              {msg.showAgentButton && (
                <a
                  href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors shadow-sm"
                >
                  <Icon name="UserCircle" size={18} />
                  <span className="text-sm font-medium">Написать агенту</span>
                </a>
              )}
              {msg.showAdminLink && (
                <a
                  href="/admin-panel"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm"
                >
                  <Icon name="Settings" size={18} />
                  <span className="text-sm font-medium">Открыть админ-панель</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {!isSystemChat && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
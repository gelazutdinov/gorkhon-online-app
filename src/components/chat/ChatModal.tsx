import { useState, useEffect } from "react";
import { sanitizeInput, preventXSS } from "@/utils/security";
import Icon from "@/components/ui/icon";
import { getLinaResponse } from "@/utils/linaKnowledge";
import ChannelProfile from "./ChannelProfile";
import { formatTimeIrkutsk } from "@/utils/timezone";

const SYSTEM_MESSAGES_URL = 'https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806';

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  showAgentButton?: boolean;
  showAdminLink?: boolean;
  timestamp?: string;
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
        {text: 'Здравствуйте!\n\nЯ — Лина, виртуальная помощница Горхон.Online. Готова помочь с любыми вопросами о платформе, поселке и сервисах.\n\nЧем могу быть полезна? 😊', sender: 'support', timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      ];
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Загрузка системных сообщений из localStorage (офлайн-режим)
  useEffect(() => {
    if (isSystemChat && isOpen && !showProfile) {
      const loadMessages = () => {
        setIsLoading(true);
        try {
          // Сначала пытаемся загрузить из localStorage
          const savedMessages = localStorage.getItem('systemMessages');
          
          if (savedMessages) {
            const messages = JSON.parse(savedMessages);
            if (messages && messages.length > 0) {
              setChatMessages(messages.map((msg: any) => ({
                text: msg.text,
                sender: 'support' as const
              })));
              setIsLoading(false);
              return;
            }
          }
          
          // Если нет локальных сообщений, пытаемся загрузить с сервера
          fetch(SYSTEM_MESSAGES_URL)
            .then(response => {
              if (!response.ok) throw new Error('Network error');
              return response.json();
            })
            .then(data => {
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
            })
            .catch(() => {
              // При ошибке показываем приветственное сообщение
              setChatMessages([{
                text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
                sender: 'support'
              }]);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (error) {
          console.error('Failed to load system messages:', error);
          setChatMessages([{
            text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
            sender: 'support'
          }]);
          setIsLoading(false);
        }
      };
      
      loadMessages();
      
      // Слушаем изменения в localStorage для живого обновления
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'systemMessages') {
          loadMessages();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isOpen, isSystemChat, showProfile]);

  // Адаптация под клавиатуру
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const diff = windowHeight - viewportHeight;
        setKeyboardHeight(diff > 100 ? diff : 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, [isOpen]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const playMessageSound = () => {
    const audio = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/////////////////////////////////////////////////////////////////AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SC+vk2AAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const sendMessage = async () => {
    if (chatInput.trim()) {
      const sanitized = sanitizeInput(chatInput.trim());
      const userMsg = preventXSS(sanitized);
      
      if (userMsg.length > 1000) {
        return;
      }
      
      playMessageSound();
      setChatMessages(prev => [...prev, {text: userMsg, sender: 'user', timestamp: getCurrentTime()}]);
      setChatInput('');
      
      const aiResponse = getLinaResponse(userMsg);
      
      if (aiResponse.needsWebSearch && aiResponse.searchQuery) {
        setChatMessages(prev => [...prev, {
          text: aiResponse.text,
          sender: 'support',
          timestamp: getCurrentTime()
        }]);
        
        setIsLoading(true);
        
        try {
          const searchResponse = await fetch(`https://functions.poehali.dev/45af682d-92cb-4090-82b9-6ae2eb896eed?q=${encodeURIComponent(aiResponse.searchQuery)}`);
          
          if (!searchResponse.ok) {
            throw new Error(`HTTP ${searchResponse.status}`);
          }
          
          const searchData = await searchResponse.json();
          console.log('Search results:', searchData);
          
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
            
            // Добавляем ссылки если есть детальные результаты
            if (searchData.detailed_results && searchData.detailed_results.length > 0) {
              resultText += '\n\n🔗 Источники:\n';
              searchData.detailed_results.forEach((detail: any, index: number) => {
                if (detail.url && index < 3) {
                  resultText += `• ${detail.url}\n`;
                }
              });
            }
          } else {
            resultText = '🔍 К сожалению, не нашла актуальной информации в интернете.\n\n💡 Рекомендую:\n• Проверить официальные источники\n• Спросить в местных группах\n• Написать агенту для уточнения';
          }
          
          setChatMessages(prev => [...prev, {
            text: resultText,
            sender: 'support',
            timestamp: getCurrentTime()
          }]);
        } catch (error) {
          console.error('Search error:', error);
          setChatMessages(prev => [...prev, {
            text: `⚠️ Технический сбой при поиске: ${error instanceof Error ? error.message : 'неизвестная ошибка'}\n\n💡 Попробуйте:\n• Переформулировать запрос\n• Спросить по-другому\n• Обновить страницу\n\n🆘 Проблема не уходит? Напишите агенту!`,
            sender: 'support',
            showAgentButton: true,
            timestamp: getCurrentTime()
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
            showAdminLink: aiResponse.showAdminLink,
            timestamp: getCurrentTime()
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
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md flex flex-col shadow-2xl"
        style={{
          height: keyboardHeight > 0 ? `calc(100vh - ${keyboardHeight}px)` : '92vh',
          maxHeight: keyboardHeight > 0 ? `calc(100vh - ${keyboardHeight}px)` : '92vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onClose} className="text-gorkhon-pink hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Icon name="Headphones" size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Поддержка</h3>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {chatMessages.map((msg, idx) => (
            <div key={idx}>
              {isSystemChat ? (
                // Telegram-канал стиль
                <div className="border-b border-[#2B3942] hover:bg-[#151E27] transition-colors">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0088CC] flex items-center justify-center flex-shrink-0">
                        <img 
                          src="https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png" 
                          alt="Горхон.Online"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">Горхон.Online</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                            <circle cx="8" cy="8" r="8" fill="#0088CC"/>
                            <path d="M6 8l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-400 text-xs">сейчас</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                          <div className="flex items-center gap-1">
                            <Icon name="Eye" size={14} />
                            <span>1.2K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3">
                  {msg.sender === 'support' && (
                    <div className="font-bold text-sm text-gray-900 mb-2">Лина</div>
                  )}
                  <div className="flex items-end gap-2">
                    {msg.sender === 'support' && (
                      <span className="text-xs text-gray-500 mb-1">{msg.timestamp || formatTimeIrkutsk()}</span>
                    )}
                    <div 
                      className={`rounded-3xl px-4 py-3 max-w-[75%] ${
                        msg.sender === 'user' 
                          ? 'ml-auto bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 text-white' 
                          : 'bg-purple-50 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <span className="text-xs text-gray-500 mb-1">{msg.timestamp || formatTimeIrkutsk()}</span>
                    )}
                  </div>
                  {msg.showAgentButton && (
                    <a
                      href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 bg-gorkhon-pink text-white rounded-xl hover:bg-gorkhon-pink/90 transition-colors shadow-sm"
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
              )}
            </div>
          ))}
        </div>

        {!isSystemChat && (
          <div className="p-4 border-t bg-white/95 backdrop-blur-sm">
            {isLoading ? (
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gorkhon-pink"></div>
                  <span>Лина печатает...</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 rounded-3xl p-2 shadow-sm">
                <button className="text-gray-400 p-2 active:bg-gray-200 rounded-full transition-colors">
                  <Icon name="Paperclip" size={20} />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ваше сообщение"
                  className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none text-sm"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-2.5 rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Icon name="Send" size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
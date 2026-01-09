import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { SystemMessage } from './types';
import { useRef, useEffect } from 'react';

interface SystemMessagesTabProps {
  systemMessages: SystemMessage[];
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  addSystemMessage: () => void;
  deleteSystemMessage: (id: string) => void;
}

const SystemMessagesTab = ({
  systemMessages,
  newMessageText,
  setNewMessageText,
  addSystemMessage,
  deleteSystemMessage
}: SystemMessagesTabProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemMessages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Irkutsk'
    });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-[#0E1621] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
      
      {/* Telegram-стиль Header */}
      <div className="bg-[#212D3B] px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Icon name="Radio" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Системный канал</h2>
            <p className="text-gray-400 text-xs">
              {systemMessages.length} {systemMessages.length === 1 ? 'сообщение' : 'сообщений'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">ONLINE</span>
        </div>
      </div>

      {/* Messages Area - Telegram Style */}
      <div className="flex-1 overflow-y-auto bg-[#0E1621] p-4 space-y-3" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
        {systemMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-32 h-32 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <Icon name="MessageSquare" size={64} className="opacity-30" />
            </div>
            <p className="text-lg font-medium">Нет сообщений</p>
            <p className="text-sm text-gray-600 mt-1">Начните публиковать объявления</p>
          </div>
        ) : (
          <>
            {systemMessages.slice().reverse().map((msg, index) => (
              <div key={msg.id} className="animate-fadeIn">
                {/* Date separator */}
                {(index === 0 || new Date(msg.timestamp).toDateString() !== new Date(systemMessages[systemMessages.length - index].timestamp).toDateString()) && (
                  <div className="flex justify-center mb-4 mt-2">
                    <div className="bg-[#1a2332] text-gray-400 text-xs px-3 py-1 rounded-full font-medium">
                      {new Date(msg.timestamp).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long',
                        year: new Date(msg.timestamp).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </div>
                  </div>
                )}

                {/* Message bubble - Telegram style */}
                <div className="flex justify-start group">
                  <div className="max-w-[85%] flex items-end gap-2">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-lg">
                      <Icon name="Radio" size={14} className="text-white" />
                    </div>
                    
                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-[#212D3B] rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg relative group/message hover:shadow-xl transition-shadow">
                        {/* Message header */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-blue-400 text-sm">Системный канал</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                        </div>
                        
                        {/* Message text */}
                        <p className="text-white text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>

                        {/* Message actions - появляются при hover */}
                        <div className="absolute -right-12 top-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                          <Button
                            onClick={() => deleteSystemMessage(msg.id)}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Message status */}
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <Icon name="Check" size={12} className="text-blue-400" />
                        <Icon name="Check" size={12} className="text-blue-400 -ml-2" />
                        <span className="text-xs text-gray-600 ml-1">Прочитано</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Telegram Style */}
      <div className="bg-[#212D3B] border-t border-gray-700 px-4 py-3">
        <div className="flex items-end gap-3">
          {/* Attach button */}
          <button className="w-10 h-10 rounded-full bg-[#2B5278] hover:bg-[#3A6A9C] transition-colors flex items-center justify-center flex-shrink-0 mb-1">
            <Icon name="Paperclip" size={20} className="text-white" />
          </button>

          {/* Message input */}
          <div className="flex-1 bg-[#0E1621] rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Напишите сообщение..."
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none outline-none min-h-[44px] max-h-[200px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addSystemMessage();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={addSystemMessage}
            disabled={!newMessageText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mb-1 transition-all ${
              newMessageText.trim()
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50 scale-100'
                : 'bg-gray-700 scale-95 opacity-50'
            }`}
          >
            <Icon name="Send" size={18} className="text-white ml-0.5" />
          </button>
        </div>
        
        {/* Hint text */}
        <p className="text-xs text-gray-600 mt-2 ml-14">
          Enter для отправки, Shift+Enter для новой строки
        </p>
      </div>
    </div>
  );
};

export default SystemMessagesTab;
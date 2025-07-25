import { useRef, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import { Ticket, TicketMessage } from './TicketListItem';
import Icon from '@/components/ui/icon';

interface TicketChatProps {
  ticket: Ticket;
  user: UserProfile;
  newMessage: string;
  isLinaTyping: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
}

const TicketChat = ({ 
  ticket, 
  user, 
  newMessage, 
  isLinaTyping, 
  onMessageChange, 
  onSendMessage, 
  onClose 
}: TicketChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.messages, isLinaTyping]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'in_progress': return 'В работе';
      case 'resolved': return 'Решен';
      case 'closed': return 'Закрыт';
      default: return status;
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl h-96 flex flex-col">
      {/* Заголовок чата */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
            <p className="text-sm text-gray-600">Тикет #{ticket.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
              {getStatusText(ticket.status)}
            </span>
            <button
              onClick={onClose}
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
                {new Date(ticket.createdAt).toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{ticket.description}</p>
        </div>

        {/* Сообщения */}
        {ticket.messages.map(message => (
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
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
            disabled={isLinaTyping}
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isLinaTyping}
            className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketChat;
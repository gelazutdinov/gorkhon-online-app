import { useState, useRef, useEffect } from 'react';
import { DirectMessage, Chat, SocialUser } from '../types/SocialTypes';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';

interface DirectMessagesProps {
  chats: Chat[];
  messages: DirectMessage[];
  socialUsers: SocialUser[];
  currentUser: UserProfile;
  onSendMessage: (toUserId: string, content: string, image?: string) => void;
  onMarkAsRead: (chatId: string) => void;
}

const DirectMessages = ({ 
  chats, 
  messages, 
  socialUsers, 
  currentUser, 
  onSendMessage,
  onMarkAsRead 
}: DirectMessagesProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserById = (userId: string) => 
    socialUsers.find(u => u.id === userId);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId 
    ? messages.filter(m => 
        (m.fromUserId === currentUser.id || m.toUserId === currentUser.id) &&
        (selectedChat?.participants.includes(m.fromUserId) && selectedChat?.participants.includes(m.toUserId))
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedChatId) {
      onMarkAsRead(selectedChatId);
    }
  }, [selectedChatId, onMarkAsRead]);

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !selectedImage) || !selectedChat) return;

    const otherUserId = selectedChat.participants.find(id => id !== currentUser.id);
    if (otherUserId) {
      onSendMessage(otherUserId, newMessage.trim(), selectedImage || undefined);
      setNewMessage('');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Список чатов */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Сообщения</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Icon name="MessageCircle" size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Нет сообщений</p>
            </div>
          ) : (
            chats.map(chat => {
              const otherUserId = chat.participants.find(id => id !== currentUser.id);
              const otherUser = getUserById(otherUserId || '');
              
              if (!otherUser) return null;

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedChatId === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    {otherUser.avatar.startsWith('data:') ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {otherUser.avatar}
                      </div>
                    )}
                    {otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{otherUser.name}</h4>
                      {chat.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage.image ? '📷 Фото' : chat.lastMessage.content}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Выберите чат для начала общения</p>
            </div>
          </div>
        ) : (
          <>
            {/* Заголовок чата */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              {(() => {
                const otherUserId = selectedChat.participants.find(id => id !== currentUser.id);
                const otherUser = getUserById(otherUserId || '');
                
                return otherUser ? (
                  <>
                    {otherUser.avatar.startsWith('data:') ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {otherUser.avatar}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{otherUser.name}</h4>
                      <p className="text-sm text-gray-500">
                        {otherUser.isOnline ? 'В сети' : 'Не в сети'}
                      </p>
                    </div>
                  </>
                ) : null;
              })()}
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => {
                const isOwn = message.fromUserId === currentUser.id;
                const author = getUserById(message.fromUserId);

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'} rounded-2xl px-4 py-2`}>
                      {message.image && (
                        <img 
                          src={message.image} 
                          alt="Отправленное изображение"
                          className="w-full rounded-lg mb-2"
                        />
                      )}
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="p-4 border-t border-gray-200">
              {selectedImage && (
                <div className="mb-3 relative inline-block">
                  <img 
                    src={selectedImage} 
                    alt="Предпросмотр"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}
              
              <div className="flex items-end gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Icon name="Camera" size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Написать сообщение..."
                    className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-2xl resize-none border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm max-h-20"
                    rows={1}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedImage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default DirectMessages;
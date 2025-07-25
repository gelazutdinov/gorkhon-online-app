import { useState, useEffect } from 'react';
import { UserProfile } from '@/hooks/useUser';
import Icon from '@/components/ui/icon';
import TicketListItem, { Ticket, TicketMessage } from './tickets/TicketListItem';
import TicketChat from './tickets/TicketChat';
import CreateTicketModal from './tickets/CreateTicketModal';
import LinaAssistantCard from './tickets/LinaAssistantCard';
import { botKnowledge, generateBotResponse } from './tickets/BotKnowledge';

interface TicketSystemProps {
  user: UserProfile;
}

const TicketSystem = ({ user }: TicketSystemProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLinaTyping, setIsLinaTyping] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });

  // Загрузка тикетов пользователя
  useEffect(() => {
    const savedTickets = localStorage.getItem(`tickets_${user.id}`);
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, [user.id]);

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
        const botResponse = generateBotResponse(newMessage, activeTicket.id);
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

      <LinaAssistantCard />

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
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  isActive={activeTicket?.id === ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Чат */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <TicketChat
              ticket={activeTicket}
              user={user}
              newMessage={newMessage}
              isLinaTyping={isLinaTyping}
              onMessageChange={setNewMessage}
              onSendMessage={sendMessage}
              onClose={() => setActiveTicket(null)}
            />
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

      <CreateTicketModal
        isOpen={showCreateTicket}
        newTicket={newTicket}
        onTicketChange={setNewTicket}
        onClose={() => setShowCreateTicket(false)}
        onCreate={createTicket}
      />
    </div>
  );
};

export default TicketSystem;
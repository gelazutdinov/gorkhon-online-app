import Icon from '@/components/ui/icon';

export interface Ticket {
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

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'bot' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

interface TicketListItemProps {
  ticket: Ticket;
  isActive: boolean;
  onClick: () => void;
}

const TicketListItem = ({ ticket, isActive, onClick }: TicketListItemProps) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'in_progress': return 'В работе';
      case 'resolved': return 'Решен';
      case 'closed': return 'Закрыт';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        isActive
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
          {getStatusText(ticket.status)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
          {getPriorityText(ticket.priority)}
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
  );
};

export default TicketListItem;
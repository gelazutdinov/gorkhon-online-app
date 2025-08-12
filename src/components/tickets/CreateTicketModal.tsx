import Icon from '@/components/ui/icon';

interface NewTicket {
  subject: string;
  description: string;
  category: 'technical' | 'account' | 'billing' | 'general';
  priority: 'low' | 'medium' | 'high';
}

interface CreateTicketModalProps {
  isOpen: boolean;
  newTicket: NewTicket;
  onTicketChange: (updater: (prev: NewTicket) => NewTicket) => void;
  onClose: () => void;
  onCreate: () => void;
}

const CreateTicketModal = ({ isOpen, newTicket, onTicketChange, onClose, onCreate }: CreateTicketModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 safe-area-bottom">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Создать тикет</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тема
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => onTicketChange(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base"
                placeholder="Кратко опишите проблему"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e) => onTicketChange(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base resize-none"
                placeholder="Подробно опишите проблему или вопрос"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => onTicketChange(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base"
                >
                  <option value="general">Общие вопросы</option>
                  <option value="technical">Технические проблемы</option>
                  <option value="account">Аккаунт</option>
                  <option value="billing">Billing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => onTicketChange(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent text-sm sm:text-base"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={onCreate}
              disabled={!newTicket.subject.trim() || !newTicket.description.trim()}
              className="flex-1 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать тикет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
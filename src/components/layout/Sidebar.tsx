import Icon from "@/components/ui/icon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onChatOpen: () => void;
  onDocumentOpen: (doc: 'privacy' | 'terms' | 'security') => void;
}

const Sidebar = ({ isOpen, onClose, onChatOpen, onDocumentOpen }: SidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/50" />
      <div 
        className="w-80 bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{backgroundColor: '#F1117E'}}>
          <h3 className="font-semibold text-white">Меню</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Поддержка</h3>
            <button
              onClick={() => {
                onClose();
                onChatOpen();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
            >
              <Icon name="Bot" size={20} />
              <div className="flex-1">
                <div className="font-medium">Лина (ИИ-помощник)</div>
                <div className="text-xs opacity-90">Помощь по платформе</div>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Документы</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onDocumentOpen('privacy');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100 border border-gray-200"
              >
                <Icon name="Shield" size={18} />
                <span className="text-sm font-medium">Политика конфиденциальности</span>
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('terms');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100 border border-gray-200"
              >
                <Icon name="FileText" size={18} />
                <span className="text-sm font-medium">Правила пользования</span>
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('security');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100 border border-gray-200"
              >
                <Icon name="Lock" size={18} />
                <span className="text-sm font-medium">Защита информации</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
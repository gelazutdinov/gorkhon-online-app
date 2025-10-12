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
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />
      <div 
        className="w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-pink-500 to-pink-600">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-lg">Меню</h3>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-all active:scale-95"
              aria-label="Закрыть меню"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          <p className="text-white/80 text-xs">Навигация и настройки</p>
        </div>

        <div className="p-4 space-y-5">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Помощь</h3>
            <button
              onClick={() => {
                onClose();
                onChatOpen();
              }}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg active:scale-98"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="Bot" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Лина</div>
                <div className="text-xs opacity-90">ИИ-помощник онлайн</div>
              </div>
              <Icon name="ChevronRight" size={16} className="opacity-50" />
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Информация</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onDocumentOpen('privacy');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200 active:scale-98"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium flex-1">Конфиденциальность</span>
                <Icon name="ChevronRight" size={14} className="text-gray-400" />
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('terms');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200 active:scale-98"
              >
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={16} className="text-green-600" />
                </div>
                <span className="text-sm font-medium flex-1">Правила</span>
                <Icon name="ChevronRight" size={14} className="text-gray-400" />
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('security');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200 active:scale-98"
              >
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Icon name="Lock" size={16} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium flex-1">Безопасность</span>
                <Icon name="ChevronRight" size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Heart" size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Горхон.Online</p>
                  <p className="text-xs text-gray-600">Ваш информационный помощник</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
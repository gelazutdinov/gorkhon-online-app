import Icon from '@/components/ui/icon';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">Настройки</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 safe-area-bottom">
          {/* Приватность */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Icon name="Shield" size={16} className="flex-shrink-0" />
              <span className="truncate">Приватность и безопасность</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm sm:text-base truncate">Сбор аналитики</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Анонимная статистика использования</div>
                </div>
                <button className="w-12 h-6 bg-gorkhon-pink rounded-full relative flex-shrink-0 min-touch">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm sm:text-base truncate">Автосохранение</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Автоматическое сохранение данных</div>
                </div>
                <button className="w-12 h-6 bg-gorkhon-pink rounded-full relative flex-shrink-0 min-touch">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Интерфейс */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="Smartphone" size={16} />
              Интерфейс
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Анимации переходов</div>
                  <div className="text-sm text-gray-600">Плавные переходы между страницами</div>
                </div>
                <button className="w-12 h-6 bg-gorkhon-pink rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Звуковые сигналы</div>
                  <div className="text-sm text-gray-600">Звуки при нажатиях и уведомлениях</div>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Кнопка сброса */}
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <div className="flex items-center justify-center gap-2">
                <Icon name="RotateCcw" size={16} />
                Сбросить настройки
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
import Icon from '@/components/ui/icon';

interface QuickActionsProps {
  onShowStatistics: () => void;
  onShowLina: () => void;
  onShowBackup: () => void;
  onShowAccessibility: () => void;
}

const QuickActions = ({ onShowStatistics, onShowLina, onShowBackup, onShowAccessibility }: QuickActionsProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Быстрые действия</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onShowStatistics}
          className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="BarChart3" size={20} className="text-blue-600 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium text-gray-800 text-sm sm:text-base">Статистика</div>
            <div className="text-xs sm:text-sm text-blue-600">Ваша активность</div>
          </div>
        </button>
        
        <button
          onClick={onShowLina}
          className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors active:scale-95 relative"
        >
          <Icon name="Bot" size={20} className="text-green-600 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium text-gray-800 text-sm sm:text-base">Лина</div>
            <div className="text-xs sm:text-sm text-green-600">Цифровой помощник</div>
          </div>
        </button>
        
        <button
          onClick={onShowBackup}
          className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="Shield" size={20} className="text-purple-600 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium text-gray-800 text-sm sm:text-base truncate">Резервное копирование</div>
            <div className="text-xs sm:text-sm text-purple-600 truncate">Сохранение данных</div>
          </div>
        </button>
        
        <button
          onClick={onShowAccessibility}
          className="flex items-center gap-3 p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="Eye" size={20} className="text-orange-600 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium text-gray-800 text-sm sm:text-base truncate">Доступность</div>
            <div className="text-xs sm:text-sm text-orange-600 truncate">Настройки интерфейса</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
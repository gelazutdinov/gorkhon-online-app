import Icon from '@/components/ui/icon';

interface QuickActionsProps {
  onShowStatistics: () => void;
  onShowLina: () => void;
  onShowBackup: () => void;
  onShowAccessibility: () => void;
}

const QuickActions = ({ onShowStatistics, onShowLina, onShowBackup, onShowAccessibility }: QuickActionsProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onShowStatistics}
          className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors relative"
        >
          <Icon name="BarChart3" size={24} className="text-blue-600 mb-3" />
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">Статистика</div>
            <div className="text-sm text-blue-600">Ваша активность</div>
          </div>
        </button>
        
        <button
          onClick={onShowLina}
          className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors relative"
        >
          <Icon name="Bot" size={24} className="text-green-600 mb-3" />
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">Лина</div>
            <div className="text-sm text-green-600">Цифровой помощник</div>
          </div>
        </button>
        
        <button
          onClick={onShowBackup}
          className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors relative"
        >
          <Icon name="Shield" size={24} className="text-purple-600 mb-3" />
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">Резервно...</div>
            <div className="text-sm text-purple-600">Сохранени...</div>
          </div>
        </button>
        
        <button
          onClick={onShowAccessibility}
          className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors relative"
        >
          <Icon name="Eye" size={24} className="text-orange-600 mb-3" />
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">Доступно...</div>
            <div className="text-sm text-orange-600">Настройки ...</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
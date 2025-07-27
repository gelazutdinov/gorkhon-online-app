import Icon from '@/components/ui/icon';

interface AdditionalToolsProps {
  onShowDataManager: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
}

const AdditionalTools = ({ onShowDataManager, onShowSettings, onLogout }: AdditionalToolsProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Инструменты</h3>
      <div className="space-y-3">
        <button
          onClick={onShowDataManager}
          className="w-full flex items-center gap-3 p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="Database" size={20} className="text-yellow-600 flex-shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm sm:text-base">Управление данными</div>
            <div className="text-xs sm:text-sm text-yellow-600">Экспорт и очистка данных</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
        </button>
        
        <button
          onClick={onShowSettings}
          className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="Settings" size={20} className="text-gray-600 flex-shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm sm:text-base">Настройки</div>
            <div className="text-xs sm:text-sm text-gray-600">Конфигурация приложения</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 sm:p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors active:scale-95"
        >
          <Icon name="LogOut" size={20} className="text-red-600 flex-shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm sm:text-base">Выйти из аккаунта</div>
            <div className="text-xs sm:text-sm text-red-600">Завершить сессию</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default AdditionalTools;
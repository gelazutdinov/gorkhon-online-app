import Icon from '@/components/ui/icon';

interface AdditionalToolsProps {
  onShowDataManager: () => void;
  onShowSettings: () => void;
  onShowSecurity: () => void;
  onLogout: () => void;
}

const AdditionalTools = ({ onShowDataManager, onShowSettings, onShowSecurity, onLogout }: AdditionalToolsProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Инструменты</h3>
      <div className="space-y-3">
        <button
          onClick={onShowDataManager}
          className="w-full flex items-center gap-4 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} className="text-yellow-600" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Управление данными</div>
            <div className="text-sm text-yellow-600">Экспорт и очистка данных</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
        </button>
        
        <button
          onClick={onShowSecurity}
          className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-green-600" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Безопасность</div>
            <div className="text-sm text-green-600">2FA и защита данных</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
        </button>
        
        <button
          onClick={onShowSettings}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-gray-600" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Настройки</div>
            <div className="text-sm text-gray-600">Конфигурация приложения</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="LogOut" size={20} className="text-red-600" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Выйти из аккаунта</div>
            <div className="text-sm text-red-600">Завершить сессию</div>
          </div>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default AdditionalTools;
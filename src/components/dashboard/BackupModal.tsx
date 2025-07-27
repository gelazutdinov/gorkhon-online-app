import Icon from '@/components/ui/icon';

interface BackupModalProps {
  onClose: () => void;
  onShowDataManager: () => void;
}

const BackupModal = ({ onClose, onShowDataManager }: BackupModalProps) => {
  const handleExportData = () => {
    onClose();
    onShowDataManager();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Резервное копирование</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          <div className="text-center">
            <Icon name="Shield" size={48} className="mx-auto mb-4 text-purple-500" />
            <h3 className="text-lg font-medium mb-2">Автоматическое резервное копирование</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ваши данные автоматически сохраняются локально в браузере. 
              Для дополнительной безопасности рекомендуем периодически экспортировать данные.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-green-600" />
              <span className="font-medium text-green-800">Состояние резервного копирования</span>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Профиль пользователя сохранен</li>
              <li>✓ Настройки синхронизированы</li>
              <li>✓ Статистика обновлена</li>
            </ul>
          </div>
          
          <button
            onClick={handleExportData}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Экспортировать данные
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;
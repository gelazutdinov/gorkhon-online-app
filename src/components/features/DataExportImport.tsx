import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/types/user';

interface DataExportImportProps {
  user: UserProfile;
  onClose: () => void;
  onImportSuccess: (data: UserProfile) => void;
}

const DataExportImport = ({ user, onClose, onImportSuccess }: DataExportImportProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Экспорт данных
  const exportData = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userData: user,
      settings: {
        notifications: localStorage.getItem('gorkhon_notifications'),
        theme: localStorage.getItem('gorkhon_theme'),
        reminders: localStorage.getItem('gorkhon_reminders')
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gorkhon-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Экспорт в CSV формат
  const exportCSV = () => {
    const csvData = [
      ['Поле', 'Значение'],
      ['Имя', user.name],
      ['Email', user.email],
      ['Телефон', user.phone],
      ['Дата рождения', user.birthDate],
      ['Дата регистрации', new Date(user.registeredAt).toLocaleDateString('ru-RU')],
      ['Всего сессий', user.stats.totalSessions.toString()],
      ['Время в приложении', `${user.stats.totalTimeSpent} минут`],
      ['Дней активности', user.stats.daysActive.toString()],
      ['Интересы', (user.interests || []).join(', ')],
      ['Статус', user.status || '']
    ];

    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gorkhon-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Импорт данных
  const importData = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    setImportError(null);

    try {
      const text = await importFile.text();
      const importedData = JSON.parse(text);

      // Валидация данных
      if (!importedData.userData || !importedData.userData.id) {
        throw new Error('Неверный формат файла');
      }

      const userData = importedData.userData as UserProfile;

      // Проверяем обязательные поля
      if (!userData.name || !userData.email) {
        throw new Error('В файле отсутствуют обязательные поля');
      }

      // Восстанавливаем настройки
      if (importedData.settings) {
        if (importedData.settings.notifications) {
          localStorage.setItem('gorkhon_notifications', importedData.settings.notifications);
        }
        if (importedData.settings.theme) {
          localStorage.setItem('gorkhon_theme', importedData.settings.theme);
        }
        if (importedData.settings.reminders) {
          localStorage.setItem('gorkhon_reminders', importedData.settings.reminders);
        }
      }

      // Обновляем профиль пользователя
      onImportSuccess(userData);
      onClose();

    } catch (error) {
      console.error('Import error:', error);
      setImportError(error instanceof Error ? error.message : 'Ошибка импорта данных');
    } finally {
      setIsImporting(false);
    }
  };

  // Очистка данных
  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      // Очищаем localStorage
      localStorage.removeItem('gorkhon_user_profile');
      localStorage.removeItem('gorkhon_notifications');
      localStorage.removeItem('gorkhon_theme');
      localStorage.removeItem('gorkhon_reminders');
      localStorage.removeItem('gorkhon_session_start');
      
      // Перезагружаем страницу
      window.location.reload();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Управление данными</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Экспорт данных */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="Download" size={20} className="text-gorkhon-pink" />
            Экспорт данных
          </h3>
          
          <div className="grid gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="FileJson" size={24} className="text-blue-600" />
              <div>
                <div className="font-medium text-gray-800">Полный бэкап (JSON)</div>
                <div className="text-sm text-gray-600">Включает все данные и настройки</div>
              </div>
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="FileSpreadsheet" size={24} className="text-green-600" />
              <div>
                <div className="font-medium text-gray-800">Таблица данных (CSV)</div>
                <div className="text-sm text-gray-600">Основная информация профиля</div>
              </div>
            </button>
          </div>
        </div>

        {/* Импорт данных */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon name="Upload" size={20} className="text-gorkhon-green" />
            Импорт данных
          </h3>

          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                <Icon name="FileUp" size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Выберите файл бэкапа</p>
                <p className="text-sm text-gray-500">Поддерживается только JSON формат</p>
              </label>
            </div>

            {importFile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">{importFile.name}</span>
                <button
                  onClick={() => setImportFile(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            )}

            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600" />
                  <span className="text-sm text-red-700">{importError}</span>
                </div>
              </div>
            )}

            <button
              onClick={importData}
              disabled={!importFile || isImporting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gorkhon-green text-white rounded-lg hover:bg-gorkhon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Импортирую...</span>
                </>
              ) : (
                <>
                  <Icon name="Upload" size={18} />
                  <span>Импортировать данные</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Информация о данных */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Icon name="Info" size={16} />
            Информация о ваших данных
          </h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Размер профиля: {JSON.stringify(user).length} символов</div>
            <div>Дата создания: {new Date(user.registeredAt).toLocaleDateString('ru-RU')}</div>
            <div>Последняя активность: {new Date(user.lastActiveAt).toLocaleDateString('ru-RU')}</div>
          </div>
        </div>

        {/* Опасная зона */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-4">
            <Icon name="AlertTriangle" size={20} />
            Опасная зона
          </h3>
          
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Icon name="Trash2" size={18} />
            <span>Удалить все данные</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Это действие нельзя отменить. Все данные будут потеряны.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataExportImport;
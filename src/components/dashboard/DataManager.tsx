import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface DataManagerProps {
  user: UserProfile;
  onClose: () => void;
}

const DataManager = ({ user, onClose }: DataManagerProps) => {
  const [activeTab, setActiveTab] = useState<'export' | 'clear'>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearConfirm, setClearConfirm] = useState('');

  const exportUserData = async () => {
    setIsExporting(true);
    
    try {
      // Собираем все данные пользователя
      const userData = {
        profile: user,
        notifications: JSON.parse(localStorage.getItem('gorkhon_notifications') || '[]'),
        theme: localStorage.getItem('gorkhon_theme') || 'default',
        settings: JSON.parse(localStorage.getItem('gorkhon_settings') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Создаем JSON файл
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gorkhon-data-${user.name}-${new Date().toISOString().split('T')[0]}.json`;
      
      // Инициируем скачивание
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Очищаем URL
      URL.revokeObjectURL(url);
      
      // Показываем уведомление об успехе
      const notifications = JSON.parse(localStorage.getItem('gorkhon_notifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: 'Данные экспортированы',
        message: 'Ваши данные успешно сохранены в файл',
        type: 'success',
        timestamp: Date.now(),
        read: false
      });
      localStorage.setItem('gorkhon_notifications', JSON.stringify(notifications));
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Ошибка при экспорте данных. Попробуйте еще раз.');
    } finally {
      setIsExporting(false);
    }
  };

  const clearAllData = () => {
    if (clearConfirm !== 'ОЧИСТИТЬ') {
      alert('Введите "ОЧИСТИТЬ" для подтверждения');
      return;
    }

    setIsClearing(true);
    
    try {
      // Очищаем все данные кроме базовой информации о пользователе
      const keysToKeep = ['gorkhon_user'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (key.startsWith('gorkhon_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Сбрасываем тему
      const root = document.documentElement;
      root.style.removeProperty('--color-gorkhon-pink');
      root.style.removeProperty('--color-gorkhon-green');
      root.style.removeProperty('--color-gorkhon-blue');

      alert('Все данные очищены. Страница будет перезагружена.');
      window.location.reload();
      
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Ошибка при очистке данных. Попробуйте еще раз.');
    } finally {
      setIsClearing(false);
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('gorkhon_')) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2); // В KB
  };

  const getDataTypes = () => {
    const types = [];
    if (localStorage.getItem('gorkhon_user')) types.push('Профиль пользователя');
    if (localStorage.getItem('gorkhon_notifications')) types.push('Уведомления');
    if (localStorage.getItem('gorkhon_theme')) types.push('Настройки темы');
    if (localStorage.getItem('gorkhon_settings')) types.push('Общие настройки');
    return types;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-gray-800">Управление данными</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Табы */}
      <div className="flex bg-gray-100 p-1 m-4 rounded-lg">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'export'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Экспорт данных
        </button>
        <button
          onClick={() => setActiveTab('clear')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'clear'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Очистка данных
        </button>
      </div>

      <div className="p-6 pt-0">
        {activeTab === 'export' ? (
          <div className="space-y-6">
            {/* Информация о данных */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Icon name="Info" size={16} />
                Информация о ваших данных
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Размер данных:</span>
                  <span className="font-medium text-blue-800">{getStorageSize()} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Пользователь:</span>
                  <span className="font-medium text-blue-800">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Регистрация:</span>
                  <span className="font-medium text-blue-800">
                    {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            {/* Типы данных */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Что будет экспортировано:</h3>
              <div className="space-y-2">
                {getDataTypes().map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка экспорта */}
            <button
              onClick={exportUserData}
              disabled={isExporting}
              className="w-full py-3 px-4 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Экспортируется...
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} />
                  Скачать мои данные
                </>
              )}
            </button>

            {/* Дополнительная информация */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Данные экспортируются в формате JSON</p>
              <p>• Файл содержит всю информацию о вашем профиле</p>
              <p>• Вы можете использовать эти данные для восстановления</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Предупреждение */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} />
                Внимание!
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Эта операция удалит все ваши данные навсегда. Восстановление будет невозможно.
              </p>
              <div className="text-sm text-red-600 space-y-1">
                <p>Будут удалены:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Все уведомления</li>
                  <li>Настройки темы оформления</li>
                  <li>История активности</li>
                  <li>Пользовательские настройки</li>
                </ul>
              </div>
            </div>

            {/* Статистика данных */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-3">Текущие данные:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-white rounded-lg">
                  <div className="font-bold text-gray-800">{getStorageSize()}</div>
                  <div className="text-gray-600">KB данных</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <div className="font-bold text-gray-800">{getDataTypes().length}</div>
                  <div className="text-gray-600">типов данных</div>
                </div>
              </div>
            </div>

            {/* Подтверждение */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Для подтверждения введите: <strong>ОЧИСТИТЬ</strong>
              </label>
              <input
                type="text"
                value={clearConfirm}
                onChange={(e) => setClearConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Введите ОЧИСТИТЬ"
              />
            </div>

            {/* Кнопка очистки */}
            <button
              onClick={clearAllData}
              disabled={isClearing || clearConfirm !== 'ОЧИСТИТЬ'}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Очищается...
                </>
              ) : (
                <>
                  <Icon name="Trash2" size={16} />
                  Очистить все данные
                </>
              )}
            </button>

            {/* Рекомендация */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Рекомендация</h4>
                  <p className="text-sm text-yellow-700">
                    Перед очисткой рекомендуем сначала экспортировать ваши данные 
                    на случай, если они понадобятся в будущем.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManager;
import Icon from '@/components/ui/icon';

interface SettingsModalsProps {
  showPasswordChange: boolean;
  showActivityHistory: boolean;
  onClosePasswordChange: () => void;
  onCloseActivityHistory: () => void;
}

const SettingsModals = ({ 
  showPasswordChange, 
  showActivityHistory, 
  onClosePasswordChange, 
  onCloseActivityHistory 
}: SettingsModalsProps) => {
  return (
    <>
      {/* Модалка смены пароля */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Key" className="w-5 h-5 text-blue-600" />
                Сменить пароль
              </h2>
              <button
                onClick={onClosePasswordChange}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={onClosePasswordChange}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => {
                    alert('Пароль изменен!');
                    onClosePasswordChange();
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка истории активности */}
      {showActivityHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Activity" className="w-5 h-5 text-green-600" />
                История активности
              </h2>
              <button
                onClick={onCloseActivityHistory}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {[
                { action: 'Вход в систему', time: 'Сегодня, 14:30', ip: '192.168.1.1' },
                { action: 'Изменение профиля', time: 'Вчера, 16:20', ip: '192.168.1.1' },
                { action: 'Смена пароля', time: '3 дня назад', ip: '192.168.1.1' },
                { action: 'Вход в систему', time: '5 дней назад', ip: '192.168.1.5' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time} • IP: {activity.ip}</p>
                  </div>
                  <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModals;
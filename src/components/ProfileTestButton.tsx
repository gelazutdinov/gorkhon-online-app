import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';

const ProfileTestButton = () => {
  const { user, updateProfile, reloadUser } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev, logMessage]);
  };

  const testProfileUpdate = async () => {
    log('🧪 Тестирую обновление профиля...');
    
    if (!user) {
      log('❌ Пользователь не авторизован');
      return;
    }

    // Тестовые данные для обновления
    const testUpdates = {
      name: 'Тестовое Имя',
      phone: '+7 999 123 45 67',
      birthDate: '1990-05-15'
    };

    log(`📝 Обновляю профиль: ${JSON.stringify(testUpdates)}`);

    try {
      const result = await updateProfile(testUpdates);
      
      if (result.success) {
        log('✅ updateProfile вернул успех');
        
        // Проверяем localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          log(`💾 В localStorage: name=${userData.name}, phone=${userData.phone}`);
        } else {
          log('❌ Нет данных в localStorage!');
        }
        
        // Перезагружаем пользователя
        const reloadResult = reloadUser();
        if (reloadResult.success) {
          log('🔄 Данные пользователя перезагружены');
        }
        
      } else {
        log(`❌ Ошибка обновления: ${result.error}`);
      }
    } catch (error) {
      log(`💥 Исключение: ${error}`);
    }
  };

  const checkCurrentData = () => {
    log('🔍 Проверяю текущие данные пользователя:');
    log(`  - name: ${user?.name}`);
    log(`  - phone: ${user?.phone}`);
    log(`  - birthDate: ${user?.birthDate}`);
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        log('💾 В localStorage:');
        log(`  - name: ${userData.name}`);
        log(`  - phone: ${userData.phone}`);
        log(`  - birthDate: ${userData.birthDate}`);
      } catch (error) {
        log('❌ Ошибка чтения localStorage');
      }
    } else {
      log('❌ Нет данных в localStorage');
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">⚠️ Войдите в систему для тестирования профиля</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">🧪 Тест сохранения профиля</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Кнопки управления */}
        <div className="space-y-3">
          <div>
            <h3 className="font-medium mb-2">Текущий пользователь:</h3>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p>Имя: <strong>{user.name}</strong></p>
              <p>Email: <strong>{user.email}</strong></p>
              <p>Телефон: <strong>{user.phone || 'не указан'}</strong></p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={testProfileUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Edit" size={16} />
              Тест обновления
            </button>
            
            <button
              onClick={checkCurrentData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Search" size={16} />
              Проверить данные
            </button>
            
            <button
              onClick={() => setLogs([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Trash2" size={16} />
              Очистить
            </button>
          </div>
        </div>

        {/* Логи */}
        <div>
          <h3 className="font-medium mb-2">Логи тестирования:</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">Логи появятся здесь</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-xs font-mono p-2 rounded ${
                      log.includes('✅') ? 'bg-green-100 text-green-800' :
                      log.includes('❌') ? 'bg-red-100 text-red-800' :
                      log.includes('🔍') ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Инструкция */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium mb-2">📋 Как тестировать:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Нажмите "Тест обновления" - изменит имя, телефон и дату рождения</li>
          <li>Нажмите "Проверить данные" - покажет текущие данные</li>
          <li>Проверьте, что изменения сохранились в localStorage</li>
          <li>Обновите страницу - данные должны остаться</li>
        </ol>
      </div>
    </div>
  );
};

export default ProfileTestButton;
import { useState, useEffect } from 'react';
import { saveCredentials, loadCredentials, clearCredentials, getAutoFillCredentials } from '@/utils/rememberMe';
import Icon from '@/components/ui/icon';

const SaveTestForm = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    log('🚀 Компонент загружен, проверяю сохраненные данные');
    
    const savedData = getAutoFillCredentials();
    log(`📥 Найдены данные: email=${savedData.email}, password=${savedData.password ? '***' : 'пусто'}, remember=${savedData.rememberMe}`);
    
    if (savedData.email || savedData.password) {
      setTestEmail(savedData.email);
      setTestPassword(savedData.password);
      setRememberMe(savedData.rememberMe);
      log('✅ Поля автозаполнены');
    }
  }, []);

  const handleSave = () => {
    log('💾 Сохраняю данные...');
    saveCredentials(testEmail, testPassword, rememberMe);
    log(`✅ Данные сохранены: ${testEmail} / *** / remember=${rememberMe}`);
  };

  const handleLoad = () => {
    log('📥 Загружаю данные...');
    const data = loadCredentials();
    log(`📋 Загружены: email=${data.email}, password=${data.password ? '***' : 'пусто'}, remember=${data.rememberMe}`);
    
    setTestEmail(data.email);
    setTestPassword(data.password);
    setRememberMe(data.rememberMe);
  };

  const handleClear = () => {
    log('🗑️ Очищаю все данные...');
    clearCredentials();
    setTestEmail('');
    setTestPassword('');
    setRememberMe(false);
    log('✅ Все очищено');
  };

  const checkLocalStorage = () => {
    log('🔍 Проверяю localStorage напрямую:');
    const email = localStorage.getItem('savedEmail');
    const password = localStorage.getItem('savedPassword');
    const remember = localStorage.getItem('rememberMe');
    const regData = localStorage.getItem('registrationData');
    
    log(`  - savedEmail: ${email || 'нет'}`);
    log(`  - savedPassword: ${password || 'нет'}`);
    log(`  - rememberMe: ${remember || 'нет'}`);
    log(`  - registrationData: ${regData ? 'есть' : 'нет'}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">🧪 Тест сохранения данных</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Форма */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="password123"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="remember" className="text-sm">Запомнить меня</label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Save" size={16} />
              Сохранить
            </button>
            
            <button
              onClick={handleLoad}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Download" size={16} />
              Загрузить
            </button>
            
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Trash2" size={16} />
              Очистить
            </button>
            
            <button
              onClick={checkLocalStorage}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Icon name="Search" size={16} />
              Проверить
            </button>
          </div>
        </div>

        {/* Логи */}
        <div>
          <h3 className="font-medium mb-2">Логи:</h3>
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
          
          <button
            onClick={() => setLogs([])}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Очистить логи
          </button>
        </div>
      </div>
      
      {/* Инструкция */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium mb-2">📋 Инструкция:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Введите email и пароль</li>
          <li>Поставьте галочку "Запомнить меня"</li>
          <li>Нажмите "Сохранить"</li>
          <li>Очистите поля кнопкой "Очистить"</li>
          <li>Нажмите "Загрузить" - поля должны заполниться</li>
          <li>Проверьте localStorage кнопкой "Проверить"</li>
        </ol>
      </div>
    </div>
  );
};

export default SaveTestForm;
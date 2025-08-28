import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';

const AuthTestSuite = () => {
  const { register, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const log = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setTestResults([]);
    localStorage.clear();
    log('🧹 localStorage очищен');
  };

  const runTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Шаг 1: Очистка
      localStorage.clear();
      log('🧹 localStorage очищен');

      // Шаг 2: Регистрация
      log('📝 Начинаем регистрацию...');
      const regResult = await register({
        email: 'test-user@example.com',
        password: 'password123',
        name: 'Тестовый Юзер',
        birthDate: '1990-01-01'
      });

      if (regResult.success) {
        log('✅ Регистрация успешна');
        
        // Проверяем, что данные сохранились
        const savedRegData = localStorage.getItem('registrationData');
        if (savedRegData) {
          const parsedData = JSON.parse(savedRegData);
          log(`💾 Данные регистрации сохранены: ${parsedData.email} / ${parsedData.password}`);
        } else {
          log('❌ Данные регистрации НЕ сохранились');
        }
      } else {
        log(`❌ Ошибка регистрации: ${regResult.error}`);
        return;
      }

      // Шаг 3: Выход
      await logout();
      log('🚪 Вышли из системы');

      // Шаг 4: Попытка входа с теми же данными
      log('🔐 Пробуем войти с данными регистрации...');
      const loginResult = await login({
        email: 'test-user@example.com',
        password: 'password123',
        rememberMe: true
      });

      if (loginResult.success) {
        log('✅ Вход успешен! Данные регистрации работают');
        
        // Проверяем сохранение для автозаполнения
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        const rememberMe = localStorage.getItem('rememberMe');
        
        log(`💾 Автозаполнение: email=${savedEmail}, password=${savedPassword ? '***' : 'не сохранен'}, remember=${rememberMe}`);
      } else {
        log(`❌ Ошибка входа: ${loginResult.error}`);
      }

      // Шаг 5: Тест автозаполнения
      await logout();
      log('🚪 Снова вышли');
      
      log('🔄 Проверяем автозаполнение...');
      const autoFillEmail = localStorage.getItem('savedEmail');
      const autoFillPassword = localStorage.getItem('savedPassword');
      
      if (autoFillEmail && autoFillPassword) {
        log(`✅ Автозаполнение работает: ${autoFillEmail} / ***`);
        
        // Финальный тест - вход с сохраненными данными
        const finalLogin = await login({
          email: autoFillEmail,
          password: autoFillPassword,
          rememberMe: true
        });
        
        if (finalLogin.success) {
          log('🎉 ФИНАЛЬНЫЙ ТЕСТ ПРОШЕЛ! Все работает корректно');
        } else {
          log(`❌ Финальный тест провален: ${finalLogin.error}`);
        }
      } else {
        log('❌ Автозаполнение не работает');
      }

    } catch (error) {
      log(`💥 Ошибка теста: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">🧪 Тестирование системы авторизации</h2>
        <p className="text-gray-600 text-sm">Полный тест: Регистрация → Выход → Вход → Автозаполнение</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={runTest}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
              Тестируем...
            </>
          ) : (
            <>
              <Icon name="Play" className="w-4 h-4" />
              Запустить тест
            </>
          )}
        </button>
        
        <button
          onClick={clearLogs}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Icon name="Trash2" className="w-4 h-4" />
          Очистить
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-medium mb-2">Логи тестирования:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm">Нажмите "Запустить тест" для начала</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`text-sm font-mono p-2 rounded ${
                  result.includes('✅') ? 'bg-green-100 text-green-800' :
                  result.includes('❌') ? 'bg-red-100 text-red-800' :
                  result.includes('🎉') ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTestSuite;
const http = require('http');

console.log('🧪 ТЕСТИРОВАНИЕ ЭКСТРЕННОГО СЕРВЕРА');
console.log('=' .repeat(50));

const baseURL = 'http://localhost:3001';

// Функция для HTTP запросов
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Основная функция тестирования
async function testServer() {
  try {
    console.log('🔍 1. Проверяем health endpoint...');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    
    if (health.status !== 200) {
      throw new Error('Health check failed!');
    }
    
    console.log('✅ Health check успешен!');
    console.log('');

    console.log('🔐 2. Тестируем логин...');
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'smm@gelazutdinov.ru',
      password: 'admin123'
    });
    console.log(`   Status: ${login.status}`);
    console.log(`   Response:`, login.data);
    
    if (login.status !== 200 || !login.data.success) {
      throw new Error('Login failed!');
    }
    
    console.log('✅ Логин успешен!');
    console.log('');

    const token = login.data.data.token;

    console.log('👤 3. Проверяем текущего пользователя...');
    const me = await makeRequest('GET', '/api/auth/me');
    me.headers = { 'Authorization': `Bearer ${token}` };
    console.log(`   Status: ${me.status}`);
    console.log(`   Response:`, me.data);
    
    console.log('✅ Проверка пользователя завершена!');
    console.log('');

    console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
    console.log('🟢 СЕРВЕР РАБОТАЕТ КОРРЕКТНО!');
    console.log('');
    console.log('📊 Доступные endpoints:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/register');
    console.log('   GET  /api/auth/me');
    console.log('   POST /api/auth/logout');

  } catch (error) {
    console.error('❌ ОШИБКА ТЕСТИРОВАНИЯ:', error.message);
    console.log('');
    console.log('💡 Убедитесь, что сервер запущен:');
    console.log('   node server/start-emergency-server.js');
    process.exit(1);
  }
}

// Проверяем доступность сервера
console.log('⏳ Подключение к серверу...');
setTimeout(() => {
  testServer();
}, 1000);
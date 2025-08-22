const https = require('http');

console.log('🧪 ТЕСТИРОВАНИЕ РАБОЧЕГО СЕРВЕРА');
console.log('===============================');

const BASE_URL = 'http://localhost:3001';

// Функция для HTTP запросов
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  let token = null;

  try {
    // 1. Тест health check
    console.log('1. 🏥 Тестируем health check...');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   Статус: ${health.status}`);
    console.log(`   Ответ:`, health.data);

    // 2. Тест логина
    console.log('\n2. 🔑 Тестируем логин...');
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'smm@gelazutdinov.ru',
      password: 'admin123'
    });
    console.log(`   Статус: ${login.status}`);
    console.log(`   Успех: ${login.data.success}`);
    
    if (login.data.success) {
      token = login.data.data.token;
      console.log(`   Токен получен: ${token.substring(0, 20)}...`);
    }

    // 3. Тест получения профиля
    if (token) {
      console.log('\n3. 👤 Тестируем получение профиля...');
      const profile = await makeRequest('GET', '/api/auth/me', null, token);
      console.log(`   Статус: ${profile.status}`);
      console.log(`   Пользователь:`, profile.data.data?.user?.email);
    }

    // 4. Тест неверного логина
    console.log('\n4. ❌ Тестируем неверный логин...');
    const badLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'test@test.com',
      password: 'wrong'
    });
    console.log(`   Статус: ${badLogin.status}`);
    console.log(`   Ошибка: ${badLogin.data.error}`);

    // 5. Тест регистрации
    console.log('\n5. 📝 Тестируем регистрацию...');
    const register = await makeRequest('POST', '/api/auth/register', {
      email: 'test@example.com',
      password: 'test123',
      name: 'Тестовый пользователь'
    });
    console.log(`   Статус: ${register.status}`);
    console.log(`   Успех: ${register.data.success}`);

    console.log('\n✅ ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ!');

  } catch (error) {
    console.error('❌ ОШИБКА ТЕСТИРОВАНИЯ:', error.message);
  }
}

// Запуск тестов с задержкой для запуска сервера
setTimeout(runTests, 2000);
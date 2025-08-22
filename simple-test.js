// Простой тест для endpoints
const http = require('http');

console.log('🔍 Проверяем работу тестового сервера...\n');

// Сначала попробуем подключиться к серверу (если он уже запущен)
function testConnection() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

// Функция для выполнения HTTP запроса
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parsedBody: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parsedBody: null,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('1️⃣ Проверяем подключение к серверу...');
  
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('❌ Сервер не запущен на порту 3001');
    console.log('💡 Запустите сервер командой: node test-simple-server.js');
    return;
  }
  
  console.log('✅ Сервер отвечает!\n');
  
  const results = [];
  
  // Тест 1: Health check
  console.log('🔍 Тестируем GET /api/health...');
  try {
    const healthResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    
    const success = healthResult.statusCode === 200;
    results.push({
      endpoint: 'GET /api/health',
      status: healthResult.statusCode,
      success: success,
      response: healthResult.parsedBody
    });
    
    console.log(`   Статус: ${healthResult.statusCode}`);
    console.log(`   Ответ: ${JSON.stringify(healthResult.parsedBody, null, 2)}`);
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    results.push({
      endpoint: 'GET /api/health',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 2: Register
  console.log('🔍 Тестируем POST /api/auth/register...');
  console.log('   Body: {"email": "test@test.com", "password": "123456", "name": "Test User"}');
  try {
    const registerResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'test@test.com',
      password: '123456',
      name: 'Test User'
    });
    
    const success = registerResult.statusCode === 200;
    results.push({
      endpoint: 'POST /api/auth/register',
      status: registerResult.statusCode,
      success: success,
      response: registerResult.parsedBody
    });
    
    console.log(`   Статус: ${registerResult.statusCode}`);
    console.log(`   Ответ: ${JSON.stringify(registerResult.parsedBody, null, 2)}`);
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    results.push({
      endpoint: 'POST /api/auth/register',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 3: Login
  console.log('🔍 Тестируем POST /api/auth/login...');
  console.log('   Body: {"email": "smm@gelazutdinov.ru", "password": "admin123"}');
  try {
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'smm@gelazutdinov.ru',
      password: 'admin123'
    });
    
    const success = loginResult.statusCode === 200;
    results.push({
      endpoint: 'POST /api/auth/login',
      status: loginResult.statusCode,
      success: success,
      response: loginResult.parsedBody
    });
    
    console.log(`   Статус: ${loginResult.statusCode}`);
    console.log(`   Ответ: ${JSON.stringify(loginResult.parsedBody, null, 2)}`);
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    results.push({
      endpoint: 'POST /api/auth/login',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Финальный отчет
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ:');
  console.log('==================');
  
  const successful = results.filter(r => r.success).length;
  console.log(`Успешных запросов: ${successful}/${results.length}`);
  
  console.log('\nДетали:');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.endpoint}: ${result.success ? '✅' : '❌'} (HTTP ${result.status || 'ERROR'})`);
    if (result.error) {
      console.log(`   Ошибка: ${result.error}`);
    }
  });
  
  console.log('\n🔗 Для запуска сервера используйте: node test-simple-server.js');
}

runTests().catch(console.error);
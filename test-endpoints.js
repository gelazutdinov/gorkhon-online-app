const http = require('http');
const { spawn } = require('child_process');

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
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Функция ожидания
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Главная функция тестирования
async function testEndpoints() {
  console.log('🚀 Запуск тестового сервера...\n');
  
  // Запускаем сервер
  const serverProcess = spawn('node', ['test-simple-server.js'], {
    stdio: ['inherit', 'pipe', 'pipe']
  });
  
  let serverLogs = '';
  let serverErrors = '';
  
  serverProcess.stdout.on('data', (data) => {
    const message = data.toString();
    serverLogs += message;
    console.log('📡 Сервер:', message.trim());
  });
  
  serverProcess.stderr.on('data', (data) => {
    const message = data.toString();
    serverErrors += message;
    console.error('❌ Ошибка сервера:', message.trim());
  });
  
  // Ждем, пока сервер запустится
  await sleep(2000);
  
  const testResults = {
    serverStarted: false,
    serverLogs: serverLogs,
    serverErrors: serverErrors,
    endpoints: []
  };
  
  // Проверяем, запустился ли сервер
  if (serverLogs.includes('Тестовый сервер запущен')) {
    testResults.serverStarted = true;
    console.log('✅ Сервер успешно запущен!\n');
  } else {
    console.log('❌ Сервер не запустился!\n');
    serverProcess.kill();
    return testResults;
  }
  
  console.log('🔍 Начинаем тестирование endpoints...\n');
  
  // Тест 1: GET /api/health
  console.log('1️⃣ Тестируем GET http://localhost:3001/api/health');
  try {
    const healthResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    
    testResults.endpoints.push({
      endpoint: 'GET /api/health',
      status: healthResult.statusCode,
      success: healthResult.statusCode === 200,
      response: healthResult.parsedBody,
      error: healthResult.parseError || null
    });
    
    console.log(`   Статус: ${healthResult.statusCode}`);
    console.log(`   Ответ:`, healthResult.parsedBody);
    console.log(`   Результат: ${healthResult.statusCode === 200 ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    testResults.endpoints.push({
      endpoint: 'GET /api/health',
      status: null,
      success: false,
      response: null,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 2: POST /api/auth/register
  console.log('2️⃣ Тестируем POST http://localhost:3001/api/auth/register');
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
    
    testResults.endpoints.push({
      endpoint: 'POST /api/auth/register',
      status: registerResult.statusCode,
      success: registerResult.statusCode === 200,
      response: registerResult.parsedBody,
      error: registerResult.parseError || null
    });
    
    console.log(`   Статус: ${registerResult.statusCode}`);
    console.log(`   Ответ:`, registerResult.parsedBody);
    console.log(`   Результат: ${registerResult.statusCode === 200 ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    testResults.endpoints.push({
      endpoint: 'POST /api/auth/register',
      status: null,
      success: false,
      response: null,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 3: POST /api/auth/login
  console.log('3️⃣ Тестируем POST http://localhost:3001/api/auth/login');
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
    
    testResults.endpoints.push({
      endpoint: 'POST /api/auth/login',
      status: loginResult.statusCode,
      success: loginResult.statusCode === 200,
      response: loginResult.parsedBody,
      error: loginResult.parseError || null
    });
    
    console.log(`   Статус: ${loginResult.statusCode}`);
    console.log(`   Ответ:`, loginResult.parsedBody);
    console.log(`   Результат: ${loginResult.statusCode === 200 ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
  } catch (error) {
    testResults.endpoints.push({
      endpoint: 'POST /api/auth/login',
      status: null,
      success: false,
      response: null,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Завершаем работу сервера
  console.log('🛑 Останавливаем сервер...');
  serverProcess.kill();
  
  await sleep(1000);
  
  // Финальный отчет
  console.log('\n📊 ФИНАЛЬНЫЙ ОТЧЕТ:');
  console.log('==================');
  console.log(`Сервер запущен: ${testResults.serverStarted ? '✅ ДА' : '❌ НЕТ'}`);
  console.log(`Всего endpoints протестировано: ${testResults.endpoints.length}`);
  
  const successfulEndpoints = testResults.endpoints.filter(ep => ep.success);
  console.log(`Успешных запросов: ${successfulEndpoints.length}/${testResults.endpoints.length}`);
  
  console.log('\nДетали по endpoints:');
  testResults.endpoints.forEach((ep, index) => {
    console.log(`${index + 1}. ${ep.endpoint}: ${ep.success ? '✅' : '❌'} (${ep.status || 'Ошибка подключения'})`);
    if (ep.error) {
      console.log(`   Ошибка: ${ep.error}`);
    }
  });
  
  if (testResults.serverErrors) {
    console.log('\n❌ Ошибки сервера:');
    console.log(testResults.serverErrors);
  }
  
  return testResults;
}

// Запускаем тестирование
testEndpoints().catch(console.error);
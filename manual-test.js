// Ручной тест - запускаем сервер и тестируем
const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 ЗАПУСК ТЕСТИРОВАНИЯ API ENDPOINTS');
console.log('=====================================\n');

// Глобальные переменные для отчета
let serverProcess = null;
let serverLogs = '';
let serverErrors = '';
let testResults = [];

// Функция для HTTP запросов
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parsedBody: body ? JSON.parse(body) : null
          });
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
      reject(new Error('Request timeout'));
    });
    
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

// Запуск сервера
async function startServer() {
  console.log('🔧 Запускаем тестовый сервер...');
  
  return new Promise((resolve, reject) => {
    try {
      serverProcess = spawn('node', ['test-simple-server.js'], {
        stdio: ['inherit', 'pipe', 'pipe']
      });
      
      serverProcess.stdout.on('data', (data) => {
        const message = data.toString();
        serverLogs += message;
        console.log('📡', message.trim());
      });
      
      serverProcess.stderr.on('data', (data) => {
        const message = data.toString();
        serverErrors += message;
        console.error('❌', message.trim());
      });
      
      serverProcess.on('error', (err) => {
        console.error('💥 Ошибка запуска сервера:', err.message);
        reject(err);
      });
      
      // Ждем немного для запуска
      setTimeout(() => {
        if (serverLogs.includes('Тестовый сервер запущен')) {
          console.log('✅ Сервер успешно запущен!\n');
          resolve(true);
        } else {
          console.log('❌ Сервер не запустился за отведенное время\n');
          resolve(false);
        }
      }, 3000);
      
    } catch (error) {
      console.error('💥 Критическая ошибка при запуске:', error.message);
      reject(error);
    }
  });
}

// Тестирование endpoints
async function testEndpoints() {
  console.log('🔍 ТЕСТИРОВАНИЕ ENDPOINTS');
  console.log('========================\n');
  
  // Тест 1: Health check
  console.log('1️⃣ GET /api/health');
  console.log('   URL: http://localhost:3001/api/health');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    
    const success = result.statusCode === 200;
    testResults.push({
      test: 'GET /api/health',
      status: result.statusCode,
      success: success,
      response: result.parsedBody,
      error: result.parseError
    });
    
    console.log(`   Статус: ${result.statusCode}`);
    if (result.parsedBody) {
      console.log('   Ответ:', JSON.stringify(result.parsedBody, null, 4));
    } else {
      console.log('   Ответ (raw):', result.body);
    }
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
    
  } catch (error) {
    testResults.push({
      test: 'GET /api/health',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 2: Register
  console.log('2️⃣ POST /api/auth/register');
  console.log('   URL: http://localhost:3001/api/auth/register');
  console.log('   Body: {"email": "test@test.com", "password": "123456", "name": "Test User"}');
  try {
    const result = await makeRequest({
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
    
    const success = result.statusCode === 200;
    testResults.push({
      test: 'POST /api/auth/register',
      status: result.statusCode,
      success: success,
      response: result.parsedBody,
      error: result.parseError
    });
    
    console.log(`   Статус: ${result.statusCode}`);
    if (result.parsedBody) {
      console.log('   Ответ:', JSON.stringify(result.parsedBody, null, 4));
    } else {
      console.log('   Ответ (raw):', result.body);
    }
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
    
  } catch (error) {
    testResults.push({
      test: 'POST /api/auth/register',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
  
  // Тест 3: Login
  console.log('3️⃣ POST /api/auth/login');
  console.log('   URL: http://localhost:3001/api/auth/login');
  console.log('   Body: {"email": "smm@gelazutdinov.ru", "password": "admin123"}');
  try {
    const result = await makeRequest({
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
    
    const success = result.statusCode === 200;
    testResults.push({
      test: 'POST /api/auth/login',
      status: result.statusCode,
      success: success,
      response: result.parsedBody,
      error: result.parseError
    });
    
    console.log(`   Статус: ${result.statusCode}`);
    if (result.parsedBody) {
      console.log('   Ответ:', JSON.stringify(result.parsedBody, null, 4));
    } else {
      console.log('   Ответ (raw):', result.body);
    }
    console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
    
  } catch (error) {
    testResults.push({
      test: 'POST /api/auth/login',
      status: null,
      success: false,
      error: error.message
    });
    console.log(`   ❌ ОШИБКА: ${error.message}\n`);
  }
}

// Остановка сервера
function stopServer() {
  if (serverProcess) {
    console.log('🛑 Останавливаем сервер...');
    serverProcess.kill('SIGTERM');
    
    // На всякий случай принудительное завершение через 2 секунды
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 2000);
  }
}

// Итоговый отчет
function generateReport() {
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('================');
  
  const serverStarted = serverLogs.includes('Тестовый сервер запущен');
  console.log(`\n🚀 Запуск сервера: ${serverStarted ? '✅ УСПЕШНО' : '❌ ОШИБКА'}`);
  
  if (serverErrors) {
    console.log(`\n❌ Ошибки сервера:\n${serverErrors}`);
  }
  
  console.log(`\n📡 Логи сервера:\n${serverLogs}`);
  
  const successful = testResults.filter(r => r.success).length;
  console.log(`\n🔍 Тестирование endpoints: ${successful}/${testResults.length} успешно`);
  
  console.log('\nДетальные результаты:');
  testResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.test}`);
    console.log(`   Статус: ${result.status || 'ERROR'}`);
    console.log(`   Результат: ${result.success ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
    if (result.error) {
      console.log(`   Ошибка: ${result.error}`);
    }
    if (result.response) {
      console.log(`   Ответ: ${JSON.stringify(result.response, null, 2)}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('СВОДКА:');
  console.log(`- Сервер запустился: ${serverStarted ? 'ДА' : 'НЕТ'}`);
  console.log(`- Работающих endpoints: ${successful}/${testResults.length}`);
  console.log(`- Ошибок сервера: ${serverErrors ? 'ЕСТЬ' : 'НЕТ'}`);
  console.log('='.repeat(50));
}

// Главная функция
async function main() {
  try {
    // Запускаем сервер
    const serverStarted = await startServer();
    
    if (serverStarted) {
      // Тестируем endpoints
      await testEndpoints();
    } else {
      console.log('❌ Не удалось запустить сервер, тестирование прервано');
    }
    
  } catch (error) {
    console.error('💥 Критическая ошибка:', error.message);
  } finally {
    // Останавливаем сервер
    stopServer();
    
    // Ждем немного и выводим отчет
    await sleep(1000);
    generateReport();
    
    // Завершаем процесс
    process.exit(0);
  }
}

// Обработка сигналов завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал прерывания...');
  stopServer();
  setTimeout(() => process.exit(1), 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  stopServer();
  setTimeout(() => process.exit(1), 1000);
});

// Запускаем тестирование
main();
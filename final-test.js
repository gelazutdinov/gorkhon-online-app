console.log('🚀 ТЕСТИРОВАНИЕ API ENDPOINTS');
console.log('=============================\n');

const http = require('http');
const { spawn } = require('child_process');

let serverProcess;
let serverStarted = false;
let serverLogs = '';
let serverErrors = '';

// HTTP запрос функция
function httpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: body,
            json: JSON.parse(body)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: body,
            json: null
          });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Запуск сервера
function startServer() {
  return new Promise((resolve) => {
    console.log('📡 Запускаем сервер...');
    
    try {
      serverProcess = spawn('node', ['test-simple-server.js']);
      
      serverProcess.stdout.on('data', (data) => {
        const msg = data.toString();
        serverLogs += msg;
        console.log('   ', msg.trim());
        if (msg.includes('Тестовый сервер запущен')) {
          serverStarted = true;
        }
      });
      
      serverProcess.stderr.on('data', (data) => {
        const msg = data.toString();
        serverErrors += msg;
        console.error('   ОШИБКА:', msg.trim());
      });
      
      serverProcess.on('error', (err) => {
        console.error('   ОШИБКА ЗАПУСКА:', err.message);
        resolve(false);
      });
      
      // Ждем 3 секунды
      setTimeout(() => {
        resolve(serverStarted);
      }, 3000);
      
    } catch (error) {
      console.error('   КРИТИЧЕСКАЯ ОШИБКА:', error.message);
      resolve(false);
    }
  });
}

// Основная функция тестирования
async function runTests() {
  const started = await startServer();
  
  if (!started) {
    console.log('\n❌ Сервер не запустился!');
    return;
  }
  
  console.log('\n✅ Сервер запущен! Тестируем endpoints...\n');
  
  const tests = [
    {
      name: 'GET /api/health',
      method: 'GET',
      path: '/api/health',
      expected: 200
    },
    {
      name: 'POST /api/auth/register',
      method: 'POST',
      path: '/api/auth/register',
      data: { email: 'test@test.com', password: '123456', name: 'Test User' },
      expected: 200
    },
    {
      name: 'POST /api/auth/login',
      method: 'POST',
      path: '/api/auth/login',
      data: { email: 'smm@gelazutdinov.ru', password: 'admin123' },
      expected: 200
    }
  ];
  
  const results = [];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}️⃣ ${test.name}`);
    
    try {
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: test.path,
        method: test.method,
        headers: test.data ? { 'Content-Type': 'application/json' } : {}
      };
      
      const result = await httpRequest(options, test.data);
      const success = result.status === test.expected;
      
      console.log(`   Статус: ${result.status}`);
      console.log(`   Ответ: ${result.json ? JSON.stringify(result.json, null, 2) : result.body}`);
      console.log(`   Результат: ${success ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);
      
      results.push({
        test: test.name,
        status: result.status,
        success: success,
        response: result.json || result.body
      });
      
    } catch (error) {
      console.log(`   ❌ ОШИБКА: ${error.message}\n`);
      results.push({
        test: test.name,
        status: null,
        success: false,
        error: error.message
      });
    }
  }
  
  // Завершаем сервер
  if (serverProcess) {
    console.log('🛑 Останавливаем сервер...');
    serverProcess.kill();
  }
  
  // Итоговый отчет
  console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('='.repeat(40));
  
  const successful = results.filter(r => r.success).length;
  
  console.log(`\n🚀 Сервер запустился: ${serverStarted ? '✅ ДА' : '❌ НЕТ'}`);
  console.log(`🔍 Успешных тестов: ${successful}/${results.length}`);
  
  console.log('\n📋 Детали по каждому endpoint:');
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.test}`);
    console.log(`   Статус: ${result.status || 'ERROR'}`);
    console.log(`   Работает: ${result.success ? '✅ ДА' : '❌ НЕТ'}`);
    if (result.error) {
      console.log(`   Ошибка: ${result.error}`);
    }
  });
  
  if (serverErrors) {
    console.log('\n❌ Ошибки сервера:');
    console.log(serverErrors);
  }
  
  console.log('\n📝 Логи сервера:');
  console.log(serverLogs || 'Логов нет');
  
  console.log('\n' + '='.repeat(40));
}

// Запуск
runTests().catch(console.error);
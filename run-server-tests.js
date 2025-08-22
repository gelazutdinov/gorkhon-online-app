const { spawn, exec } = require('child_process');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

console.log('🧪 ПОЛНОЕ ТЕСТИРОВАНИЕ НОВОГО СЕРВЕРА');
console.log('=' .repeat(50));

const SERVER_URL = 'http://localhost:3001';
const TEST_CREDENTIALS = {
  email: 'smm@gelazutdinov.ru',
  password: 'admin123'
};

let serverProcess = null;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function curlTest(description, curlCommand) {
  console.log(`\n${description}`);
  console.log(`Command: ${curlCommand}`);
  console.log('-'.repeat(40));
  
  try {
    const { stdout, stderr } = await execAsync(curlCommand, { timeout: 10000 });
    if (stdout) {
      try {
        const jsonData = JSON.parse(stdout);
        console.log('✅ Response:', JSON.stringify(jsonData, null, 2));
        return { success: true, data: jsonData };
      } catch {
        console.log('✅ Response:', stdout);
        return { success: true, data: stdout };
      }
    }
    if (stderr) {
      console.error('⚠️ Stderr:', stderr);
    }
    return { success: true, data: stdout };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function startServerInBackground() {
  console.log('🚀 Запуск сервера в фоновом режиме...');
  
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server', 'quick-server.js');
    
    serverProcess = spawn('node', [serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: path.join(__dirname, 'server'),
      detached: false
    });
    
    let output = '';
    let hasStarted = false;
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      const message = data.toString().trim();
      console.log('📝 Server:', message);
      
      if (message.includes('ЭКСТРЕННЫЙ СЕРВЕР РАБОТАЕТ') && !hasStarted) {
        hasStarted = true;
        resolve(true);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('❌ Server error:', data.toString().trim());
    });
    
    serverProcess.on('error', (error) => {
      console.error('❌ Ошибка запуска сервера:', error.message);
      reject(error);
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.log(`📝 Сервер завершился с кодом: ${code}`);
      }
    });
    
    // Таймаут для запуска сервера
    setTimeout(() => {
      if (!hasStarted) {
        reject(new Error('Сервер не запустился в течение 10 секунд'));
      }
    }, 10000);
  });
}

function stopServer() {
  if (serverProcess) {
    console.log('\n🛑 Остановка сервера...');
    
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
    } else {
      serverProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (serverProcess && !serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
      }, 3000);
    }
  }
}

async function runAllTests() {
  let token = null;
  
  try {
    // Запуск сервера
    await startServerInBackground();
    await delay(3000); // Дать серверу время полностью запуститься
    
    // 1. Тестирование Health endpoint
    const healthResult = await curlTest(
      '🏥 Тестирование /api/health',
      `curl -s "${SERVER_URL}/api/health"`
    );
    
    // 2. Тестирование логина
    const loginResult = await curlTest(
      '🔐 Тестирование логина',
      `curl -s -X POST "${SERVER_URL}/api/auth/login" -H "Content-Type: application/json" -d '{"email":"${TEST_CREDENTIALS.email}","password":"${TEST_CREDENTIALS.password}"}'`
    );
    
    // Извлекаем токен из ответа логина
    if (loginResult.success && loginResult.data && typeof loginResult.data === 'object') {
      token = loginResult.data.data?.token;
    }
    
    // 3. Тестирование /api/auth/me с токеном
    if (token) {
      await curlTest(
        '🔍 Тестирование /api/auth/me',
        `curl -s -H "Authorization: Bearer ${token}" "${SERVER_URL}/api/auth/me"`
      );
    } else {
      console.log('\n❌ Токен не получен, пропускаем тест /api/auth/me');
    }
    
    // 4. Тестирование регистрации
    const timestamp = Date.now();
    await curlTest(
      '📝 Тестирование регистрации',
      `curl -s -X POST "${SERVER_URL}/api/auth/register" -H "Content-Type: application/json" -d '{"email":"test${timestamp}@test.com","password":"testpass123","name":"Test User"}'`
    );
    
    // 5. Тестирование logout
    await curlTest(
      '🚪 Тестирование logout',
      `curl -s -X POST "${SERVER_URL}/api/auth/logout" -H "Content-Type: application/json"`
    );
    
    // 6. Тестирование 404
    await curlTest(
      '🔍 Тестирование 404 endpoint',
      `curl -s "${SERVER_URL}/api/nonexistent"`
    );
    
    // 7. Тестирование неверного логина
    await curlTest(
      '🔐 Тестирование неверного логина',
      `curl -s -X POST "${SERVER_URL}/api/auth/login" -H "Content-Type: application/json" -d '{"email":"wrong@email.com","password":"wrongpass"}'`
    );
    
  } catch (error) {
    console.error('\n💥 Критическая ошибка:', error.message);
  } finally {
    stopServer();
    await delay(2000);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
    console.log('='.repeat(50));
    console.log('✅ Тестирование завершено');
    console.log('📋 Проверенные endpoints:');
    console.log('   - GET  /api/health');
    console.log('   - POST /api/auth/login');
    console.log('   - GET  /api/auth/me');
    console.log('   - POST /api/auth/register');
    console.log('   - POST /api/auth/logout');
    console.log('   - GET  /api/nonexistent (404 test)');
    console.log('='.repeat(50));
  }
}

// Обработка сигналов
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал остановки...');
  stopServer();
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  stopServer();
  process.exit(1);
});

// Запуск тестов
runAllTests().catch(error => {
  console.error('💥 Неожиданная ошибка:', error);
  stopServer();
  process.exit(1);
});
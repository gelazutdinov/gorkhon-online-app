const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 ПОШАГОВОЕ ТЕСТИРОВАНИЕ СЕРВЕРА');
console.log('=' .repeat(50));

// Шаг 1: Проверка файлов
console.log('\n📁 Шаг 1: Проверка файлов');
const serverPath = path.join(__dirname, 'server', 'quick-server.js');
console.log('Путь к серверу:', serverPath);

if (!fs.existsSync(serverPath)) {
  console.error('❌ Файл сервера не найден!');
  process.exit(1);
}

console.log('✅ Файл сервера найден');

// Шаг 2: Проверка содержимого
console.log('\n📄 Шаг 2: Проверка содержимого');
const content = fs.readFileSync(serverPath, 'utf8');
console.log('Размер файла:', content.length, 'символов');

const requiredParts = [
  'express',
  'cors', 
  '3001',
  '/api/health',
  '/api/auth/login',
  'smm@gelazutdinov.ru',
  'admin123'
];

requiredParts.forEach(part => {
  const found = content.includes(part);
  console.log(`${found ? '✅' : '❌'} ${part}: ${found ? 'найден' : 'НЕ НАЙДЕН'}`);
});

// Шаг 3: Проверка синтаксиса
console.log('\n🔍 Шаг 3: Проверка синтаксиса');

const syntaxCheck = spawn('node', ['-c', serverPath]);

syntaxCheck.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Синтаксис корректен');
    startServerTest();
  } else {
    console.error('❌ Ошибка синтаксиса! Код:', code);
    process.exit(1);
  }
});

syntaxCheck.stderr.on('data', (data) => {
  console.error('❌ Syntax Error:', data.toString());
});

function startServerTest() {
  console.log('\n🚀 Шаг 4: Запуск сервера');
  
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: path.join(__dirname, 'server')
  });
  
  let serverStarted = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log('📝 Server:', output);
    
    if (output.includes('ЭКСТРЕННЫЙ СЕРВЕР РАБОТАЕТ') && !serverStarted) {
      serverStarted = true;
      console.log('✅ Сервер запущен успешно!');
      
      // Запускаем тесты через 2 секунды
      setTimeout(() => {
        runEndpointTests(serverProcess);
      }, 2000);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error('❌ Server Error:', data.toString().trim());
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Ошибка запуска:', error.message);
  });
  
  // Таймаут на запуск
  setTimeout(() => {
    if (!serverStarted) {
      console.error('❌ Сервер не запустился в течение 10 секунд');
      serverProcess.kill();
      process.exit(1);
    }
  }, 10000);
}

async function runEndpointTests(serverProcess) {
  console.log('\n🧪 Шаг 5: Тестирование endpoints');
  
  const SERVER_URL = 'http://localhost:3001';
  
  try {
    // Тест 1: Health endpoint
    console.log('\n🏥 Тест 1: /api/health');
    const healthResponse = await fetch(`${SERVER_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    console.log('Status:', healthResponse.status);
    console.log('Response:', JSON.stringify(healthData, null, 2));
    
    if (healthResponse.status === 200 && healthData.status === 'ok') {
      console.log('✅ Health endpoint - PASS');
    } else {
      console.log('❌ Health endpoint - FAIL');
    }
    
    // Тест 2: Login
    console.log('\n🔐 Тест 2: /api/auth/login');
    const loginResponse = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'smm@gelazutdinov.ru',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Status:', loginResponse.status);
    console.log('Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.status === 200 && loginData.success) {
      console.log('✅ Login endpoint - PASS');
      
      // Тест 3: Auth Me с токеном
      const token = loginData.data.token;
      console.log('\n🔍 Тест 3: /api/auth/me');
      
      const meResponse = await fetch(`${SERVER_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const meData = await meResponse.json();
      console.log('Status:', meResponse.status);
      console.log('Response:', JSON.stringify(meData, null, 2));
      
      if (meResponse.status === 200 && meData.success) {
        console.log('✅ Auth Me endpoint - PASS');
      } else {
        console.log('❌ Auth Me endpoint - FAIL');
      }
      
    } else {
      console.log('❌ Login endpoint - FAIL');
    }
    
    // Тест 4: Регистрация
    console.log('\n📝 Тест 4: /api/auth/register');
    const regResponse = await fetch(`${SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `test${Date.now()}@test.com`,
        password: 'testpass123',
        name: 'Test User'
      })
    });
    
    const regData = await regResponse.json();
    console.log('Status:', regResponse.status);
    console.log('Response:', JSON.stringify(regData, null, 2));
    
    if (regResponse.status === 200 && regData.success) {
      console.log('✅ Register endpoint - PASS');
    } else {
      console.log('❌ Register endpoint - FAIL');
    }
    
    // Тест 5: 404
    console.log('\n🔍 Тест 5: 404 endpoint');
    const notFoundResponse = await fetch(`${SERVER_URL}/api/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    
    console.log('Status:', notFoundResponse.status);
    console.log('Response:', JSON.stringify(notFoundData, null, 2));
    
    if (notFoundResponse.status === 404 && !notFoundData.success) {
      console.log('✅ 404 handling - PASS');
    } else {
      console.log('❌ 404 handling - FAIL');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  } finally {
    console.log('\n🛑 Остановка сервера...');
    serverProcess.kill('SIGTERM');
    
    setTimeout(() => {
      console.log('\n✅ Тестирование завершено');
      process.exit(0);
    }, 1000);
  }
}

// Обработка сигналов
process.on('SIGINT', () => {
  console.log('\n🛑 Прерывание...');
  process.exit(1);
});
#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 АВТОМАТИЧЕСКИЙ ТЕСТ НОВОГО СЕРВЕРА');
console.log('=' .repeat(50));

const SERVER_URL = 'http://localhost:3001';
const TEST_CREDENTIALS = {
  email: 'smm@gelazutdinov.ru',
  password: 'admin123'
};

let serverProcess = null;
let testResults = {
  serverStart: false,
  healthCheck: false,
  login: false,
  register: false,
  authMe: false,
  logout: false,
  notFound: false
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(url, options = {}) {
  try {
    // Используем встроенный fetch если доступен (Node 18+), иначе импортируем node-fetch
    let fetch;
    if (global.fetch) {
      fetch = global.fetch;
    } else {
      fetch = (await import('node-fetch')).default;
    }
    
    const response = await fetch(url, {
      timeout: 5000,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    return { success: true, status: response.status, data, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function startServer() {
  console.log('🚀 Запуск сервера...');
  
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server', 'quick-server.js');
    
    if (!fs.existsSync(serverPath)) {
      return reject(new Error(`Файл сервера не найден: ${serverPath}`));
    }
    
    serverProcess = spawn('node', [serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: path.join(__dirname, 'server')
    });
    
    let output = '';
    let errorOutput = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('📝 Server output:', data.toString().trim());
      
      if (output.includes('ЭКСТРЕННЫЙ СЕРВЕР РАБОТАЕТ')) {
        testResults.serverStart = true;
        resolve(true);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('❌ Server error:', data.toString().trim());
    });
    
    serverProcess.on('error', (error) => {
      console.error('❌ Ошибка запуска сервера:', error.message);
      reject(error);
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Сервер завершился с кодом: ${code}. Error: ${errorOutput}`));
      }
    });
    
    // Таймаут для запуска сервера
    setTimeout(() => {
      if (!testResults.serverStart) {
        reject(new Error('Сервер не запустился в течение 10 секунд'));
      }
    }, 10000);
  });
}

async function testHealthEndpoint() {
  console.log('🏥 Тестирование /api/health...');
  
  const result = await makeRequest(`${SERVER_URL}/api/health`);
  
  if (result.success && result.status === 200) {
    console.log('✅ Health endpoint работает');
    console.log('📊 Данные:', JSON.stringify(result.data, null, 2));
    testResults.healthCheck = true;
    return true;
  } else {
    console.error('❌ Health endpoint не работает:', result.error || result.data);
    return false;
  }
}

async function testLogin() {
  console.log('🔐 Тестирование логина...');
  
  const result = await makeRequest(`${SERVER_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(TEST_CREDENTIALS)
  });
  
  if (result.success && result.status === 200 && result.data.success) {
    console.log('✅ Логин работает');
    console.log('👤 Пользователь:', result.data.data.user.name);
    console.log('🎫 Токен:', result.data.data.token.substring(0, 20) + '...');
    testResults.login = true;
    return result.data.data.token;
  } else {
    console.error('❌ Логин не работает:', result.error || result.data);
    return null;
  }
}

async function testRegister() {
  console.log('📝 Тестирование регистрации...');
  
  const testUser = {
    email: `test${Date.now()}@test.com`,
    password: 'testpass123',
    name: 'Test User'
  };
  
  const result = await makeRequest(`${SERVER_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (result.success && result.status === 200 && result.data.success) {
    console.log('✅ Регистрация работает');
    console.log('👤 Новый пользователь:', result.data.data.user.name);
    testResults.register = true;
    return true;
  } else {
    console.error('❌ Регистрация не работает:', result.error || result.data);
    return false;
  }
}

async function testAuthMe(token) {
  console.log('🔍 Тестирование /api/auth/me...');
  
  if (!token) {
    console.error('❌ Нет токена для тестирования');
    return false;
  }
  
  const result = await makeRequest(`${SERVER_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (result.success && result.status === 200 && result.data.success) {
    console.log('✅ Auth me работает');
    console.log('👤 Текущий пользователь:', result.data.data.user.name);
    testResults.authMe = true;
    return true;
  } else {
    console.error('❌ Auth me не работает:', result.error || result.data);
    return false;
  }
}

async function testLogout() {
  console.log('🚪 Тестирование logout...');
  
  const result = await makeRequest(`${SERVER_URL}/api/auth/logout`, {
    method: 'POST'
  });
  
  if (result.success && result.status === 200 && result.data.success) {
    console.log('✅ Logout работает');
    testResults.logout = true;
    return true;
  } else {
    console.error('❌ Logout не работает:', result.error || result.data);
    return false;
  }
}

async function testNotFound() {
  console.log('🔍 Тестирование 404 endpoint...');
  
  const result = await makeRequest(`${SERVER_URL}/api/nonexistent`);
  
  if (result.success && result.status === 404 && !result.data.success) {
    console.log('✅ 404 обработка работает');
    testResults.notFound = true;
    return true;
  } else {
    console.error('❌ 404 обработка не работает:', result.error || result.data);
    return false;
  }
}

function stopServer() {
  if (serverProcess) {
    console.log('🛑 Остановка сервера...');
    serverProcess.kill('SIGTERM');
    
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

function printReport() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 ОТЧЕТ О ТЕСТИРОВАНИИ');
  console.log('='.repeat(50));
  
  const tests = [
    { name: 'Запуск сервера', result: testResults.serverStart },
    { name: 'Health endpoint', result: testResults.healthCheck },
    { name: 'Логин', result: testResults.login },
    { name: 'Регистрация', result: testResults.register },
    { name: 'Auth me', result: testResults.authMe },
    { name: 'Logout', result: testResults.logout },
    { name: '404 обработка', result: testResults.notFound }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
  });
  
  const passedTests = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📈 РЕЗУЛЬТАТ: ${passedTests}/${totalTests} тестов прошли успешно`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Все тесты пройдены! Сервер работает корректно.');
  } else {
    console.log('⚠️ Некоторые тесты не прошли. Требуется исправление.');
  }
  console.log('='.repeat(50));
}

async function runTests() {
  try {
    // Запуск сервера
    await startServer();
    await delay(2000); // Дать серверу время на полный запуск
    
    // Выполнение тестов
    await testHealthEndpoint();
    await delay(500);
    
    const token = await testLogin();
    await delay(500);
    
    await testRegister();
    await delay(500);
    
    await testAuthMe(token);
    await delay(500);
    
    await testLogout();
    await delay(500);
    
    await testNotFound();
    await delay(500);
    
  } catch (error) {
    console.error('💥 Критическая ошибка:', error.message);
  } finally {
    stopServer();
    await delay(1000);
    printReport();
    process.exit(testResults.serverStart && testResults.healthCheck && testResults.login ? 0 : 1);
  }
}

// Обработка сигналов для корректной остановки
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
runTests().catch(error => {
  console.error('💥 Неожиданная ошибка:', error);
  stopServer();
  process.exit(1);
});
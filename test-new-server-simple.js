const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 БЫСТРЫЙ ТЕСТ НОВОГО СЕРВЕРА');
console.log('=' .repeat(50));

const SERVER_URL = 'http://localhost:3001';
let serverProcess = null;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
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
    
    serverProcess = spawn('node', [serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: path.join(__dirname, 'server')
    });
    
    let output = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('📝 Server:', data.toString().trim());
      
      if (output.includes('ЭКСТРЕННЫЙ СЕРВЕР РАБОТАЕТ')) {
        resolve(true);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('❌ Server error:', data.toString().trim());
    });
    
    serverProcess.on('error', (error) => {
      console.error('❌ Ошибка запуска:', error.message);
      reject(error);
    });
    
    setTimeout(() => reject(new Error('Таймаут запуска сервера')), 10000);
  });
}

async function testEndpoints() {
  console.log('\n🏥 Тестирование /api/health...');
  const health = await makeRequest(`${SERVER_URL}/api/health`);
  console.log(health.success ? '✅ Health OK' : '❌ Health FAIL');
  if (health.success) {
    console.log('📊 Response:', JSON.stringify(health.data, null, 2));
  }
  
  console.log('\n🔐 Тестирование логина...');
  const login = await makeRequest(`${SERVER_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'smm@gelazutdinov.ru',
      password: 'admin123'
    })
  });
  console.log(login.success && login.data.success ? '✅ Login OK' : '❌ Login FAIL');
  if (login.success && login.data.success) {
    console.log('👤 User:', login.data.data.user.name);
    console.log('🎫 Token:', login.data.data.token.substring(0, 30) + '...');
    
    // Тест auth/me
    console.log('\n🔍 Тестирование /api/auth/me...');
    const authMe = await makeRequest(`${SERVER_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${login.data.data.token}`
      }
    });
    console.log(authMe.success && authMe.data.success ? '✅ Auth Me OK' : '❌ Auth Me FAIL');
  }
  
  console.log('\n📝 Тестирование регистрации...');
  const register = await makeRequest(`${SERVER_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      email: `test${Date.now()}@test.com`,
      password: 'testpass123',
      name: 'Test User'
    })
  });
  console.log(register.success && register.data.success ? '✅ Register OK' : '❌ Register FAIL');
  
  console.log('\n🔍 Тестирование 404...');
  const notFound = await makeRequest(`${SERVER_URL}/api/nonexistent`);
  console.log(notFound.status === 404 ? '✅ 404 OK' : '❌ 404 FAIL');
}

function stopServer() {
  if (serverProcess) {
    console.log('\n🛑 Остановка сервера...');
    serverProcess.kill('SIGTERM');
  }
}

async function runTest() {
  try {
    await startServer();
    await delay(2000);
    await testEndpoints();
  } catch (error) {
    console.error('💥 Ошибка:', error.message);
  } finally {
    stopServer();
    console.log('\n✅ Тест завершен');
  }
}

process.on('SIGINT', () => {
  stopServer();
  process.exit(1);
});

runTest();
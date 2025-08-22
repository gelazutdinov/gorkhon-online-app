console.log('🔍 БЫСТРАЯ ПРОВЕРКА СЕРВЕРА');
console.log('='.repeat(40));

const path = require('path');
const fs = require('fs');

// Проверяем существование файла сервера
const serverPath = path.join(__dirname, 'server', 'quick-server.js');
console.log('📁 Путь к серверу:', serverPath);

if (fs.existsSync(serverPath)) {
  console.log('✅ Файл сервера найден');
  
  // Читаем содержимое для проверки
  const content = fs.readFileSync(serverPath, 'utf8');
  console.log('📏 Размер файла:', content.length, 'символов');
  
  // Проверяем ключевые компоненты
  const checks = [
    { name: 'Express импорт', check: content.includes("require('express')") },
    { name: 'CORS импорт', check: content.includes("require('cors')") },
    { name: 'Порт 3001', check: content.includes('3001') },
    { name: 'Health endpoint', check: content.includes('/api/health') },
    { name: 'Login endpoint', check: content.includes('/api/auth/login') },
    { name: 'Тестовые данные', check: content.includes('smm@gelazutdinov.ru') }
  ];
  
  console.log('\n📋 Проверка компонентов:');
  checks.forEach(check => {
    console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
  });
  
  const allPassed = checks.every(check => check.check);
  console.log(`\n${allPassed ? '✅' : '❌'} Общий результат: ${allPassed ? 'OK' : 'FAIL'}`);
  
} else {
  console.log('❌ Файл сервера НЕ найден!');
}

console.log('\n🚀 Попытка запуска сервера для проверки синтаксиса...');

const { spawn } = require('child_process');

const serverProcess = spawn('node', ['-c', serverPath]);

serverProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Синтаксис сервера корректен');
    console.log('\n🔥 Запуск полного теста...');
    
    // Запускаем сервер на несколько секунд
    const runProcess = spawn('node', [serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: path.join(__dirname, 'server')
    });
    
    runProcess.stdout.on('data', (data) => {
      console.log('📝 Server output:', data.toString().trim());
    });
    
    runProcess.stderr.on('data', (data) => {
      console.error('❌ Server error:', data.toString().trim());
    });
    
    // Останавливаем через 5 секунд
    setTimeout(() => {
      runProcess.kill('SIGTERM');
      console.log('🛑 Сервер остановлен');
      
      // Теперь тестируем endpoints
      testEndpoints();
    }, 5000);
    
  } else {
    console.log(`❌ Ошибка синтаксиса! Код выхода: ${code}`);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('❌ Syntax error:', data.toString().trim());
});

async function testEndpoints() {
  console.log('\n🧪 ТЕСТИРОВАНИЕ ENDPOINTS');
  console.log('='.repeat(40));
  
  // Запускаем сервер для тестирования
  const testProcess = spawn('node', [serverPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: path.join(__dirname, 'server')
  });
  
  testProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log('📝 Server:', output);
    
    if (output.includes('ЭКСТРЕННЫЙ СЕРВЕР РАБОТАЕТ')) {
      console.log('✅ Сервер успешно запущен');
      
      // Даем серверу время запуститься и тестируем
      setTimeout(async () => {
        await runQuickTests();
        testProcess.kill('SIGTERM');
      }, 2000);
    }
  });
  
  testProcess.stderr.on('data', (data) => {
    console.error('❌ Server error:', data.toString().trim());
  });
}

async function runQuickTests() {
  const SERVER_URL = 'http://localhost:3001';
  
  console.log('\n🏥 Тестирование Health endpoint...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health endpoint работает');
    console.log('📊 Ответ:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Health endpoint не работает:', error.message);
  }
  
  console.log('\n🔐 Тестирование логина...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'smm@gelazutdinov.ru',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Логин работает');
      console.log('👤 Пользователь:', data.data.user.name);
      console.log('🎫 Токен:', data.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Логин не работает:', data.error);
    }
  } catch (error) {
    console.error('❌ Ошибка логина:', error.message);
  }
  
  console.log('\n✅ Быстрое тестирование завершено');
}
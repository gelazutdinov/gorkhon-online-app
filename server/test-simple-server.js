import { spawn } from 'child_process';
import fetch from 'node-fetch';

console.log('🧪 Тестирование простого сервера...\n');

// Запускаем сервер
const serverProcess = spawn('tsx', ['src/simple-app.ts'], {
  cwd: 'server',
  stdio: 'pipe'
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log('📋 Server output:', output.trim());
});

serverProcess.stderr.on('data', (data) => {
  const output = data.toString();
  console.error('❌ Server error:', output.trim());
});

// Даем серверу время запуститься
setTimeout(async () => {
  try {
    console.log('\n🔍 Тестируем эндпоинты...\n');

    // Тест 1: Health check
    console.log('1️⃣ Тест health check...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Тест 2: Регистрация админа
    console.log('\n2️⃣ Тест входа администратора...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'smm@gelazutdinov.ru',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Авторизация админа успешна');
      console.log('👤 Пользователь:', loginData.data.user.name);
      console.log('🎭 Роль:', loginData.data.user.role);
      console.log('🔑 Токен получен');
    } else {
      console.log('❌ Ошибка авторизации:', loginData.error);
    }

    // Тест 3: Регистрация нового пользователя
    console.log('\n3️⃣ Тест регистрации нового пользователя...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
        name: 'Тестовый пользователь'
      })
    });
    
    const registerData = await registerResponse.json();
    if (registerData.success) {
      console.log('✅ Регистрация нового пользователя успешна');
      console.log('👤 Пользователь:', registerData.data.user.name);
      console.log('🎭 Роль:', registerData.data.user.role);
    } else {
      console.log('❌ Ошибка регистрации:', registerData.error);
    }

    console.log('\n🎉 Тестирование завершено!');
    console.log('\n📊 Сводка:');
    console.log('• Сервер запущен на порту 3001');
    console.log('• API доступно по адресу: http://localhost:3001/api');
    console.log('• Health check: http://localhost:3001/api/health');
    console.log('• Админ аккаунт: smm@gelazutdinov.ru / admin123');
    console.log('• База данных: SQLite (server/database.sqlite)');

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  } finally {
    // Останавливаем сервер
    console.log('\n🛑 Останавливаем сервер...');
    serverProcess.kill();
    process.exit(0);
  }
}, 3000);

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал остановки...');
  serverProcess.kill();
  process.exit(0);
});
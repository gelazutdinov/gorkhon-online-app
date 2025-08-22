#!/usr/bin/env node

// ТЕСТ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ
const http = require('http');

console.log('🧪 ТЕСТИРОВАНИЕ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ');
console.log('=' .repeat(50));

function testConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      timeout: 3000
    };

    console.log('🔍 Проверяю доступность сервера...');

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`📊 Статус ответа: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('✅ Сервер отвечает корректно!');
            console.log('📦 Ответ сервера:', response);
            resolve(true);
          } catch (e) {
            console.log('⚠️ Сервер отвечает, но JSON некорректный');
            console.log('📄 Данные:', data);
            resolve(false);
          }
        } else {
          console.log('❌ Сервер отвечает с ошибкой');
          console.log('📄 Данные:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('🔴 СЕРВЕР НЕДОСТУПЕН!');
      console.log('❌ Ошибка:', err.message);
      console.log('');
      console.log('💡 Возможные причины:');
      console.log('   1. Сервер не запущен');
      console.log('   2. Порт 3001 занят другим процессом');
      console.log('   3. Проблемы с сетью');
      console.log('');
      console.log('🚀 Для запуска сервера выполните:');
      console.log('   node start-server-now.js');
      console.log('   или');
      console.log('   node server/start-emergency-server.js');
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ TIMEOUT! Сервер не отвечает');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Тест логина
async function testLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'smm@gelazutdinov.ru',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 3000
    };

    console.log('🔑 Тестирую логин...');

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`📊 Статус логина: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.success) {
            console.log('✅ Логин работает!');
            console.log('👤 Пользователь:', response.data.user.name);
            console.log('🎫 Токен получен:', response.data.token ? 'Да' : 'Нет');
            resolve(true);
          } else {
            console.log('❌ Логин не работает');
            console.log('📄 Ответ:', response);
            resolve(false);
          }
        } catch (e) {
          console.log('⚠️ Ошибка парсинга ответа логина');
          console.log('📄 Данные:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('🔴 Ошибка логина:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout логина');
      req.destroy();
      reject(new Error('Login timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Основной тест
async function runTests() {
  try {
    console.log('Шаг 1: Проверка health endpoint');
    const healthOk = await testConnection();
    
    if (!healthOk) {
      throw new Error('Health check failed');
    }

    console.log('');
    console.log('Шаг 2: Проверка авторизации');
    const loginOk = await testLogin();

    if (!loginOk) {
      throw new Error('Login test failed');
    }

    console.log('');
    console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
    console.log('🟢 СЕРВЕР ПОЛНОСТЬЮ РАБОТОСПОСОБЕН!');
    console.log('');
    console.log('📋 Инструкции для пользователя:');
    console.log('   1. Откройте приложение в браузере');
    console.log('   2. Перейдите в раздел регистрации/входа');
    console.log('   3. Используйте данные:');
    console.log('      Email: smm@gelazutdinov.ru');
    console.log('      Password: admin123');
    console.log('   4. Нажмите "Войти"');
    console.log('');
    console.log('✅ Проблема "Failed to fetch" должна быть решена!');

  } catch (error) {
    console.log('');
    console.log('🔴 ТЕСТЫ НЕ ПРОЙДЕНЫ!');
    console.log('❌ Причина:', error.message);
    console.log('');
    console.log('🛠️ Действия для исправления:');
    console.log('   1. Запустите сервер: node start-server-now.js');
    console.log('   2. Подождите 5 секунд');
    console.log('   3. Запустите тест снова: node test-connection.js');
    process.exit(1);
  }
}

runTests();
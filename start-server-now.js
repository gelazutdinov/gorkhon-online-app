#!/usr/bin/env node

// НЕМЕДЛЕННЫЙ ЗАПУСК СЕРВЕРА
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 ЭКСТРЕННЫЙ ЗАПУСК СЕРВЕРА! 🚨');
console.log('=' .repeat(50));

// Проверяем наличие файла сервера
const serverPath = path.join(__dirname, 'server', 'start-emergency-server.js');

if (!fs.existsSync(serverPath)) {
  console.error('❌ Файл сервера не найден!');
  console.log('📍 Ожидаемый путь:', serverPath);
  process.exit(1);
}

console.log('✅ Файл сервера найден');
console.log('🚀 Запускаем...');

// Убиваем процессы на порту 3001
const killPort = spawn('pkill', ['-f', '3001'], { stdio: 'ignore' });

killPort.on('close', () => {
  setTimeout(() => {
    // Запускаем сервер
    const server = spawn('node', [serverPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    server.on('error', (error) => {
      console.error('❌ Ошибка запуска сервера:', error.message);
      process.exit(1);
    });

    server.on('close', (code) => {
      console.log(`🛑 Сервер остановлен с кодом ${code}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Получен сигнал остановки...');
      server.kill('SIGINT');
      process.exit(0);
    });

  }, 500);
});

setTimeout(() => {
  console.log('\n📊 Проверка доступности сервера через 3 секунды...');
  setTimeout(async () => {
    try {
      const http = require('http');
      
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/health',
        method: 'GET',
        timeout: 2000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('🟢 СЕРВЕР РАБОТАЕТ УСПЕШНО!');
            console.log('🎯 Доступ: http://localhost:3001');
            console.log('🔑 Логин: smm@gelazutdinov.ru');
            console.log('🗝️  Пароль: admin123');
          } else {
            console.log('🟡 Сервер запущен, но возвращает:', res.statusCode);
          }
        });
      });

      req.on('error', (err) => {
        console.log('🔴 Сервер еще не доступен, подождите...');
      });

      req.on('timeout', () => {
        console.log('⏰ Время ожидания истекло, но сервер может еще запускаться...');
        req.destroy();
      });

      req.end();

    } catch (error) {
      console.log('⚠️ Проверка недоступна:', error.message);
    }
  }, 3000);
}, 1000);
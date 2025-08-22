#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 БЫСТРЫЙ ЗАПУСК СЕРВЕРА');
console.log('=' .repeat(40));

const serverPath = path.join(__dirname, 'server', 'quick-server.js');

console.log('📁 Путь к серверу:', serverPath);
console.log('🌐 URL сервера: http://localhost:3001');
console.log('🏥 Health check: http://localhost:3001/api/health');
console.log('👤 Тестовый логин: smm@gelazutdinov.ru / admin123');
console.log('=' .repeat(40));

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: path.join(__dirname, 'server')
});

serverProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска сервера:', error.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Завершение сервера...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});
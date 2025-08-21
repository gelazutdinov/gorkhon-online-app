#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запуск сервера Горхон.Online...');

const serverPath = path.join(__dirname, 'src', 'app.ts');
const server = spawn('tsx', [serverPath], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`Сервер завершился с кодом ${code}`);
});

server.on('error', (err) => {
  console.error('Ошибка запуска сервера:', err);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
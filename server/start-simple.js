import { spawn } from 'child_process';

console.log('🚀 Запуск простого сервера...\n');

const serverProcess = spawn('tsx', ['src/simple-app.ts'], {
  cwd: 'server',
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`\n🛑 Сервер остановлен с кодом ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал остановки...');
  serverProcess.kill();
  process.exit(0);
});
const { spawn } = require('child_process');
const path = require('path');

console.log('🔥 КРИТИЧЕСКИЙ ТЕСТ СЕРВЕРА - ЗАПУСК ПРЯМО СЕЙЧАС!');
console.log('='.repeat(60));

// Переходим в папку server и запускаем tsx
const serverPath = path.join(process.cwd(), 'server');
console.log(`📂 Переходим в папку: ${serverPath}`);

const command = 'npx';
const args = ['tsx', 'src/simple-app.ts'];

console.log(`🚀 Выполняем команду: ${command} ${args.join(' ')}`);

const child = spawn(command, args, {
  cwd: serverPath,
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
});

child.on('close', (code) => {
  console.log(`🏁 Процесс завершен с кодом: ${code}`);
});

// Также проверим, есть ли процесс на порту 3001
const { exec } = require('child_process');
exec('netstat -an | grep 3001', (error, stdout, stderr) => {
  if (stdout) {
    console.log('⚠️ ПРОЦЕСС УЖЕ НА ПОРТУ 3001:');
    console.log(stdout);
  } else {
    console.log('✅ Порт 3001 свободен');
  }
});
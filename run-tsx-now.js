const { spawn } = require('child_process');

console.log('⚡ БЫСТРЫЙ ЗАПУСК TSX СЕРВЕРА');
console.log('============================\\n');

const proc = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: 'server',
  stdio: 'inherit'
});

console.log('🚀 Команда запущена: npx tsx src/app.ts');
console.log('📁 В директории: server/');
console.log('⏰ Останавливаем через 6 секунд...\\n');

setTimeout(() => {
  console.log('\\n🛑 Останавливаем сервер...');
  proc.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('✅ Тест завершен');
    process.exit(0);
  }, 1000);
}, 6000);

proc.on('error', (error) => {
  console.error('❌ Ошибка:', error.message);
  process.exit(1);
});
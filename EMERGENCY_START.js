const { spawn, execSync } = require('child_process');

console.log('🚨 ЭКСТРЕННЫЙ ЗАПУСК СЕРВЕРА РАЗРАБОТКИ!');

// 1. Убить все процессы
console.log('Убиваем процессы...');
try {
  execSync('pkill -f node || true', { stdio: 'inherit' });
  execSync('pkill -f vite || true', { stdio: 'inherit' });
  execSync('pkill -f npm || true', { stdio: 'inherit' });
} catch (e) {
  console.log('Процессы остановлены');
}

// 2. Очистить порты
console.log('Очищаем порты 5173 и 3001...');
try {
  execSync('lsof -ti:5173 | xargs kill -9 2>/dev/null || true', { stdio: 'inherit' });
  execSync('lsof -ti:3001 | xargs kill -9 2>/dev/null || true', { stdio: 'inherit' });
} catch (e) {
  console.log('Порты очищены');
}

// 3. Запустить dev server
console.log('🚀 ЗАПУСКАЕМ npm run dev...');
const devProcess = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit', 
  shell: true 
});

devProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска:', error);
});

devProcess.on('close', (code) => {
  console.log(`Процесс завершен с кодом ${code}`);
});

// Показать URL через 3 секунды
setTimeout(() => {
  console.log('\n🌐 СЕРВЕР ДОЛЖЕН БЫТЬ ДОСТУПЕН НА:');
  console.log('📍 http://localhost:5173');
  console.log('📍 http://0.0.0.0:5173');
}, 3000);
const { execSync } = require('child_process');

try {
  // Убиваем все процессы на порту 3001
  execSync('lsof -ti:3001 | xargs kill -9', { stdio: 'ignore' });
  console.log('🧹 Очистили порт 3001');
} catch (error) {
  console.log('ℹ️ Порт 3001 свободен');
}

try {
  // Убиваем процессы tsx
  execSync('pkill -f tsx', { stdio: 'ignore' });
  console.log('🧹 Завершили процессы tsx');
} catch (error) {
  console.log('ℹ️ Нет активных процессов tsx');
}

console.log('✅ Система готова к тестированию');
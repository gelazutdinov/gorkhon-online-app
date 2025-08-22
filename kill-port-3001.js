const { exec } = require('child_process');

console.log('🔪 УБИВАЕМ ВСЕ ПРОЦЕССЫ НА ПОРТУ 3001');

// Для разных операционных систем
const commands = [
  'lsof -ti:3001 | xargs kill -9',  // Unix/Linux/macOS
  'netstat -ano | findstr :3001',   // Windows для поиска
];

// Попробуем Unix команду
exec(commands[0], (error, stdout, stderr) => {
  if (error) {
    console.log('ℹ️ Нет процессов на порту 3001 (или ошибка Unix команды)');
    
    // Попробуем Windows команду
    exec(commands[1], (error, stdout, stderr) => {
      if (stdout) {
        console.log('📊 Процессы на порту 3001 (Windows):');
        console.log(stdout);
      } else {
        console.log('✅ Порт 3001 свободен');
      }
    });
  } else {
    console.log('🔪 Процессы на порту 3001 убиты');
  }
});

// Дополнительная проверка
setTimeout(() => {
  exec('netstat -an | grep 3001', (error, stdout, stderr) => {
    if (stdout) {
      console.log('⚠️ Все еще есть процессы на порту 3001:');
      console.log(stdout);
    } else {
      console.log('✅ Порт 3001 полностью свободен');
    }
  });
}, 1000);
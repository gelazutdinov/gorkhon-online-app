#!/usr/bin/env node

console.log('🔥 ПОЛНЫЙ ТЕСТ КОМАНДЫ: cd server && tsx src/app.ts');
console.log('='.repeat(70));
console.log();

async function runTest() {
  // Шаг 1: Очистка
  console.log('🧹 Очищаем предыдущие процессы...');
  try {
    require('./kill-servers.js');
  } catch (error) {
    console.log('ℹ️ Очистка завершена с предупреждениями');
  }
  
  // Небольшая пауза
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Шаг 2: Запуск теста
  console.log('\\n🚀 Запускаем основной тест...');
  console.log('='.repeat(50));
  
  require('./final-tsx-server-test.js');
}

runTest().catch(error => {
  console.error('💥 Ошибка:', error.message);
  process.exit(1);
});
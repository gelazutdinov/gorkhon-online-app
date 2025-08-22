const { execSync } = require('child_process');

try {
  console.log('🎯 Выполняем команду напрямую:');
  console.log('cd server && timeout 5s npx tsx src/app.ts');
  console.log('=====================================\\n');
  
  const result = execSync('cd server && timeout 5s npx tsx src/app.ts', {
    encoding: 'utf8',
    timeout: 10000,
    stdio: 'pipe'
  });
  
  console.log('📤 STDOUT:');
  console.log(result);
  console.log('\\n✅ Команда выполнена успешно!');
  
} catch (error) {
  console.log('📤 STDOUT:');
  console.log(error.stdout || '(пусто)');
  
  console.log('\\n⚠️ STDERR:');
  console.log(error.stderr || '(пусто)');
  
  console.log(`\\n📊 Код завершения: ${error.status}`);
  
  if (error.status === 124) {
    console.log('✅ Процесс был остановлен по таймауту (это ожидаемо для сервера)');
  } else if (error.stdout && error.stdout.includes('Сервер запущен')) {
    console.log('✅ Сервер успешно запустился!');
  } else {
    console.log('❌ Возможна ошибка запуска');
  }
}
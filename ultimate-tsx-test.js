const { spawn } = require('child_process');
const path = require('path');

console.log('🎯 УЛЬТИМАТИВНЫЙ ТЕСТ ЗАПУСКА СЕРВЕРА');
console.log('====================================\\n');

console.log('📋 Информация о тесте:');
console.log(`   📁 Директория: ${__dirname}`);
console.log(`   🎯 Команда: cd server && npx tsx src/app.ts`);
console.log(`   ⏰ Время тестирования: 10 секунд\\n`);

const serverDir = path.join(__dirname, 'server');
console.log(`🔍 Запуск в директории: ${serverDir}\\n`);

const child = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: serverDir,
  stdio: 'pipe'
});

let allOutput = '';
let hasServerMessage = false;

console.log('📡 ВЫВОД СЕРВЕРА:');
console.log('-'.repeat(50));

child.stdout.on('data', (data) => {
  const text = data.toString();
  allOutput += text;
  
  // Выводим каждую строку
  text.split('\\n').forEach(line => {
    if (line.trim()) {
      console.log(`[📤] ${line.trim()}`);
      
      // Ищем признаки успешного запуска
      if (line.includes('Сервер') || line.includes('запущен') || line.includes('🚀') || line.includes('listening')) {
        hasServerMessage = true;
      }
    }
  });
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  allOutput += text;
  
  text.split('\\n').forEach(line => {
    if (line.trim()) {
      console.log(`[⚠️] ${line.trim()}`);
    }
  });
});

child.on('error', (error) => {
  console.log(`[💥] Ошибка процесса: ${error.message}`);
});

// Завершаем тест через 10 секунд
setTimeout(() => {
  console.log('-'.repeat(50));
  console.log('\\n⏰ Время тестирования истекло\\n');
  
  child.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('📊 ФИНАЛЬНЫЙ РЕЗУЛЬТАТ:');
    console.log('========================');
    
    if (hasServerMessage) {
      console.log('✅ УСПЕХ: Обнаружены сообщения о запуске сервера!');
      console.log('🎯 Команда tsx src/app.ts работает корректно');
    } else if (allOutput.trim()) {
      console.log('⚠️ ЧАСТИЧНЫЙ УСПЕХ: Сервер выдал вывод, но без явного сообщения о запуске');
      console.log('🤔 Возможно, сервер работает, но использует другой формат сообщений');
    } else {
      console.log('❌ НЕУДАЧА: Нет вывода от сервера');
      console.log('💡 Возможные причины: ошибки зависимостей, неправильный путь, или проблемы с tsx');
    }
    
    console.log('\\n📋 ПОЛНЫЙ ВЫВОД СЕРВЕРА:');
    console.log('========================');
    if (allOutput.trim()) {
      console.log(allOutput);
    } else {
      console.log('(НЕТ ВЫВОДА)');
    }
    
    console.log('\\n🏁 Тестирование завершено');
    console.log('========================');
    
    process.exit(hasServerMessage ? 0 : 1);
  }, 1000);
}, 10000);

console.log('⏳ Ожидание результатов (10 секунд)...');
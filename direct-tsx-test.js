const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🔥 Прямой тест команды tsx');
console.log('==========================\n');

// Сначала проверим команду tsx --version
console.log('1️⃣ Проверяем tsx...');
try {
  const version = execSync('npx tsx --version', { 
    encoding: 'utf8', 
    timeout: 10000,
    cwd: __dirname 
  });
  console.log(`✅ tsx версия: ${version.trim()}\n`);
} catch (error) {
  console.error('❌ Ошибка проверки tsx:', error.message);
  process.exit(1);
}

// Теперь запускаем команду cd server && tsx src/app.ts
console.log('2️⃣ Выполняем: cd server && npx tsx src/app.ts');
console.log('============================================');

const serverDir = path.join(__dirname, 'server');

try {
  const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
    cwd: serverDir,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  let output = '';
  let errorOutput = '';
  let serverReady = false;

  serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    
    // Выводим в реальном времени
    const lines = text.trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`📤 ${line}`);
      }
    });
    
    // Проверяем на успешный запуск
    if (text.includes('Сервер запущен на порту') || text.includes('🚀')) {
      serverReady = true;
    }
  });

  serverProcess.stderr.on('data', (data) => {
    const text = data.toString();
    errorOutput += text;
    
    // Выводим ошибки в реальном времени
    const lines = text.trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`❌ ${line}`);
      }
    });
  });

  serverProcess.on('error', (error) => {
    console.error('🚫 Ошибка процесса:', error.message);
  });

  // Устанавливаем таймаут
  const testTimeout = setTimeout(() => {
    console.log('\n⏰ Время тестирования истекло');
    serverProcess.kill('SIGTERM');
  }, 8000);

  serverProcess.on('close', (code, signal) => {
    clearTimeout(testTimeout);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ');
    console.log('='.repeat(50));
    
    console.log(`🔄 Процесс завершен - Код: ${code}, Сигнал: ${signal}`);
    
    if (serverReady) {
      console.log('✅ УСПЕХ: Сервер успешно запустился!');
      console.log('🎯 Команда tsx src/app.ts работает корректно');
    } else if (signal === 'SIGTERM') {
      console.log('⚠️ Сервер остановлен по таймауту');
      console.log('🤔 Возможно сервер запустился, но не вывел ожидаемое сообщение');
    } else {
      console.log('❌ ОШИБКА: Сервер не запустился');
    }
    
    console.log('\n📋 ПОЛНЫЕ ЛОГИ ЗАПУСКА:');
    if (output.trim()) {
      console.log('--- СТАНДАРТНЫЙ ВЫВОД ---');
      console.log(output);
    }
    
    if (errorOutput.trim()) {
      console.log('--- ОШИБКИ ---');
      console.log(errorOutput);
    }
    
    if (!output.trim() && !errorOutput.trim()) {
      console.log('(Нет логов)');
    }
    
    console.log('\n' + '='.repeat(50));
    
    // Определяем код выхода
    const exitCode = serverReady ? 0 : (code || 1);
    setTimeout(() => process.exit(exitCode), 500);
  });

  console.log('⏳ Ожидание запуска сервера...\n');

} catch (error) {
  console.error('💥 Критическая ошибка:', error.message);
  process.exit(1);
}
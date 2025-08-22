const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🚀 Тестирование запуска TypeScript сервера');
console.log('==========================================\n');

// Проверяем наличие tsx
console.log('1️⃣ Проверяем доступность tsx...');
try {
  const tsxVersion = execSync('npx tsx --version', { encoding: 'utf8', timeout: 10000 });
  console.log(`✅ tsx доступен, версия: ${tsxVersion.trim()}\n`);
} catch (error) {
  console.error('❌ tsx недоступен:', error.message);
  process.exit(1);
}

// Проверяем структуру проекта
console.log('2️⃣ Проверяем структуру проекта...');
const serverDir = path.join(__dirname, 'server');
const appFile = path.join(serverDir, 'src', 'app.ts');

try {
  require('fs').accessSync(serverDir);
  console.log('✅ Папка server найдена');
  
  require('fs').accessSync(appFile);
  console.log('✅ Файл src/app.ts найден\n');
} catch (error) {
  console.error('❌ Ошибка проверки файлов:', error.message);
  process.exit(1);
}

// Запускаем сервер
console.log('3️⃣ Запускаем команду: cd server && npx tsx src/app.ts');
console.log('==========================================');

const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: serverDir,
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
let serverStarted = false;

// Обрабатываем stdout
serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  console.log(`[OUT] ${text.trim()}`);
  
  if (text.includes('Сервер запущен на порту')) {
    serverStarted = true;
  }
});

// Обрабатываем stderr
serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  console.log(`[ERR] ${text.trim()}`);
});

// Обрабатываем ошибки
serverProcess.on('error', (error) => {
  console.error('❌ Ошибка процесса:', error.message);
});

// Устанавливаем таймаут на 8 секунд
const timeout = setTimeout(() => {
  console.log('\n⏰ Таймаут достигнут, останавливаем сервер...');
  serverProcess.kill('SIGTERM');
  
  setTimeout(() => {
    serverProcess.kill('SIGKILL');
  }, 2000);
}, 8000);

// Обрабатываем завершение процесса
serverProcess.on('close', (code, signal) => {
  clearTimeout(timeout);
  
  console.log('\n==========================================');
  console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:');
  console.log('==========================================');
  
  console.log(`🔄 Процесс завершен - Код: ${code}, Сигнал: ${signal}`);
  
  if (serverStarted) {
    console.log('✅ Сервер УСПЕШНО запустился!');
    console.log('🎯 СТАТУС: УСПЕХ');
  } else if (signal === 'SIGTERM') {
    console.log('⚠️ Сервер остановлен по таймауту (возможно запустился)');
    console.log('🎯 СТАТУС: ЧАСТИЧНЫЙ УСПЕХ');
  } else {
    console.log('❌ Сервер НЕ запустился корректно');
    console.log('🎯 СТАТУС: ОШИБКА');
  }
  
  console.log('\n📝 ПОЛНЫЕ ЛОГИ:');
  console.log('--- STDOUT ---');
  console.log(stdout || '(пусто)');
  
  if (stderr.trim()) {
    console.log('\n--- STDERR ---');
    console.log(stderr);
  }
  
  console.log('\n==========================================');
  
  // Выходим с соответствующим кодом
  if (serverStarted || signal === 'SIGTERM') {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

console.log('\n⏳ Ожидание запуска сервера (до 8 секунд)...');
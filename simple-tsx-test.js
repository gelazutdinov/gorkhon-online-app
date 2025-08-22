const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Простой тест запуска TypeScript сервера');
console.log('==========================================\n');

const serverProcess = spawn('node', [path.join(__dirname, 'node_modules', '.bin', 'tsx'), 'src/app.ts'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe'
});

let output = '';
let hasStarted = false;

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(`[STDOUT] ${text.trim()}`);
  
  if (text.includes('Сервер запущен')) {
    hasStarted = true;
    console.log('\n✅ Сервер запустился успешно!');
  }
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(`[STDERR] ${text.trim()}`);
});

serverProcess.on('error', (error) => {
  console.error('❌ Ошибка:', error.message);
});

// Останавливаем через 6 секунд
setTimeout(() => {
  console.log('\n⏰ Останавливаем тест...');
  
  if (hasStarted) {
    console.log('🎯 РЕЗУЛЬТАТ: УСПЕХ - Сервер запустился!');
  } else {
    console.log('🎯 РЕЗУЛЬТАТ: Сервер не запустился или не выдал ожидаемое сообщение');
  }
  
  console.log('\n📝 Полный вывод:');
  console.log(output || '(нет вывода)');
  
  serverProcess.kill('SIGTERM');
  
  setTimeout(() => {
    process.exit(hasStarted ? 0 : 1);
  }, 1000);
}, 6000);

console.log('⏳ Ожидание результатов (6 секунд)...');
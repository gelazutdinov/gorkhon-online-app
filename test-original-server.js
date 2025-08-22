import { spawn } from 'child_process';

console.log('🔍 Диагностика оригинального сервера...\n');

const serverProcess = spawn('tsx', ['server/src/app.ts'], {
  stdio: 'pipe'
});

let hasError = false;
let output = '';

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log('📋 Output:', text.trim());
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.error('❌ Error:', text.trim());
  hasError = true;
});

serverProcess.on('close', (code) => {
  console.log(`\n📊 Результат диагностики оригинального сервера:`);
  console.log(`• Код завершения: ${code}`);
  console.log(`• Есть ошибки: ${hasError ? 'Да' : 'Нет'}`);
  
  if (hasError) {
    console.log('\n❌ Проблемы найдены в оригинальном сервере');
    console.log('🔧 Переходим к тестированию нового сервера...\n');
    testNewServer();
  } else {
    console.log('\n✅ Оригинальный сервер работает нормально');
    process.exit(0);
  }
});

setTimeout(() => {
  if (!hasError) {
    console.log('\n✅ Сервер запустился без ошибок за 5 секунд');
    serverProcess.kill();
  }
}, 5000);

function testNewServer() {
  console.log('🧪 Тестирование нового простого сервера...\n');
  
  const newServerProcess = spawn('node', ['server/test-simple-server.js'], {
    stdio: 'inherit'
  });

  newServerProcess.on('close', (code) => {
    console.log(`\n✅ Тестирование завершено с кодом ${code}`);
    process.exit(0);
  });
}
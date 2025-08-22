import { spawn } from 'child_process';

console.log('🔧 Финальное тестирование серверов...\n');

async function runTest() {
  console.log('1️⃣ Тестируем оригинальный сервер...');
  
  try {
    const result = await testServer('tsx', ['server/src/app.ts'], 'оригинальный');
    if (result.success) {
      console.log('✅ Оригинальный сервер работает');
      return;
    }
  } catch (error) {
    console.log('❌ Оригинальный сервер имеет проблемы:', error.message);
  }

  console.log('\n2️⃣ Тестируем новый простой сервер...');
  
  try {
    const result = await testServer('tsx', ['server/src/simple-app.ts'], 'новый');
    if (result.success) {
      console.log('✅ Новый сервер работает отлично!');
    }
  } catch (error) {
    console.log('❌ Новый сервер имеет проблемы:', error.message);
  }
}

function testServer(command, args, name) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Запускаем ${name} сервер...`);
    
    const serverProcess = spawn(command, args, {
      stdio: 'pipe'
    });

    let hasError = false;
    let output = '';

    const timeout = setTimeout(() => {
      if (!hasError) {
        console.log(`✅ ${name.charAt(0).toUpperCase() + name.slice(1)} сервер запустился успешно`);
        serverProcess.kill();
        resolve({ success: true, output });
      }
    }, 5000);

    serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`📋 [${name}]:`, text.trim());
    });

    serverProcess.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.error(`❌ [${name}]:`, text.trim());
      hasError = true;
      clearTimeout(timeout);
      serverProcess.kill();
      reject(new Error(`Ошибка в ${name} сервере: ${text.trim()}`));
    });

    serverProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !hasError) {
        reject(new Error(`${name.charAt(0).toUpperCase() + name.slice(1)} сервер завершился с кодом ${code}`));
      }
    });
  });
}

runTest().catch(console.error);
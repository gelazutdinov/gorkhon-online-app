const { spawn } = require('child_process');

console.log('🚀 Быстрый тест запуска сервера...\n');

// Проверяем, что tsx доступен
const tsxCheck = spawn('npx', ['tsx', '--version'], { stdio: 'pipe' });

tsxCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ tsx доступен\n');
    
    // Запускаем сервер
    console.log('🔥 Запускаем сервер: cd server && npx tsx src/app.ts\n');
    
    const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
      cwd: 'server',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let serverOutput = '';
    let hasError = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[STDOUT] ${output.trim()}`);
      serverOutput += output;
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.log(`[STDERR] ${error.trim()}`);
      hasError = true;
    });

    serverProcess.on('error', (error) => {
      console.error('❌ Ошибка запуска:', error.message);
      hasError = true;
    });

    // Завершаем через 5 секунд
    setTimeout(() => {
      if (!hasError && serverOutput.includes('Сервер запущен')) {
        console.log('\n✅ Сервер запустился успешно!');
      } else if (hasError) {
        console.log('\n❌ Ошибки при запуске сервера');
      } else {
        console.log('\n⚠️ Сервер не выдал ожидаемого сообщения о запуске');
      }
      
      console.log('\n📝 Полный вывод сервера:');
      console.log(serverOutput);
      
      serverProcess.kill('SIGTERM');
      process.exit(0);
    }, 5000);
    
  } else {
    console.log('❌ tsx недоступен, код:', code);
    process.exit(1);
  }
});

tsxCheck.on('error', (error) => {
  console.error('❌ Ошибка проверки tsx:', error.message);
  process.exit(1);
});
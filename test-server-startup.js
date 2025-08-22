import { spawn } from 'child_process';
import fetch from 'node-fetch';

console.log('🚀 Запуск тестирования TypeScript сервера...\n');

const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: 'server',
  stdio: 'pipe'
});

let serverOutput = '';
let serverError = '';
let serverStarted = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[STDOUT] ${output.trim()}`);
  serverOutput += output;
  
  // Определяем, что сервер запустился
  if (output.includes('Сервер запущен на порту')) {
    serverStarted = true;
  }
});

serverProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.log(`[STDERR] ${error.trim()}`);
  serverError += error;
});

// Функция для проверки доступности сервера
const waitForServer = (maxAttempts = 10, delay = 1000) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = async () => {
      attempts++;
      try {
        const response = await fetch('http://localhost:3001/api/health', { timeout: 1000 });
        if (response.ok) {
          resolve(true);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(new Error(`Сервер не отвечает после ${maxAttempts} попыток`));
        } else {
          console.log(`Попытка ${attempts}/${maxAttempts}: сервер еще не готов...`);
          setTimeout(checkServer, delay);
        }
      }
    };
    
    checkServer();
  });
};

// Ждем запуска сервера и тестируем endpoints
setTimeout(async () => {
  console.log('\n📊 Ожидание готовности сервера...\n');
  
  try {
    await waitForServer();
    console.log('✅ Сервер готов к тестированию!\n');
    
    console.log('=== ТЕСТИРОВАНИЕ ENDPOINTS ===\n');
    
    // Test 1: Health check
    console.log('1️⃣ Тестируем GET /api/health...');
    try {
      const healthResponse = await fetch('http://localhost:3001/api/health');
      const healthData = await healthResponse.json();
      console.log(`   Статус: ${healthResponse.status}`);
      console.log(`   ✅ Health check успешен:`, JSON.stringify(healthData, null, 2));
    } catch (error) {
      console.log(`   ❌ Health check неудачен: ${error.message}`);
    }

    // Test 2: Register
    console.log('\n2️⃣ Тестируем POST /api/auth/register...');
    try {
      const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "123456",
          name: "Test User"
        })
      });
      const registerData = await registerResponse.json();
      console.log(`   Статус: ${registerResponse.status}`);
      if (registerResponse.ok) {
        console.log(`   ✅ Register успешен:`, JSON.stringify(registerData, null, 2));
      } else {
        console.log(`   ⚠️ Register ответил:`, JSON.stringify(registerData, null, 2));
      }
    } catch (error) {
      console.log(`   ❌ Register неудачен: ${error.message}`);
    }

    // Test 3: Login
    console.log('\n3️⃣ Тестируем POST /api/auth/login...');
    try {
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "smm@gelazutdinov.ru",
          password: "admin123"
        })
      });
      const loginData = await loginResponse.json();
      console.log(`   Статус: ${loginResponse.status}`);
      if (loginResponse.ok) {
        console.log(`   ✅ Login успешен:`, JSON.stringify(loginData, null, 2));
      } else {
        console.log(`   ⚠️ Login ответил:`, JSON.stringify(loginData, null, 2));
      }
    } catch (error) {
      console.log(`   ❌ Login неудачен: ${error.message}`);
    }

    console.log('\n=== ИТОГОВЫЙ ОТЧЕТ ===');
    console.log(`🔥 Запуск сервера: ${serverStarted ? '✅ УСПЕШНО' : '❌ НЕУДАЧА'}`);
    console.log(`📝 Вывод сервера:\n${serverOutput}`);
    if (serverError) {
      console.log(`⚠️ Ошибки сервера:\n${serverError}`);
    }
    
  } catch (error) {
    console.log(`❌ Ошибка ожидания сервера: ${error.message}`);
    console.log(`📝 Вывод сервера:\n${serverOutput}`);
    if (serverError) {
      console.log(`⚠️ Ошибки сервера:\n${serverError}`);
    }
  }
  
  // Завершаем процесс сервера
  console.log('\n🔄 Завершение тестирования...');
  serverProcess.kill('SIGTERM');
  setTimeout(() => {
    serverProcess.kill('SIGKILL');
    process.exit(0);
  }, 2000);
}, 2000);

serverProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска сервера:', error.message);
  process.exit(1);
});

serverProcess.on('exit', (code, signal) => {
  console.log(`\n🏁 Сервер завершился. Код: ${code}, Сигнал: ${signal}`);
  if (code !== 0 && code !== null) {
    console.log('❌ Сервер завершился с ошибкой');
  }
});
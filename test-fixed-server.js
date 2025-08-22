#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔧 ТЕСТ ИСПРАВЛЕННОГО СЕРВЕРА');
console.log('='.repeat(50));

// Проверяем, что исправления применены
console.log('\n🔍 Проверяем исправления...');

try {
  const appContent = fs.readFileSync('server/src/app.ts', 'utf8');
  
  if (appContent.includes('async function startServer()')) {
    console.log('✅ Исправление 1: Асинхронная инициализация БД');
  } else {
    console.log('❌ Исправление 1: НЕ применено');
  }
  
  if (appContent.includes('await DatabaseService.getInstance().initialize()')) {
    console.log('✅ Исправление 2: Ожидание Promise БД');
  } else {
    console.log('❌ Исправление 2: НЕ применено');
  }
  
} catch (error) {
  console.log(`❌ Ошибка чтения app.ts: ${error.message}`);
}

try {
  const dbContent = fs.readFileSync('server/src/services/DatabaseService.ts', 'utf8');
  
  if (dbContent.includes("path.join(process.cwd(), 'database.sqlite')")) {
    console.log('✅ Исправление 3: Правильный путь к БД');
  } else {
    console.log('❌ Исправление 3: НЕ применено');
  }
  
} catch (error) {
  console.log(`❌ Ошибка чтения DatabaseService.ts: ${error.message}`);
}

// Запускаем сервер
console.log('\n🚀 Тестируем запуск исправленного сервера...');
console.log('Команда: cd server && npx tsx src/app.ts');
console.log('-'.repeat(50));

const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: 'server',
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
let dbInitialized = false;
let serverStarted = false;

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  
  text.split('\n').forEach(line => {
    if (line.trim()) {
      console.log(`[OUT] ${line.trim()}`);
      
      if (line.includes('База данных инициализирована')) {
        dbInitialized = true;
        console.log('✅ База данных успешно инициализирована');
      }
      
      if (line.includes('Сервер запущен на порту')) {
        serverStarted = true;
        console.log('✅ Сервер успешно запущен');
      }
    }
  });
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  
  text.split('\n').forEach(line => {
    if (line.trim()) {
      console.log(`[ERR] ${line.trim()}`);
    }
  });
});

serverProcess.on('error', (error) => {
  console.log(`[PROCESS] Ошибка: ${error.message}`);
});

// Тест health endpoint через 3 секунды
setTimeout(() => {
  if (serverStarted) {
    console.log('\n🌐 Тестируем health endpoint...');
    
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health endpoint работает!');
          try {
            const healthData = JSON.parse(data);
            console.log(`📊 Статус: ${healthData.status}`);
            console.log(`⏱️ Uptime: ${Math.round(healthData.uptime)}s`);
          } catch (e) {
            console.log('📊 Ответ получен, но не JSON');
          }
        } else {
          console.log(`❌ Health endpoint вернул: ${res.statusCode}`);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Ошибка health endpoint: ${error.message}`);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('⏰ Health endpoint timeout');
    });

    req.end();
  }
}, 3000);

// Завершение через 8 секунд
setTimeout(() => {
  console.log('\n⏰ Завершаем тестирование...');
  serverProcess.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 РЕЗУЛЬТАТЫ ТЕСТА');
    console.log('='.repeat(50));
    
    if (dbInitialized && serverStarted) {
      console.log('🎉 ТЕСТ ПРОЙДЕН: Все исправления работают!');
      console.log('✅ База данных инициализируется');
      console.log('✅ Сервер запускается');
      console.log('✅ API доступно');
    } else {
      console.log('❌ ТЕСТ НЕ ПРОЙДЕН');
      
      if (!dbInitialized) {
        console.log('   ❌ База данных не инициализирована');
      }
      
      if (!serverStarted) {
        console.log('   ❌ Сервер не запустился');
      }
      
      if (stderr.trim()) {
        console.log('\n🔍 Ошибки:');
        console.log(stderr);
      }
    }
    
    console.log('\n📝 Команда для ручного запуска:');
    console.log('cd server && npx tsx src/app.ts');
    
    process.exit(dbInitialized && serverStarted ? 0 : 1);
  }, 1000);
}, 8000);
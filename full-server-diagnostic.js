#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

console.log('🔥 ПОЛНАЯ ДИАГНОСТИКА СЕРВЕРА');
console.log('='.repeat(50));

// 1. Проверка зависимостей
console.log('\n📦 ПРОВЕРКА ЗАВИСИМОСТЕЙ:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const serverDeps = [
    'express', 'cors', 'helmet', 'morgan', 'express-rate-limit',
    'dotenv', 'bcryptjs', 'jsonwebtoken', 'sqlite3', 'tsx'
  ];
  
  serverDeps.forEach(dep => {
    const inDeps = packageJson.dependencies && packageJson.dependencies[dep];
    const inDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
    
    if (inDeps || inDevDeps) {
      console.log(`✅ ${dep}: ${inDeps || inDevDeps}`);
    } else {
      console.log(`❌ ${dep}: НЕ НАЙДЕН`);
    }
  });
} catch (error) {
  console.log(`❌ Ошибка package.json: ${error.message}`);
}

// 2. Проверка файлов
console.log('\n📄 ПРОВЕРКА ФАЙЛОВ:');
const serverFiles = [
  'server/src/app.ts',
  'server/src/routes/auth.ts',
  'server/src/routes/users.ts',
  'server/src/routes/admin.ts',
  'server/src/middleware/auth.ts',
  'server/src/middleware/errorHandler.ts',
  'server/src/services/DatabaseService.ts',
  'server/.env'
];

serverFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - НЕ НАЙДЕН`);
  }
});

// 3. Проверка .env
console.log('\n⚙️ ПРОВЕРКА .ENV:');
try {
  const envContent = fs.readFileSync('server/.env', 'utf8');
  const envVars = ['PORT=3001', 'JWT_SECRET', 'NODE_ENV=development'];
  
  envVars.forEach(envVar => {
    if (envContent.includes(envVar.split('=')[0])) {
      console.log(`✅ ${envVar.split('=')[0]} задан`);
    } else {
      console.log(`❌ ${envVar.split('=')[0]} отсутствует`);
    }
  });
} catch (error) {
  console.log(`❌ Ошибка .env: ${error.message}`);
}

// 4. Проверка tsx
console.log('\n🔧 ПРОВЕРКА TSX:');
try {
  const tsxVersion = execSync('npx tsx --version', { encoding: 'utf8', timeout: 5000 }).trim();
  console.log(`✅ tsx версия: ${tsxVersion}`);
} catch (error) {
  console.log(`❌ Проблема с tsx: ${error.message}`);
}

// 5. Запуск сервера для диагностики
console.log('\n🚀 ТЕСТИРОВАНИЕ ЗАПУСКА:');
console.log('Команда: cd server && npx tsx src/app.ts');
console.log('-'.repeat(50));

const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
  cwd: 'server',
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';
let serverErrors = '';
let serverStarted = false;

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  serverOutput += text;
  console.log(`[OUT] ${text.trim()}`);
  
  if (text.includes('Сервер запущен') || text.includes('🚀')) {
    serverStarted = true;
  }
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  serverErrors += text;
  console.log(`[ERR] ${text.trim()}`);
});

serverProcess.on('error', (error) => {
  console.log(`[PROCESS ERROR] ${error.message}`);
});

// Завершаем через 8 секунд
setTimeout(() => {
  serverProcess.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 РЕЗУЛЬТАТЫ ДИАГНОСТИКИ:');
    console.log('='.repeat(50));
    
    if (serverStarted) {
      console.log('🎉 РЕЗУЛЬТАТ: Сервер запускается УСПЕШНО!');
      console.log('✅ Команда работает: cd server && npx tsx src/app.ts');
    } else {
      console.log('💥 РЕЗУЛЬТАТ: Сервер НЕ запускается');
      
      // Анализ ошибок
      if (serverErrors.includes('Cannot find module')) {
        console.log('🔍 ПРОБЛЕМА: Отсутствуют модули');
        console.log('💡 РЕШЕНИЕ: npm install');
      }
      
      if (serverErrors.includes('EADDRINUSE')) {
        console.log('🔍 ПРОБЛЕМА: Порт 3001 занят');
        console.log('💡 РЕШЕНИЕ: pkill -f "tsx.*app.ts" или изменить PORT в .env');
      }
      
      if (serverErrors.includes('ENOENT')) {
        console.log('🔍 ПРОБЛЕМА: Файлы не найдены');
        console.log('💡 РЕШЕНИЕ: Проверить пути к файлам');
      }
      
      if (serverErrors.includes('SyntaxError')) {
        console.log('🔍 ПРОБЛЕМА: Синтаксическая ошибка');
        console.log('💡 РЕШЕНИЕ: Проверить код TypeScript');
      }
      
      if (!serverErrors.trim() && !serverOutput.trim()) {
        console.log('🔍 ПРОБЛЕМА: Нет вывода от команды');
        console.log('💡 РЕШЕНИЕ: Проверить установку tsx');
      }
    }
    
    console.log('\n📋 ПОЛНЫЙ ВЫВОД:');
    console.log('STDOUT:', serverOutput || '(пусто)');
    if (serverErrors) {
      console.log('STDERR:', serverErrors);
    }
    
    process.exit(serverStarted ? 0 : 1);
  }, 1000);
}, 8000);
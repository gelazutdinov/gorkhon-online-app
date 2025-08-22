#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 БЫСТРАЯ ПРОВЕРКА СЕРВЕРА\n');

// 1. Проверяем tsx
try {
  console.log('1. Проверяем tsx...');
  const tsx = execSync('which tsx 2>/dev/null || echo "not found"', { encoding: 'utf8' }).trim();
  if (tsx === 'not found') {
    console.log('   ❌ tsx не найден глобально');
    console.log('   ✅ Проверяем npx tsx...');
    const tsxVersion = execSync('npx tsx --version', { encoding: 'utf8', timeout: 5000 }).trim();
    console.log(`   ✅ tsx через npx: ${tsxVersion}`);
  } else {
    console.log(`   ✅ tsx найден: ${tsx}`);
  }
} catch (error) {
  console.log(`   ❌ Ошибка tsx: ${error.message}`);
}

// 2. Проверяем структуру
console.log('\n2. Проверяем файлы...');
const files = ['server/src/app.ts', 'server/.env'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} не найден`);
  }
});

// 3. Проверяем порт
console.log('\n3. Проверяем порт 3001...');
const net = require('net');
const server = net.createServer();

server.listen(3001, () => {
  console.log('   ✅ Порт 3001 свободен');
  server.close();
  
  // 4. Пробуем запустить сервер
  console.log('\n4. Тестируем запуск сервера...');
  console.log('   Команда: cd server && npx tsx src/app.ts');
  console.log('   ' + '-'.repeat(40));
  
  const proc = spawn('npx', ['tsx', 'src/app.ts'], {
    cwd: 'server',
    stdio: 'inherit'
  });
  
  let killed = false;
  
  proc.on('error', (error) => {
    console.log(`   ❌ Ошибка: ${error.message}`);
  });
  
  setTimeout(() => {
    if (!killed) {
      console.log('\n   ⏰ Останавливаем тест...');
      proc.kill('SIGTERM');
      killed = true;
      
      setTimeout(() => {
        console.log('\n✅ Тест завершен!');
        process.exit(0);
      }, 1000);
    }
  }, 5000);
  
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('   ⚠️ Порт 3001 занят (возможно, сервер уже запущен)');
  } else {
    console.log(`   ❌ Ошибка порта: ${err.message}`);
  }
});
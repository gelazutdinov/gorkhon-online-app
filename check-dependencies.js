console.log('🔍 Проверка зависимостей для test-simple-server.js\n');

try {
  console.log('1. Проверяем express...');
  const express = require('express');
  console.log('✅ express найден:', typeof express);
} catch (error) {
  console.log('❌ express не найден:', error.message);
}

try {
  console.log('2. Проверяем cors...');
  const cors = require('cors');
  console.log('✅ cors найден:', typeof cors);
} catch (error) {
  console.log('❌ cors не найден:', error.message);
}

console.log('\n3. Проверяем содержимое test-simple-server.js...');

const fs = require('fs');
try {
  const content = fs.readFileSync('test-simple-server.js', 'utf8');
  const lines = content.split('\n');
  
  console.log('📄 Файл содержит', lines.length, 'строк');
  console.log('🔍 Основные компоненты:');
  
  if (content.includes('const express = require')) {
    console.log('✅ Импорт express');
  }
  
  if (content.includes('const cors = require')) {
    console.log('✅ Импорт cors');
  }
  
  if (content.includes('app.get(\'/api/health\'')) {
    console.log('✅ Endpoint GET /api/health');
  }
  
  if (content.includes('app.post(\'/api/auth/register\'')) {
    console.log('✅ Endpoint POST /api/auth/register');
  }
  
  if (content.includes('app.post(\'/api/auth/login\'')) {
    console.log('✅ Endpoint POST /api/auth/login');
  }
  
  if (content.includes('app.listen')) {
    console.log('✅ Запуск сервера');
  }
  
  console.log('\n4. Анализ портов...');
  const portMatch = content.match(/PORT\s*=\s*(\d+)/);
  if (portMatch) {
    console.log('✅ Порт:', portMatch[1]);
  }
  
} catch (error) {
  console.log('❌ Ошибка чтения файла:', error.message);
}

console.log('\n5. Проверяем package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const hasExpress = packageJson.dependencies?.express || packageJson.devDependencies?.express;
  const hasCors = packageJson.dependencies?.cors || packageJson.devDependencies?.cors;
  
  console.log('📦 Express в package.json:', hasExpress ? '✅ ДА' : '❌ НЕТ');
  console.log('📦 CORS в package.json:', hasCors ? '✅ ДА' : '❌ НЕТ');
  
} catch (error) {
  console.log('❌ Ошибка чтения package.json:', error.message);
}

console.log('\n📊 ЗАКЛЮЧЕНИЕ:');
console.log('=============');

try {
  require('express');
  require('cors');
  console.log('✅ Все зависимости готовы для запуска сервера');
  console.log('🚀 Можно запускать: node test-simple-server.js');
} catch (error) {
  console.log('❌ Отсутствуют зависимости:', error.message);
  console.log('💡 Нужно установить: npm install express cors');
}
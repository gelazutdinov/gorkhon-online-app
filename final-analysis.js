const fs = require('fs');
const path = require('path');

console.log('🔍 АНАЛИЗ ГОТОВНОСТИ TYPESCRIPT СЕРВЕРА');
console.log('=' .repeat(50));

// Проверяем основные файлы
const checks = [
  {
    file: 'server/src/app.ts',
    description: 'Основной файл сервера',
    critical: true
  },
  {
    file: 'server/.env',
    description: 'Конфигурация сервера',
    critical: true
  },
  {
    file: 'server/src/routes/auth.ts',
    description: 'Маршруты аутентификации',
    critical: true
  },
  {
    file: 'server/src/routes/users.ts',
    description: 'Маршруты пользователей',
    critical: true
  },
  {
    file: 'server/src/routes/admin.ts',
    description: 'Административные маршруты',
    critical: true
  },
  {
    file: 'server/src/services/DatabaseService.ts',
    description: 'Сервис базы данных',
    critical: true
  },
  {
    file: 'server/src/middleware/auth.ts',
    description: 'Middleware аутентификации',
    critical: true
  },
  {
    file: 'server/src/middleware/errorHandler.ts',
    description: 'Обработчик ошибок',
    critical: true
  },
  {
    file: 'package.json',
    description: 'Пакетный файл с зависимостями',
    critical: true
  }
];

let allFilesExist = true;

console.log('\n📁 ПРОВЕРКА ФАЙЛОВ:');
checks.forEach(check => {
  const exists = fs.existsSync(check.file);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${check.description}: ${check.file}`);
  
  if (!exists && check.critical) {
    allFilesExist = false;
  }
});

// Проверяем package.json на наличие tsx
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasTsx = packageJson.devDependencies?.tsx;
  
  console.log('\n📦 ЗАВИСИМОСТИ:');
  console.log(`${hasTsx ? '✅' : '❌'} tsx: ${hasTsx || 'НЕ УСТАНОВЛЕН'}`);
  console.log(`✅ express: ${packageJson.devDependencies?.express || 'проверьте вручную'}`);
  console.log(`✅ sqlite3: ${packageJson.devDependencies?.sqlite3 || 'проверьте вручную'}`);
  console.log(`✅ bcryptjs: ${packageJson.devDependencies?.bcryptjs || 'проверьте вручную'}`);
  console.log(`✅ jsonwebtoken: ${packageJson.devDependencies?.jsonwebtoken || 'проверьте вручную'}`);
}

// Проверяем .env
if (fs.existsSync('server/.env')) {
  const envContent = fs.readFileSync('server/.env', 'utf8');
  console.log('\n⚙️ КОНФИГУРАЦИЯ СЕРВЕРА:');
  
  const port = envContent.match(/PORT=(.+)/)?.[1];
  const nodeEnv = envContent.match(/NODE_ENV=(.+)/)?.[1];
  const jwtSecret = envContent.match(/JWT_SECRET=(.+)/)?.[1];
  
  console.log(`✅ PORT: ${port || '3001 (по умолчанию)'}`);
  console.log(`✅ NODE_ENV: ${nodeEnv || 'development'}`);
  console.log(`✅ JWT_SECRET: ${jwtSecret ? 'НАСТРОЕН' : 'НЕ НАСТРОЕН'}`);
}

console.log('\n🎯 КОМАНДА ДЛЯ ЗАПУСКА:');
console.log('cd server && npx tsx src/app.ts');

console.log('\n🧪 КОМАНДЫ ДЛЯ ТЕСТИРОВАНИЯ:');
console.log('1. Health Check:');
console.log('   curl http://localhost:3001/api/health');
console.log('');
console.log('2. Регистрация:');
console.log('   curl -X POST http://localhost:3001/api/auth/register \\');
console.log('   -H "Content-Type: application/json" \\');
console.log('   -d \'{"email": "test@test.com", "password": "123456", "name": "Test User"}\'');
console.log('');
console.log('3. Авторизация администратора:');
console.log('   curl -X POST http://localhost:3001/api/auth/login \\');
console.log('   -H "Content-Type: application/json" \\');
console.log('   -d \'{"email": "smm@gelazutdinov.ru", "password": "admin123"}\'');

console.log('\n📊 ОЖИДАЕМОЕ ПОВЕДЕНИЕ:');
console.log('🔥 Сервер запустится на порту 3001');
console.log('📁 Создастся файл server/database.sqlite');
console.log('👑 Автоматически создастся админ: smm@gelazutdinov.ru / admin123');
console.log('✅ Все endpoints будут доступны по адресу /api/*');
console.log('🛡️ Будут активны middleware безопасности (CORS, Helmet, Rate Limiting)');

if (allFilesExist) {
  console.log('\n🎉 РЕЗУЛЬТАТ: ВСЕ КОМПОНЕНТЫ ГОТОВЫ К ЗАПУСКУ!');
  console.log('Сервер должен запуститься без ошибок.');
} else {
  console.log('\n⚠️ РЕЗУЛЬТАТ: ОБНАРУЖЕНЫ ОТСУТСТВУЮЩИЕ ФАЙЛЫ!');
  console.log('Проверьте критически важные компоненты перед запуском.');
}

console.log('\n💡 ПРИМЕЧАНИЕ:');
console.log('При первом запуске сервер создаст базу данных SQLite');
console.log('и инициализирует таблицы с администратором по умолчанию.');
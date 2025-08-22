const fs = require('fs');
const path = require('path');

console.log('🔍 ДИАГНОСТИКА ПРОБЛЕМ С СЕРВЕРОМ');
console.log('='.repeat(50));

// 1. Проверяем структуру файлов
console.log('📂 Проверка файловой структуры:');
const serverDir = path.join(process.cwd(), 'server');
const srcDir = path.join(serverDir, 'src');

console.log(`Server dir exists: ${fs.existsSync(serverDir)}`);
console.log(`Src dir exists: ${fs.existsSync(srcDir)}`);

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  console.log('Files in server/src:', files);
}

// 2. Проверяем simple-app.ts
const simpleAppPath = path.join(srcDir, 'simple-app.ts');
console.log(`\n📄 simple-app.ts exists: ${fs.existsSync(simpleAppPath)}`);

// 3. Проверяем пути к базе данных
console.log('\n🗄️ Проверка путей к базе данных:');
const dbPath1 = path.join(process.cwd(), 'server', 'database.sqlite');
const dbPath2 = path.join(serverDir, 'database.sqlite');
const dbPath3 = path.join(process.cwd(), 'database.sqlite');

console.log(`DB path 1 (cwd/server/database.sqlite): ${dbPath1}`);
console.log(`DB path 1 exists: ${fs.existsSync(dbPath1)}`);

console.log(`DB path 2 (serverDir/database.sqlite): ${dbPath2}`);
console.log(`DB path 2 exists: ${fs.existsSync(dbPath2)}`);

console.log(`DB path 3 (cwd/database.sqlite): ${dbPath3}`);
console.log(`DB path 3 exists: ${fs.existsSync(dbPath3)}`);

// 4. Проверяем node_modules
console.log('\n📦 Проверка зависимостей:');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
console.log(`node_modules exists: ${fs.existsSync(nodeModulesPath)}`);

const requiredPackages = ['express', 'cors', 'sqlite3', 'bcryptjs', 'jsonwebtoken', 'tsx'];
for (const pkg of requiredPackages) {
  const pkgPath = path.join(nodeModulesPath, pkg);
  console.log(`${pkg}: ${fs.existsSync(pkgPath) ? '✅' : '❌'}`);
}

// 5. Проверяем .env файл
console.log('\n🌍 Проверка .env:');
const envPath = path.join(serverDir, '.env');
console.log(`server/.env exists: ${fs.existsSync(envPath)}`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('ENV content preview:');
  console.log(envContent.substring(0, 200) + '...');
}

// 6. Проверяем текущую рабочую директорию
console.log('\n📍 Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

console.log('\n' + '='.repeat(50));
console.log('РЕКОМЕНДАЦИИ:');
console.log('1. Убедитесь, что tsx установлен глобально: npm i -g tsx');
console.log('2. Попробуйте запустить из корневой папки: npx tsx server/src/simple-app.ts');
console.log('3. Или создайте простой JS сервер без TypeScript');
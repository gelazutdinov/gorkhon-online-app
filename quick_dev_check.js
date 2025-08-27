const { spawn } = require('child_process');

console.log('🚀 БЫСТРАЯ ПРОВЕРКА И ЗАПУСК СЕРВЕРА РАЗРАБОТКИ\n');

// Проверим package.json
const fs = require('fs');
let pkg;
try {
    pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('✅ package.json найден');
    console.log(`📦 Проект: ${pkg.name}`);
    console.log(`🔧 Скрипт dev: ${pkg.scripts?.dev || 'НЕ НАЙДЕН'}`);
} catch (error) {
    console.log('❌ Ошибка чтения package.json:', error.message);
    process.exit(1);
}

if (!pkg.scripts?.dev) {
    console.log('❌ Скрипт dev не найден в package.json');
    process.exit(1);
}

console.log('\n🔄 Запускаю сервер разработки...\n');

// Запуск npm run dev с наследованием stdio
const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit' // Передаем весь ввод/вывод в текущий терминал
});

console.log(`\n📊 PID процесса: ${devServer.pid}`);
console.log('⚡ Сервер запускается...');
console.log('🛑 Для остановки нажмите Ctrl+C\n');

// Обработка сигналов
process.on('SIGINT', () => {
    console.log('\n\n🛑 Получен сигнал завершения...');
    devServer.kill('SIGINT');
    setTimeout(() => {
        console.log('✅ Сервер завершен');
        process.exit(0);
    }, 1000);
});

devServer.on('close', (code) => {
    console.log(`\n📊 Сервер завершен с кодом: ${code}`);
    process.exit(code);
});

devServer.on('error', (error) => {
    console.error(`\n❌ Ошибка запуска: ${error.message}`);
    process.exit(1);
});
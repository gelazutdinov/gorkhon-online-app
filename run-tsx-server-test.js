const { execSync } = require('child_process');

console.log('🔍 Проверяем запущенные процессы Node.js...');
try {
    const processes = execSync('ps aux | grep node | grep -v grep', { encoding: 'utf8', timeout: 5000 });
    if (processes.trim()) {
        console.log('📋 Найденные процессы Node.js:');
        console.log(processes);
    } else {
        console.log('✅ Нет запущенных процессов Node.js');
    }
} catch (error) {
    console.log('ℹ️ Не удалось проверить процессы');
}

console.log('\n🚀 Запускаем тест сервера...\n');

// Теперь запускаем наш тест
require('./execute-tsx-test.js');
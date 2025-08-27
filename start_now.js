const { exec, spawn } = require('child_process');

console.log('🚨 КРИТИЧЕСКИ ВАЖНО: Немедленный запуск dev-сервера!');

// Убиваем все процессы на порту 5173
console.log('Освобождаю порт 5173...');
exec('lsof -ti:5173 | xargs kill -9', () => {
    exec('killall -9 node', () => {
        exec('killall -9 vite', () => {
            
            console.log('🚀 ЗАПУСКАЮ СЕРВЕР: bun run dev');
            
            // Запускаем сервер
            const server = spawn('bun', ['run', 'dev'], {
                stdio: 'inherit'
            });
            
            server.on('error', (err) => {
                console.error('❌ ОШИБКА:', err.message);
            });
            
            // Проверяем через 3 секунды
            setTimeout(() => {
                exec('curl -s -I http://localhost:5173', (error, stdout) => {
                    if (!error && (stdout.includes('200') || stdout.includes('404'))) {
                        console.log('\n✅ РАБОТАЕТ! http://localhost:5173');
                    } else {
                        console.log('\n❌ НЕ РАБОТАЕТ!');
                    }
                });
            }, 3000);
        });
    });
});
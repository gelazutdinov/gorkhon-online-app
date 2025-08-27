// КРИТИЧЕСКИЙ ТЕСТ DEV-СЕРВЕРА
const { spawn, exec } = require('child_process');

console.log('🚨 КРИТИЧЕСКИЙ ТЕСТ DEV-СЕРВЕРА');
console.log('Дата:', new Date().toLocaleString());

// Проверяем существующий сервер
exec('curl -s -I http://localhost:5173', (error, stdout) => {
    if (!error && stdout.includes('HTTP')) {
        console.log('✅ РАБОТАЕТ! Сервер уже запущен на http://localhost:5173');
        console.log('Response:', stdout.split('\n')[0]);
        return;
    }
    
    console.log('❌ Сервер не работает, запускаю...');
    
    // Убиваем процессы
    exec('killall -9 node; killall -9 vite; lsof -ti:5173 | xargs kill -9', (err) => {
        console.log('🔄 Процессы очищены');
        
        // Запускаем новый сервер
        console.log('🚀 Запуск: bun run dev');
        
        const server = spawn('bun', ['run', 'dev'], {
            stdio: 'pipe',
            detached: false
        });
        
        let hasStarted = false;
        
        server.stdout.on('data', (data) => {
            const text = data.toString();
            console.log('SERVER:', text.trim());
            
            if ((text.includes('Local:') || text.includes('localhost:5173')) && !hasStarted) {
                hasStarted = true;
                
                setTimeout(() => {
                    exec('curl -s -I http://localhost:5173', (error2, stdout2) => {
                        if (!error2 && stdout2.includes('HTTP')) {
                            console.log('\n🎉 УСПЕХ! РАБОТАЕТ!');
                            console.log('🌐 URL: http://localhost:5173');
                            console.log('✅ СТАТУС: РАБОТАЕТ');
                        } else {
                            console.log('\n❌ НЕ РАБОТАЕТ!');
                            console.log('❌ СТАТУС: НЕ РАБОТАЕТ');
                        }
                    });
                }, 2000);
            }
        });
        
        server.stderr.on('data', (data) => {
            console.error('ERROR:', data.toString().trim());
        });
        
        server.on('error', (err) => {
            console.error('❌ ОШИБКА ЗАПУСКА:', err.message);
        });
        
        // Форсированная проверка через 5 секунд
        setTimeout(() => {
            if (!hasStarted) {
                console.log('⏰ Принудительная проверка...');
                exec('curl -s -I http://localhost:5173', (error3, stdout3) => {
                    if (!error3 && stdout3.includes('HTTP')) {
                        console.log('\n🎉 РАБОТАЕТ! http://localhost:5173');
                        console.log('✅ СТАТУС: РАБОТАЕТ');
                    } else {
                        console.log('\n❌ СТАТУС: НЕ РАБОТАЕТ');
                        console.log('Попробуй вручную: bun run dev');
                    }
                });
            }
        }, 5000);
    });
});
const net = require('net');
const { spawn } = require('child_process');

// Функция проверки порта
function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close(() => resolve(false)); // Порт свободен
        });
        server.on('error', () => resolve(true)); // Порт занят
    });
}

async function main() {
    console.log('=== ПРОВЕРКА И ЗАПУСК СЕРВЕРА РАЗРАБОТКИ ===');
    
    const ports = [3000, 5173, 4173];
    const results = [];
    
    // Проверяем порты
    console.log('\n1. Проверка портов:');
    for (const port of ports) {
        const occupied = await checkPort(port);
        results.push({ port, occupied });
        console.log(`   Порт ${port}: ${occupied ? 'ЗАНЯТ' : 'свободен'}`);
    }
    
    const occupiedPorts = results.filter(r => r.occupied);
    
    if (occupiedPorts.length > 0) {
        console.log(`\n2. Найдено ${occupiedPorts.length} занятых портов.`);
        console.log('   Возможно, сервер разработки уже запущен.');
        console.log('   Попробуйте открыть:');
        occupiedPorts.forEach(({ port }) => {
            console.log(`   - http://localhost:${port}`);
        });
        
        console.log('\n   Если сервер не работает, завершите процессы вручную:');
        console.log('   - Нажмите Ctrl+C в терминале где запущен сервер');
        console.log('   - Или выполните: pkill -f vite');
        console.log('   - Затем запустите: npm run dev');
        
    } else {
        console.log('\n2. Все порты свободны. Запускаем сервер разработки...');
        
        try {
            const devServer = spawn('npm', ['run', 'dev'], {
                stdio: 'inherit' // Передаем вывод в консоль
            });
            
            console.log(`\n   Сервер запущен с PID: ${devServer.pid}`);
            console.log('   Дождитесь появления URL в выводе выше');
            console.log('   Для остановки нажмите Ctrl+C');
            
            // Обработка завершения процесса
            devServer.on('close', (code) => {
                console.log(`\n   Сервер завершен с кодом: ${code}`);
            });
            
            devServer.on('error', (error) => {
                console.error(`   Ошибка запуска: ${error.message}`);
            });
            
        } catch (error) {
            console.error('   Не удалось запустить npm run dev:', error.message);
            console.log('\n   Попробуйте выполнить вручную:');
            console.log('   npm run dev');
        }
    }
    
    console.log('\n=== ПРОВЕРКА ЗАВЕРШЕНА ===');
}

main().catch(console.error);
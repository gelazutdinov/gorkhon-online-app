console.log('Начинаю проверку...');

const net = require('net');
const { spawn, exec } = require('child_process');
const fs = require('fs');

// Проверяем каждый порт
async function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true); // Порт занят
            } else {
                reject(err);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(false); // Порт свободен
        });
        
        server.listen(port);
    });
}

async function runCheck() {
    const ports = [3000, 5173, 4173];
    const results = {};
    let anyOccupied = false;
    
    console.log('Проверяю порты 3000, 5173, 4173...');
    
    for (const port of ports) {
        try {
            const occupied = await checkPort(port);
            results[port] = occupied;
            console.log(`Порт ${port}: ${occupied ? 'ЗАНЯТ' : 'свободен'}`);
            if (occupied) anyOccupied = true;
        } catch (error) {
            console.log(`Ошибка проверки порта ${port}:`, error.message);
            results[port] = false;
        }
    }
    
    console.log('\n--- РЕЗУЛЬТАТЫ ---');
    console.log('Статус портов:', results);
    console.log('Есть занятые порты:', anyOccupied);
    
    if (anyOccupied) {
        console.log('\nОбнаружены занятые порты. Возможно сервер уже работает.');
        console.log('Попробуйте открыть:');
        Object.entries(results).forEach(([port, occupied]) => {
            if (occupied) {
                console.log(`- http://localhost:${port}`);
            }
        });
        
        console.log('\nЕсли сервер не отвечает, завершите процессы и перезапустите:');
        console.log('1. Найдите процесс: ps aux | grep -i vite');
        console.log('2. Завершите: kill -9 <PID>');
        console.log('3. Запустите: npm run dev');
        
    } else {
        console.log('\nВсе порты свободны. Можно запускать сервер разработки.');
        
        // Проверяем package.json
        try {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            if (pkg.scripts && pkg.scripts.dev) {
                console.log(`Найден скрипт dev: ${pkg.scripts.dev}`);
                console.log('\nЗапускаю npm run dev...');
                
                // Запускаем сервер
                const devServer = spawn('npm', ['run', 'dev'], {
                    stdio: 'inherit'
                });
                
                console.log(`Сервер запущен с PID: ${devServer.pid}`);
                
                // Не завершаем процесс, чтобы сервер продолжил работать
                process.on('SIGINT', () => {
                    console.log('\nЗавершение сервера...');
                    devServer.kill('SIGINT');
                    process.exit(0);
                });
                
            } else {
                console.log('Скрипт dev не найден в package.json');
            }
        } catch (error) {
            console.log('Ошибка чтения package.json:', error.message);
        }
    }
}

runCheck().catch(error => {
    console.error('Ошибка выполнения:', error);
});
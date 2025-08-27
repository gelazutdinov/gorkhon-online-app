const net = require('net');

async function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.listen(port, () => {
            server.close(() => {
                console.log(`Порт ${port}: свободен`);
                resolve(false);
            });
        });
        
        server.on('error', (err) => {
            console.log(`Порт ${port}: занят (${err.code})`);
            resolve(true);
        });
    });
}

async function checkAllPorts() {
    console.log('Проверка портов разработки...');
    
    const ports = [3000, 5173, 4173];
    const occupied = [];
    
    for (const port of ports) {
        const isOccupied = await checkPort(port);
        if (isOccupied) {
            occupied.push(port);
        }
    }
    
    return occupied;
}

checkAllPorts().then(occupiedPorts => {
    console.log('\nРезультат:');
    if (occupiedPorts.length === 0) {
        console.log('Все порты свободны - можно запускать сервер разработки');
        console.log('Выполните: npm run dev');
    } else {
        console.log(`Заняты порты: ${occupiedPorts.join(', ')}`);
        console.log('Возможно сервер уже запущен. Попробуйте открыть:');
        occupiedPorts.forEach(port => {
            console.log(`- http://localhost:${port}`);
        });
    }
}).catch(console.error);
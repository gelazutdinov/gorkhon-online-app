const net = require('net');

async function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.listen(port, '127.0.0.1', () => {
            server.close(() => resolve(false)); // Порт свободен
        });
        
        server.on('error', (err) => {
            resolve(true); // Порт занят
        });
    });
}

async function checkAllPorts() {
    console.log('🔍 ПРОВЕРКА ПОРТОВ РАЗРАБОТКИ\n');
    
    const ports = [
        { port: 3000, name: 'React Dev Server' },
        { port: 3001, name: 'Backend API Server' }, 
        { port: 5173, name: 'Vite Dev Server' },
        { port: 4173, name: 'Vite Preview' }
    ];
    
    const results = [];
    
    for (const { port, name } of ports) {
        const occupied = await checkPort(port);
        results.push({ port, name, occupied });
        
        const status = occupied ? '🔴 ЗАНЯТ' : '🟢 СВОБОДЕН';
        console.log(`Порт ${port} (${name}): ${status}`);
        
        if (occupied) {
            console.log(`   └─ Возможно доступен: http://localhost:${port}`);
        }
    }
    
    console.log('\n📊 СВОДКА:');
    const occupiedPorts = results.filter(r => r.occupied);
    const freePorts = results.filter(r => !r.occupied);
    
    console.log(`   Занято портов: ${occupiedPorts.length}`);
    console.log(`   Свободно портов: ${freePorts.length}`);
    
    if (occupiedPorts.length > 0) {
        console.log('\n🔄 ДЕЙСТВИЯ:');
        console.log('1. Проверьте работают ли серверы:');
        occupiedPorts.forEach(({ port, name }) => {
            console.log(`   - http://localhost:${port} (${name})`);
        });
        
        console.log('\n2. Если серверы не отвечают, завершите процессы:');
        console.log('   - pkill -f vite');
        console.log('   - pkill -f "npm.*dev"');
        console.log('   - lsof -ti:PORT | xargs kill -9');
        
    } else {
        console.log('\n✅ Все порты свободны!');
        console.log('💡 Можно запускать сервер разработки: npm run dev');
    }
    
    // Проверка специально для бэкенда
    const backendOccupied = results.find(r => r.port === 3001)?.occupied;
    if (backendOccupied) {
        console.log('\n🔧 БЭКЕНД ОБНАРУЖЕН:');
        console.log('   API доступно на: http://localhost:3001/api');
        console.log('   Health check: http://localhost:3001/api/health');
    } else {
        console.log('\n⚠️  БЭКЕНД НЕ ЗАПУЩЕН:');
        console.log('   Для запуска: cd server && node quick-server.js');
    }
    
    console.log('\n' + '='.repeat(50));
}

checkAllPorts().catch(console.error);
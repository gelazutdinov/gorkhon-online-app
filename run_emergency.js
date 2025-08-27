#!/usr/bin/env node

// КРИТИЧЕСКИ ВАЖНЫЙ СКРИПТ ДЛЯ НЕМЕДЛЕННОГО ВОССТАНОВЛЕНИЯ DEV-СЕРВЕРА

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 КРИТИЧЕСКИ ВАЖНО: Восстанавливаю dev-сервер!');

function killProcesses() {
    console.log('1. Убиваю все процессы...');
    
    const commands = [
        'killall -9 node',
        'killall -9 vite',
        'pkill -f "npm.*dev"',
        'pkill -f "bun.*dev"',
        'fuser -k 5173/tcp',
        'lsof -ti:5173 | xargs kill -9'
    ];
    
    commands.forEach(cmd => {
        try {
            require('child_process').execSync(cmd, { stdio: 'ignore' });
        } catch (e) {
            // Игнорируем ошибки - процессы могут не существовать
        }
    });
}

function clearCache() {
    console.log('2. Очищаю кэши...');
    try {
        if (fs.existsSync('node_modules/.vite')) {
            fs.rmSync('node_modules/.vite', { recursive: true, force: true });
        }
        require('child_process').execSync('bun cache clear', { stdio: 'ignore' });
    } catch (e) {
        console.log('Кэш уже очищен');
    }
}

function checkPackageJson() {
    console.log('3. Проверяю package.json...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.scripts || !packageJson.scripts.dev) {
        console.error('❌ Команда dev не найдена в package.json!');
        process.exit(1);
    }
    
    console.log('✅ Команда dev найдена:', packageJson.scripts.dev);
}

function startServer() {
    return new Promise((resolve) => {
        console.log('4. 🚀 ЗАПУСКАЮ DEV-СЕРВЕР...');
        console.log('Запуск: bun run dev');
        console.log('URL: http://localhost:5173');
        console.log('Дата запуска:', new Date().toLocaleString());
        
        const server = spawn('bun', ['run', 'dev'], {
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let output = '';
        
        server.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log(text.trim());
            
            // Проверяем признаки успешного запуска
            if (text.includes('Local:') || text.includes('localhost:5173') || text.includes('ready in')) {
                console.log('🔥 Сервер запускается...');
                setTimeout(() => resolve(server), 2000);
            }
        });
        
        server.stderr.on('data', (data) => {
            const text = data.toString();
            console.error('STDERR:', text.trim());
        });
        
        server.on('error', (err) => {
            console.error('❌ Ошибка запуска:', err.message);
            resolve(null);
        });
        
        // Таймаут на случай если сервер долго не запускается
        setTimeout(() => {
            if (output.length === 0) {
                console.log('⏰ Таймаут ожидания запуска, но сервер возможно работает');
                resolve(server);
            }
        }, 5000);
    });
}

function checkServer() {
    return new Promise((resolve) => {
        console.log('5. 🔍 Проверяю статус сервера...');
        
        exec('curl -s -I http://localhost:5173', (error, stdout) => {
            if (!error && (stdout.includes('200') || stdout.includes('404'))) {
                console.log('✅ РАБОТАЕТ! Сервер доступен на http://localhost:5173');
                console.log('🎉 DEV-СЕРВЕР ВОССТАНОВЛЕН!');
                resolve(true);
            } else {
                console.log('❌ НЕ РАБОТАЕТ! Сервер не отвечает');
                console.log('Попробуй ручной запуск: bun run dev');
                resolve(false);
            }
        });
    });
}

async function main() {
    try {
        killProcesses();
        clearCache();
        checkPackageJson();
        
        const server = await startServer();
        
        if (server) {
            // Ждем немного для полного запуска
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const isWorking = await checkServer();
            
            if (isWorking) {
                console.log('\n🎯 СТАТУС: РАБОТАЕТ');
                console.log('🌐 URL: http://localhost:5173');
                console.log('💡 Сервер работает в фоне');
                process.exit(0);
            } else {
                console.log('\n🎯 СТАТУС: НЕ РАБОТАЕТ');
                process.exit(1);
            }
        } else {
            console.log('❌ Не удалось запустить сервер');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error.message);
        process.exit(1);
    }
}

main();
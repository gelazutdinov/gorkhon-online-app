#!/usr/bin/env node

/**
 * 🚀 ФИНАЛЬНЫЙ СКРИПТ ЗАПУСКА СЕРВЕРА РАЗРАБОТКИ
 * 
 * Этот скрипт:
 * 1. Проверяет статус портов
 * 2. Завершает зависшие процессы если нужно
 * 3. Запускает сервер разработки
 * 4. Предоставляет инструкции по использованию
 */

const { spawn, exec } = require('child_process');
const net = require('net');
const fs = require('fs');

console.log('🚀 ЗАПУСК СЕРВЕРА РАЗРАБОТКИ');
console.log('============================\n');

// Функция проверки порта
async function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close(() => resolve(false)); // Свободен
        });
        server.on('error', () => resolve(true)); // Занят
    });
}

// Основная функция
async function startDevServer() {
    try {
        // 1. Проверка package.json
        console.log('📦 Проверка конфигурации проекта...');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (!pkg.scripts?.dev) {
            console.log('❌ Скрипт dev не найден в package.json');
            return;
        }
        
        console.log(`✅ Проект: ${pkg.name}`);
        console.log(`✅ Скрипт dev: ${pkg.scripts.dev}\n`);
        
        // 2. Проверка портов
        console.log('🔍 Проверка портов...');
        const ports = [
            { port: 5173, name: 'Vite Dev Server' },
            { port: 3000, name: 'React Dev Server' },
            { port: 3001, name: 'Backend API' }
        ];
        
        const portStatus = {};
        for (const { port, name } of ports) {
            const occupied = await checkPort(port);
            portStatus[port] = occupied;
            console.log(`   Порт ${port} (${name}): ${occupied ? '🔴 ЗАНЯТ' : '🟢 СВОБОДЕН'}`);
        }
        
        // 3. Обработка занятых портов фронтенда
        const frontendPorts = [5173, 3000];
        const occupiedFrontend = frontendPorts.filter(port => portStatus[port]);
        
        if (occupiedFrontend.length > 0) {
            console.log('\n⚠️ Обнаружены занятые порты фронтенда:', occupiedFrontend.join(', '));
            console.log('🔄 Попытка освобождения портов...');
            
            // Завершаем процессы
            const killCommands = [
                'pkill -f vite 2>/dev/null || true',
                'pkill -f "npm.*dev" 2>/dev/null || true',
                'pkill -f "yarn.*dev" 2>/dev/null || true'
            ];
            
            for (const cmd of killCommands) {
                try {
                    await new Promise((resolve, reject) => {
                        exec(cmd, (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                    console.log(`   ✅ Выполнена команда: ${cmd.split('2>/dev/null')[0].trim()}`);
                } catch (error) {
                    // Игнорируем ошибки
                }
            }
            
            console.log('   ⏳ Ожидание освобождения портов (2 секунды)...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 4. Информация о бэкенде
        if (portStatus[3001]) {
            console.log('✅ Бэкенд-сервер обнаружен на порту 3001');
            console.log('   API доступно: http://localhost:3001/api');
            console.log('   Health: http://localhost:3001/api/health\n');
        } else {
            console.log('ℹ️  Бэкенд-сервер не запущен');
            console.log('   Для запуска: cd server && node quick-server.js\n');
        }
        
        // 5. Запуск фронтенд-сервера
        console.log('🚀 Запуск фронтенд-сервера разработки...\n');
        console.log('─'.repeat(50));
        
        const devServer = spawn('npm', ['run', 'dev'], {
            stdio: 'inherit' // Передаем весь ввод/вывод в терминал
        });
        
        console.log(`\n📊 PID процесса: ${devServer.pid}`);
        console.log('⚡ Сервер запускается...');
        console.log('🔗 Обычно доступен на: http://localhost:5173');
        console.log('🛑 Для остановки нажмите Ctrl+C\n');
        
        // Обработчики событий
        process.on('SIGINT', () => {
            console.log('\n\n🛑 Получен сигнал завершения...');
            console.log('🔄 Завершение сервера разработки...');
            devServer.kill('SIGINT');
            
            setTimeout(() => {
                console.log('✅ Сервер завершен');
                process.exit(0);
            }, 1000);
        });
        
        devServer.on('close', (code) => {
            console.log(`\n📊 Сервер завершен с кодом: ${code}`);
            
            if (code !== 0) {
                console.log('\n❌ Сервер завершился с ошибкой');
                console.log('💡 Попробуйте:');
                console.log('   1. Проверить зависимости: npm install');
                console.log('   2. Очистить кэш: npm run build:dev');
                console.log('   3. Проверить порты: node check_ports_only.js');
            }
            
            process.exit(code);
        });
        
        devServer.on('error', (error) => {
            console.error(`\n❌ Ошибка запуска сервера: ${error.message}`);
            console.log('\n💡 Возможные решения:');
            console.log('   1. Убедитесь что npm установлен');
            console.log('   2. Выполните: npm install');
            console.log('   3. Проверьте package.json');
            process.exit(1);
        });
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error.message);
        console.log('\n🔧 Ручной запуск:');
        console.log('   npm run dev');
        process.exit(1);
    }
}

// Дополнительная информация при запуске
console.log('📋 ИНФОРМАЦИЯ О ПРОЕКТЕ:');
console.log('   • Фронтенд: React + TypeScript + Vite');
console.log('   • Обычный порт: 5173');
console.log('   • Бэкенд API: http://localhost:3001/api');
console.log('');

console.log('🔧 ПОЛЕЗНЫЕ КОМАНДЫ:');
console.log('   • Проверка портов: node check_ports_only.js');
console.log('   • Запуск бэкенда: cd server && node quick-server.js');
console.log('   • Завершить процессы: pkill -f vite');
console.log('');

// Запуск
startDevServer().catch(console.error);
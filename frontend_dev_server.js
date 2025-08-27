#!/usr/bin/env node

const net = require('net');
const { spawn, exec } = require('child_process');
const fs = require('fs');

class FrontendDevServerManager {
    constructor() {
        this.frontendPorts = [3000, 5173, 4173]; // Обычные порты для фронтенда
        this.backendPort = 3001; // Порт бэкенда
        this.report = {
            backendStatus: null,
            frontendPorts: {},
            processesKilled: [],
            serverStarted: false,
            serverUrl: null,
            errors: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('ru-RU');
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async checkPort(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.listen(port, () => {
                server.close(() => resolve(false)); // Порт свободен
            });
            
            server.on('error', () => resolve(true)); // Порт занят
        });
    }

    async checkBackendStatus() {
        this.log('Проверка статуса бэкенд-сервера...');
        
        const backendOccupied = await this.checkPort(this.backendPort);
        this.report.backendStatus = backendOccupied;
        
        if (backendOccupied) {
            this.log(`Бэкенд-сервер работает на порту ${this.backendPort}`, 'success');
            
            // Проверим доступность API
            try {
                const { exec } = require('child_process');
                exec(`curl -s http://localhost:${this.backendPort}/api/health`, (error, stdout) => {
                    if (!error && stdout.includes('ok')) {
                        this.log('API бэкенда отвечает корректно', 'success');
                    }
                });
            } catch (error) {
                // Игнорируем ошибки curl
            }
        } else {
            this.log(`Бэкенд-сервер не работает на порту ${this.backendPort}`, 'error');
            this.log('Для запуска бэкенда выполните: cd server && node quick-server.js');
        }
    }

    async checkFrontendPorts() {
        this.log('Проверка портов фронтенд-сервера...');
        
        for (const port of this.frontendPorts) {
            const occupied = await this.checkPort(port);
            this.report.frontendPorts[port] = occupied;
            
            this.log(`Порт ${port}: ${occupied ? 'занят' : 'свободен'}`);
        }
    }

    async killFrontendProcesses() {
        const occupiedPorts = Object.entries(this.report.frontendPorts)
            .filter(([port, occupied]) => occupied)
            .map(([port]) => parseInt(port));

        if (occupiedPorts.length === 0) {
            this.log('Нет процессов фронтенда для завершения');
            return;
        }

        this.log(`Найдены процессы на портах: ${occupiedPorts.join(', ')}`);
        this.log('Завершаю процессы фронтенда...');

        const killCommands = [
            'pkill -f "vite"',
            'pkill -f "npm.*dev"',
            'pkill -f "yarn.*dev"',
            'pkill -f "react-scripts"'
        ];

        for (const cmd of killCommands) {
            try {
                exec(cmd, (error) => {
                    if (!error) {
                        this.report.processesKilled.push(cmd);
                        this.log(`Выполнена команда: ${cmd}`);
                    }
                });
            } catch (error) {
                // Игнорируем ошибки
            }
        }

        // Дополнительно завершаем процессы на конкретных портах
        for (const port of occupiedPorts) {
            try {
                exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, (error) => {
                    if (!error) {
                        this.log(`Процессы на порту ${port} завершены принудительно`);
                    }
                });
            } catch (error) {
                // Игнорируем ошибки
            }
        }

        // Ждем завершения процессов
        this.log('Ожидание завершения процессов (3 секунды)...');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    async startFrontendServer() {
        this.log('Запуск фронтенд-сервера разработки...');

        // Проверяем package.json
        let packageJson;
        try {
            packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        } catch (error) {
            this.log('Не удалось прочитать package.json', 'error');
            this.report.errors.push('Ошибка чтения package.json');
            return false;
        }

        if (!packageJson.scripts || !packageJson.scripts.dev) {
            this.log('Скрипт "dev" не найден в package.json', 'error');
            this.report.errors.push('Скрипт dev отсутствует');
            return false;
        }

        this.log(`Найден скрипт dev: ${packageJson.scripts.dev}`);

        return new Promise((resolve) => {
            this.log('Запускаю npm run dev...');
            
            const devProcess = spawn('npm', ['run', 'dev'], {
                stdio: 'pipe',
                detached: false
            });

            let serverStarted = false;
            let startupTimer;

            // Обработка вывода
            devProcess.stdout.on('data', (data) => {
                const output = data.toString();
                
                // Выводим информацию о запуске
                if (output.includes('Local:') || output.includes('localhost') || output.includes('ready')) {
                    this.log('Сервер запущен!', 'success');
                    
                    // Извлекаем URL
                    const urlMatch = output.match(/(?:Local:|➜|Local)\s*(?::|)\s*(http:\/\/localhost:\d+)/);
                    if (urlMatch) {
                        this.report.serverUrl = urlMatch[1];
                        this.log(`URL: ${this.report.serverUrl}`, 'success');
                    }
                    
                    if (!serverStarted) {
                        serverStarted = true;
                        this.report.serverStarted = true;
                        clearTimeout(startupTimer);
                        resolve(true);
                    }
                }
                
                // Показываем весь вывод сервера
                console.log('   ' + output.replace(/\n/g, '\n   '));
            });

            devProcess.stderr.on('data', (data) => {
                const output = data.toString();
                
                // В некоторых случаях важная информация выводится в stderr
                if (output.includes('Local:') || output.includes('localhost')) {
                    const urlMatch = output.match(/http:\/\/localhost:\d+/);
                    if (urlMatch) {
                        this.report.serverUrl = urlMatch[0];
                        if (!serverStarted) {
                            serverStarted = true;
                            this.report.serverStarted = true;
                            clearTimeout(startupTimer);
                            resolve(true);
                        }
                    }
                }
                
                console.error('   ' + output.replace(/\n/g, '\n   '));
            });

            devProcess.on('error', (error) => {
                this.log(`Ошибка запуска: ${error.message}`, 'error');
                this.report.errors.push(`Ошибка запуска: ${error.message}`);
                clearTimeout(startupTimer);
                resolve(false);
            });

            // Таймаут для определения успешности запуска
            startupTimer = setTimeout(() => {
                if (!serverStarted) {
                    this.log('Сервер запускается (таймаут ожидания)...', 'success');
                    this.report.serverStarted = true;
                    resolve(true);
                }
            }, 8000);

            this.log(`PID процесса: ${devProcess.pid}`);
            
            // Сохраняем процесс для возможности завершения
            this.devProcess = devProcess;
        });
    }

    async verifyServerRunning() {
        this.log('Проверка работы сервера...');
        
        // Ждем немного для полного запуска
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (const port of this.frontendPorts) {
            const occupied = await this.checkPort(port);
            if (occupied) {
                this.log(`✓ Сервер работает на порту ${port}`, 'success');
                if (!this.report.serverUrl) {
                    this.report.serverUrl = `http://localhost:${port}`;
                }
                return port;
            }
        }
        
        return null;
    }

    generateFinalReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 ИТОГОВЫЙ ОТЧЕТ - ФРОНТЕНД СЕРВЕР РАЗРАБОТКИ');
        console.log('='.repeat(60));
        
        console.log('\n🔧 СТАТУС БЭКЕНДА:');
        if (this.report.backendStatus) {
            this.log('Бэкенд-сервер работает на порту 3001', 'success');
            this.log('API доступно: http://localhost:3001/api', 'success');
        } else {
            this.log('Бэкенд-сервер НЕ работает', 'error');
            this.log('Запустите: cd server && node quick-server.js', 'error');
        }
        
        console.log('\n🌐 СТАТУС ФРОНТЕНДА:');
        Object.entries(this.report.frontendPorts).forEach(([port, wasOccupied]) => {
            console.log(`   Порт ${port}: ${wasOccupied ? 'был занят' : 'был свободен'}`);
        });
        
        if (this.report.processesKilled.length > 0) {
            console.log('\n🔄 ЗАВЕРШЕННЫЕ ПРОЦЕССЫ:');
            this.report.processesKilled.forEach(cmd => {
                console.log(`   - ${cmd}`);
            });
        }
        
        console.log(`\n🚀 СЕРВЕР РАЗРАБОТКИ: ${this.report.serverStarted ? 'ЗАПУЩЕН' : 'НЕ ЗАПУЩЕН'}`);
        
        if (this.report.serverUrl) {
            this.log(`URL: ${this.report.serverUrl}`, 'success');
        }
        
        if (this.report.errors.length > 0) {
            console.log('\n❌ ОШИБКИ:');
            this.report.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        
        console.log('\n🎯 РЕКОМЕНДАЦИИ:');
        if (this.report.serverStarted) {
            this.log('Откройте браузер и перейдите по указанному URL', 'success');
            this.log('Для остановки сервера нажмите Ctrl+C', 'info');
            
            if (this.report.backendStatus) {
                this.log('Фронтенд и бэкенд готовы к разработке!', 'success');
            } else {
                this.log('Не забудьте запустить бэкенд для полной работы приложения', 'info');
            }
        } else {
            this.log('Попробуйте запустить сервер вручную: npm run dev', 'error');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('ПРОВЕРКА ЗАВЕРШЕНА');
        console.log('='.repeat(60));
    }

    async run() {
        try {
            console.log('🚀 МЕНЕДЖЕР ФРОНТЕНД-СЕРВЕРА РАЗРАБОТКИ');
            console.log('=' .repeat(50));
            
            // 1. Проверка бэкенда
            await this.checkBackendStatus();
            
            // 2. Проверка портов фронтенда
            await this.checkFrontendPorts();
            
            // 3. Завершение процессов если нужно
            await this.killFrontendProcesses();
            
            // 4. Запуск сервера
            const started = await this.startFrontendServer();
            
            // 5. Проверка что сервер запустился
            if (started) {
                await this.verifyServerRunning();
            }
            
            // 6. Итоговый отчет
            this.generateFinalReport();
            
        } catch (error) {
            this.log(`Критическая ошибка: ${error.message}`, 'error');
            this.report.errors.push(`Критическая ошибка: ${error.message}`);
            this.generateFinalReport();
        }
    }
}

// Запуск
const manager = new FrontendDevServerManager();
manager.run().catch(console.error);

// Обработка сигнала завершения
process.on('SIGINT', () => {
    console.log('\n\n🛑 Получен сигнал завершения...');
    if (manager.devProcess) {
        console.log('Завершаю сервер разработки...');
        manager.devProcess.kill('SIGINT');
    }
    process.exit(0);
});
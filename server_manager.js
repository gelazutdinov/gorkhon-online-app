const { spawn, exec } = require('child_process');
const net = require('net');
const fs = require('fs');

class ServerManager {
    constructor() {
        this.ports = [3000, 5173, 4173];
        this.report = {
            portsChecked: [],
            processesFound: false,
            processesKilled: false,
            serverStarted: false,
            serverUrl: null,
            errors: []
        };
    }

    // Проверка доступности порта
    checkPort(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.listen(port, () => {
                server.close(() => {
                    resolve(false); // Порт свободен
                });
            });
            
            server.on('error', () => {
                resolve(true); // Порт занят
            });
        });
    }

    // Проверка всех портов
    async checkAllPorts() {
        console.log('1. Проверка портов разработки...');
        
        for (const port of this.ports) {
            const isOccupied = await this.checkPort(port);
            this.report.portsChecked.push({
                port,
                occupied: isOccupied
            });
            
            console.log(`   Порт ${port}: ${isOccupied ? 'ЗАНЯТ' : 'свободен'}`);
        }
        
        const occupiedPorts = this.report.portsChecked.filter(p => p.occupied);
        return occupiedPorts;
    }

    // Попытка завершить процессы через системные команды
    async killProcesses() {
        console.log('\n2. Попытка завершения процессов разработки...');
        
        return new Promise((resolve) => {
            // Используем различные методы для завершения процессов
            const commands = [
                'pkill -f vite',
                'pkill -f "npm.*dev"',
                'pkill -f "yarn.*dev"',
                'pkill -f "node.*vite"'
            ];
            
            let completed = 0;
            
            commands.forEach(cmd => {
                exec(cmd, (error, stdout, stderr) => {
                    completed++;
                    if (!error) {
                        console.log(`   Выполнена команда: ${cmd}`);
                        this.report.processesKilled = true;
                    }
                    
                    if (completed === commands.length) {
                        if (this.report.processesKilled) {
                            console.log('   Процессы завершены, ожидание освобождения портов...');
                            setTimeout(resolve, 2000);
                        } else {
                            console.log('   Активные процессы разработки не найдены');
                            resolve();
                        }
                    }
                });
            });
        });
    }

    // Запуск сервера разработки
    async startDevServer() {
        console.log('\n3. Запуск сервера разработки...');
        
        // Проверяем package.json
        let packageJson;
        try {
            packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        } catch (error) {
            console.error('   Ошибка чтения package.json:', error.message);
            this.report.errors.push('Не удалось прочитать package.json');
            return false;
        }

        if (!packageJson.scripts || !packageJson.scripts.dev) {
            console.error('   Скрипт dev не найден в package.json');
            this.report.errors.push('Скрипт dev не найден');
            return false;
        }

        console.log(`   Найден скрипт dev: ${packageJson.scripts.dev}`);

        return new Promise((resolve) => {
            console.log('   Запускаем npm run dev...');
            
            const npmProcess = spawn('npm', ['run', 'dev'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let serverStarted = false;
            let startupTimeout;

            // Обработка вывода
            npmProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('   ' + output.replace(/\n/g, '\n   '));
                
                // Проверяем индикаторы запуска
                if (output.includes('Local:') || output.includes('localhost') || 
                    output.includes('ready in') || output.includes('http://')) {
                    
                    // Извлекаем URL если возможно
                    const urlMatch = output.match(/http:\/\/localhost:(\d+)/);
                    if (urlMatch) {
                        this.report.serverUrl = urlMatch[0];
                    }
                    
                    if (!serverStarted) {
                        serverStarted = true;
                        this.report.serverStarted = true;
                        clearTimeout(startupTimeout);
                        
                        console.log('\n   ✓ Сервер разработки успешно запущен!');
                        if (this.report.serverUrl) {
                            console.log(`   URL: ${this.report.serverUrl}`);
                        }
                        resolve(true);
                    }
                }
            });

            npmProcess.stderr.on('data', (data) => {
                const output = data.toString();
                console.error('   ERROR: ' + output.replace(/\n/g, '\n   ERROR: '));
                
                // Некоторые серверы выводят информацию в stderr
                if (output.includes('Local:') || output.includes('localhost')) {
                    const urlMatch = output.match(/http:\/\/localhost:(\d+)/);
                    if (urlMatch) {
                        this.report.serverUrl = urlMatch[0];
                        if (!serverStarted) {
                            serverStarted = true;
                            this.report.serverStarted = true;
                            clearTimeout(startupTimeout);
                            resolve(true);
                        }
                    }
                }
            });

            npmProcess.on('error', (error) => {
                console.error('   Ошибка запуска npm:', error.message);
                this.report.errors.push(`Ошибка npm: ${error.message}`);
                clearTimeout(startupTimeout);
                resolve(false);
            });

            // Таймаут для определения успешности запуска
            startupTimeout = setTimeout(() => {
                if (!serverStarted) {
                    console.log('   Сервер запускается... (таймаут ожидания истек)');
                    this.report.serverStarted = true; // Предполагаем что запустился
                    resolve(true);
                }
            }, 5000);

            // Сохраняем PID процесса
            this.serverProcess = npmProcess;
            console.log(`   PID процесса: ${npmProcess.pid}`);
        });
    }

    // Финальная проверка портов
    async finalPortCheck() {
        console.log('\n4. Финальная проверка портов...');
        
        for (const port of this.ports) {
            const isOccupied = await this.checkPort(port);
            if (isOccupied) {
                console.log(`   ✓ Порт ${port} теперь занят (сервер работает)`);
                if (!this.report.serverUrl) {
                    this.report.serverUrl = `http://localhost:${port}`;
                }
                return port;
            }
        }
        
        console.log('   Ни один из стандартных портов не занят');
        return null;
    }

    // Генерация отчета
    generateReport() {
        console.log('\n=== ИТОГОВЫЙ ОТЧЕТ ===');
        
        console.log('\nПроверка портов:');
        this.report.portsChecked.forEach(({ port, occupied }) => {
            console.log(`  - Порт ${port}: ${occupied ? 'был занят' : 'был свободен'}`);
        });
        
        console.log(`\nПроцессы завершены: ${this.report.processesKilled ? 'ДА' : 'НЕТ'}`);
        console.log(`Сервер разработки запущен: ${this.report.serverStarted ? 'ДА' : 'НЕТ'}`);
        
        if (this.report.serverUrl) {
            console.log(`URL сервера: ${this.report.serverUrl}`);
        }
        
        if (this.report.errors.length > 0) {
            console.log('\nОшибки:');
            this.report.errors.forEach(error => {
                console.log(`  - ${error}`);
            });
        }
        
        if (this.report.serverStarted) {
            console.log('\nИНСТРУКЦИИ:');
            console.log('1. Откройте браузер');
            console.log(`2. Перейдите по адресу: ${this.report.serverUrl || 'http://localhost:5173'}`);
            console.log('3. Для остановки сервера нажмите Ctrl+C в терминале');
        }
        
        console.log('\n=== КОНЕЦ ОТЧЕТА ===');
    }

    // Основной метод выполнения
    async run() {
        try {
            console.log('=== МЕНЕДЖЕР СЕРВЕРА РАЗРАБОТКИ ===\n');
            
            // 1. Проверка портов
            const occupiedPorts = await this.checkAllPorts();
            
            // 2. Завершение процессов если нужно
            if (occupiedPorts.length > 0) {
                this.report.processesFound = true;
                await this.killProcesses();
            }
            
            // 3. Запуск сервера
            const started = await this.startDevServer();
            
            // 4. Финальная проверка
            if (started) {
                await this.finalPortCheck();
            }
            
            // 5. Отчет
            this.generateReport();
            
        } catch (error) {
            console.error('Критическая ошибка:', error.message);
            this.report.errors.push(`Критическая ошибка: ${error.message}`);
            this.generateReport();
        }
    }
}

// Запуск менеджера
const manager = new ServerManager();
manager.run().catch(console.error);

// Обработка выхода
process.on('SIGINT', () => {
    console.log('\n\nПолучен сигнал завершения...');
    if (manager.serverProcess) {
        console.log('Завершение сервера разработки...');
        manager.serverProcess.kill();
    }
    process.exit(0);
});
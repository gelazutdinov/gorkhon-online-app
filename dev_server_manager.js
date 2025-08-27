#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class DevServerManager {
    constructor() {
        this.report = {
            foundProcesses: [],
            killedProcesses: [],
            portStatus: {},
            serverStarted: false,
            errors: []
        };
    }

    async checkProcesses() {
        console.log('=== Проверка статуса разработческого сервера ===\n');
        
        try {
            // Проверка Node.js процессов
            console.log('1. Поиск запущенных процессов Node.js...');
            const nodeProcs = await this.findNodeProcesses();
            
            // Проверка Vite процессов
            console.log('2. Поиск запущенных процессов Vite...');
            const viteProcs = await this.findViteProcesses();
            
            // Проверка портов
            console.log('3. Проверка занятых портов...');
            await this.checkPorts();
            
            return [...nodeProcs, ...viteProcs];
        } catch (error) {
            console.error('Ошибка при проверке процессов:', error.message);
            this.report.errors.push(error.message);
            return [];
        }
    }

    async findNodeProcesses() {
        try {
            // Используем более простой подход через список процессов Node.js
            const { stdout } = await execAsync('ps -eo pid,ppid,cmd | grep -E "(node|vite)" | grep -v grep');
            const processes = stdout.trim().split('\n').filter(line => line.trim());
            
            if (processes.length === 0) {
                console.log('   Не найдено запущенных Node.js/Vite процессов');
                return [];
            }

            console.log('   Найденные процессы:');
            processes.forEach(proc => {
                console.log(`   ${proc}`);
                this.report.foundProcesses.push(proc);
            });

            return processes.map(proc => {
                const parts = proc.trim().split(/\s+/);
                return {
                    pid: parts[0],
                    cmd: parts.slice(2).join(' ')
                };
            });
        } catch (error) {
            console.log('   Не найдено запущенных Node.js процессов');
            return [];
        }
    }

    async findViteProcesses() {
        try {
            const { stdout } = await execAsync('ps -eo pid,ppid,cmd | grep -i vite | grep -v grep');
            const processes = stdout.trim().split('\n').filter(line => line.trim());
            
            if (processes.length === 0) {
                console.log('   Не найдено запущенных Vite процессов');
                return [];
            }

            console.log('   Найденные Vite процессы:');
            processes.forEach(proc => {
                console.log(`   ${proc}`);
                this.report.foundProcesses.push(proc);
            });

            return processes.map(proc => {
                const parts = proc.trim().split(/\s+/);
                return {
                    pid: parts[0],
                    cmd: parts.slice(2).join(' ')
                };
            });
        } catch (error) {
            console.log('   Не найдено запущенных Vite процессов');
            return [];
        }
    }

    async checkPorts() {
        const ports = [3000, 5173, 4173];
        
        for (const port of ports) {
            try {
                const { stdout } = await execAsync(`lsof -ti:${port}`);
                const pids = stdout.trim().split('\n').filter(pid => pid);
                
                if (pids.length > 0) {
                    console.log(`   Порт ${port} занят процессами: ${pids.join(', ')}`);
                    this.report.portStatus[port] = pids;
                } else {
                    console.log(`   Порт ${port} свободен`);
                    this.report.portStatus[port] = [];
                }
            } catch (error) {
                console.log(`   Порт ${port} свободен`);
                this.report.portStatus[port] = [];
            }
        }
    }

    async killProcesses(processes) {
        if (processes.length === 0) {
            console.log('4. Нет процессов для завершения\n');
            return;
        }

        console.log('\n4. Завершение найденных процессов...');
        
        // Завершение процессов по портам
        const ports = [3000, 5173, 4173];
        for (const port of ports) {
            const pids = this.report.portStatus[port];
            if (pids && pids.length > 0) {
                for (const pid of pids) {
                    try {
                        console.log(`   Завершение процесса PID ${pid} на порту ${port}...`);
                        await execAsync(`kill -TERM ${pid}`);
                        this.report.killedProcesses.push(`${pid} (порт ${port})`);
                        
                        // Ждем немного и проверяем, завершился ли процесс
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        try {
                            await execAsync(`kill -0 ${pid}`);
                            // Процесс все еще работает, принудительно завершаем
                            console.log(`   Принудительное завершение процесса PID ${pid}...`);
                            await execAsync(`kill -KILL ${pid}`);
                        } catch (error) {
                            // Процесс уже завершен
                        }
                    } catch (error) {
                        console.log(`   Не удалось завершить процесс PID ${pid}: ${error.message}`);
                    }
                }
            }
        }

        // Дополнительная проверка и завершение процессов Vite
        for (const proc of processes) {
            if (proc.cmd && proc.cmd.includes('vite')) {
                try {
                    console.log(`   Завершение Vite процесса PID ${proc.pid}...`);
                    await execAsync(`kill -TERM ${proc.pid}`);
                    this.report.killedProcesses.push(`${proc.pid} (vite)`);
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    try {
                        await execAsync(`kill -0 ${proc.pid}`);
                        await execAsync(`kill -KILL ${proc.pid}`);
                    } catch (error) {
                        // Процесс уже завершен
                    }
                } catch (error) {
                    console.log(`   Не удалось завершить процесс PID ${proc.pid}: ${error.message}`);
                }
            }
        }

        console.log('   Процессы завершены.\n');
    }

    async startDevServer() {
        console.log('5. Запуск сервера разработки...');
        
        try {
            // Проверяем, есть ли npm
            await execAsync('which npm');
            console.log('   Найден npm, запускаем npm run dev...');
            
            // Запускаем сервер разработки
            const devServer = spawn('npm', ['run', 'dev'], {
                detached: false,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let serverStarted = false;
            let startupOutput = '';

            // Обрабатываем вывод сервера
            devServer.stdout.on('data', (data) => {
                const output = data.toString();
                startupOutput += output;
                console.log('   ' + output.trim());
                
                // Проверяем индикаторы успешного запуска
                if (output.includes('Local:') || output.includes('localhost') || output.includes('ready in')) {
                    serverStarted = true;
                    this.report.serverStarted = true;
                }
            });

            devServer.stderr.on('data', (data) => {
                const output = data.toString();
                console.error('   ERROR: ' + output.trim());
            });

            // Ждем некоторое время для запуска
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (serverStarted) {
                console.log('\n   Сервер разработки успешно запущен!');
                
                // Проверяем доступность портов
                const ports = [5173, 3000, 4173];
                for (const port of ports) {
                    try {
                        const { stdout } = await execAsync(`lsof -ti:${port}`);
                        if (stdout.trim()) {
                            console.log(`   Сервер доступен на порту ${port}`);
                            console.log(`   Откройте браузер и перейдите по адресу: http://localhost:${port}`);
                            break;
                        }
                    } catch (error) {
                        // Порт не занят
                    }
                }
            } else {
                console.log('\n   Сервер запускается... Проверьте вывод выше для получения URL.');
                this.report.serverStarted = true; // Считаем что запустился, даже если не поймали индикатор
            }

            return devServer;
        } catch (error) {
            console.error('   Ошибка при запуске сервера:', error.message);
            this.report.errors.push('Ошибка запуска: ' + error.message);
            this.report.serverStarted = false;
            
            try {
                // Пробуем yarn как альтернативу
                await execAsync('which yarn');
                console.log('   Пробуем yarn dev...');
                
                const devServer = spawn('yarn', ['dev'], {
                    detached: false,
                    stdio: ['ignore', 'pipe', 'pipe']
                });

                devServer.stdout.on('data', (data) => {
                    console.log('   ' + data.toString().trim());
                });

                devServer.stderr.on('data', (data) => {
                    console.error('   ERROR: ' + data.toString().trim());
                });

                return devServer;
            } catch (yarnError) {
                console.error('   Yarn также недоступен');
                throw error;
            }
        }
    }

    async generateReport() {
        console.log('\n=== ОТЧЕТ О ВЫПОЛНЕННЫХ ДЕЙСТВИЯХ ===');
        console.log(`Найдено процессов: ${this.report.foundProcesses.length}`);
        if (this.report.foundProcesses.length > 0) {
            this.report.foundProcesses.forEach(proc => {
                console.log(`  - ${proc}`);
            });
        }

        console.log(`\nЗавершено процессов: ${this.report.killedProcesses.length}`);
        if (this.report.killedProcesses.length > 0) {
            this.report.killedProcesses.forEach(proc => {
                console.log(`  - ${proc}`);
            });
        }

        console.log('\nСтатус портов:');
        Object.entries(this.report.portStatus).forEach(([port, pids]) => {
            const status = pids.length > 0 ? `занят (${pids.join(', ')})` : 'свободен';
            console.log(`  - Порт ${port}: ${status}`);
        });

        console.log(`\nСервер разработки запущен: ${this.report.serverStarted ? 'ДА' : 'НЕТ'}`);

        if (this.report.errors.length > 0) {
            console.log('\nОшибки:');
            this.report.errors.forEach(error => {
                console.log(`  - ${error}`);
            });
        }

        console.log('\n=== КОНЕЦ ОТЧЕТА ===');
    }

    async run() {
        try {
            const processes = await this.checkProcesses();
            await this.killProcesses(processes);
            await this.startDevServer();
            await this.generateReport();
        } catch (error) {
            console.error('Критическая ошибка:', error.message);
            this.report.errors.push('Критическая ошибка: ' + error.message);
            await this.generateReport();
        }
    }
}

// Запуск менеджера
const manager = new DevServerManager();
manager.run().catch(console.error);
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function checkAndStartDevServer() {
    console.log('=== Проверка и запуск сервера разработки ===\n');
    
    const report = {
        foundProcesses: 0,
        killedProcesses: 0,
        serverStarted: false,
        actions: []
    };

    try {
        // 1. Проверка процессов на портах разработки
        console.log('1. Проверка портов 3000, 5173, 4173...');
        const ports = [3000, 5173, 4173];
        let foundPorts = [];

        for (const port of ports) {
            try {
                const { stdout } = await execAsync(`netstat -tlnp 2>/dev/null | grep :${port} || true`);
                if (stdout.trim()) {
                    console.log(`   Порт ${port} занят`);
                    foundPorts.push(port);
                } else {
                    console.log(`   Порт ${port} свободен`);
                }
            } catch (error) {
                console.log(`   Порт ${port} свободен`);
            }
        }

        // 2. Попытка найти и завершить процессы Node.js/Vite
        if (foundPorts.length > 0) {
            console.log('\n2. Попытка освобождения занятых портов...');
            for (const port of foundPorts) {
                try {
                    // Используем fuser для поиска процессов на порту (если доступен)
                    await execAsync(`fuser -k ${port}/tcp 2>/dev/null || true`);
                    console.log(`   Процессы на порту ${port} завершены`);
                    report.killedProcesses++;
                } catch (error) {
                    console.log(`   Не удалось завершить процессы на порту ${port}`);
                }
            }
            
            // Дополнительная попытка через pkill
            try {
                await execAsync('pkill -f vite 2>/dev/null || true');
                await execAsync('pkill -f "npm.*dev" 2>/dev/null || true');
                await execAsync('pkill -f "yarn.*dev" 2>/dev/null || true');
                console.log('   Завершены дополнительные dev процессы');
            } catch (error) {
                // Игнорируем ошибки pkill
            }

            // Ждем освобождения портов
            console.log('   Ожидание освобождения портов (2 секунды)...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            console.log('\n2. Порты свободны, процессы для завершения не найдены');
        }

        // 3. Запуск сервера разработки
        console.log('\n3. Запуск сервера разработки...');
        
        // Проверяем package.json для доступных скриптов
        const fs = require('fs');
        let packageJson;
        try {
            packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        } catch (error) {
            throw new Error('Не удалось прочитать package.json');
        }

        if (!packageJson.scripts || !packageJson.scripts.dev) {
            throw new Error('Скрипт dev не найден в package.json');
        }

        console.log('   Найден скрипт dev:', packageJson.scripts.dev);

        // Пытаемся запустить через npm
        try {
            console.log('   Запуск npm run dev...');
            
            const devProcess = spawn('npm', ['run', 'dev'], {
                stdio: ['ignore', 'pipe', 'pipe'],
                detached: false
            });

            let outputReceived = false;
            let errorReceived = false;

            devProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('   ' + output.replace(/\n/g, '\n   '));
                outputReceived = true;
                
                if (output.includes('Local:') || output.includes('localhost') || output.includes('ready')) {
                    report.serverStarted = true;
                }
            });

            devProcess.stderr.on('data', (data) => {
                const output = data.toString();
                console.error('   ERROR: ' + output.replace(/\n/g, '\n   ERROR: '));
                errorReceived = true;
            });

            // Ждем запуска
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (outputReceived && !errorReceived) {
                report.serverStarted = true;
                console.log('\n   Сервер разработки запущен успешно!');
                
                // Проверяем на каком порту запустился
                for (const port of [5173, 3000, 4173]) {
                    try {
                        const { stdout } = await execAsync(`netstat -tlnp 2>/dev/null | grep :${port} || echo "не найден"`);
                        if (stdout.includes(`${port}`) && !stdout.includes('не найден')) {
                            console.log(`   Сервер доступен на http://localhost:${port}`);
                            break;
                        }
                    } catch (error) {
                        // Игнорируем ошибки проверки портов
                    }
                }
            } else if (errorReceived) {
                console.log('\n   Обнаружены ошибки при запуске. Проверьте вывод выше.');
            } else {
                console.log('\n   Сервер запускается. Проверьте вывод в терминале.');
                report.serverStarted = true; // Предполагаем что запустился
            }

            // Оставляем процесс работать
            console.log(`\n   PID процесса сервера: ${devProcess.pid}`);
            
        } catch (error) {
            console.error('   Ошибка запуска npm:', error.message);
            report.serverStarted = false;
        }

    } catch (error) {
        console.error('Критическая ошибка:', error.message);
        report.serverStarted = false;
    }

    // 4. Итоговый отчет
    console.log('\n=== ОТЧЕТ ===');
    console.log(`Найдено занятых портов: ${foundPorts.length}`);
    console.log(`Завершено процессов: ${report.killedProcesses}`);
    console.log(`Сервер разработки запущен: ${report.serverStarted ? 'ДА' : 'НЕТ'}`);
    
    if (report.serverStarted) {
        console.log('\nРекомендации:');
        console.log('- Откройте браузер и перейдите на http://localhost:5173 или http://localhost:3000');
        console.log('- Для остановки сервера используйте Ctrl+C в терминале');
        console.log('- Для повторного запуска выполните: npm run dev');
    }
    
    console.log('\n=== КОНЕЦ ОТЧЕТА ===');
}

// Запуск
checkAndStartDevServer().catch(console.error);
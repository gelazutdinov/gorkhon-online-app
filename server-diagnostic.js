#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Функция для красивого вывода
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    rocket: '🚀',
    file: '📁',
    gear: '⚙️',
    time: '⏰',
    debug: '🔍',
    network: '🌐'
  };
  console.log(`${icons[type] || 'ℹ️'} [${timestamp}] ${message}`);
}

async function runDiagnostic() {
  console.log('🔥 ПОЛНАЯ ДИАГНОСТИКА СЕРВЕРА');
  console.log('='.repeat(80));
  console.log();

  // 1. Проверка Node.js и npm/yarn
  log('Проверяем окружение Node.js...', 'gear');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`Node.js: ${nodeVersion}`, 'success');
  } catch (error) {
    log('Node.js не найден!', 'error');
    return;
  }

  // 2. Проверка установленных пакетов
  log('Проверяем наличие tsx...', 'gear');
  try {
    const tsxVersion = execSync('npx tsx --version', { encoding: 'utf8', timeout: 10000 }).trim();
    log(`tsx: ${tsxVersion}`, 'success');
  } catch (error) {
    log(`Ошибка с tsx: ${error.message}`, 'error');
    log('Попробуем установить tsx...', 'gear');
    try {
      execSync('npm install tsx', { encoding: 'utf8' });
      log('tsx успешно установлен', 'success');
    } catch (installError) {
      log(`Ошибка установки tsx: ${installError.message}`, 'error');
      return;
    }
  }

  // 3. Проверка структуры проекта
  log('Проверяем структуру проекта...', 'file');
  
  const requiredFiles = [
    'server/src/app.ts',
    'server/src/routes/auth.ts',
    'server/src/routes/users.ts',
    'server/src/routes/admin.ts',
    'server/src/middleware/auth.ts',
    'server/src/middleware/errorHandler.ts',
    'server/src/services/DatabaseService.ts',
    'server/.env'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`${file} найден`, 'success');
    } else {
      log(`${file} отсутствует!`, 'error');
    }
  }

  // 4. Проверка package.json
  log('Проверяем зависимости в package.json...', 'gear');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'express', 'cors', 'helmet', 'morgan', 'express-rate-limit',
      'dotenv', 'bcryptjs', 'jsonwebtoken', 'sqlite3'
    ];

    for (const dep of requiredDeps) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        log(`${dep} найден в dependencies`, 'success');
      } else {
        log(`${dep} отсутствует в dependencies!`, 'error');
      }
    }
  } catch (error) {
    log(`Ошибка чтения package.json: ${error.message}`, 'error');
  }

  // 5. Проверка переменных окружения
  log('Проверяем файл .env...', 'file');
  try {
    const envContent = fs.readFileSync('server/.env', 'utf8');
    const requiredEnvVars = ['PORT', 'JWT_SECRET', 'NODE_ENV'];
    
    for (const envVar of requiredEnvVars) {
      if (envContent.includes(envVar)) {
        log(`${envVar} найден в .env`, 'success');
      } else {
        log(`${envVar} отсутствует в .env!`, 'warning');
      }
    }
  } catch (error) {
    log(`Ошибка чтения .env: ${error.message}`, 'error');
  }

  // 6. Проверка порта 3001
  log('Проверяем доступность порта 3001...', 'network');
  try {
    const net = require('net');
    const server = net.createServer();
    
    await new Promise((resolve, reject) => {
      server.listen(3001, () => {
        log('Порт 3001 свободен', 'success');
        server.close(resolve);
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          log('Порт 3001 уже занят!', 'warning');
        } else {
          log(`Ошибка с портом: ${err.message}`, 'error');
        }
        reject(err);
      });
    });
  } catch (error) {
    // Порт занят - это нормально, если сервер уже запущен
  }

  // 7. Запуск сервера с детальной диагностикой
  console.log();
  log('Запускаем сервер для диагностики...', 'rocket');
  console.log('─'.repeat(80));

  return new Promise((resolve) => {
    const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
      cwd: 'server',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdoutData = '';
    let stderrData = '';
    let serverStarted = false;
    let startupErrors = [];

    // Обработка stdout
    serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      stdoutData += text;
      
      text.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[OUT] ${line.trim()}`);
          
          if (line.includes('Сервер запущен') || 
              line.includes('🚀') || 
              line.includes('запущен') ||
              line.includes('listening')) {
            serverStarted = true;
            log('✨ Сервер успешно запустился!', 'success');
          }
          
          if (line.includes('База данных') && line.includes('подключена')) {
            log('✨ База данных подключена!', 'success');
          }
        }
      });
    });

    // Обработка stderr
    serverProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderrData += text;
      
      text.split('\n').forEach(line => {
        if (line.trim()) {
          console.log(`[ERR] ${line.trim()}`);
          
          // Анализируем конкретные ошибки
          if (line.includes('Cannot find module')) {
            startupErrors.push(`Отсутствует модуль: ${line}`);
          } else if (line.includes('EADDRINUSE')) {
            startupErrors.push('Порт 3001 уже используется другим процессом');
          } else if (line.includes('ENOENT')) {
            startupErrors.push('Файл или директория не найдены');
          } else if (line.includes('SyntaxError')) {
            startupErrors.push(`Синтаксическая ошибка: ${line}`);
          } else if (line.includes('TypeError')) {
            startupErrors.push(`Ошибка типа: ${line}`);
          }
        }
      });
    });

    // Ошибки процесса
    serverProcess.on('error', (error) => {
      log(`Ошибка процесса: ${error.message}`, 'error');
      startupErrors.push(`Ошибка запуска процесса: ${error.message}`);
    });

    // Тестирование API через 4 секунды
    setTimeout(async () => {
      if (serverStarted) {
        log('Тестируем API endpoints...', 'network');
        
        try {
          const http = require('http');
          
          // Тест health endpoint
          const testEndpoint = (path, description) => {
            return new Promise((resolve) => {
              const req = http.request({
                hostname: 'localhost',
                port: 3001,
                path: path,
                method: 'GET',
                timeout: 3000
              }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                  if (res.statusCode === 200) {
                    log(`${description}: ✅ ${res.statusCode}`, 'success');
                  } else {
                    log(`${description}: ⚠️ ${res.statusCode}`, 'warning');
                  }
                  resolve();
                });
              });

              req.on('error', (error) => {
                log(`${description}: ❌ ${error.message}`, 'error');
                resolve();
              });

              req.on('timeout', () => {
                req.destroy();
                log(`${description}: ⏰ Timeout`, 'warning');
                resolve();
              });

              req.end();
            });
          };

          await testEndpoint('/api/health', 'Health endpoint');
          await testEndpoint('/api/auth/register', 'Auth endpoint');
          
        } catch (error) {
          log(`Ошибка тестирования API: ${error.message}`, 'error');
        }
      }
    }, 4000);

    // Завершение через 10 секунд
    setTimeout(() => {
      log('Завершаем диагностику...', 'time');
      serverProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
      }, 2000);
    }, 10000);

    // Анализ результатов
    serverProcess.on('close', (code, signal) => {
      console.log();
      console.log('='.repeat(80));
      log('РЕЗУЛЬТАТЫ ДИАГНОСТИКИ', 'rocket');
      console.log('='.repeat(80));
      
      // Общий статус
      if (serverStarted) {
        log('🎉 РЕЗУЛЬТАТ: Сервер запускается успешно!', 'success');
      } else {
        log('💥 РЕЗУЛЬТАТ: Сервер НЕ запускается', 'error');
      }
      
      console.log();
      
      // Анализ ошибок
      if (startupErrors.length > 0) {
        log('🔍 НАЙДЕННЫЕ ПРОБЛЕМЫ:', 'error');
        startupErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
        console.log();
      }
      
      // Рекомендации
      log('💡 РЕКОМЕНДАЦИИ ДЛЯ ИСПРАВЛЕНИЯ:', 'info');
      
      if (!serverStarted) {
        if (stderrData.includes('Cannot find module')) {
          console.log('   1. Выполните: npm install');
          console.log('   2. Проверьте правильность импортов в файлах');
        }
        
        if (stderrData.includes('EADDRINUSE')) {
          console.log('   1. Остановите процесс на порту 3001: lsof -ti:3001 | xargs kill');
          console.log('   2. Или измените порт в .env файле');
        }
        
        if (stderrData.includes('ENOENT')) {
          console.log('   1. Проверьте правильность путей к файлам');
          console.log('   2. Убедитесь, что все файлы существуют');
        }
        
        if (!stderrData.trim() && !stdoutData.trim()) {
          console.log('   1. Проверьте установку tsx: npm install tsx');
          console.log('   2. Попробуйте запустить: npx tsx --version');
        }
      } else {
        console.log('   ✅ Сервер работает корректно!');
        console.log('   📝 Для запуска используйте: cd server && tsx src/app.ts');
      }
      
      console.log();
      log('📋 ПОЛНЫЙ ВЫ ОД СЕРВЕРА:', 'debug');
      console.log('─'.repeat(40) + ' STDOUT ' + '─'.repeat(40));
      console.log(stdoutData || '(пусто)');
      
      if (stderrData.trim()) {
        console.log('─'.repeat(40) + ' STDERR ' + '─'.repeat(40));
        console.log(stderrData);
      }
      
      console.log('='.repeat(80));
      
      resolve();
    });
  });
}

// Запуск диагностики
runDiagnostic().catch(error => {
  log(`Критическая ошибка диагностики: ${error.message}`, 'error');
  process.exit(1);
});
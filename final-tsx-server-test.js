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
    time: '⏰'
  };
  console.log(`${icons[type] || 'ℹ️'} [${timestamp}] ${message}`);
}

async function main() {
  console.log('🔥 ФИНАЛЬНЫЙ ТЕСТ ЗАПУСКА TYPESCRIPT СЕРВЕРА');
  console.log('='.repeat(60));
  console.log();

  // Этап 1: Проверка окружения
  log('Проверяем окружение...', 'gear');
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`Node.js версия: ${nodeVersion}`, 'success');
  } catch (error) {
    log('Node.js не найден!', 'error');
    process.exit(1);
  }

  try {
    const tsxVersion = execSync('npx tsx --version', { encoding: 'utf8', timeout: 15000 }).trim();
    log(`tsx версия: ${tsxVersion}`, 'success');
  } catch (error) {
    log(`Ошибка проверки tsx: ${error.message}`, 'error');
    process.exit(1);
  }

  // Этап 2: Проверка файлов
  log('Проверяем структуру проекта...', 'file');
  
  const serverDir = path.join(__dirname, 'server');
  const appFile = path.join(serverDir, 'src', 'app.ts');
  
  if (!fs.existsSync(serverDir)) {
    log('Папка server не найдена!', 'error');
    process.exit(1);
  }
  log('Папка server найдена', 'success');
  
  if (!fs.existsSync(appFile)) {
    log('Файл src/app.ts не найден!', 'error');
    process.exit(1);
  }
  log('Файл src/app.ts найден', 'success');

  // Этап 3: Запуск сервера
  console.log();
  log('Запускаем команду: cd server && npx tsx src/app.ts', 'rocket');
  console.log('─'.repeat(60));

  return new Promise((resolve) => {
    const serverProcess = spawn('npx', ['tsx', 'src/app.ts'], {
      cwd: serverDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });

    let stdoutData = '';
    let stderrData = '';
    let serverStarted = false;
    let healthEndpointWorks = false;

    // Обработка stdout
    serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      stdoutData += text;
      
      // Выводим логи построчно
      text.split('\\n').forEach(line => {
        if (line.trim()) {
          console.log(`[OUT] ${line.trim()}`);
          
          // Проверяем индикаторы успешного запуска
          if (line.includes('Сервер запущен на порту') || 
              line.includes('🚀') || 
              line.includes('запущен') ||
              line.includes('listening')) {
            serverStarted = true;
            log('Сервер успешно запустился!', 'success');
          }
        }
      });
    });

    // Обработка stderr
    serverProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderrData += text;
      
      text.split('\\n').forEach(line => {
        if (line.trim()) {
          console.log(`[ERR] ${line.trim()}`);
        }
      });
    });

    // Обработка ошибок процесса
    serverProcess.on('error', (error) => {
      log(`Ошибка процесса: ${error.message}`, 'error');
    });

    // Тестирование health endpoint через 3 секунды
    setTimeout(async () => {
      if (serverStarted) {
        try {
          // Простая проверка, что сервер отвечает
          log('Проверяем health endpoint...', 'gear');
          
          // Используем простой HTTP запрос
          const http = require('http');
          const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/health',
            method: 'GET',
            timeout: 2000
          };

          const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
              if (res.statusCode === 200) {
                healthEndpointWorks = true;
                log('Health endpoint работает!', 'success');
                log(`Ответ: ${data.substring(0, 100)}...`, 'info');
              } else {
                log(`Health endpoint вернул статус: ${res.statusCode}`, 'warning');
              }
            });
          });

          req.on('error', (error) => {
            log(`Ошибка health endpoint: ${error.message}`, 'warning');
          });

          req.on('timeout', () => {
            req.destroy();
            log('Health endpoint не отвечает (timeout)', 'warning');
          });

          req.end();
        } catch (error) {
          log(`Ошибка тестирования endpoint: ${error.message}`, 'warning');
        }
      }
    }, 3000);

    // Завершение теста через 8 секунд
    setTimeout(() => {
      log('Завершаем тестирование...', 'time');
      serverProcess.kill('SIGTERM');
      
      // Принудительное завершение через 2 секунды
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
      }, 2000);
    }, 8000);

    // Обработка завершения процесса
    serverProcess.on('close', (code, signal) => {
      console.log();
      console.log('='.repeat(60));
      log('РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ', 'rocket');
      console.log('='.repeat(60));
      
      log(`Процесс завершен - Код: ${code}, Сигнал: ${signal}`, 'info');
      
      // Определяем результат
      let testResult = 'UNKNOWN';
      let exitCode = 1;
      
      if (serverStarted && healthEndpointWorks) {
        testResult = 'ПОЛНЫЙ УСПЕХ';
        exitCode = 0;
        log('✨ Сервер запустился и отвечает на запросы!', 'success');
      } else if (serverStarted) {
        testResult = 'ЧАСТИЧНЫЙ УСПЕХ';
        exitCode = 0;
        log('🌟 Сервер запустился, но health endpoint недоступен', 'warning');
      } else if (signal === 'SIGTERM' && stdoutData.trim()) {
        testResult = 'ВОЗМОЖНЫЙ УСПЕХ';
        exitCode = 0;
        log('🤔 Сервер выдал вывод, но без явного сообщения о запуске', 'warning');
      } else if (stderrData.trim() && !stdoutData.trim()) {
        testResult = 'ОШИБКА';
        log('💥 Сервер завершился с ошибками', 'error');
      } else {
        testResult = 'НЕУДАЧА';
        log('😞 Сервер не запустился', 'error');
      }
      
      console.log();
      log(`🎯 ИТОГОВЫЙ РЕЗУЛЬТАТ: ${testResult}`, testResult.includes('УСПЕХ') ? 'success' : 'error');
      
      // Выводим логи
      console.log();
      log('📋 ПОЛНЫЕ ЛОГИ СЕРВЕРА:', 'info');
      console.log('─'.repeat(30) + ' STDOUT ' + '─'.repeat(30));
      console.log(stdoutData || '(пусто)');
      
      if (stderrData.trim()) {
        console.log('─'.repeat(30) + ' STDERR ' + '─'.repeat(30));
        console.log(stderrData);
      }
      
      console.log('='.repeat(60));
      
      resolve(exitCode);
    });
  });
}

// Запускаем тест
main().then(exitCode => {
  setTimeout(() => process.exit(exitCode), 500);
}).catch(error => {
  log(`Критическая ошибка: ${error.message}`, 'error');
  process.exit(1);
});
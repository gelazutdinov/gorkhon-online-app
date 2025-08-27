const { exec } = require('child_process');

console.log('🔍 Быстрая проверка dev-сервера...');

exec('curl -s -I http://localhost:5173', (error, stdout, stderr) => {
    if (!error && (stdout.includes('200') || stdout.includes('404') || stdout.includes('HTTP'))) {
        console.log('✅ РАБОТАЕТ! Сервер доступен на http://localhost:5173');
        console.log('Response:', stdout.split('\n')[0]);
        process.exit(0);
    } else {
        console.log('❌ НЕ РАБОТАЕТ! Сервер не отвечает');
        console.log('Error:', error?.message || 'No response');
        
        // Запускаем сервер
        console.log('🚀 Запускаю сервер...');
        const { spawn } = require('child_process');
        
        const server = spawn('bun', ['run', 'dev'], {
            stdio: 'inherit',
            detached: false
        });
        
        setTimeout(() => {
            exec('curl -s -I http://localhost:5173', (error2, stdout2) => {
                if (!error2 && stdout2.includes('HTTP')) {
                    console.log('\n✅ ТЕПЕРЬ РАБОТАЕТ! http://localhost:5173');
                } else {
                    console.log('\n❌ ВСЕ ЕЩЕ НЕ РАБОТАЕТ!');
                }
            });
        }, 4000);
        
        process.exit(1);
    }
});
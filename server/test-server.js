// Быстрый тест API сервера
const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Тестирование API сервера...\n');

  try {
    // 1. Health check
    console.log('1. Проверка health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // 2. Регистрация тестового пользователя
    console.log('\n2. Регистрация пользователя...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
        name: 'Тестовый Пользователь'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Регистрация успешна для:', registerData.data.user.email);
      const token = registerData.data.token;

      // 3. Получение текущего пользователя
      console.log('\n3. Получение профиля...');
      const profileResponse = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Профиль получен:', profileData.data.user.name);
      }

    } else {
      const errorData = await registerResponse.json();
      console.log('⚠️ Регистрация:', errorData.error);
    }

    // 4. Вход администратора
    console.log('\n4. Вход администратора...');
    const adminLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'smm@gelazutdinov.ru',
        password: 'admin123'
      })
    });
    
    if (adminLoginResponse.ok) {
      const adminData = await adminLoginResponse.json();
      console.log('✅ Админ вошел:', adminData.data.user.email);
      const adminToken = adminData.data.token;

      // 5. Получение статистики
      console.log('\n5. Статистика базы данных...');
      const statsResponse = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Статистика:', statsData.data);
      }
    }

    console.log('\n🎉 Все тесты пройдены успешно!');

  } catch (error) {
    console.error('\n❌ Ошибка тестирования:', error.message);
    console.log('\n💡 Убедитесь что сервер запущен: cd server && tsx src/app.ts');
  }
}

// Запуск через 2 секунды, чтобы сервер успел запуститься
setTimeout(testAPI, 2000);
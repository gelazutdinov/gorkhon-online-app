const express = require('express');
const cors = require('cors');

console.log('🚨 АВАРИЙНЫЙ СЕРВЕР - ПРОСТЕЙШИЙ ВАРИАНТ');

const app = express();
const PORT = 3001;

// Базовые middleware
app.use(cors());
app.use(express.json());

// Тестовый endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'EMERGENCY SERVER WORKING',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Тестовый логин
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'smm@gelazutdinov.ru' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        user: {
          id: 'admin_123',
          email: 'smm@gelazutdinov.ru',
          name: 'Администратор',
          role: 'admin'
        },
        token: 'emergency_token_123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Неверный email или пароль'
    });
  }
});

// Catch all
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found in emergency server' 
  });
});

// Запуск
app.listen(PORT, () => {
  console.log(`🚀 АВАРИЙНЫЙ СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Логин: smm@gelazutdinov.ru / admin123`);
  console.log('=' .repeat(50));
});
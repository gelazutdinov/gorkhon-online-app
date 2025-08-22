const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

console.log('🚀 ПРОСТОЙ РАБОЧИЙ СЕРВЕР');
console.log('========================');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Простая "база данных" в памяти
const users = [
  {
    id: 'admin_123',
    email: 'smm@gelazutdinov.ru',
    password: 'admin123', // В реальности должен быть хэшированный
    name: 'Администратор',
    role: 'admin',
    status: 'active',
    isVerified: true
  }
];

// Функция поиска пользователя
const findUser = (email) => {
  return users.find(user => user.email === email);
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'WORKING SERVER OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0-simple'
  });
});

// Логин
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Введите email и пароль'
      });
    }

    const user = findUser(email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: `simple_token_${Date.now()}`
      }
    });

    console.log(`✅ Успешный логин: ${email}`);
  } catch (error) {
    console.error('❌ Ошибка логина:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Получение текущего пользователя (простая реализация)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Токен доступа отсутствует' 
    });
  }

  // Простая проверка токена (в реальности нужно JWT)
  if (token.startsWith('simple_token_')) {
    const { password, ...userWithoutPassword } = users[0]; // Возвращаем админа
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Недействительный токен' 
    });
  }
});

// Регистрация (простая)
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Заполните все поля'
    });
  }

  if (findUser(email)) {
    return res.status(409).json({
      success: false,
      error: 'Пользователь с таким email уже существует'
    });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password, // В реальности должен быть хэшированный
    name,
    role: 'user',
    status: 'active',
    isVerified: false
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword,
      token: `simple_token_${Date.now()}`
    }
  });

  console.log(`✅ Новый пользователь: ${email}`);
});

// Выход
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Выход выполнен успешно'
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Ошибка сервера:', error);
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 ПРОСТОЙ СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Админ: smm@gelazutdinov.ru / admin123`);
  console.log('=' .repeat(50));
});

module.exports = app;
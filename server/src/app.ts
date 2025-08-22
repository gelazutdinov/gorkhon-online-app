import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// JSON parsing
app.use(express.json());

console.log('🔄 Запуск минимального сервера...');

// Простые данные в памяти
const users = [
  {
    id: 'admin_1',
    email: 'smm@gelazutdinov.ru',
    password: 'admin123',
    name: 'Администратор',
    role: 'admin'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Попытка входа:', email);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Неверные данные'
    });
  }
  
  const { password: _, ...userSafe } = user;
  
  res.json({
    success: true,
    data: {
      user: userSafe,
      token: `token_${Date.now()}`
    }
  });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: 'Пользователь уже существует'
    });
  }
  
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password,
    name,
    role: 'user'
  };
  
  users.push(newUser);
  
  const { password: _, ...userSafe } = newUser;
  
  res.json({
    success: true,
    data: {
      user: userSafe,
      token: `token_${Date.now()}`
    }
  });
});

// Current user
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !token.startsWith('token_')) {
    return res.status(401).json({
      success: false,
      error: 'Нет токена'
    });
  }
  
  const { password: _, ...userSafe } = users[0];
  
  res.json({
    success: true,
    data: { user: userSafe }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Выход выполнен'
  });
});

// 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint не найден'
  });
});

// Запуск
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Админ: smm@gelazutdinov.ru / admin123`);
});

export default app;
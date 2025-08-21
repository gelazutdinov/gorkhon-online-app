const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Сервер работает!'
  });
});

// Простая регистрация для тестирования
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Все поля обязательны'
    });
  }
  
  // Имитация успешной регистрации
  res.json({
    success: true,
    data: {
      user: { id: 1, email, name },
      token: 'test-token-123'
    }
  });
});

// Простая авторизация
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'smm@gelazutdinov.ru' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        user: { id: 1, email, name: 'Администратор' },
        token: 'admin-token-123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Неверные учетные данные'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Тестовый сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
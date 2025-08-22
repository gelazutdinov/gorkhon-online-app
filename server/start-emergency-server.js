#!/usr/bin/env node

const http = require('http');
const url = require('url');

const PORT = 3001;

// Простые данные
const users = [{
  id: 'admin_1',
  email: 'smm@gelazutdinov.ru',
  password: 'admin123',
  name: 'Администратор',
  role: 'admin'
}];

// Простой HTTP сервер
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  console.log(`${req.method} ${path}`);

  // Health check
  if (path === '/api/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'EMERGENCY SERVER OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }

  // Login
  if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, error: 'Неверные данные' }));
          return;
        }
        
        const { password: _, ...userSafe } = user;
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: { user: userSafe, token: `emergency_token_${Date.now()}` }
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Ошибка данных' }));
      }
    });
    return;
  }

  // Current user
  if (path === '/api/auth/me' && req.method === 'GET') {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];
    
    if (!token || !token.startsWith('emergency_token_')) {
      res.writeHead(401);
      res.end(JSON.stringify({ success: false, error: 'Нет токена' }));
      return;
    }
    
    const { password: _, ...userSafe } = users[0];
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: { user: userSafe } }));
    return;
  }

  // Register
  if (path === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { email, password, name } = JSON.parse(body);
        
        if (users.find(u => u.email === email)) {
          res.writeHead(409);
          res.end(JSON.stringify({ success: false, error: 'Пользователь существует' }));
          return;
        }
        
        const newUser = { id: `user_${Date.now()}`, email, password, name, role: 'user' };
        users.push(newUser);
        
        const { password: _, ...userSafe } = newUser;
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          data: { user: userSafe, token: `emergency_token_${Date.now()}` }
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Ошибка данных' }));
      }
    });
    return;
  }

  // Logout
  if (path === '/api/auth/logout' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'Выход выполнен' }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: 'Endpoint не найден' }));
});

server.listen(PORT, () => {
  console.log('🚨 ЭКСТРЕННЫЙ СЕРВЕР ЗАПУЩЕН! 🚨');
  console.log(`✅ http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Логин: smm@gelazutdinov.ru / admin123`);
  console.log('=' .repeat(60));
});

process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.close();
  process.exit(0);
});
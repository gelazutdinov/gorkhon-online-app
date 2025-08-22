import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'gorkhon-super-secret-key-2024';

// База данных
let db: sqlite3.Database;

// Интерфейсы
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

interface AuthRequest extends express.Request {
  user?: Omit<User, 'password'>;
}

// Middleware безопасности
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://poehali.dev'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Логирование
app.use(morgan('combined'));

// Функции для работы с базой данных
const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        reject(err);
        return;
      }
      console.log('✅ База данных SQLite подключена');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        isVerified INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastLoginAt TEXT,
        loginCount INTEGER DEFAULT 0
      )
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Ошибка создания таблицы users:', err);
        reject(err);
        return;
      }
      
      // Создаем админа по умолчанию
      createDefaultAdmin().then(() => {
        console.log('✅ Таблицы базы данных созданы');
        resolve();
      }).catch(reject);
    });
  });
};

const createDefaultAdmin = async (): Promise<void> => {
  const adminEmail = 'smm@gelazutdinov.ru';
  
  return new Promise((resolve, reject) => {
    // Проверяем, существует ли админ
    db.get('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (!row) {
        // Создаем админа
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminId = `admin_${Date.now()}`;
        const now = new Date().toISOString();

        const insertAdmin = `
          INSERT INTO users (
            id, email, password, name, role, status, 
            isVerified, createdAt, updatedAt, loginCount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertAdmin, [
          adminId,
          adminEmail,
          hashedPassword,
          'Администратор',
          'admin',
          'active',
          1,
          now,
          now,
          0
        ], (err) => {
          if (err) {
            console.error('Ошибка создания администратора:', err);
            reject(err);
          } else {
            console.log('✅ Администратор создан:', adminEmail);
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
};

const getUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: any) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        resolve(null);
        return;
      }

      resolve({
        ...row,
        isVerified: Boolean(row.isVerified)
      });
    });
  });
};

const getUserById = (id: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: any) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        resolve(null);
        return;
      }

      resolve({
        ...row,
        isVerified: Boolean(row.isVerified)
      });
    });
  });
};

const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<User> => {
  return new Promise((resolve, reject) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const insertUser = `
      INSERT INTO users (
        id, email, password, name, role, status, isVerified, 
        createdAt, updatedAt, loginCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertUser, [
      userId,
      userData.email,
      userData.password,
      userData.name,
      userData.role || 'user',
      userData.status || 'active',
      userData.isVerified ? 1 : 0,
      now,
      now,
      0
    ], function(err) {
      if (err) {
        reject(err);
        return;
      }

      // Возвращаем созданного пользователя
      const newUser: User = {
        id: userId,
        ...userData,
        createdAt: now,
        updatedAt: now,
        loginCount: 0
      };
      resolve(newUser);
    });
  });
};

const updateLastLogin = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.run(
      'UPDATE users SET lastLoginAt = ?, loginCount = loginCount + 1 WHERE id = ?',
      [now, id],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// Middleware аутентификации
const authenticateToken = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Токен доступа отсутствует' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Пользователь не найден' 
      });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ 
        success: false, 
        error: 'Аккаунт заблокирован' 
      });
    }

    // Убираем пароль из объекта пользователя
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      error: 'Недействительный токен' 
    });
  }
};

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Маршруты

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Авторизация
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Введите email и пароль'
      });
    }

    // Поиск пользователя
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Проверка статуса аккаунта
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        error: 'Ваш аккаунт заблокирован'
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        error: 'Ваш аккаунт неактивен'
      });
    }

    // Обновляем время последнего входа
    await updateLastLogin(user.id);

    // Генерация токена
    const token = generateToken(user.id);

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Валидация
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Заполните все обязательные поля'
      });
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Некорректный формат email'
      });
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Пароль должен содержать минимум 6 символов'
      });
    }

    // Проверка на существующего пользователя
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Определяем роль пользователя
    const role = email === 'smm@gelazutdinov.ru' ? 'admin' : 'user';

    // Создание пользователя
    const newUser = await createUser({
      email,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      isVerified: role === 'admin'
    });

    // Обновляем время последнего входа
    await updateLastLogin(newUser.id);

    // Генерация токена
    const token = generateToken(newUser.id);

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Получение текущего пользователя
app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Выход (на клиенте просто удаляется токен)
app.post('/api/auth/logout', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: 'Выход выполнен успешно'
  });
});

// Обработка 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

// Обработка ошибок
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Ошибка сервера:', error);

  // Ошибки базы данных
  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      success: false,
      error: 'Пользователь с таким email уже существует'
    });
  }

  // JWT ошибки
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Недействительный токен'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Токен истек'
    });
  }

  // Общая ошибка сервера
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Запуск сервера
async function startServer() {
  try {
    // Инициализация базы данных
    console.log('🔄 Инициализация базы данных...');
    await initDatabase();
    console.log('✅ База данных инициализирована');

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📊 API доступно по адресу: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 Админ аккаунт: smm@gelazutdinov.ru / admin123`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

startServer();

export default app;
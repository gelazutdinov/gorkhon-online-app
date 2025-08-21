import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../services/DatabaseService';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const db = DatabaseService.getInstance();

// Регистрация
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, middleName, phone, birthDate } = req.body;

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
    const existingUser = await db.getUserByEmail(email);
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
    const newUser = await db.createUser({
      email,
      password: hashedPassword,
      name,
      middleName,
      phone,
      birthDate,
      role,
      status: 'active',
      isVerified: role === 'admin'
    });

    // Обновляем время последнего входа
    await db.updateLastLogin(newUser.id);

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
    next(error);
  }
});

// Авторизация
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Введите email и пароль'
      });
    }

    // Поиск пользователя
    const user = await db.getUserByEmail(email);
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
    await db.updateLastLogin(user.id);

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
    next(error);
  }
});

// Получение текущего пользователя
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
});

// Выход (на клиенте просто удаляется токен)
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: 'Выход выполнен успешно'
  });
});

export default router;
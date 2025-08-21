import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../services/DatabaseService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const db = DatabaseService.getInstance();

// Все маршруты требуют авторизации
router.use(authenticateToken);

// Обновление профиля
router.put('/profile', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Убираем системные поля, которые нельзя обновлять напрямую
    delete updates.id;
    delete updates.email;
    delete updates.password;
    delete updates.role;
    delete updates.createdAt;
    delete updates.loginCount;

    const updatedUser = await db.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
});

// Изменение пароля
router.put('/password', async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Введите текущий и новый пароль'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Новый пароль должен содержать минимум 6 символов'
      });
    }

    // Получаем пользователя с паролем
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Неверный текущий пароль'
      });
    }

    // Хэшируем новый пароль
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await db.updateUser(userId, { password: hashedNewPassword });

    res.json({
      success: true,
      message: 'Пароль успешно изменен'
    });
  } catch (error) {
    next(error);
  }
});

// Получение профиля пользователя по ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Убираем пароль и приватные данные
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
});

// Удаление аккаунта
router.delete('/account', async (req: AuthRequest, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Введите пароль для подтверждения'
      });
    }

    // Получаем пользователя с паролем
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Неверный пароль'
      });
    }

    // Админа нельзя удалить
    if (user.email === 'smm@gelazutdinov.ru') {
      return res.status(403).json({
        success: false,
        error: 'Аккаунт администратора нельзя удалить'
      });
    }

    // Удаляем пользователя
    const deleted = await db.deleteUser(userId);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Ошибка при удалении аккаунта'
      });
    }

    res.json({
      success: true,
      message: 'Аккаунт успешно удален'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
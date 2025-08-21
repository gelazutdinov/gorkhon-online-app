import { Router } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const db = DatabaseService.getInstance();

// Все маршруты требуют авторизации и права админа
router.use(authenticateToken);
router.use(requireAdmin);

// Получение всех пользователей
router.get('/users', async (req: AuthRequest, res, next) => {
  try {
    const users = await db.getAllUsers();
    
    // Убираем пароли из ответа
    const usersWithoutPasswords = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: {
        users: usersWithoutPasswords
      }
    });
  } catch (error) {
    next(error);
  }
});

// Получение статистики
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const stats = await db.getDatabaseStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Обновление пользователя (админ)
router.put('/users/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Админ может обновлять больше полей
    delete updates.id;
    delete updates.password; // Пароль обновляется отдельно
    delete updates.createdAt;

    const updatedUser = await db.updateUser(id, updates);
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

// Изменение статуса пользователя
router.put('/users/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Некорректный статус. Доступны: active, inactive, banned'
      });
    }

    // Проверяем, что не блокируем самих себя
    if (id === req.user.id && status === 'banned') {
      return res.status(400).json({
        success: false,
        error: 'Нельзя заблокировать самого себя'
      });
    }

    const updatedUser = await db.updateUser(id, { status });
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

// Верификация пользователя
router.put('/users/:id/verify', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Поле isVerified должно быть boolean'
      });
    }

    const updatedUser = await db.updateUser(id, { isVerified });
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

// Удаление пользователя (админ)
router.delete('/users/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Проверяем, что не удаляем самих себя
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Нельзя удалить самого себя'
      });
    }

    // Получаем пользователя для проверки
    const user = await db.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    // Нельзя удалить главного админа
    if (user.email === 'smm@gelazutdinov.ru') {
      return res.status(403).json({
        success: false,
        error: 'Нельзя удалить главного администратора'
      });
    }

    const deleted = await db.deleteUser(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Ошибка при удалении пользователя'
      });
    }

    res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    next(error);
  }
});

// Экспорт данных
router.get('/export', async (req: AuthRequest, res, next) => {
  try {
    const users = await db.getAllUsers();
    
    // Убираем пароли из экспорта
    const exportData = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=users_export_${new Date().toISOString().split('T')[0]}.json`);
    
    res.json({
      exportDate: new Date().toISOString(),
      totalUsers: users.length,
      users: exportData
    });
  } catch (error) {
    next(error);
  }
});

export default router;
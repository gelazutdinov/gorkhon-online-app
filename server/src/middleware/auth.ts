import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../services/DatabaseService';

const JWT_SECRET = process.env.JWT_SECRET || 'gorkhon-secret-key-2024';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const db = DatabaseService.getInstance();
    const user = await db.getUserById(decoded.userId);

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

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Требуется авторизация' 
    });
  }

  if (req.user.role !== 'admin' && req.user.email !== 'smm@gelazutdinov.ru') {
    return res.status(403).json({ 
      success: false, 
      error: 'Доступ запрещен. Требуются права администратора' 
    });
  }

  next();
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
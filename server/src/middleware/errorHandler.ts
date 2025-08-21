import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Ошибка сервера:', error);

  // Ошибки валидации
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Ошибка валидации данных',
      details: error.message
    });
  }

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
};
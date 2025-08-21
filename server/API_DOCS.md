# 🚀 API Documentation - Горхон.Online

## Запуск сервера

```bash
# Из корневой папки проекта
cd server
tsx src/app.ts
```

Сервер запустится на `http://localhost:3001`

## API Endpoints

### 🔐 AUTH `/api/auth`

**POST** `/api/auth/register` - Регистрация
**POST** `/api/auth/login` - Вход  
**GET** `/api/auth/me` - Текущий пользователь
**POST** `/api/auth/logout` - Выход

### 👤 USERS `/api/users`

**PUT** `/api/users/profile` - Обновить профиль
**PUT** `/api/users/password` - Изменить пароль
**GET** `/api/users/:id` - Получить пользователя
**DELETE** `/api/users/account` - Удалить аккаунт

### 🛡 ADMIN `/api/admin` (только для smm@gelazutdinov.ru)

**GET** `/api/admin/users` - Все пользователи
**GET** `/api/admin/stats` - Статистика
**PUT** `/api/admin/users/:id` - Обновить пользователя
**PUT** `/api/admin/users/:id/status` - Изменить статус
**PUT** `/api/admin/users/:id/verify` - Верификация
**DELETE** `/api/admin/users/:id` - Удалить пользователя
**GET** `/api/admin/export` - Экспорт данных

## Администратор по умолчанию

- Email: `smm@gelazutdinov.ru`
- Пароль: `admin123`
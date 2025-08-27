#!/bin/bash

echo "🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ СЕРВЕРА РАЗРАБОТКИ"

# 1. Убиваем все процессы
echo "Убиваем процессы node, vite, npm..."
pkill -f node || true
pkill -f vite || true  
pkill -f npm || true
pkill -f tsx || true

# 2. Очищаем порты принудительно
echo "Очищаем порты 5173 и 3001..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# 3. Запускаем dev server
echo "Запускаем npm run dev..."
npm run dev
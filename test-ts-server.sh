#!/bin/bash

echo "🔥 ТЕСТ TYPESCRIPT СЕРВЕРА"
echo "=========================="

# Убиваем процессы на порту 3001
echo "🔪 Освобождаем порт 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Порт свободен"

sleep 1

echo ""
echo "🚀 Запускаем TypeScript сервер..."
echo "Команда: cd server && npx tsx src/simple-app.ts"

cd server

# Проверяем файлы
echo ""
echo "📂 Проверка файлов:"
echo "simple-app.ts exists: $(test -f src/simple-app.ts && echo 'YES' || echo 'NO')"
echo "Current directory: $(pwd)"

# Пробуем запустить
echo ""
echo "🎯 Запуск сервера (10 секунд)..."
timeout 10s npx tsx src/simple-app.ts &
TSX_PID=$!

# Ждем
sleep 3

# Тестируем
echo ""
echo "🧪 Тестирование..."
curl -s http://localhost:3001/api/health || echo "❌ Сервер не отвечает"

# Убиваем процесс
kill $TSX_PID 2>/dev/null

echo ""
echo "=========================="
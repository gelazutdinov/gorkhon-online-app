#!/bin/bash

echo "🚨 КРИТИЧЕСКИ ВАЖНО: Прямой запуск dev-сервера!"

# Убиваем процессы на порту 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo "🚀 Запускаю: bun run dev"
echo "📅 $(date)"

# Запускаем сервер
bun run dev &
SERVER_PID=$!

echo "✅ Сервер запущен с PID: $SERVER_PID"

# Ждем 3 секунды
sleep 3

# Проверяем
if curl -s -I http://localhost:5173 >/dev/null 2>&1; then
    echo "✅ РАБОТАЕТ! http://localhost:5173"
else
    echo "❌ НЕ РАБОТАЕТ!"
fi
#!/bin/bash

# КРИТИЧЕСКИЙ АВАРИЙНЫЙ ЗАПУСК DEV-СЕРВЕРА

echo "🚨 КРИТИЧЕСКИ ВАЖНО: Восстанавливаю dev-сервер!"

# 1. УБИВАЕМ ВСЕ процессы принудительно
echo "1. Убиваю все процессы..."
killall -9 node 2>/dev/null || true
killall -9 vite 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "bun.*dev" 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

# 2. Освобождаем порт 5173
echo "2. Освобождаю порт 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# 3. Очищаем кэш
echo "3. Очищаю кэши..."
rm -rf node_modules/.vite 2>/dev/null || true
bun cache clear 2>/dev/null || true

# 4. Проверяем что команда dev существует
echo "4. Проверяю package.json..."
if ! grep -q "\"dev\":" package.json; then
    echo "❌ Команда dev не найдена в package.json!"
    exit 1
fi

# 5. ЗАПУСКАЕМ сервер
echo "5. 🚀 ЗАПУСКАЮ DEV-СЕРВЕР..."
echo "Запуск: bun run dev"
echo "URL: http://localhost:5173"
echo "Дата запуска: $(date)"

# Запуск в фоне и сохранение PID
nohup bun run dev > vite-dev.log 2>&1 &
SERVER_PID=$!

echo "✅ Сервер запущен с PID: $SERVER_PID"
echo "📝 Логи: vite-dev.log"

# Ждем 3 секунды для запуска
sleep 3

# 6. Проверяем что сервер запустился
echo "6. 🔍 Проверяю статус сервера..."
if curl -s -I http://localhost:5173 | grep -q "200\|404"; then
    echo "✅ РАБОТАЕТ! Сервер доступен на http://localhost:5173"
    echo "🎉 DEV-СЕРВЕР ВОССТАНОВЛЕН!"
    exit 0
else
    echo "❌ НЕ РАБОТАЕТ! Сервер не отвечает"
    echo "Проверь логи: cat vite-dev.log"
    exit 1
fi
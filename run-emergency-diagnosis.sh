#!/bin/bash

echo "🚨 КРИТИЧЕСКАЯ ДИАГНОСТИКА СЕРВЕРА"
echo "=================================="

echo "1. Убиваем процессы на порту 3001..."
node kill-port-3001.js

echo ""
echo "2. Диагностика проблем..."
node diagnose-server-issues.js

echo ""
echo "3. Тест простого аварийного сервера..."
echo "Запускаем аварийный сервер на 10 секунд..."
timeout 10s node emergency-server.js &
EMERGENCY_PID=$!

# Ждем 2 секунды для запуска
sleep 2

echo ""
echo "4. Тестируем аварийный сервер..."
curl -s http://localhost:3001/api/health || echo "❌ Аварийный сервер не отвечает"

echo ""
echo "5. Пробуем оригинальный сервер..."
echo "Выполняем: cd server && npx tsx src/simple-app.ts"

# Останавливаем аварийный сервер
kill $EMERGENCY_PID 2>/dev/null

# Пробуем запустить оригинальный сервер
cd server
timeout 10s npx tsx src/simple-app.ts

echo ""
echo "=================================="
echo "ДИАГНОСТИКА ЗАВЕРШЕНА"
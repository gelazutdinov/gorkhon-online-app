#!/bin/bash

echo "🚀 Тестирование API endpoints"
echo "============================="
echo ""

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден!"
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"
echo ""

# Проверяем, не запущен ли уже сервер
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "⚠️  Сервер уже запущен на порту 3001"
    echo "🔍 Тестируем endpoints..."
    echo ""
    node simple-test.js
    exit 0
fi

echo "🚀 Запускаем тестовый сервер..."

# Запускаем сервер в фоне
node test-simple-server.js &
SERVER_PID=$!

echo "📡 Сервер запущен с PID: $SERVER_PID"
echo "⏳ Ждем 3 секунды для инициализации..."
sleep 3

echo ""
echo "🔍 Тестируем endpoints..."
echo ""

# Запускаем тесты
node simple-test.js

echo ""
echo "🛑 Останавливаем сервер..."

# Убиваем сервер
kill $SERVER_PID 2>/dev/null

# Ждем немного, чтобы сервер корректно завершился
sleep 1

echo "✅ Тестирование завершено!"
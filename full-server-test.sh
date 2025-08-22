#!/bin/bash

echo "🚨 ПОЛНОЕ ТЕСТИРОВАНИЕ СЕРВЕРА - КРИТИЧЕСКИ ВАЖНО!"
echo "================================================="

# Убиваем все процессы на порту 3001
echo "🔪 Шаг 1: Освобождаем порт 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Порт 3001 уже свободен"

sleep 1

# Запускаем рабочий сервер в фоне
echo ""
echo "🚀 Шаг 2: Запускаем рабочий сервер..."
cd server && node working-server.js &
SERVER_PID=$!
echo "Сервер PID: $SERVER_PID"

# Возвращаемся в корневую папку
cd ..

# Ждем запуска сервера
echo ""
echo "⏳ Шаг 3: Ждем запуска сервера (3 секунды)..."
sleep 3

# Тестируем сервер
echo ""
echo "🧪 Шаг 4: Тестируем сервер..."
node test-working-server.js

# Дополнительные curl тесты
echo ""
echo "🌐 Шаг 5: Дополнительные curl тесты..."
echo "Health check:"
curl -s http://localhost:3001/api/health | head -c 200
echo ""

echo ""
echo "Login test:"
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smm@gelazutdinov.ru","password":"admin123"}' | head -c 200
echo ""

# Останавливаем сервер
echo ""
echo "🛑 Шаг 6: Останавливаем тестовый сервер..."
kill $SERVER_PID 2>/dev/null

sleep 1

echo ""
echo "================================================="
echo "✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!"
echo ""
echo "КОМАНДЫ ДЛЯ ЗАПУСКА СЕРВЕРА:"
echo "1. Простой рабочий сервер: ./start-working-server.sh"
echo "2. Или вручную: cd server && node working-server.js"
echo ""
echo "ПРОВЕРКА РАБОТЫ:"
echo "curl http://localhost:3001/api/health"
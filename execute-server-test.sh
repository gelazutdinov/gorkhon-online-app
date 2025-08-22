#!/bin/bash

echo "🧪 Выполнение полного тестирования TypeScript сервера"
echo "======================================================"

# Показываем симуляцию
echo "📊 Показываем ожидаемые результаты:"
node server-simulation.js

echo ""
echo "🔧 Проверка готовности компонентов:"

# Проверяем наличие tsx
if command -v npx &> /dev/null && npx tsx --version &> /dev/null; then
    echo "✅ tsx доступен: $(npx tsx --version)"
else
    echo "❌ tsx недоступен"
fi

# Проверяем наличие server/src/app.ts
if [ -f "server/src/app.ts" ]; then
    echo "✅ Главный файл сервера найден: server/src/app.ts"
else
    echo "❌ Главный файл сервера не найден"
fi

# Проверяем .env файл
if [ -f "server/.env" ]; then
    echo "✅ Конфигурация найдена: server/.env"
    echo "   PORT=$(grep PORT server/.env | cut -d'=' -f2)"
    echo "   NODE_ENV=$(grep NODE_ENV server/.env | cut -d'=' -f2)"
else
    echo "❌ Файл конфигурации не найден"
fi

echo ""
echo "⚡ Для реального запуска выполните:"
echo "cd server && npx tsx src/app.ts"

echo ""
echo "🧪 Для тестирования endpoints выполните в другом терминале:"
echo "curl http://localhost:3001/api/health"
echo "curl -X POST http://localhost:3001/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@test.com\",\"password\":\"123456\",\"name\":\"Test User\"}'"
echo "curl -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"smm@gelazutdinov.ru\",\"password\":\"admin123\"}'"
#!/bin/bash

echo "🚀 Запуск тестирования TypeScript сервера..."
echo "📁 Переходим в директорию server..."

cd server || exit 1

echo "🔥 Запускаем сервер с помощью tsx..."
node ../test-server-startup.js
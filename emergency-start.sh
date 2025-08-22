#!/bin/bash

echo "🚨 ЭКСТРЕННЫЙ ЗАПУСК СЕРВЕРА 🚨"

# Проверяем доступность Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден!"
    exit 1
fi

# Останавливаем процессы на порту 3001
echo "🔄 Освобождаем порт 3001..."
pkill -f "3001" 2>/dev/null || echo "Порт свободен"

# Запускаем экстренный сервер
echo "🚀 Запуск экстренного сервера..."
node server/start-emergency-server.js
#!/bin/bash

echo "🔍 Проверяем наличие Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js найден: $(node --version)"
else
    echo "❌ Node.js не найден!"
    exit 1
fi

echo ""
echo "🚀 Запускаем тестирование endpoints..."
echo "======================================"
echo ""

node test-endpoints.js

echo ""
echo "✅ Тестирование завершено!"
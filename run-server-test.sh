#!/bin/bash

echo "🚀 Запуск TypeScript сервера через tsx..."
echo "==========================================="

# Сохраняем текущую директорию
ORIGINAL_DIR=$(pwd)

# Переходим в директорию server
echo "📁 Переходим в папку server..."
cd server || {
    echo "❌ Ошибка: Не удалось перейти в папку server"
    exit 1
}

echo "✅ Текущая директория: $(pwd)"

# Проверяем наличие файла app.ts
if [ ! -f "src/app.ts" ]; then
    echo "❌ Ошибка: Файл src/app.ts не найден"
    cd "$ORIGINAL_DIR"
    exit 1
fi

echo "✅ Файл src/app.ts найден"

# Запускаем команду tsx src/app.ts
echo ""
echo "🔥 Выполняем команду: tsx src/app.ts"
echo "==========================================="

# Запуск с выводом всех логов
npx tsx src/app.ts &

# Получаем PID процесса
SERVER_PID=$!

echo "🆔 PID сервера: $SERVER_PID"

# Ждем 8 секунд для запуска
echo "⏳ Ожидание запуска сервера (8 секунд)..."
sleep 8

# Проверяем, что процесс еще работает
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Сервер успешно запущен и работает!"
    
    # Тестируем health endpoint
    echo ""
    echo "🏥 Тестируем health endpoint..."
    if command -v curl >/dev/null 2>&1; then
        curl -s "http://localhost:3001/api/health" | head -c 500
        echo ""
    else
        echo "⚠️ curl не найден, пропускаем тест endpoint"
    fi
    
    echo ""
    echo "🛑 Останавливаем сервер..."
    kill $SERVER_PID
    
    # Ждем завершения
    wait $SERVER_PID 2>/dev/null
    
    echo "✅ Сервер успешно остановлен"
    echo ""
    echo "🎯 РЕЗУЛЬТАТ: УСПЕХ - Сервер запустился корректно!"
    
else
    echo "❌ Сервер не запустился или завершился с ошибкой"
    echo ""
    echo "🎯 РЕЗУЛЬТАТ: ОШИБКА - Сервер не смог запуститься!"
    
    cd "$ORIGINAL_DIR"
    exit 1
fi

# Возвращаемся в исходную директорию
cd "$ORIGINAL_DIR"

echo ""
echo "==========================================="
echo "🏁 Тестирование завершено"
echo "==========================================="
#!/bin/bash

echo "🔥 Тестирование команды: cd server && tsx src/app.ts"
echo "=================================================="
echo

# Проверяем рабочую директорию
echo "📁 Текущая директория: $(pwd)"

# Проверяем наличие папки server
if [ ! -d "server" ]; then
    echo "❌ Папка 'server' не найдена!"
    exit 1
fi
echo "✅ Папка 'server' найдена"

# Переходим в папку server
cd server
echo "📁 Перешли в: $(pwd)"

# Проверяем наличие файла app.ts
if [ ! -f "src/app.ts" ]; then
    echo "❌ Файл 'src/app.ts' не найден!"
    exit 1
fi
echo "✅ Файл 'src/app.ts' найден"

# Проверяем наличие tsx
echo
echo "🔍 Проверяем доступность tsx..."
if command -v npx >/dev/null 2>&1; then
    echo "✅ npx доступен"
    
    if npx tsx --version >/dev/null 2>&1; then
        TSX_VERSION=$(npx tsx --version 2>/dev/null)
        echo "✅ tsx доступен, версия: $TSX_VERSION"
    else
        echo "❌ tsx недоступен через npx"
        exit 1
    fi
else
    echo "❌ npx недоступен"
    exit 1
fi

echo
echo "🚀 Запускаем команду: tsx src/app.ts"
echo "=================================="

# Запускаем tsx с ограничением по времени
timeout 8s npx tsx src/app.ts &
TSX_PID=$!

echo "🆔 PID процесса tsx: $TSX_PID"
echo "⏰ Ожидание запуска (8 секунд)..."

# Ждём завершения или таймаута
wait $TSX_PID 2>/dev/null
EXIT_CODE=$?

echo
echo "📊 РЕЗУЛЬТАТ:"
echo "============"

if [ $EXIT_CODE -eq 124 ]; then
    echo "✅ Процесс работал и был остановлен по таймауту"
    echo "🎯 УСПЕХ: Команда tsx src/app.ts работает!"
elif [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Процесс завершился корректно"
    echo "🎯 УСПЕХ: Команда выполнена без ошибок"
else
    echo "❌ Процесс завершился с ошибкой (код: $EXIT_CODE)"
    echo "🎯 ОШИБКА: Проблема с выполнением команды"
fi

echo
echo "🏁 Тестирование завершено"
echo "========================"

# Возвращаемся в исходную директорию
cd ..

exit $EXIT_CODE
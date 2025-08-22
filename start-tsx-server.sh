#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Запуск TypeScript сервера ===${NC}"
echo -e "${YELLOW}Переходим в папку server...${NC}"

# Проверяем существование папки server
if [ ! -d "server" ]; then
    echo -e "${RED}❌ Ошибка: Папка 'server' не найдена${NC}"
    exit 1
fi

cd server

# Проверяем существование файла app.ts
if [ ! -f "src/app.ts" ]; then
    echo -e "${RED}❌ Ошибка: Файл 'src/app.ts' не найден${NC}"
    exit 1
fi

echo -e "${YELLOW}Текущая директория: $(pwd)${NC}"
echo -e "${YELLOW}Запускаем команду: tsx src/app.ts${NC}"
echo -e "${BLUE}===========================================${NC}"

# Запуск сервера с таймаутом для тестирования
timeout 10s tsx src/app.ts

# Проверяем код завершения
exit_code=$?

echo -e "${BLUE}===========================================${NC}"

if [ $exit_code -eq 124 ]; then
    echo -e "${GREEN}✅ Сервер успешно запустился (остановлен по таймауту)${NC}"
elif [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✅ Сервер завершился корректно${NC}"
else
    echo -e "${RED}❌ Сервер завершился с ошибкой (код: $exit_code)${NC}"
fi

exit $exit_code
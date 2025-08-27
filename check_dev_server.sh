#!/bin/bash

echo "=== Проверка статуса разработческого сервера ==="
echo

# Функция для поиска процессов
check_processes() {
    echo "1. Поиск запущенных процессов Node.js и Vite..."
    
    # Поиск процессов Node.js
    echo "Node.js процессы:"
    NODE_PROCESSES=$(ps aux | grep -E "(node|nodejs)" | grep -v grep | grep -v "check_dev_server.sh")
    if [ -n "$NODE_PROCESSES" ]; then
        echo "$NODE_PROCESSES"
        FOUND_NODE=true
    else
        echo "Не найдено запущенных Node.js процессов"
        FOUND_NODE=false
    fi
    
    echo
    
    # Поиск процессов Vite
    echo "Vite процессы:"
    VITE_PROCESSES=$(ps aux | grep -i vite | grep -v grep | grep -v "check_dev_server.sh")
    if [ -n "$VITE_PROCESSES" ]; then
        echo "$VITE_PROCESSES"
        FOUND_VITE=true
    else
        echo "Не найдено запущенных Vite процессов"
        FOUND_VITE=false
    fi
    
    echo
    
    # Поиск процессов npm/yarn
    echo "npm/yarn dev процессы:"
    DEV_PROCESSES=$(ps aux | grep -E "(npm|yarn).*dev" | grep -v grep | grep -v "check_dev_server.sh")
    if [ -n "$DEV_PROCESSES" ]; then
        echo "$DEV_PROCESSES"
        FOUND_DEV=true
    else
        echo "Не найдено запущенных npm/yarn dev процессов"
        FOUND_DEV=false
    fi
}

# Функция для проверки портов
check_ports() {
    echo "2. Проверка занятых портов (3000, 5173, 4173)..."
    
    for port in 3000 5173 4173; do
        PORT_PROCESS=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$PORT_PROCESS" ]; then
            echo "Порт $port занят процессом PID: $PORT_PROCESS"
            lsof -i:$port
            FOUND_PORTS=true
        else
            echo "Порт $port свободен"
        fi
    done
}

# Функция для завершения процессов
kill_processes() {
    echo "3. Завершение найденных процессов..."
    
    # Завершить процессы на портах разработки
    for port in 3000 5173 4173; do
        PORT_PIDS=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$PORT_PIDS" ]; then
            echo "Завершение процессов на порту $port: $PORT_PIDS"
            kill -TERM $PORT_PIDS 2>/dev/null
            sleep 2
            # Если процессы все еще работают, принудительно завершить
            PORT_PIDS=$(lsof -ti:$port 2>/dev/null)
            if [ -n "$PORT_PIDS" ]; then
                echo "Принудительное завершение процессов на порту $port: $PORT_PIDS"
                kill -KILL $PORT_PIDS 2>/dev/null
            fi
        fi
    done
    
    # Завершить все процессы vite
    VITE_PIDS=$(pgrep -f "vite" | grep -v $$)
    if [ -n "$VITE_PIDS" ]; then
        echo "Завершение Vite процессов: $VITE_PIDS"
        kill -TERM $VITE_PIDS 2>/dev/null
        sleep 2
        VITE_PIDS=$(pgrep -f "vite" | grep -v $$)
        if [ -n "$VITE_PIDS" ]; then
            kill -KILL $VITE_PIDS 2>/dev/null
        fi
    fi
}

# Функция для запуска сервера разработки
start_dev_server() {
    echo "4. Запуск сервера разработки..."
    
    # Проверить наличие npm или yarn
    if command -v npm &> /dev/null; then
        echo "Найден npm, запускаем npm run dev..."
        npm run dev &
        DEV_PID=$!
        echo "Сервер разработки запущен с PID: $DEV_PID"
    elif command -v yarn &> /dev/null; then
        echo "Найден yarn, запускаем yarn dev..."
        yarn dev &
        DEV_PID=$!
        echo "Сервер разработки запущен с PID: $DEV_PID"
    else
        echo "Ошибка: не найден npm или yarn"
        exit 1
    fi
    
    # Ждем запуска сервера
    echo "Ожидание запуска сервера (5 секунд)..."
    sleep 5
    
    # Проверяем, запустился ли сервер
    if ps -p $DEV_PID > /dev/null 2>&1; then
        echo "Сервер разработки успешно запущен!"
        
        # Проверяем доступность портов
        for port in 3000 5173 4173; do
            if lsof -i:$port &> /dev/null; then
                echo "Сервер доступен на порту $port"
                echo "Откройте браузер и перейдите по адресу: http://localhost:$port"
                break
            fi
        done
    else
        echo "Ошибка: сервер разработки не запустился"
        exit 1
    fi
}

# Основная логика
main() {
    FOUND_NODE=false
    FOUND_VITE=false
    FOUND_DEV=false
    FOUND_PORTS=false
    
    check_processes
    check_ports
    
    if [ "$FOUND_NODE" = true ] || [ "$FOUND_VITE" = true ] || [ "$FOUND_DEV" = true ] || [ "$FOUND_PORTS" = true ]; then
        echo
        echo "Найдены запущенные процессы. Завершаем их..."
        kill_processes
        echo "Процессы завершены."
        echo
        sleep 2
    else
        echo "Запущенных процессов разработки не найдено."
        echo
    fi
    
    start_dev_server
}

# Запуск основной функции
main

echo
echo "=== Проверка завершена ==="
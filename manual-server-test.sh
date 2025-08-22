#!/bin/bash

echo "🧪 РУЧНОЕ ТЕСТИРОВАНИЕ СЕРВЕРА"
echo "==============================================="

SERVER_URL="http://localhost:3001"

echo ""
echo "🚀 Запуск сервера в background..."
cd server && node quick-server.js &
SERVER_PID=$!

echo "⏳ Ожидание запуска сервера..."
sleep 3

echo ""
echo "🏥 Тестирование /api/health"
echo "curl $SERVER_URL/api/health"
curl -s "$SERVER_URL/api/health" | jq '.' || curl -s "$SERVER_URL/api/health"

echo ""
echo ""
echo "🔐 Тестирование логина"
echo "curl -X POST $SERVER_URL/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"smm@gelazutdinov.ru\",\"password\":\"admin123\"}'"
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"smm@gelazutdinov.ru","password":"admin123"}')

echo "$LOGIN_RESPONSE" | jq '.' || echo "$LOGIN_RESPONSE"

# Извлекаем токен для дальнейших тестов
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null || echo "")

echo ""
echo ""
if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "🔍 Тестирование /api/auth/me с токеном"
    echo "curl -H 'Authorization: Bearer $TOKEN' $SERVER_URL/api/auth/me"
    curl -s -H "Authorization: Bearer $TOKEN" "$SERVER_URL/api/auth/me" | jq '.' || curl -s -H "Authorization: Bearer $TOKEN" "$SERVER_URL/api/auth/me"
else
    echo "❌ Токен не получен, пропускаем тест /api/auth/me"
fi

echo ""
echo ""
echo "📝 Тестирование регистрации"
TIMESTAMP=$(date +%s)
curl -s -X POST "$SERVER_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$TIMESTAMP@test.com\",\"password\":\"testpass123\",\"name\":\"Test User\"}" | jq '.' || \
curl -s -X POST "$SERVER_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$TIMESTAMP@test.com\",\"password\":\"testpass123\",\"name\":\"Test User\"}"

echo ""
echo ""
echo "🔍 Тестирование 404"
curl -s "$SERVER_URL/api/nonexistent" | jq '.' || curl -s "$SERVER_URL/api/nonexistent"

echo ""
echo ""
echo "🛑 Остановка сервера..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo ""
echo "✅ Тестирование завершено"
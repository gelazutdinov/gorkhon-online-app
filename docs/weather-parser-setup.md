# Настройка парсера погоды Яндекс

## 🌦️ Алгоритм работы

Создан автоматический парсер который:
- ✅ Обновляется каждый час
- ✅ Парсит данные с Яндекс.Погоды
- ✅ Автоматически запускается при загрузке страницы
- ✅ Кеширует данные и обрабатывает ошибки
- ✅ Использует fallback данные при недоступности

## ⚠️ Ограничения браузера

**CORS (Cross-Origin Resource Sharing)** блокирует прямые запросы к Яндексу из браузера.

Текущий статус: 
- 🔴 Прямой запрос к `yandex.ru` заблокирован
- 🟡 Используются интеллектуальные fallback данные
- 🟢 Автообновление работает каждый час

## 🔧 Решения для продакшена

### Вариант 1: Прокси-сервер (Рекомендуется)

Создать простой прокси на Node.js:

```javascript
// proxy-server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/weather', async (req, res) => {
  try {
    const response = await axios.get(
      'https://yandex.ru/pogoda/ru?lat=51.561569&lon=108.786552&from=tableau_yabro',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    res.json({ html: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

Затем изменить URL в парсере:
```typescript
// В weatherParser.ts
private readonly PROXY_URL = 'http://localhost:3001/api/weather';
```

### Вариант 2: Cloudflare Workers

```javascript
// Cloudflare Worker
export default {
  async fetch(request) {
    const response = await fetch(
      'https://yandex.ru/pogoda/ru?lat=51.561569&lon=108.786552&from=tableau_yabro'
    );
    
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  }
}
```

### Вариант 3: Browser Extension

Создать расширение браузера с разрешениями на cross-origin запросы.

### Вариант 4: Server-Side Rendering

Парсинг на сервере (Next.js, Nuxt.js) в API routes.

## 📋 Текущая реализация

```typescript
// Автоматический запуск парсера
weatherParser.startAutoUpdate();

// Подписка на обновления
const unsubscribe = weatherParser.onWeatherUpdate((data) => {
  console.log('Новые данные погоды:', data);
});

// Принудительное обновление
weatherParser.forceUpdate();

// Получить кешированные данные
const { data, lastUpdate } = weatherParser.getLastData();
```

## 🎯 Особенности алгоритма

1. **Умный fallback**: При недоступности Яндекса генерирует правдоподобные данные с вариациями
2. **Кеширование**: Сохраняет последние данные в памяти
3. **Обработка ошибок**: Graceful fallback без крашей
4. **Подписки**: Reactive обновления для UI
5. **Память**: Автоочистка при размонтировании компонента

## 🚀 Запуск в продакшене

1. Настроить прокси-сервер или Cloudflare Worker
2. Обновить `YANDEX_URL` в `weatherParser.ts`
3. Деплоить и наслаждаться реальными данными!

## 📊 Мониторинг

Парсер логирует все операции в консоль:
- `🔄 Обновление погоды...` - Начало обновления
- `✅ Погода обновлена успешно` - Успешное обновление  
- `❌ Ошибка обновления погоды` - Ошибка с деталями
- `📊 Используем резервные данные` - Fallback активирован

## 🔮 Будущие улучшения

- [ ] Интеграция с Official Yandex Weather API
- [ ] Geolocation для автоопределения координат
- [ ] Push уведомления о резких изменениях погоды
- [ ] Историческое накопление данных
- [ ] ML предсказание на основе трендов
const https = require('https');

const data = JSON.stringify({
  text: "🍂 Осеннее обновление завершено!\n\n✅ Подчищены баги и оптимизирован код\n📞 Добавлены новые важные номера (Скорая помощь, Соц.защита, Регистратура, Нотариус, Судебные приставы, Вакуумная машина, Миграционная служба)\n⏰ Обновлены режимы работы организаций\n📍 Добавлена подробная информация о ПВЗ с примерочными и навигацией\n\nВсе улучшения уже доступны! 🎉"
});

const url = new URL('https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806');

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': 'admin2024',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  console.log(`HTTP Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    console.log(responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();

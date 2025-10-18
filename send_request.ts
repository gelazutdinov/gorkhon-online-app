const response = await fetch('https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': 'admin2024'
  },
  body: JSON.stringify({
    text: "🍂 Осеннее обновление завершено!\n\n✅ Подчищены баги и оптимизирован код\n📞 Добавлены новые важные номера (Скорая помощь, Соц.защита, Регистратура, Нотариус, Судебные приставы, Вакуумная машина, Миграционная служба)\n⏰ Обновлены режимы работы организаций\n📍 Добавлена подробная информация о ПВЗ с примерочными и навигацией\n\nВсе улучшения уже доступны! 🎉"
  })
});

console.log('HTTP Status Code:', response.status);
console.log('Status Text:', response.statusText);
console.log('\nResponse Headers:');
for (const [key, value] of response.headers.entries()) {
  console.log(`  ${key}: ${value}`);
}

const responseText = await response.text();
console.log('\nResponse Body:');
console.log(responseText);

// Try to parse as JSON if possible
try {
  const jsonData = JSON.parse(responseText);
  console.log('\nParsed JSON:');
  console.log(JSON.stringify(jsonData, null, 2));
} catch (e) {
  // Not JSON, already printed as text
}

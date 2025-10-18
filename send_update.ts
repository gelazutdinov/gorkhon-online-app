const message = {
  text: `🍂 Осеннее обновление завершено!

✅ Подчищены баги и оптимизирован код
📞 Добавлены новые важные номера (Скорая помощь, Соц.защита, Регистратура, Нотариус, Судебные приставы, Вакуумная машина, Миграционная служба)
⏰ Обновлены режимы работы организаций
📍 Добавлена подробная информация о ПВЗ с примерочными и навигацией

Все улучшения уже доступны! 🎉`
};

const response = await fetch('https://functions.poehali.dev/a7b8d7b8-eb5d-4ecc-ac30-8672db766806', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': 'admin2024'
  },
  body: JSON.stringify(message)
});

const result = await response.json();
console.log('Status:', response.status);
console.log('Response:', result);

if (response.ok) {
  console.log('✅ Сообщение успешно отправлено в системный чат!');
} else {
  console.log('❌ Ошибка отправки');
}

const TermsOfUse = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 mb-4">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Общие условия</h2>
      <p className="text-gray-700 mb-4">
        Используя информационный портал Горхон.Online, вы соглашаетесь с настоящими правилами пользования.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Назначение портала</h2>
      <p className="text-gray-700 mb-4">
        Горхон.Online предоставляет информационные услуги жителям поселка:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Контактная информация организаций и служб</li>
        <li>Важные телефоны экстренных служб</li>
        <li>Техническая поддержка пользователей</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Правила использования</h2>
      <p className="text-gray-700 mb-4">
        При использовании портала запрещается:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Распространять ложную информацию</li>
        <li>Нарушать работу технических систем портала</li>
        <li>Использовать портал в незаконных целях</li>
        <li>Размещать материалы, нарушающие права третьих лиц</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Ответственность</h2>
      <p className="text-gray-700 mb-4">
        Администрация портала не несёт ответственности за:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Действия организаций, контакты которых размещены на портале</li>
        <li>Временные технические сбои и перерывы в работе</li>
        <li>Изменения в контактной информации организаций</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Изменение правил</h2>
      <p className="text-gray-700 mb-4">
        Администрация оставляет за собой право изменять настоящие правила. Актуальная версия всегда доступна на портале.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Техническая поддержка</h2>
      <p className="text-gray-700 mb-4">
        Для получения помощи используйте чат с ИИ-помощником Лина или форму обратной связи.
      </p>
    </div>
  );
};

export default TermsOfUse;

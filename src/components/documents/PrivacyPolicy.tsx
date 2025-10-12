const PrivacyPolicy = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 mb-4">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Общие положения</h2>
      <p className="text-gray-700 mb-4">
        Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных данных пользователей информационного портала Горхон.Online.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Сбор персональных данных</h2>
      <p className="text-gray-700 mb-4">
        Мы собираем только ту информацию, которая необходима для предоставления качественного сервиса:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Данные, которые вы предоставляете при использовании чата поддержки</li>
        <li>Техническую информацию о вашем устройстве и браузере</li>
        <li>Информацию о посещаемых разделах портала</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Использование данных</h2>
      <p className="text-gray-700 mb-4">
        Собранные данные используются исключительно для:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Улучшения качества предоставляемых услуг</li>
        <li>Оказания технической поддержки</li>
        <li>Анализа работы портала</li>
        <li>Предотвращения мошенничества и злоупотреблений</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Защита данных</h2>
      <p className="text-gray-700 mb-4">
        Мы применяем современные технологии защиты информации и не передаём ваши данные третьим лицам без вашего согласия.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Ваши права</h2>
      <p className="text-gray-700 mb-4">
        Вы имеете право на доступ, изменение и удаление своих персональных данных. Для этого обратитесь в службу поддержки через чат на портале.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Контакты</h2>
      <p className="text-gray-700 mb-4">
        По вопросам обработки персональных данных обращайтесь к нашему ИИ-помощнику Лина или через форму обратной связи.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

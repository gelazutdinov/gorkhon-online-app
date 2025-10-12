const SecurityPolicy = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 mb-4">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Принципы защиты</h2>
      <p className="text-gray-700 mb-4">
        Защита информации пользователей портала Горхон.Online является нашим приоритетом.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Технические меры защиты</h2>
      <p className="text-gray-700 mb-4">
        Мы применяем следующие меры безопасности:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Шифрование передаваемых данных (HTTPS)</li>
        <li>Регулярное обновление систем безопасности</li>
        <li>Мониторинг попыток несанкционированного доступа</li>
        <li>Резервное копирование данных</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Хранение данных</h2>
      <p className="text-gray-700 mb-4">
        Персональные данные хранятся на защищённых серверах с ограниченным доступом. Доступ к данным имеют только уполномоченные сотрудники.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Рекомендации пользователям</h2>
      <p className="text-gray-700 mb-4">
        Для обеспечения безопасности рекомендуем:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Использовать актуальные версии браузеров</li>
        <li>Не передавать личные данные третьим лицам</li>
        <li>Сообщать о подозрительной активности в службу поддержки</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Инциденты безопасности</h2>
      <p className="text-gray-700 mb-4">
        В случае обнаружения инцидентов безопасности мы незамедлительно принимаем меры по их устранению и информируем затронутых пользователей.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Контроль и аудит</h2>
      <p className="text-gray-700 mb-4">
        Регулярно проводится аудит систем безопасности для выявления и устранения потенциальных уязвимостей.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Обратная связь</h2>
      <p className="text-gray-700 mb-4">
        О любых вопросах, связанных с безопасностью информации, сообщайте через чат поддержки или форму обратной связи.
      </p>
    </div>
  );
};

export default SecurityPolicy;

interface KnowledgeResponse {
  text: string;
  showAgentButton?: boolean;
  category?: 'platform' | 'life' | 'technical';
  needsWebSearch?: boolean;
  searchQuery?: string;
  showAdminLink?: boolean;
}

export const getLinaResponse = (userMessage: string): KnowledgeResponse => {
  const msg = userMessage.toLowerCase();
  
  // === АДМИН-ПАНЕЛЬ ===
  if (msg.includes('нужна админ-панель') || msg.includes('админ панель') || msg.includes('админка')) {
    return {
      text: 'Открываю админ-панель для управления платформой.\n\nДоступны: редактирование важных номеров, расписание транспорта, помощь посёлку.\n\nНажмите кнопку ниже для перехода.',
      category: 'platform',
      showAdminLink: true
    };
  }
  
  // === ПРИВЕТСТВИЯ ===
  if (msg.includes('привет') || msg.includes('здравствуй') || msg.includes('добрый') || msg.includes('хай') || msg.includes('hi') || msg.includes('hello') || msg.includes('как дела') || msg.includes('как ты') || msg.includes('что у тебя')) {
    return {
      text: 'Привет! Всё отлично, готова помогать.\n\nЯ — Лина, ассистент Горхон.Online. Отвечу на вопросы о посёлке, подскажу контакты, найду информацию.\n\nЧем помочь?',
      category: 'platform'
    };
  }
  
  // === О ЛИНЕ ===
  if (msg.includes('кто ты') || msg.includes('что ты') || msg.includes('ты кто') || msg.includes('расскажи о себе')) {
    return {
      text: 'Я — Лина, ассистент Горхон.Online.\n\nМогу искать информацию в интернете, отвечать на вопросы о посёлке, подсказывать контакты, помогать с платформой.\n\nРаботаю круглосуточно.',
      category: 'platform'
    };
  }
  
  // === ЭКСТРЕННЫЕ СЛУЖБЫ ===
  if (msg.includes('скорая') || msg.includes('112') || msg.includes('экстренн') || msg.includes('срочно') || msg.includes('помощь')) {
    return {
      text: 'В экстренной ситуации звоните 112 — это единый номер пожарной, полиции и скорой.\n\nСкорая помощь Новый: 7-301-364-51-03 или 112',
      category: 'platform'
    };
  }
  
  // === МЕДИЦИНА ===
  if (msg.includes('фап') || msg.includes('больниц') || msg.includes('врач') || msg.includes('поликлиник') || msg.includes('здоровье') || msg.includes('лечение')) {
    return {
      text: 'Регистратура поликлиники Заиграево: +7-924-555-90-03\n\nСохраните номер заранее. При экстренных случаях звоните 112 или 7-301-364-51-03',
      category: 'platform'
    };
  }
  
  // === ПОЛИЦИЯ/УЧАСТКОВЫЙ ===
  if (msg.includes('участков') || msg.includes('полиц') || msg.includes('милиц') || msg.includes('правопорядок')) {
    return {
      text: 'Участковый Алексей: +7-999-275-34-13\n\nПри экстренных случаях звоните 112. По плановым вопросам обращайтесь к участковому.',
      category: 'platform'
    };
  }
  
  // === ЭЛЕКТРИЧЕСТВО ===
  if (msg.includes('электричеств') || msg.includes('свет') || msg.includes('рэс') || msg.includes('энерг') || msg.includes('отключ') || msg.includes('авария')) {
    return {
      text: 'Диспетчер РЭС: +7-301-234-40-83\n\nПри отключении света сначала проверьте автоматы в щитке, потом звоните диспетчеру.',
      category: 'platform'
    };
  }
  
  // === МУСОР ===
  if (msg.includes('мусор') || msg.includes('эко') || msg.includes('экоальянс') || msg.includes('вывоз') || msg.includes('контейнер')) {
    return {
      text: 'Диспетчер ЭкоАльянс: +7-983-433-95-71\n\nЗвоните при переполненных контейнерах, дополнительном вывозе или крупногабаритном мусоре.',
      category: 'platform'
    };
  }
  
  // === МФЦ И ДОКУМЕНТЫ ===
  if (msg.includes('мфц') || msg.includes('документ') || msg.includes('справк') || msg.includes('заиграев') || msg.includes('паспорт') || msg.includes('госуслуг')) {
    return {
      text: 'МФЦ Заиграево: +7-301-364-11-01\n\nЗапишитесь заранее, чтобы не стоять в очереди. Многие услуги доступны онлайн через Госуслуги.',
      category: 'platform'
    };
  }
  
  // === ПОЧТА ===
  if (msg.includes('почт') || msg.includes('посылк') || msg.includes('отправ') || msg.includes('письмо')) {
    return {
      text: 'Почта Горхон, Елена: 8-914-843-45-93\n\nОтправка и получение посылок, письма, переводы. Следите за треком через приложение Почты России.',
      category: 'platform'
    };
  }
  
  // === ВСЕ КОНТАКТЫ ===
  if (msg.includes('контакт') || msg.includes('номер') || msg.includes('телефон') || msg.includes('позвонить') || msg.includes('где найти')) {
    return {
      text: 'Важные контакты:\nУчастковый: +7-999-275-34-13\nРЭС: +7-301-234-40-83\nЭкоАльянс: +7-983-433-95-71\nМФЦ: +7-301-364-11-01\nПочта: 8-914-843-45-93\nСкорая: 112, 7-301-364-51-03\n\nВсе номера на главной странице — прокрутите вниз.',
      category: 'platform'
    };
  }
  
  // === КАК РАБОТАЕТ ПЛАТФОРМА ===
  if (msg.includes('как работа') || msg.includes('как пользова') || msg.includes('инструкц') || msg.includes('как найти') || msg.includes('где посмотреть')) {
    return {
      text: 'На главной странице все контакты в одном месте. Кликните на номер — сразу позвоните.\n\nМеню — документы и информация. Я всегда здесь для помощи.\n\nМожно добавить на главный экран — работает как приложение.',
      category: 'platform'
    };
  }
  
  // === ТЕХНИЧЕСКИЕ ПРОБЛЕМЫ ===
  if (msg.includes('не работает') || msg.includes('ошибка') || msg.includes('баг') || msg.includes('не открывается') || msg.includes('проблем') || msg.includes('сломал')) {
    return {
      text: 'Попробуйте:\n1. Обновите страницу\n2. Проверьте интернет\n3. Очистите кеш браузера (Ctrl+Shift+Del)\n4. Перезагрузите устройство\n\nОпишите проблему подробнее — помогу разобраться.',
      category: 'technical',
      showAgentButton: true
    };
  }
  
  // === МЕДЛЕННАЯ РАБОТА ===
  if (msg.includes('медленн') || msg.includes('тормоз') || msg.includes('долго') || msg.includes('зависа') || msg.includes('грузится')) {
    return {
      text: 'Проверьте скорость интернета на Speedtest.net — нужно минимум 2-3 Мбит/с.\n\nЗакройте лишние вкладки и программы. Попробуйте Wi-Fi вместо мобильного.\n\nВсё ещё медленно? Сообщите агенту — проверим сервер.',
      category: 'technical',
      showAgentButton: true
    };
  }
  
  // === УСТАНОВКА ПРИЛОЖЕНИЯ ===
  if (msg.includes('установ') || msg.includes('приложение') || msg.includes('скачать') || msg.includes('app')) {
    return {
      text: 'Установка на главный экран:\n\nAndroid: меню → "Добавить на главный экран"\niPhone: "Поделиться" → "На экран Домой"\n\nБудет работать как приложение — быстро и удобно.',
      category: 'technical'
    };
  }
  
  // === БЕЗОПАСНОСТЬ И ПРИВАТНОСТЬ ===
  if (msg.includes('безопасн') || msg.includes('приватн') || msg.includes('данные') || msg.includes('конфиденциальн')) {
    return {
      text: 'Ваши данные в безопасности. Соединение защищено HTTPS.\n\nНе собираем личную информацию и не продаём данные. Подробности в меню → Документы.',
      category: 'platform'
    };
  }
  
  // === ЖИЗНЕННЫЕ СОВЕТЫ - ПОГОДА ===
  if (msg.includes('погод') || msg.includes('температур') || msg.includes('дождь') || msg.includes('снег')) {
    return {
      text: 'Рекомендую Яндекс.Погода или Gismeteo для точного прогноза.\n\nВ Бурятии резкие перепады: зимой до -40°C, летом до +35°C. Одевайтесь по погоде.',
      category: 'life'
    };
  }
  
  // === ТРАНСПОРТ ===
  if (msg.includes('автобус') || msg.includes('маршрутк') || msg.includes('транспорт') || msg.includes('улан-удэ') || msg.includes('уехать') || msg.includes('доехать')) {
    return {
      text: 'Расписание автобусов есть в меню платформы.\n\nМаршрут: Горхон — Заиграево — Улан-Удэ. Уточняйте время у водителей — может меняться.',
      category: 'platform'
    };
  }
  
  // === ИНТЕРНЕТ И СВЯЗЬ ===
  if (msg.includes('интернет') || msg.includes('wi-fi') || msg.includes('wifi') || msg.includes('связь') || msg.includes('мобильн') || msg.includes('сим-карт')) {
    return {
      text: 'Основные операторы: МТС, Билайн, Мегафон.\n\nДля стабильного интернета выбирайте тарифы с большим пакетом данных. Проводной интернет уточняйте у местных провайдеров.',
      category: 'life'
    };
  }
  
  // === ШКОЛА ===
  if (msg.includes('школ') || msg.includes('учител') || msg.includes('образован') || msg.includes('дети') || msg.includes('класс')) {
    return {
      text: 'В Горхоне есть школа. Контакты и информацию уточняйте в администрации посёлка или у участкового.',
      category: 'life'
    };
  }
  
  // === МАГАЗИНЫ ===
  if (msg.includes('магазин') || msg.includes('продукт') || msg.includes('купить') || msg.includes('еда') || msg.includes('хлеб')) {
    return {
      text: 'В посёлке есть продуктовые магазины.\n\nДля больших покупок можно съездить в Заиграево или Улан-Удэ. Время работы уточняйте на месте.',
      category: 'life'
    };
  }
  
  // === РАБОТА ===
  if (msg.includes('работ') || msg.includes('вакансии') || msg.includes('трудоустройств') || msg.includes('зарплат')) {
    return {
      text: 'Местные вакансии уточняйте в администрации посёлка или у участкового.\n\nШирокий выбор вакансий в Улан-Удэ. Смотрите на hh.ru, Авито, Работа.ру.',
      category: 'life'
    };
  }
  
  // === ДОСУГ ===
  if (msg.includes('досуг') || msg.includes('развлечен') || msg.includes('куда сходить') || msg.includes('что делать') || msg.includes('скучно')) {
    return {
      text: 'В Горхоне красивая природа — прогулки, рыбалка, походы.\n\nДля развлечений езжайте в Улан-Удэ: кинотеатры, кафе, торговые центры, музеи.',
      category: 'life'
    };
  }
  
  // === БАЙКАЛ ===
  if (msg.includes('байкал') || msg.includes('озеро') || msg.includes('турист') || msg.includes('поездк')) {
    return {
      text: 'До Байкала около 100 км от Горхона.\n\nПопулярные места: Листвянка, Ольхон, Аршан. Добраться можно на автобусе или машине. Планируйте поездку заранее.',
      category: 'life'
    };
  }
  
  // === АДМИНИСТРАЦИЯ ===
  if (msg.includes('администрац') || msg.includes('глава') || msg.includes('власт') || msg.includes('официальн')) {
    return {
      text: 'Контакты администрации посёлка уточняйте у участкового Алексея: +7-999-275-34-13\n\nОн подскажет по всем официальным вопросам.',
      category: 'platform'
    };
  }
  
  // === ИСТОРИЯ ===
  if (msg.includes('истори') || msg.includes('откуда') || msg.includes('название') || msg.includes('основан')) {
    return {
      text: 'Горхон — старинное село в Бурятии. Название произошло от бурятского языка.\n\nДля подробной истории могу поискать информацию в интернете — попросите меня найти.',
      category: 'life'
    };
  }
  
  // === БЛАГОДАРНОСТЬ ===
  if (msg.includes('спасибо') || msg.includes('благодар') || msg.includes('спс') || msg.includes('thanks') || msg.includes('thank you')) {
    return {
      text: 'Всегда рада помочь! Обращайтесь, если нужна ещё информация.',
      category: 'platform'
    };
  }
  
  // === ПРОЩАНИЕ ===
  if (msg.includes('пока') || msg.includes('до свидания') || msg.includes('bye') || msg.includes('досвидос')) {
    return {
      text: 'До встречи! Если что — я здесь, обращайтесь.',
      category: 'platform'
    };
  }
  
  // === ПОИСК В ИНТЕРНЕТЕ ===
  if (msg.includes('найди') || msg.includes('поищи') || msg.includes('погугли') || msg.includes('что такое') || msg.includes('кто такой') || msg.includes('расскажи про')) {
    return {
      text: 'Ищу информацию в интернете...',
      category: 'platform',
      needsWebSearch: true,
      searchQuery: userMessage
    };
  }
  
  // Универсальный ответ
  return {
    text: 'Могу помочь с информацией о Горхоне, подсказать контакты или поискать в интернете.\n\nЗадайте вопрос — постараюсь ответить.',
    category: 'platform'
  };
};

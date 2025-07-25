import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Кнопка возврата на платформу */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gorkhon-blue text-white rounded-lg hover:bg-gorkhon-blue/90 transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Вернуться на платформу</span>
        </Link>
      </div>

      {/* Заголовок */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Icon name="FileText" size={32} className="text-gorkhon-pink" />
          <h1 className="text-3xl font-bold text-gray-800">
            Пользовательское соглашение
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Правила и условия использования портала жителей поселка Горхон
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Версия 1.0 от {new Date().toLocaleDateString('ru-RU')}
        </div>
      </div>

      {/* Краткое описание */}
      <div className="bg-gradient-to-r from-gorkhon-blue/10 to-gorkhon-pink/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-gorkhon-blue" />
          О соглашении
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Используя портал жителей поселка Горхон, вы соглашаетесь с условиями, изложенными в этом документе. 
          Мы стремимся создать комфортное и безопасное цифровое пространство для всех жителей.
        </p>
      </div>

      {/* Разделы соглашения */}
      <div className="space-y-4">
        {/* Общие положения */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('general')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="BookOpen" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Общие положения</span>
            </div>
            <Icon 
              name={activeSection === 'general' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'general' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">🏠 О портале</h4>
                  <p className="text-gray-700 mb-2">
                    Портал жителей поселка Горхон — это цифровая платформа, созданная для:
                  </p>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Информирования жителей о важных событиях</li>
                    <li>• Предоставления актуального расписания транспорта</li>
                    <li>• Координации помощи военнослужащим</li>
                    <li>• Работы с пунктом выдачи заказов</li>
                    <li>• Общения между жителями поселка</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">👥 Кто может пользоваться</h4>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Жители поселка Горхон</li>
                    <li>• Временно пребывающие в поселке</li>
                    <li>• Представители организаций, работающих с поселком</li>
                    <li>• Родственники жителей (с ограничениями по функциям)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">📱 Доступ к сервису</h4>
                  <p className="text-gray-700">
                    Портал доступен 24/7 через веб-браузер. Для полного функционала 
                    необходима регистрация. Некоторые разделы доступны без регистрации.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Права и обязанности пользователей */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('rights-duties')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Scale" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Права и обязанности</span>
            </div>
            <Icon 
              name={activeSection === 'rights-duties' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'rights-duties' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3">✅ Ваши права</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Доступ к информации</h5>
                      <p className="text-xs text-gray-600">
                        Получать актуальную информацию о жизни поселка
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Конфиденциальность</h5>
                      <p className="text-xs text-gray-600">
                        Защита ваших персональных данных
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Техподдержка</h5>
                      <p className="text-xs text-gray-600">
                        Получать помощь в использовании портала
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Удаление аккаунта</h5>
                      <p className="text-xs text-gray-600">
                        Удалить свой профиль в любое время
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700 mb-3">📋 Ваши обязанности</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Достоверные данные</h5>
                      <p className="text-xs text-gray-600">
                        Указывать правдивую информацию при регистрации
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Уважение к другим</h5>
                      <p className="text-xs text-gray-600">
                        Соблюдать этику общения с другими пользователями
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Безопасность</h5>
                      <p className="text-xs text-gray-600">
                        Не нарушать работу системы и не злоупотреблять доступом
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Законность</h5>
                      <p className="text-xs text-gray-600">
                        Использовать портал только в законных целях
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Правила поведения */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('conduct-rules')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Users" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Правила поведения</span>
            </div>
            <Icon 
              name={activeSection === 'conduct-rules' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'conduct-rules' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <Icon name="ThumbsUp" size={16} />
                    Приветствуется
                  </h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Конструктивное участие в жизни поселка</li>
                    <li>• Помощь другим жителям с информацией</li>
                    <li>• Сообщение о проблемах и предложения решений</li>
                    <li>• Вежливое общение и взаимопомощь</li>
                    <li>• Активное участие в общественных инициативах</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    <Icon name="Ban" size={16} />
                    Запрещается
                  </h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Распространение ложной информации</li>
                    <li>• Оскорбления и агрессивное поведение</li>
                    <li>• Спам и реклама без согласования</li>
                    <li>• Нарушение приватности других пользователей</li>
                    <li>• Попытки взлома или нарушения работы системы</li>
                    <li>• Публикация незаконного контента</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <Icon name="AlertTriangle" size={16} />
                    Ответственность за нарушения
                  </h4>
                  <p className="text-amber-700 text-sm">
                    За нарушение правил могут применяться меры от предупреждения до 
                    полного запрета доступа к порталу. Серьезные нарушения могут 
                    быть переданы в соответствующие органы.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Функции и ограничения */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('functions-limits')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Settings" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Функции и ограничения</span>
            </div>
            <Icon 
              name={activeSection === 'functions-limits' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'functions-limits' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🚀 Доступные функции</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-sm mb-2">Информационные разделы</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Важные телефоны и контакты</li>
                        <li>• Расписание транспорта</li>
                        <li>• Новости и объявления</li>
                        <li>• График работы организаций</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-sm mb-2">Интерактивные функции</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Система донатов для военных</li>
                        <li>• Пункт выдачи заказов</li>
                        <li>• Личный кабинет пользователя</li>
                        <li>• Уведомления о важных событиях</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">⚠️ Ограничения использования</h4>
                  <div className="bg-white p-4 rounded-lg">
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Icon name="Clock" size={14} className="text-gorkhon-pink mt-0.5" />
                        <span>Технические работы могут временно ограничить доступ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Zap" size={14} className="text-gorkhon-pink mt-0.5" />
                        <span>Интенсивное использование может быть ограничено</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Shield" size={14} className="text-gorkhon-pink mt-0.5" />
                        <span>Некоторые функции доступны только зарегистрированным пользователям</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="UserX" size={14} className="text-gorkhon-pink mt-0.5" />
                        <span>Доступ может быть ограничен при нарушении правил</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ответственность и гарантии */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('liability')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="ShieldAlert" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Ответственность и гарантии</span>
            </div>
            <Icon 
              name={activeSection === 'liability' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'liability' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3">✅ Наши гарантии</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm">Безопасность данных</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Защищаем ваши данные современными средствами шифрования
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm">Актуальность информации</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Стремимся поддерживать информацию в актуальном состоянии
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm">Техподдержка</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Отвечаем на обращения в разумные сроки
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700 mb-3">⚠️ Ограничения ответственности</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-orange-500">
                      <h5 className="font-medium text-sm">Технические сбои</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Не несем ответственности за временные сбои в работе
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-orange-500">
                      <h5 className="font-medium text-sm">Действия третьих лиц</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Не отвечаем за информацию, размещенную другими пользователями
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-orange-500">
                      <h5 className="font-medium text-sm">Форс-мажор</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Не отвечаем за невозможность предоставления услуг по независящим причинам
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Изменения соглашения */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('changes')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="RefreshCw" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Изменения и контакты</span>
            </div>
            <Icon 
              name={activeSection === 'changes' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'changes' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🔄 Изменения соглашения</h4>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-700 text-sm mb-3">
                      Мы можем изменять это соглашение для улучшения сервиса. 
                      О существенных изменениях мы уведомим заранее.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Bell" size={16} className="text-gorkhon-pink" />
                      <span className="text-gray-600">
                        Уведомления придут за 7 дней до вступления изменений в силу
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">📞 Контакты для вопросов</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Icon name="Phone" size={20} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium text-sm">Телефон</div>
                      <div className="text-xs text-gray-600">8 (914) 000-00-00</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Icon name="Mail" size={20} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium text-sm">Email</div>
                      <div className="text-xs text-gray-600">info@gorkhon.ru</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Icon name="MessageSquare" size={20} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium text-sm">Поддержка</div>
                      <div className="text-xs text-gray-600">В разделе "Поддержка"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Согласие */}
      <div className="mt-12">
        <div className="bg-gorkhon-blue/5 border-2 border-gorkhon-blue/20 rounded-2xl p-6 text-center">
          <Icon name="HandHeart" size={32} className="text-gorkhon-blue mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gorkhon-blue mb-2">
            Спасибо за использование нашего портала!
          </h3>
          <p className="text-gray-700 mb-4">
            Продолжая пользоваться сервисом, вы соглашаетесь с условиями данного соглашения
          </p>
          <div className="text-sm text-gray-500">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
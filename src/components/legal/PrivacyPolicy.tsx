import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PrivacyPolicy = () => {
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
          <Icon name="Shield" size={32} className="text-gorkhon-pink" />
          <h1 className="text-3xl font-bold text-gray-800">
            Политика конфиденциальности
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Мы заботимся о безопасности ваших данных и прозрачности их использования
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
        </div>
      </div>

      {/* Основные принципы */}
      <div className="bg-gradient-to-r from-gorkhon-pink/10 to-gorkhon-blue/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="Heart" size={20} className="text-gorkhon-pink" />
          Наши принципы
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <Icon name="Lock" size={24} className="text-gorkhon-blue mx-auto mb-2" />
            <div className="font-medium">Безопасность</div>
            <div className="text-sm text-gray-600">Надежная защита данных</div>
          </div>
          <div className="text-center">
            <Icon name="Eye" size={24} className="text-gorkhon-blue mx-auto mb-2" />
            <div className="font-medium">Прозрачность</div>
            <div className="text-sm text-gray-600">Честно о том, что мы делаем</div>
          </div>
          <div className="text-center">
            <Icon name="UserCheck" size={24} className="text-gorkhon-blue mx-auto mb-2" />
            <div className="font-medium">Контроль</div>
            <div className="text-sm text-gray-600">Вы управляете своими данными</div>
          </div>
        </div>
      </div>

      {/* Разделы политики */}
      <div className="space-y-4">
        {/* Какие данные мы собираем */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('data-collection')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Database" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Какие данные мы собираем</span>
            </div>
            <Icon 
              name={activeSection === 'data-collection' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'data-collection' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">📝 Регистрационные данные:</h4>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Имя и фамилия</li>
                    <li>• Адрес электронной почты</li>
                    <li>• Номер телефона</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">📊 Данные об использовании:</h4>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Время проведенное на сайте</li>
                    <li>• Посещенные разделы</li>
                    <li>• Используемые функции</li>
                    <li>• Частота использования сервиса</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-2">🖥️ Технические данные:</h4>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• IP-адрес (только для безопасности)</li>
                    <li>• Тип браузера и устройства</li>
                    <li>• Данные localStorage (хранятся только у вас)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Как мы используем данные */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('data-usage')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Target" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Как мы используем ваши данные</span>
            </div>
            <Icon 
              name={activeSection === 'data-usage' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'data-usage' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-700 mb-2">✅ Что мы ДЕЛАЕМ:</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Обеспечиваем работу портала для жителей</li>
                    <li>• Показываем персонализированную статистику</li>
                    <li>• Улучшаем качество сервиса</li>
                    <li>• Отправляем важные уведомления</li>
                    <li>• Анализируем популярность разделов</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-medium text-red-700 mb-2">❌ Что мы НЕ ДЕЛАЕМ:</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Не продаем ваши данные третим лицам</li>
                    <li>• Не используем для рекламы</li>
                    <li>• Не передаем данные без вашего согласия</li>
                    <li>• Не отслеживаем вас на других сайтах</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Безопасность данных */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('data-security')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Безопасность и защита</span>
            </div>
            <Icon 
              name={activeSection === 'data-security' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'data-security' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🔒 Технические меры:</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>SSL шифрование всех данных</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Локальное хранение в браузере</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Защищенные серверы</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Регулярное резервное копирование</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">👥 Организационные меры:</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Ограниченный доступ к данным</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Обучение сотрудников</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Контроль за безопасностью</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Быстрое реагирование на угрозы</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ваши права */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('user-rights')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Users" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Ваши права</span>
            </div>
            <Icon 
              name={activeSection === 'user-rights' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'user-rights' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gorkhon-blue mb-2">📋 Право на информацию</h4>
                    <p className="text-gray-700 text-sm">
                      Вы можете запросить информацию о том, какие данные мы о вас храним
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gorkhon-blue mb-2">✏️ Право на исправление</h4>
                    <p className="text-gray-700 text-sm">
                      Вы можете исправить неточные данные в своем профиле
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gorkhon-blue mb-2">🗑️ Право на удаление</h4>
                    <p className="text-gray-700 text-sm">
                      Вы можете удалить свой аккаунт и все связанные данные
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gorkhon-blue mb-2">📤 Право на портируемость</h4>
                    <p className="text-gray-700 text-sm">
                      Вы можете получить свои данные в удобном формате
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Контакты и обращения */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('contacts')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="MessageCircle" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Обращения и контакты</span>
            </div>
            <Icon 
              name={activeSection === 'contacts' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'contacts' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="font-medium text-gorkhon-blue mb-4">
                    По вопросам защиты данных обращайтесь:
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <Icon name="Phone" size={24} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium">Телефон</div>
                      <div className="text-sm text-gray-600">8 (914) 000-00-00</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <Icon name="Mail" size={24} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-600">privacy@gorkhon.ru</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <Icon name="MapPin" size={24} className="text-gorkhon-pink mx-auto mb-2" />
                      <div className="font-medium">Адрес</div>
                      <div className="text-sm text-gray-600">п. Горхон, ул. Центральная, 1</div>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-amber-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-amber-800">Время рассмотрения обращений</h5>
                      <p className="text-amber-700 text-sm mt-1">
                        Мы отвечаем на все обращения по защите данных в течение 3 рабочих дней. 
                        Срочные вопросы рассматриваются в течение 24 часов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Футер документа */}
      <div className="mt-12 text-center">
        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-gray-600 mb-2">
            Эта политика действует с {new Date().toLocaleDateString('ru-RU')} г.
          </p>
          <p className="text-sm text-gray-500">
            При изменении политики мы уведомим вас заранее
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
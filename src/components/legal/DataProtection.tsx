import { useState } from 'react';
import Icon from '@/components/ui/icon';

const DataProtection = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Icon name="ShieldCheck" size={32} className="text-gorkhon-pink" />
          <h1 className="text-3xl font-bold text-gray-800">
            Защита информации
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Как мы обеспечиваем безопасность ваших данных на портале жителей поселка Горхон
        </p>
        <div className="text-sm text-gorkhon-blue mt-2 font-medium">
          🔒 Ваши данные под надежной защитой
        </div>
      </div>

      {/* Обзор системы безопасности */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-green-600" />
          Многоуровневая защита
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Lock" size={20} className="text-green-600" />
            </div>
            <div className="font-medium text-sm">Шифрование</div>
            <div className="text-xs text-gray-600">SSL/TLS</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Database" size={20} className="text-blue-600" />
            </div>
            <div className="font-medium text-sm">Хранение</div>
            <div className="text-xs text-gray-600">Локально</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="UserCheck" size={20} className="text-purple-600" />
            </div>
            <div className="font-medium text-sm">Доступ</div>
            <div className="text-xs text-gray-600">Контролируемый</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-orange-600" />
            </div>
            <div className="font-medium text-sm">Мониторинг</div>
            <div className="text-xs text-gray-600">24/7</div>
          </div>
        </div>
      </div>

      {/* Разделы защиты данных */}
      <div className="space-y-4">
        {/* Технические меры защиты */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('technical-security')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Server" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Технические меры защиты</span>
            </div>
            <Icon 
              name={activeSection === 'technical-security' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'technical-security' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🔐 Шифрование данных</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm mb-1">SSL/TLS шифрование</h5>
                      <p className="text-xs text-gray-600">
                        Все данные передаются по защищенному каналу с 256-битным шифрованием
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm mb-1">Локальное хранение</h5>
                      <p className="text-xs text-gray-600">
                        Персональные данные хранятся в зашифрованном виде в localStorage браузера
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-sm mb-1">HTTPS-соединение</h5>
                      <p className="text-xs text-gray-600">
                        Обязательное использование защищенного протокола для всех операций
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🛡️ Защита инфраструктуры</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-medium text-sm mb-1">Firewall</h5>
                      <p className="text-xs text-gray-600">
                        Многоуровневые межсетевые экраны блокируют несанкционированный доступ
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-medium text-sm mb-1">Антивирусная защита</h5>
                      <p className="text-xs text-gray-600">
                        Постоянное сканирование на предмет вредоносного ПО
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-medium text-sm mb-1">Резервное копирование</h5>
                      <p className="text-xs text-gray-600">
                        Ежедневное создание зашифрованных резервных копий
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Организационные меры */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('organizational-security')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Users" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Организационные меры</span>
            </div>
            <Icon 
              name={activeSection === 'organizational-security' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'organizational-security' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">👥 Контроль доступа персонала</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Icon name="Key" size={14} className="text-gorkhon-pink" />
                        Принцип минимальных привилегий
                      </h5>
                      <p className="text-xs text-gray-600">
                        Каждый сотрудник имеет доступ только к необходимым для работы данным
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Icon name="Eye" size={14} className="text-gorkhon-pink" />
                        Журналирование действий
                      </h5>
                      <p className="text-xs text-gray-600">
                        Все действия с данными фиксируются в защищенных логах
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">📚 Обучение и политики</h4>
                  <div className="bg-white p-4 rounded-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Icon name="GraduationCap" size={16} className="text-green-500 mt-0.5" />
                        <span>Регулярное обучение персонала основам информационной безопасности</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="FileText" size={16} className="text-green-500 mt-0.5" />
                        <span>Строгие внутренние политики обработки персональных данных</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="AlertTriangle" size={16} className="text-green-500 mt-0.5" />
                        <span>Немедленное реагирование на любые инциденты безопасности</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="RefreshCw" size={16} className="text-green-500 mt-0.5" />
                        <span>Регулярный аудит системы безопасности</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Что мы НЕ храним */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('what-we-dont-store')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="EyeOff" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Что мы НЕ собираем и НЕ храним</span>
            </div>
            <Icon 
              name={activeSection === 'what-we-dont-store' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'what-we-dont-store' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-medium text-red-800 mb-4 flex items-center gap-2">
                  <Icon name="ShieldX" size={20} />
                  Мы принципиально НЕ собираем
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-red-700 mb-3">🚫 Конфиденциальная информация</h5>
                    <ul className="space-y-2 text-sm text-red-600">
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Паспортные данные</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Финансовые данные</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Медицинские данные</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Адрес проживания</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700 mb-3">🚫 Поведенческие данные</h5>
                    <ul className="space-y-2 text-sm text-red-600">
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>История браузера</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Данные с других сайтов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Геолокацию</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="X" size={14} className="mt-0.5" />
                        <span>Биометрические данные</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-red-300">
                  <p className="text-sm text-red-700 font-medium">
                    💡 Мы собираем только минимально необходимые данные для работы портала
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Контроль данных пользователем */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('user-control')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Settings" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Ваш контроль над данными</span>
            </div>
            <Icon 
              name={activeSection === 'user-control' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'user-control' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <Icon name="UserCog" size={20} />
                    Вы полностью контролируете свои данные
                  </h4>
                  <p className="text-green-700 text-sm">
                    Все ваши персональные данные хранятся локально в браузере. 
                    Вы можете в любой момент их просмотреть, изменить или удалить.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                      <Icon name="Eye" size={16} />
                      Просмотр данных
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• В личном кабинете</li>
                      <li>• В настройках браузера</li>
                      <li>• По запросу в поддержку</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                      <Icon name="Edit" size={16} />
                      Изменение данных
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Редактирование профиля</li>
                      <li>• Обновление контактов</li>
                      <li>• Настройка уведомлений</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gorkhon-blue mb-3 flex items-center gap-2">
                    <Icon name="Trash2" size={16} />
                    Удаление данных
                  </h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Icon name="RotateCcw" size={20} className="text-gray-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Очистка данных</div>
                      <div className="text-xs text-gray-600">Удаление из браузера</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Icon name="UserX" size={20} className="text-gray-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Удаление аккаунта</div>
                      <div className="text-xs text-gray-600">Полное удаление</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Icon name="Download" size={20} className="text-gray-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Экспорт данных</div>
                      <div className="text-xs text-gray-600">Получение копии</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Инциденты и реагирование */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('incident-response')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="AlertCircle" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Реагирование на инциденты</span>
            </div>
            <Icon 
              name={activeSection === 'incident-response' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'incident-response' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-3">🚨 План действий при инцидентах</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="bg-red-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        <Icon name="AlertTriangle" size={20} className="text-red-600" />
                      </div>
                      <div className="font-medium text-sm">1. Обнаружение</div>
                      <div className="text-xs text-gray-600 mt-1">В течение 1 часа</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="bg-orange-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        <Icon name="Shield" size={20} className="text-orange-600" />
                      </div>
                      <div className="font-medium text-sm">2. Изоляция</div>
                      <div className="text-xs text-gray-600 mt-1">Немедленно</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="bg-blue-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        <Icon name="Search" size={20} className="text-blue-600" />
                      </div>
                      <div className="font-medium text-sm">3. Анализ</div>
                      <div className="text-xs text-gray-600 mt-1">В течение 24 часов</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="bg-green-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                        <Icon name="CheckCircle" size={20} className="text-green-600" />
                      </div>
                      <div className="font-medium text-sm">4. Устранение</div>
                      <div className="text-xs text-gray-600 mt-1">До 72 часов</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <Icon name="Bell" size={20} />
                    Уведомление пользователей
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-amber-700 mb-2">При серьезных инцидентах:</h5>
                      <ul className="text-xs text-amber-600 space-y-1">
                        <li>• Уведомление в течение 24 часов</li>
                        <li>• Email всем зарегистрированным пользователям</li>
                        <li>• Объявление на главной странице</li>
                        <li>• Детальный отчет о произошедшем</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-amber-700 mb-2">Информация в уведомлении:</h5>
                      <ul className="text-xs text-amber-600 space-y-1">
                        <li>• Описание инцидента</li>
                        <li>• Затронутые данные</li>
                        <li>• Принятые меры</li>
                        <li>• Рекомендации пользователям</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Сертификаты и соответствие */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('compliance')}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name="Award" size={20} className="text-gorkhon-pink" />
              <span className="font-medium text-lg">Соответствие стандартам</span>
            </div>
            <Icon 
              name={activeSection === 'compliance' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
            />
          </button>
          {activeSection === 'compliance' && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gorkhon-blue mb-4">📋 Соблюдаемые стандарты</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Icon name="Shield" size={16} className="text-green-600" />
                        Федеральный закон №152-ФЗ
                      </h5>
                      <p className="text-xs text-gray-600">
                        "О персональных данных" - полное соответствие требованиям 
                        российского законодательства по защите персональных данных
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Icon name="Globe" size={16} className="text-blue-600" />
                        Международные стандарты
                      </h5>
                      <p className="text-xs text-gray-600">
                        Следуем лучшим мировым практикам информационной безопасности 
                        и защиты приватности пользователей
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <Icon name="FileCheck" size={20} />
                    Регулярные аудиты
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded text-center">
                      <Icon name="Calendar" size={16} className="text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Ежемесячно</div>
                      <div className="text-xs text-gray-600">Внутренний аудит</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <Icon name="Users" size={16} className="text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Раз в квартал</div>
                      <div className="text-xs text-gray-600">Внешний аудит</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <Icon name="TrendingUp" size={16} className="text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">Ежегодно</div>
                      <div className="text-xs text-gray-600">Сертификация</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Контакты службы безопасности */}
      <div className="mt-12">
        <div className="bg-gorkhon-pink/5 border-2 border-gorkhon-pink/20 rounded-2xl p-6">
          <div className="text-center mb-6">
            <Icon name="ShieldCheck" size={32} className="text-gorkhon-pink mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gorkhon-pink mb-2">
              Служба информационной безопасности
            </h3>
            <p className="text-gray-700">
              Для вопросов о защите данных и сообщений об инцидентах
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <Icon name="Phone" size={20} className="text-gorkhon-pink mx-auto mb-2" />
              <div className="font-medium">Экстренная линия</div>
              <div className="text-sm text-gray-600">8 (914) 000-00-01</div>
              <div className="text-xs text-gray-500">24/7</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <Icon name="Mail" size={20} className="text-gorkhon-pink mx-auto mb-2" />
              <div className="font-medium">Email</div>
              <div className="text-sm text-gray-600">security@gorkhon.ru</div>
              <div className="text-xs text-gray-500">Ответ в течение 2 часов</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <Icon name="MessageCircle" size={20} className="text-gorkhon-pink mx-auto mb-2" />
              <div className="font-medium">Чат поддержки</div>
              <div className="text-sm text-gray-600">В разделе "Поддержка"</div>
              <div className="text-xs text-gray-500">Онлайн с 9:00 до 21:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
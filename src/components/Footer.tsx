import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Основной контент футера */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* О портале */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Home" size={24} className="text-gorkhon-pink" />
              <span className="text-xl font-bold text-gray-800">Горхон.рф</span>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Цифровой портал жителей поселка Горхон. Мы объединяем сообщество, 
              предоставляем актуальную информацию и помогаем решать повседневные задачи.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icon name="MapPin" size={16} />
                <span>п. Горхон, Амурская область</span>
              </div>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Разделы</h4>
            <ul className="space-y-2">
              <li>
                <a href="#important-numbers" className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  <span>Важные номера</span>
                </a>
              </li>
              <li>
                <a href="#schedule" className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2">
                  <Icon name="Clock" size={14} />
                  <span>Расписание</span>
                </a>
              </li>
              <li>
                <a href="#donation" className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2">
                  <Icon name="Heart" size={14} />
                  <span>Помощь военным</span>
                </a>
              </li>
              <li>
                <a href="#pvz" className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2">
                  <Icon name="Package" size={14} />
                  <span>ПВЗ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Icon name="Phone" size={16} className="text-gorkhon-pink" />
                <span className="text-sm">8 (914) 000-00-00</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Icon name="Mail" size={16} className="text-gorkhon-pink" />
                <span className="text-sm">info@gorkhon.ru</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Icon name="MessageCircle" size={16} className="text-gorkhon-pink" />
                <span className="text-sm">Раздел "Поддержка"</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Правовая информация */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Ссылки на правовые документы */}
            <div className="flex flex-wrap gap-4 text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="Shield" size={14} />
                <span>Политика конфиденциальности</span>
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="FileText" size={14} />
                <span>Пользовательское соглашение</span>
              </Link>
              <Link 
                to="/data-protection" 
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="ShieldCheck" size={14} />
                <span>Защита данных</span>
              </Link>
            </div>

            {/* Авторские права */}
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Портал жителей п. Горхон. 
              <span className="ml-2">Сделано с ❤️ для нашего сообщества</span>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gorkhon-pink/5 to-gorkhon-blue/5 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-gorkhon-blue mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-800 mb-1">О безопасности ваших данных</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Мы серьезно относимся к защите вашей приватности. Все персональные данные 
                  хранятся локально в вашем браузере и передаются только по защищенному 
                  соединению. Подробнее в наших{' '}
                  <Link to="/privacy" className="text-gorkhon-pink hover:underline">
                    документах о конфиденциальности
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Социальная ответственность */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <Icon name="Leaf" size={16} />
            <span>Эко-дружелюбный портал - минимальное потребление ресурсов</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
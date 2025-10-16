import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              Г
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Горхон.Online
            </span>
          </div>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Войти в приложение
            </Button>
          </Link>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Горхон.Online
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Современная платформа для жителей микрорайона Горхон — всё необходимое в одном приложении
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                <Icon name="Smartphone" className="mr-2" />
                Открыть приложение
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Возможности платформы
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="MessageSquare" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Чат жителей</h3>
              <p className="text-gray-600 leading-relaxed">
                Общайтесь с соседями, обсуждайте важные вопросы и находите единомышленников прямо в приложении
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="Bell" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Системные уведомления</h3>
              <p className="text-gray-600 leading-relaxed">
                Получайте важные новости и объявления от управляющей компании моментально
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="Package" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Пункты выдачи</h3>
              <p className="text-gray-600 leading-relaxed">
                Полная информация о всех пунктах выдачи в микрорайоне с фото, адресами и графиком работы
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="MapPin" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Интерактивная карта</h3>
              <p className="text-gray-600 leading-relaxed">
                Карта микрорайона с отметками всех важных объектов и сервисов
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="Users" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Сообщество</h3>
              <p className="text-gray-600 leading-relaxed">
                Объединяйтесь с соседями для решения общих задач и улучшения жизни в микрорайоне
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Icon name="Smartphone" size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">PWA приложение</h3>
              <p className="text-gray-600 leading-relaxed">
                Установите приложение на телефон и используйте как обычное мобильное приложение
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к сообществу жителей Горхон прямо сейчас
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              <Icon name="ArrowRight" className="mr-2" />
              Открыть приложение
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  Г
                </div>
                <span className="text-xl font-bold">Горхон.Online</span>
              </div>
              <p className="text-gray-400">
                Цифровая платформа для комфортной жизни в микрорайоне Горхон
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/app" className="hover:text-white transition-colors">
                    Приложение
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Условия использования
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <p className="text-gray-400">
                По всем вопросам обращайтесь через системный чат в приложении
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Горхон.Online. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

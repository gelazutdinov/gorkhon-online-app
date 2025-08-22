import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import AuthForm from '@/components/AuthForm';
import UserDashboard_New from '@/components/UserDashboard_New';
import NotificationBanner from '@/components/NotificationBanner';


interface PersonalAccountProps {
  onSectionChange: (section: string) => void;
}

const PersonalAccount = ({ onSectionChange }: PersonalAccountProps) => {
  const { user, isLoading, isLoggedIn } = useAuth();
  const { currentTheme, changeTheme } = useTheme();

  // Защита от ошибок загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
      </div>
    );
  }



  // Если пользователь авторизован, показываем дашборд
  if (isLoggedIn && user) {
    return (
      <div className="space-y-4 md:space-y-6">
        <UserDashboard_New />
        
        {/* Системные уведомления */}
        <NotificationBanner />
        
        {/* Правовая информация */}
        <div className="text-center pt-3 md:pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2 md:mb-3">Правовая информация</h4>
            
            <div className="space-y-2">
              <div>
                <Link 
                  to="/privacy" 
                  target="_blank"
                  className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
                >
                  Политика конфиденциальности
                </Link>
                <p className="text-xs text-gray-400">Как мы защищаем ваши данные</p>
              </div>
              
              <div>
                <Link 
                  to="/terms" 
                  target="_blank"
                  className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
                >
                  Пользовательское соглашение
                </Link>
                <p className="text-xs text-gray-400">Правила использования платформы</p>
              </div>
              
              <div>
                <Link 
                  to="/data-protection" 
                  target="_blank"
                  className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
                >
                  Защита данных
                </Link>
                <p className="text-xs text-gray-400">Меры безопасности ваших данных</p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h5 className="text-xs font-medium text-gray-600 mb-1">О безопасности</h5>
              <p className="text-xs text-gray-500 leading-relaxed">
                Все данные хранятся локально в вашем браузере и передаются только по защищенному соединению.
              </p>
            </div>
          </div>
        </div>
      );
  }

  // Если пользователь не авторизован, показываем форму регистрации + информацию о проекте
  return (
    <div className="space-y-6 md:space-y-8">
      <AuthForm />
      
      {/* Информация о проекте в стиле ВКонтакте */}
      <div className="space-y-4 md:space-y-6">
        {/* Заголовок в стиле VK */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Info" size={24} className="md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">О платформе Горхон.Online</h3>
              <p className="text-sm md:text-base text-gray-500">Узнайте больше о нашем проекте и миссии</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-600">Горхон.Online</span> — современная цифровая платформа для жителей поселка Горхон. 
              Мы создаем единое пространство для общения, получения информации и доступа к важным услугам.
            </p>
          </div>
        </div>

        {/* Основные разделы в VK стиле */}
        <div className="space-y-3">
          {/* Миссия */}
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Target" size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-2">Наша миссия</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Объединить жителей Горхона через удобные цифровые сервисы и создать платформу, 
                  где каждый может получить нужную информацию, помощь и поддержку сообщества.
                </p>
              </div>
            </div>
          </div>

          {/* Что мы предлагаем */}
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Gift" size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Что мы предлагаем</h4>
                <div className="grid gap-2.5">
                  <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                    <Icon name="Newspaper" size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Актуальные новости и объявления</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-green-50 rounded-lg border border-green-100">
                    <Icon name="Cloud" size={16} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Прогноз погоды и климат</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                    <Icon name="Users" size={16} className="text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Личный кабинет и профиль</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                    <Icon name="MessageCircle" size={16} className="text-orange-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">ИИ-помощник Лина для вопросов</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Преимущества */}
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Почему выбирают нас</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Работаем 24/7 без выходных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Адаптивный дизайн для всех устройств</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Безопасность и защита данных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Постоянное развитие и улучшение</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Уникальные особенности - главная карточка */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Icon name="Star" size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-bold">Особенности платформы</h4>
                <p className="text-white/80 text-sm">Что делает нас уникальными</p>
              </div>
            </div>
            
            <div className="grid gap-3 md:gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Icon name="MapPin" size={20} className="text-white/90 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium text-sm md:text-base">Локальный фокус</span>
                  <p className="text-white/70 text-xs md:text-sm">Информация специально для жителей Горхона</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Icon name="Heart" size={20} className="text-white/90 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium text-sm md:text-base">Сообщество</span>
                  <p className="text-white/70 text-xs md:text-sm">Создано жителями для жителей</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Icon name="Smartphone" size={20} className="text-white/90 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium text-sm md:text-base">Современность</span>
                  <p className="text-white/70 text-xs md:text-sm">Актуальные технологии и удобный интерфейс</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Правовая информация для неавторизованных */}
        <div className="text-center pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Правовая информация</h4>
          
          <div className="space-y-2">
            <div>
              <Link 
                to="/privacy" 
                target="_blank"
                className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <p className="text-xs text-gray-400">Как мы защищаем ваши данные</p>
            </div>
            
            <div>
              <Link 
                to="/terms" 
                target="_blank"
                className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
              >
                Пользовательское соглашение
              </Link>
              <p className="text-xs text-gray-400">Правила использования платформы</p>
            </div>
            
            <div>
              <Link 
                to="/data-protection" 
                target="_blank"
                className="text-xs text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
              >
                Защита данных
              </Link>
              <p className="text-xs text-gray-400">Меры безопасности ваших данных</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h5 className="text-xs font-medium text-gray-600 mb-1">О безопасности</h5>
            <p className="text-xs text-gray-500 leading-relaxed">
              Все данные хранятся локально в вашем браузере и передаются только по защищенному соединению.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
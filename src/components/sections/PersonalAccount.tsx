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
    } catch (error) {
      console.error('Error in UserDashboard:', error);
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Произошла ошибка</h3>
            <p className="text-gray-600">Попробуйте перезагрузить страницу</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90"
          >
            Перезагрузить
          </button>
        </div>
      );
    }
  }

  // Если пользователь не авторизован, показываем форму регистрации + информацию о проекте
  return (
    <div className="space-y-6 md:space-y-8">
      <AuthForm />
      
      {/* Информация о проекте */}
      <div className="space-y-4 md:space-y-6">
        <div className="text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">О платформе Горхон.Online</h3>
          <p className="text-sm md:text-base text-gray-600">Узнайте больше о нашем проекте и миссии</p>
        </div>

        {/* О проекте */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-blue-100">
          <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gorkhon-pink to-gorkhon-green rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Info" size={18} className="md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-1">О проекте</h4>
              <p className="text-xs md:text-sm text-gray-500">Наша миссия и цели</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Горхон.Online — это цифровая платформа, созданная для удобства жителей поселка Горхон. 
            Мы объединяем всю важную информацию в одном месте, делая жизнь нашего сообщества более 
            комфортной и связанной.
          </p>
        </div>

        {/* Миссия */}
        <div className="bg-gradient-to-br from-white to-green-50/30 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-green-100">
          <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gorkhon-green to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Target" size={18} className="md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-1">Наша миссия</h4>
              <p className="text-xs md:text-sm text-gray-500">К чему мы стремимся</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Сделать жизнь в Горхоне максимально удобной через цифровые технологии. 
            Мы стремимся создать единое информационное пространство, где каждый житель 
            может быстро найти нужную информацию и получить помощь.
          </p>
        </div>

        {/* Преимущества */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="CheckCircle" size={18} className="md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-1">Преимущества</h4>
              <p className="text-xs md:text-sm text-gray-500">Почему стоит выбрать нас</p>
            </div>
          </div>
          <div className="grid gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={14} className="md:w-4 md:h-4 text-blue-600" />
              </div>
              <span className="text-sm md:text-base text-gray-700 font-medium">Доступ к информации 24/7</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Smartphone" size={14} className="md:w-4 md:h-4 text-purple-600" />
              </div>
              <span className="text-sm md:text-base text-gray-700 font-medium">Удобный мобильный интерфейс</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Users" size={14} className="md:w-4 md:h-4 text-green-600" />
              </div>
              <span className="text-sm md:text-base text-gray-700 font-medium">Связь с сообществом</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-orange-50 rounded-lg">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size={14} className="md:w-4 md:h-4 text-orange-600" />
              </div>
              <span className="text-sm md:text-base text-gray-700 font-medium">Быстрый доступ к услугам</span>
            </div>
          </div>
        </div>

        {/* Уникальные особенности */}
        <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Icon name="Star" size={20} className="md:w-6 md:h-6 text-white" />
            <h4 className="text-base md:text-lg font-semibold">Уникальные особенности</h4>
          </div>
          <div className="grid gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Icon name="MapPin" size={14} className="md:w-4 md:h-4 text-white/80 flex-shrink-0" />
              <span className="text-sm md:text-base">Локальная информация специально для Горхона</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Icon name="Heart" size={14} className="md:w-4 md:h-4 text-white/80 flex-shrink-0" />
              <span className="text-sm md:text-base">Создано жителями для жителей</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Icon name="Shield" size={14} className="md:w-4 md:h-4 text-white/80 flex-shrink-0" />
              <span className="text-sm md:text-base">Безопасность и конфиденциальность данных</span>
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
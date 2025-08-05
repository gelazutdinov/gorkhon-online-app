import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import RegistrationForm from '@/components/RegistrationForm';
import UserDashboard from '@/components/UserDashboard';
import NotificationBanner from '@/components/NotificationBanner';


interface PersonalAccountProps {
  onSectionChange: (section: string) => void;
}

const PersonalAccount = ({ onSectionChange }: PersonalAccountProps) => {
  const { user, isLoading, register, logout, updateUser, getDaysWithUs, getFormattedTimeSpent } = useUser();
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
  if (user) {
    console.log('User data:', user); // Отладочная информация
    try {
      return (
        <div className="space-y-6">
          <UserDashboard 
            user={user}
            daysWithUs={getDaysWithUs()}
            formattedTimeSpent={getFormattedTimeSpent()}
            onLogout={logout}
            onUserUpdate={updateUser}
            onSectionChange={onSectionChange}
          />
        
          {/* Системные уведомления */}
          <NotificationBanner />
        
          {/* Правовая информация */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Shield" size={20} className="text-gorkhon-blue" />
              Правовая информация
            </h3>
            
            <div className="space-y-3">
              <Link 
                to="/privacy" 
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gorkhon-pink hover:bg-gorkhon-pink/5 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">Политика конфиденциальности</span>
                  <p className="text-sm text-gray-600">Как мы защищаем ваши данные</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </Link>
              
              <Link 
                to="/terms" 
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gorkhon-pink hover:bg-gorkhon-pink/5 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">Пользовательское соглашение</span>
                  <p className="text-sm text-gray-600">Правила использования платформы</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </Link>
              
              <Link 
                to="/data-protection" 
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gorkhon-pink hover:bg-gorkhon-pink/5 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="ShieldCheck" size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">Защита данных</span>
                  <p className="text-sm text-gray-600">Меры безопасности ваших данных</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-gray-400" />
              </Link>
            </div>
            
            {/* Информация о безопасности */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">О безопасности</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Все данные хранятся локально в вашем браузере и передаются только по защищенному соединению.
                  </p>
                </div>
              </div>
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
    <div className="space-y-8">
      <RegistrationForm onRegister={register} />
      
      {/* Информация о проекте */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">О платформе Горхон.Online</h3>
          <p className="text-gray-600">Узнайте больше о нашем проекте и миссии</p>
        </div>

        {/* О проекте */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gorkhon-pink to-gorkhon-green rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Info" size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-1">О проекте</h4>
              <p className="text-sm text-gray-500">Наша миссия и цели</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Горхон.Online — это цифровая платформа, созданная для удобства жителей поселка Горхон. 
            Мы объединяем всю важную информацию в одном месте, делая жизнь нашего сообщества более 
            комфортной и связанной.
          </p>
        </div>

        {/* Миссия */}
        <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gorkhon-green to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Target" size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-1">Наша миссия</h4>
              <p className="text-sm text-gray-500">К чему мы стремимся</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Сделать жизнь в Горхоне максимально удобной через цифровые технологии. 
            Мы стремимся создать единое информационное пространство, где каждый житель 
            может быстро найти нужную информацию и получить помощь.
          </p>
        </div>

        {/* Преимущества */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="CheckCircle" size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-1">Преимущества</h4>
              <p className="text-sm text-gray-500">Почему стоит выбрать нас</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={16} className="text-blue-600" />
              </div>
              <span className="text-gray-700 font-medium">Доступ к информации 24/7</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="Smartphone" size={16} className="text-purple-600" />
              </div>
              <span className="text-gray-700 font-medium">Удобный мобильный интерфейс</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="Users" size={16} className="text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">Связь с сообществом</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="Zap" size={16} className="text-orange-600" />
              </div>
              <span className="text-gray-700 font-medium">Быстрый доступ к услугам</span>
            </div>
          </div>
        </div>

        {/* Уникальные особенности */}
        <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Star" size={24} className="text-white" />
            <h4 className="text-lg font-semibold">Уникальные особенности</h4>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" size={16} className="text-white/80" />
              <span>Локальная информация специально для Горхона</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Heart" size={16} className="text-white/80" />
              <span>Создано жителями для жителей</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Shield" size={16} className="text-white/80" />
              <span>Безопасность и конфиденциальность данных</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
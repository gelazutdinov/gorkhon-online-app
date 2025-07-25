import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';
import RegistrationForm from '@/components/RegistrationForm';
import UserDashboard from '@/components/UserDashboard';

const PersonalAccount = () => {
  const { user, isLoading, register, logout, getDaysWithUs, getFormattedTimeSpent } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем дашборд
  if (user) {
    return (
      <div className="space-y-8">
        <UserDashboard 
          user={user}
          daysWithUs={getDaysWithUs()}
          formattedTimeSpent={getFormattedTimeSpent()}
          onLogout={logout}
        />
        
        {/* Правовая информация */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center space-y-4">
            {/* Ссылки на правовые документы */}
            <div className="flex flex-wrap justify-center gap-4 text-base">
              <Link 
                to="/privacy" 
                target="_blank"
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="Shield" size={16} />
                <span>Политика конфиденциальности</span>
              </Link>
              <Link 
                to="/terms" 
                target="_blank"
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="FileText" size={16} />
                <span>Пользовательское соглашение</span>
              </Link>
              <Link 
                to="/data-protection" 
                target="_blank"
                className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-1"
              >
                <Icon name="ShieldCheck" size={16} />
                <span>Защита данных</span>
              </Link>
            </div>

            {/* Информация о безопасности */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-gorkhon-pink/5 to-gorkhon-blue/5 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-gorkhon-blue mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1 text-base">О безопасности ваших данных</h5>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Мы серьезно относимся к защите вашей приватности. Все персональные данные 
                      хранятся локально в вашем браузере и передаются только по защищенному 
                      соединению. Подробнее в наших{' '}
                      <Link to="/privacy" target="_blank" className="text-gorkhon-pink hover:underline">
                        документах о конфиденциальности
                      </Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Info" size={24} className="text-gorkhon-pink" />
            <h4 className="text-lg font-semibold text-gray-800">О проекте</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Горхон.Online — это цифровая платформа, созданная для удобства жителей поселка Горхон. 
            Мы объединяем всю важную информацию в одном месте, делая жизнь нашего сообщества более 
            комфортной и связанной.
          </p>
        </div>

        {/* Миссия */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Target" size={24} className="text-gorkhon-green" />
            <h4 className="text-lg font-semibold text-gray-800">Наша миссия</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Сделать жизнь в Горхоне максимально удобной через цифровые технологии. 
            Мы стремимся создать единое информационное пространство, где каждый житель 
            может быстро найти нужную информацию и получить помощь.
          </p>
        </div>

        {/* Преимущества */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <h4 className="text-lg font-semibold text-gray-800">Преимущества</h4>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={16} className="text-blue-500" />
              <span className="text-gray-600">Доступ к информации 24/7</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Smartphone" size={16} className="text-blue-500" />
              <span className="text-gray-600">Удобный мобильный интерфейс</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Users" size={16} className="text-blue-500" />
              <span className="text-gray-600">Связь с сообществом</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Zap" size={16} className="text-blue-500" />
              <span className="text-gray-600">Быстрый доступ к услугам</span>
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
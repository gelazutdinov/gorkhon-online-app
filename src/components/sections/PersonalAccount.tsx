import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import RegistrationForm from '@/components/RegistrationForm';
import UserDashboard from '@/components/UserDashboard';

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
        <div className="space-y-8">
          <UserDashboard 
            user={user}
            daysWithUs={getDaysWithUs()}
            formattedTimeSpent={getFormattedTimeSpent()}
            onLogout={logout}
            onUserUpdate={updateUser}
            onSectionChange={onSectionChange}
          />
        
          {/* Дополнительные функции профиля */}
          <div className="space-y-6">
            
            {/* Уведомления и настройки */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Bell" size={20} className="text-gorkhon-pink" />
                Уведомления
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Новости поселка</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gorkhon-green transition-colors">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Важные объявления</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gorkhon-green transition-colors">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Расписание транспорта</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Темы оформления */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Palette" size={20} className="text-gorkhon-blue" />
                Тема оформления
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => changeTheme('default')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    currentTheme === 'default' 
                      ? 'border-gorkhon-pink bg-gorkhon-pink/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-full mx-auto mb-2"></div>
                  <span className={`text-sm font-medium ${
                    currentTheme === 'default' ? 'text-gorkhon-pink' : 'text-gray-600'
                  }`}>
                    Стандартная
                  </span>
                </button>
                <button 
                  onClick={() => changeTheme('dark')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    currentTheme === 'dark' 
                      ? 'border-gray-800 bg-gray-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mx-auto mb-2"></div>
                  <span className={`text-sm font-medium ${
                    currentTheme === 'dark' ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    Темная
                  </span>
                </button>
                <button 
                  onClick={() => changeTheme('blue')}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    currentTheme === 'blue' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mb-2"></div>
                  <span className={`text-sm font-medium ${
                    currentTheme === 'blue' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    Голубая
                  </span>
                </button>
              </div>
            </div>

            {/* Достижения */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-yellow-500" />
                Достижения
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-gray-700">Первый вход</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-xs font-medium text-gray-700">7 дней активности</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg opacity-50">
                  <div className="text-2xl mb-1">💬</div>
                  <div className="text-xs font-medium text-gray-700">Первое сообщение</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg opacity-50">
                  <div className="text-2xl mb-1">🌟</div>
                  <div className="text-xs font-medium text-gray-700">Активный житель</div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Правовая информация */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center space-y-4">
              {/* Ссылки на правовые документы - исправлена верстка */}
              <div className="flex flex-col items-center gap-3 text-sm">
                <Link 
                  to="/privacy" 
                  target="_blank"
                  className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2"
                >
                  <Icon name="Shield" size={16} />
                  <span>Политика конфиденциальности</span>
                </Link>
                <Link 
                  to="/terms" 
                  target="_blank"
                  className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2"
                >
                  <Icon name="FileText" size={16} />
                  <span>Пользовательское соглашение</span>
                </Link>
                <Link 
                  to="/data-protection" 
                  target="_blank"
                  className="text-gray-600 hover:text-gorkhon-pink transition-colors flex items-center gap-2"
                >
                  <Icon name="ShieldCheck" size={16} />
                  <span>Защита данных</span>
                </Link>
              </div>

              {/* Информация о безопасности - исправлена верстка */}
              <div className="px-4">
                <div className="bg-gradient-to-r from-gorkhon-pink/5 to-gorkhon-blue/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={18} className="text-gorkhon-blue mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">О безопасности ваших данных</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Мы серьезно относимся к защите вашей приватности. Все персональные данные 
                        хранятся локально в вашем браузере и передаются только по защищенному 
                        соединению.{' '}
                        <Link to="/privacy" target="_blank" className="text-gorkhon-pink hover:underline">
                          Подробнее в документах о конфиденциальности
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
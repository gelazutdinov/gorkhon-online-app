import { useUser } from '@/hooks/useUser';
import SocialNetwork from '@/components/SocialNetwork';
import Icon from '@/components/ui/icon';

const Social = () => {
  const { user } = useUser();

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gorkhon-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={32} className="text-gorkhon-pink" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Социальная сеть Горхона</h2>
          <p className="text-gray-600">Для доступа к социальной сети необходимо зарегистрироваться</p>
        </div>

        <div className="bg-gradient-to-r from-gorkhon-pink/10 to-gorkhon-blue/10 rounded-2xl p-6 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-3">🌐</div>
            <h3 className="font-semibold text-gray-800">Присоединяйтесь к сообществу!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Находите единомышленников, заводите новых друзей, делитесь интересами 
              и будьте частью активного сообщества жителей Горхона
            </p>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Icon name="Search" size={16} className="text-gorkhon-pink" />
                <span>Поиск людей по интересам</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Icon name="Heart" size={16} className="text-gorkhon-pink" />
                <span>Система друзей и заявок</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Icon name="Gift" size={16} className="text-gorkhon-pink" />
                <span>Персональные поздравления с ДР</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Icon name="Camera" size={16} className="text-gorkhon-pink" />
                <span>Загрузка собственных фото</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            Перейдите в "Профиль" для регистрации
          </p>
          <div className="flex justify-center">
            <Icon name="ArrowDown" size={20} className="text-gray-400 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем социальную сеть
  return <SocialNetwork currentUser={user} />;
};

export default Social;
import Icon from '@/components/ui/icon';

const PersonalAccount = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Личный кабинет</h2>
        <p className="text-gray-600">Узнайте больше о нашем проекте и миссии</p>
      </div>

      {/* О проекте */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Info" size={24} className="text-gorkhon-pink" />
          <h3 className="text-xl font-semibold text-gray-800">О проекте</h3>
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
          <h3 className="text-xl font-semibold text-gray-800">Наша миссия</h3>
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
          <h3 className="text-xl font-semibold text-gray-800">Преимущества</h3>
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
          <h3 className="text-xl font-semibold">Уникальные особенности</h3>
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
  );
};

export default PersonalAccount;
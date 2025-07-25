import Icon from '@/components/ui/icon';

const Support = () => {
  const handleSupportClick = () => {
    window.open('https://forms.yandex.ru/u/687f5b9a84227c08790f3222/', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Icon name="MessageCircle" size={28} className="text-gorkhon-pink" />
          <h2 className="text-2xl font-bold text-gray-800">Чат поддержки</h2>
        </div>
        <p className="text-gray-600">Есть вопросы? Мы всегда готовы помочь!</p>
      </div>

      {/* Основная форма поддержки */}
      <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Icon name="Headphones" size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Нужна помощь?</h3>
          <p className="text-white/90 mb-6 leading-relaxed">
            Наша служба поддержки готова ответить на любые вопросы 
            о работе платформы и услугах поселка
          </p>
          
          <button
            onClick={handleSupportClick}
            className="bg-white text-gorkhon-pink font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Icon name="ExternalLink" size={18} />
              <span>Открыть форму поддержки</span>
            </div>
          </button>
        </div>
      </div>

      {/* Информация о поддержке */}
      <div className="grid gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Clock" size={20} className="text-green-500" />
            <h4 className="font-semibold text-gray-800">Время работы</h4>
          </div>
          <p className="text-gray-600">Мы отвечаем на обращения ежедневно с 9:00 до 18:00</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Zap" size={20} className="text-blue-500" />
            <h4 className="font-semibold text-gray-800">Быстрый ответ</h4>
          </div>
          <p className="text-gray-600">Среднее время ответа на обращение — 2 часа</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Shield" size={20} className="text-purple-500" />
            <h4 className="font-semibold text-gray-800">Конфиденциальность</h4>
          </div>
          <p className="text-gray-600">Все обращения обрабатываются конфиденциально</p>
        </div>
      </div>


    </div>
  );
};

export default Support;
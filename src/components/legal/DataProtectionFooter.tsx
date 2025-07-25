import Icon from '@/components/ui/icon';

const DataProtectionFooter = () => {
  return (
    <div className="mt-12">
      <div className="bg-gorkhon-pink/5 border-2 border-gorkhon-pink/20 rounded-2xl p-6">
        <div className="text-center mb-6">
          <Icon name="ShieldCheck" size={32} className="text-gorkhon-pink mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gorkhon-pink mb-2">
            Служба информационной безопасности
          </h3>
          <p className="text-gray-700">
            Для вопросов о защите данных и сообщений об инцидентах
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <Icon name="Phone" size={20} className="text-gorkhon-pink mx-auto mb-2" />
            <div className="font-medium">Экстренная линия</div>
            <div className="text-sm text-gray-600">8 (914) 000-00-01</div>
            <div className="text-xs text-gray-500">24/7</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <Icon name="Mail" size={20} className="text-gorkhon-pink mx-auto mb-2" />
            <div className="font-medium">Email</div>
            <div className="text-sm text-gray-600">security@gorkhon.ru</div>
            <div className="text-xs text-gray-500">Ответ в течение 2 часов</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <Icon name="MessageCircle" size={20} className="text-gorkhon-pink mx-auto mb-2" />
            <div className="font-medium">Чат поддержки</div>
            <div className="text-sm text-gray-600">В разделе "Поддержка"</div>
            <div className="text-xs text-gray-500">Онлайн с 9:00 до 21:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProtectionFooter;
import Icon from '@/components/ui/icon';

const DataProtectionHeader = () => {
  return (
    <>
      {/* Заголовок */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Icon name="ShieldCheck" size={32} className="text-gorkhon-pink" />
          <h1 className="text-3xl font-bold text-gray-800">
            Защита информации
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Как мы обеспечиваем безопасность ваших данных на портале жителей поселка Горхон
        </p>
        <div className="text-sm text-gorkhon-blue mt-2 font-medium">
          🔒 Ваши данные под надежной защитой
        </div>
      </div>

      {/* Обзор системы безопасности */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-green-600" />
          Многоуровневая защита
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Lock" size={20} className="text-green-600" />
            </div>
            <div className="font-medium text-sm">Шифрование</div>
            <div className="text-xs text-gray-600">SSL/TLS</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Database" size={20} className="text-blue-600" />
            </div>
            <div className="font-medium text-sm">Хранение</div>
            <div className="text-xs text-gray-600">Локально</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="UserCheck" size={20} className="text-purple-600" />
            </div>
            <div className="font-medium text-sm">Доступ</div>
            <div className="text-xs text-gray-600">Контролируемый</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-orange-600" />
            </div>
            <div className="font-medium text-sm">Мониторинг</div>
            <div className="text-xs text-gray-600">24/7</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataProtectionHeader;
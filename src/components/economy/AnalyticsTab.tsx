const AnalyticsTab = () => {
  return (
    <div className="space-y-4">
      {/* Статистика за месяц */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">+1,247.50</div>
          <div className="text-sm text-gray-600">Доходы за месяц</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">-854.20</div>
          <div className="text-sm text-gray-600">Расходы за месяц</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">42.80</div>
          <div className="text-sm text-gray-600">Кэшбэк получено</div>
        </div>
      </div>

      {/* График расходов по категориям */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">📈 Расходы по категориям</h3>
        
        <div className="space-y-3">
          {[
            { category: 'Продукты питания', amount: 425.60, percent: 50, color: 'bg-green-500' },
            { category: 'Услуги ЖКХ', amount: 234.80, percent: 27, color: 'bg-blue-500' },
            { category: 'Транспорт', amount: 128.40, percent: 15, color: 'bg-purple-500' },
            { category: 'Развлечения', amount: 65.40, percent: 8, color: 'bg-pink-500' }
          ].map((item) => (
            <div key={item.category} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.amount.toFixed(2)} ГР</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-500 w-10">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
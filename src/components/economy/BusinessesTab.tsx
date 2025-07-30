import Icon from '@/components/ui/icon';

interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  logo: string;
  cashbackPercent: number;
  isOnline: boolean;
}

interface BusinessesTabProps {
  localBusinesses: LocalBusiness[];
}

const BusinessesTab = ({ localBusinesses }: BusinessesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">🏪 Местные бизнесы</h3>
        
        <div className="space-y-3">
          {localBusinesses.map((business) => (
            <div key={business.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-3xl">{business.logo}</div>
              
              <div className="flex-1">
                <div className="font-medium">{business.name}</div>
                <div className="text-sm text-gray-600">{business.category}</div>
              </div>
              
              <div className="text-right">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mb-1">
                  {business.cashbackPercent}% кэшбэк
                </div>
                <div className={`text-xs ${business.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {business.isOnline ? '🟢 Онлайн' : '⚫ Оффлайн'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Программа лояльности */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
            <Icon name="Crown" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">👑 Программа лояльности</h3>
            <p className="text-gray-700 mb-4">
              Получайте кэшбэк от местных предприятий и дополнительные бонусы за активность в экосистеме Горхона.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                До 5% кэшбэк
              </span>
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                Накопительные бонусы
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Специальные акции
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessesTab;
import Icon from '@/components/ui/icon';

interface Balance {
  main: number;
  cashback: number;
  rewards: number;
}

interface WalletBalanceProps {
  balance: Balance;
}

const WalletBalance = ({ balance }: WalletBalanceProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="Wallet" size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Основной баланс</div>
            <div className="text-xl font-bold text-green-600">{balance.main.toFixed(2)} ГР</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="Gift" size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Кэшбэк</div>
            <div className="text-xl font-bold text-blue-600">{balance.cashback.toFixed(2)} ГР</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="Award" size={20} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Бонусы</div>
            <div className="text-xl font-bold text-purple-600">{balance.rewards.toFixed(2)} ГР</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
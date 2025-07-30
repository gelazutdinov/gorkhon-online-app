import Icon from '@/components/ui/icon';

interface Balance {
  main: number;
  cashback: number;
  rewards: number;
}

interface TransferTabProps {
  balance: Balance;
  onShowTransferModal: () => void;
}

const TransferTab = ({ balance, onShowTransferModal }: TransferTabProps) => {
  return (
    <div className="space-y-4">
      {/* Быстрые переводы */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg mb-4">⚡ Быстрые переводы</h3>
        
        <button
          onClick={onShowTransferModal}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all mb-4"
        >
          💸 Новый перевод
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Петров И.С.', 'Сидорова А.М.', 'Кузнецов В.П.', 'Васильева Е.И.'].map((name) => (
            <button
              key={name}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="User" size={16} className="text-green-600" />
              </div>
              <div className="text-xs font-medium">{name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* QR-код для получения переводов */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
        <h3 className="font-bold text-lg mb-4">📱 Получить перевод</h3>
        <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <Icon name="QrCode" size={64} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">
          Покажите QR-код для получения перевода от других пользователей
        </p>
      </div>
    </div>
  );
};

export default TransferTab;
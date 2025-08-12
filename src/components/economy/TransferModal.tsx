import Icon from '@/components/ui/icon';

interface Balance {
  main: number;
  cashback: number;
  rewards: number;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: Balance;
  transferAmount: string;
  setTransferAmount: (amount: string) => void;
  transferRecipient: string;
  setTransferRecipient: (recipient: string) => void;
  onTransfer: () => void;
}

const TransferModal = ({
  isOpen,
  onClose,
  balance,
  transferAmount,
  setTransferAmount,
  transferRecipient,
  setTransferRecipient,
  onTransfer
}: TransferModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 w-full sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto safe-area-bottom">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold truncate">💸 Новый перевод</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Получатель</label>
            <input
              type="text"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="Имя или номер телефона"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сумма</label>
            <div className="relative">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 text-sm sm:text-base"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">ГР</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-700">
              <strong>Доступно:</strong> {balance.main.toFixed(2)} ГР
            </div>
            <div className="text-sm text-green-600 mt-1">
              Комиссия: 0 ГР (бесплатно для жителей Горхона)
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onTransfer}
              disabled={!transferAmount || !transferRecipient}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all order-2 sm:order-1"
            >
              Отправить
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-1 sm:order-2"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
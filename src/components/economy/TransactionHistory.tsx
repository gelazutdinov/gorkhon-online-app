import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: Date;
  counterpart?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const formatAmount = (amount: number) => {
    return `${amount > 0 ? '+' : ''}${amount.toFixed(2)} ГР`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'ArrowDownLeft';
      case 'expense': return 'ArrowUpRight';
      case 'transfer': return 'ArrowRightLeft';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base sm:text-lg truncate">📊 История операций</h3>
        <button className="text-sm text-green-600 hover:text-green-700">
          Показать все
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              transaction.type === 'income' ? 'bg-green-100' :
              transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <Icon 
                name={getTransactionIcon(transaction.type)} 
                size={16} 
                className={getTransactionColor(transaction.type)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs sm:text-sm truncate">{transaction.description}</div>
              <div className="text-xs text-gray-500 truncate">
                {transaction.counterpart && (
                  <span className="truncate">{transaction.counterpart} • </span>
                )}
                {formatDate(transaction.date)}
              </div>
            </div>
            
            <div className={`font-bold text-xs sm:text-sm flex-shrink-0 ${getTransactionColor(transaction.type)}`}>
              {formatAmount(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
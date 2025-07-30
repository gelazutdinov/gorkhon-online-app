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
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">📊 История операций</h3>
        <button className="text-sm text-green-600 hover:text-green-700">
          Показать все
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === 'income' ? 'bg-green-100' :
              transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <Icon 
                name={getTransactionIcon(transaction.type)} 
                size={18} 
                className={getTransactionColor(transaction.type)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{transaction.description}</div>
              <div className="text-xs text-gray-500">
                {transaction.counterpart} • {formatDate(transaction.date)}
              </div>
            </div>
            
            <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
              {formatAmount(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
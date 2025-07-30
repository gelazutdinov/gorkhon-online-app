import { useState } from 'react';
import Icon from '@/components/ui/icon';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import TransferTab from './TransferTab';
import BusinessesTab from './BusinessesTab';
import AnalyticsTab from './AnalyticsTab';
import TransferModal from './TransferModal';

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

interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  logo: string;
  cashbackPercent: number;
  isOnline: boolean;
}

const DigitalRuble = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'transfer' | 'businesses' | 'analytics'>('wallet');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');

  // Баланс пользователя
  const balance = {
    main: 2847.50,
    cashback: 156.30,
    rewards: 89.20
  };

  // Последние транзакции
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      amount: -125.00,
      description: 'Покупка в магазине "Продукты"',
      category: 'Покупки',
      date: new Date('2024-07-29T14:30:00'),
      counterpart: 'ИП Иванов А.В.',
      status: 'completed'
    },
    {
      id: '2',
      type: 'income',
      amount: 500.00,
      description: 'Поступление от администрации',
      category: 'Социальные выплаты',
      date: new Date('2024-07-29T10:15:00'),
      counterpart: 'Администрация Горхона',
      status: 'completed'
    },
    {
      id: '3',
      type: 'transfer',
      amount: -200.00,
      description: 'Перевод Петрову И.С.',
      category: 'Переводы',
      date: new Date('2024-07-28T18:45:00'),
      counterpart: 'Петров И.С.',
      status: 'completed'
    },
    {
      id: '4',
      type: 'income',
      amount: 15.60,
      description: 'Кэшбэк за покупки',
      category: 'Кэшбэк',
      date: new Date('2024-07-28T16:20:00'),
      status: 'completed'
    }
  ];

  // Местные бизнесы
  const localBusinesses: LocalBusiness[] = [
    {
      id: '1',
      name: 'Магазин "Продукты"',
      category: 'Продукты питания',
      logo: '🛒',
      cashbackPercent: 3,
      isOnline: true
    },
    {
      id: '2',
      name: 'Аптека "Здоровье"',
      category: 'Медицина',
      logo: '💊',
      cashbackPercent: 5,
      isOnline: true
    },
    {
      id: '3',
      name: 'Кафе "Уют"',
      category: 'Общепит',
      logo: '☕',
      cashbackPercent: 4,
      isOnline: false
    },
    {
      id: '4',
      name: 'Мастерская "Ремонт"',
      category: 'Услуги',
      logo: '🔧',
      cashbackPercent: 2,
      isOnline: true
    },
    {
      id: '5',
      name: 'Такси "Горхон"',
      category: 'Транспорт',
      logo: '🚗',
      cashbackPercent: 1,
      isOnline: true
    }
  ];

  const handleTransfer = () => {
    if (!transferAmount || !transferRecipient) return;
    
    // Здесь была бы логика перевода
    console.log('Перевод:', { amount: transferAmount, recipient: transferRecipient });
    setTransferAmount('');
    setTransferRecipient('');
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">💰 Цифровой рубль Горхона</h1>
            <p className="text-white/90">Местная валютная система поселка</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{balance.main.toFixed(2)}</div>
            <div className="text-white/80">ГР</div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
        <div className="flex rounded-lg overflow-hidden">
          {[
            { id: 'wallet', label: 'Кошелек', icon: 'Wallet' },
            { id: 'transfer', label: 'Переводы', icon: 'Send' },
            { id: 'businesses', label: 'Бизнесы', icon: 'Store' },
            { id: 'analytics', label: 'Аналитика', icon: 'TrendingUp' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon name={tab.icon as any} size={18} />
              <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Содержимое вкладок */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <WalletBalance balance={balance} />
          <TransactionHistory transactions={transactions} />
        </div>
      )}

      {activeTab === 'transfer' && (
        <TransferTab 
          balance={balance} 
          onShowTransferModal={() => setShowTransferModal(true)} 
        />
      )}

      {activeTab === 'businesses' && (
        <BusinessesTab localBusinesses={localBusinesses} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab />
      )}

      {/* Модальное окно перевода */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        balance={balance}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        transferRecipient={transferRecipient}
        setTransferRecipient={setTransferRecipient}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default DigitalRuble;
import { useState } from 'react';
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
          {/* Баланс по категориям */}
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

          {/* История транзакций */}
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
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="space-y-4">
          {/* Быстрые переводы */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">⚡ Быстрые переводы</h3>
            
            <button
              onClick={() => setShowTransferModal(true)}
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
      )}

      {activeTab === 'businesses' && (
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
      )}

      {activeTab === 'analytics' && (
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
      )}

      {/* Модальное окно перевода */}
      {showTransferModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTransferModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">💸 Новый перевод</h3>
              <button
                onClick={() => setShowTransferModal(false)}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTransfer}
                  disabled={!transferAmount || !transferRecipient}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Отправить
                </button>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalRuble;
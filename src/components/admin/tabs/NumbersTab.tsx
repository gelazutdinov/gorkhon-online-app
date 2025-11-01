import Icon from '@/components/ui/icon';

interface ImportantNumber {
  id: string;
  name: string;
  person: string;
  phone: string;
  icon: string;
  category: 'important' | 'transit';
}

interface NumbersTabProps {
  importantNumbers: ImportantNumber[];
  transitNumbers: ImportantNumber[];
  onAddNumber: () => void;
  onEditNumber: (number: ImportantNumber) => void;
  onDeleteNumber: (id: string) => void;
}

const NumbersTab = ({ 
  importantNumbers, 
  transitNumbers, 
  onAddNumber, 
  onEditNumber, 
  onDeleteNumber 
}: NumbersTabProps) => {
  return (
    <div className="space-y-6">
      {/* Кнопка добавления */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление номерами</h3>
        <button
          onClick={onAddNumber}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Добавить номер
        </button>
      </div>

      {/* Важные номера */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="AlertCircle" size={16} className="text-red-500" />
          Важные номера ({importantNumbers.length})
        </h4>
        <div className="grid gap-3">
          {importantNumbers.map((number) => (
            <div key={number.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name={number.icon as any} size={16} className="text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">{number.name}</h5>
                  <p className="text-sm text-gray-600">{number.person}</p>
                  <p className="text-sm font-mono text-blue-600">{number.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditNumber(number)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Icon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDeleteNumber(number.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Номера транзита */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="Bus" size={16} className="text-blue-500" />
          Заиграевский транзит ({transitNumbers.length})
        </h4>
        <div className="grid gap-3">
          {transitNumbers.map((number) => (
            <div key={number.id} className="border border-blue-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-blue-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name={number.icon as any} size={16} className="text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">{number.name}</h5>
                  <p className="text-sm text-gray-600">{number.person}</p>
                  <p className="text-sm font-mono text-blue-600">{number.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditNumber(number)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Icon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => onDeleteNumber(number.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumbersTab;
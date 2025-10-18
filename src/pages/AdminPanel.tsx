import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from 'react-router-dom';

interface ImportantNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

interface TransitNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

interface HelpItem {
  title: string;
  description: string;
  contact: string;
  icon: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'numbers' | 'transit' | 'help'>('numbers');
  
  // Важные номера
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  const [editingNumber, setEditingNumber] = useState<ImportantNumber | null>(null);
  const [isAddingNumber, setIsAddingNumber] = useState(false);
  
  // Расписание транспорта
  const [transitNumbers, setTransitNumbers] = useState<TransitNumber[]>([]);
  const [editingTransit, setEditingTransit] = useState<TransitNumber | null>(null);
  const [isAddingTransit, setIsAddingTransit] = useState(false);
  
  // Помощь посёлку
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [editingHelp, setEditingHelp] = useState<HelpItem | null>(null);
  const [isAddingHelp, setIsAddingHelp] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setImportantNumbers(content.importantNumbers || []);
        setTransitNumbers(content.transitNumbers || []);
        setHelpItems(content.helpItems || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const saveData = () => {
    try {
      const content = {
        importantNumbers,
        transitNumbers,
        helpItems
      };
      localStorage.setItem('homePageContent', JSON.stringify(content));
      window.dispatchEvent(new Event('storage'));
      alert('✅ Данные успешно сохранены!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('❌ Ошибка при сохранении данных');
    }
  };

  const addNumber = (number: ImportantNumber) => {
    setImportantNumbers([...importantNumbers, number]);
    setIsAddingNumber(false);
  };

  const updateNumber = (index: number, updated: ImportantNumber) => {
    const newNumbers = [...importantNumbers];
    newNumbers[index] = updated;
    setImportantNumbers(newNumbers);
    setEditingNumber(null);
  };

  const deleteNumber = (index: number) => {
    if (confirm('Удалить этот номер?')) {
      setImportantNumbers(importantNumbers.filter((_, i) => i !== index));
    }
  };

  const addTransit = (transit: TransitNumber) => {
    setTransitNumbers([...transitNumbers, transit]);
    setIsAddingTransit(false);
  };

  const updateTransit = (index: number, updated: TransitNumber) => {
    const newTransit = [...transitNumbers];
    newTransit[index] = updated;
    setTransitNumbers(newTransit);
    setEditingTransit(null);
  };

  const deleteTransit = (index: number) => {
    if (confirm('Удалить это расписание?')) {
      setTransitNumbers(transitNumbers.filter((_, i) => i !== index));
    }
  };

  const addHelp = (help: HelpItem) => {
    setHelpItems([...helpItems, help]);
    setIsAddingHelp(false);
  };

  const updateHelp = (index: number, updated: HelpItem) => {
    const newHelp = [...helpItems];
    newHelp[index] = updated;
    setHelpItems(newHelp);
    setEditingHelp(null);
  };

  const deleteHelp = (index: number) => {
    if (confirm('Удалить эту запись?')) {
      setHelpItems(helpItems.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Icon name="Settings" size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Админ-панель
              </h1>
              <p className="text-sm text-gray-600">Управление платформой Горхон.Online</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="gap-2"
          >
            <Icon name="Home" size={18} />
            На главную
          </Button>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab('numbers')}
            className={`${
              activeTab === 'numbers'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Phone" size={18} />
            Важные номера
          </Button>
          <Button
            onClick={() => setActiveTab('transit')}
            className={`${
              activeTab === 'transit'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Bus" size={18} />
            Транспорт
          </Button>
          <Button
            onClick={() => setActiveTab('help')}
            className={`${
              activeTab === 'help'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Heart" size={18} />
            Помощь посёлку
          </Button>
        </div>

        {/* Кнопка сохранения */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Save" size={24} className="text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Не забудьте сохранить изменения!</p>
                  <p className="text-sm text-gray-600">Все изменения применятся после сохранения</p>
                </div>
              </div>
              <Button
                onClick={saveData}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Icon name="Save" size={18} />
                Сохранить всё
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Контент табов */}
        {activeTab === 'numbers' && (
          <NumbersTab
            numbers={importantNumbers}
            onAdd={addNumber}
            onUpdate={updateNumber}
            onDelete={deleteNumber}
            isAdding={isAddingNumber}
            setIsAdding={setIsAddingNumber}
            editing={editingNumber}
            setEditing={setEditingNumber}
          />
        )}

        {activeTab === 'transit' && (
          <TransitTab
            transit={transitNumbers}
            onAdd={addTransit}
            onUpdate={updateTransit}
            onDelete={deleteTransit}
            isAdding={isAddingTransit}
            setIsAdding={setIsAddingTransit}
            editing={editingTransit}
            setEditing={setEditingTransit}
          />
        )}

        {activeTab === 'help' && (
          <HelpTab
            items={helpItems}
            onAdd={addHelp}
            onUpdate={updateHelp}
            onDelete={deleteHelp}
            isAdding={isAddingHelp}
            setIsAdding={setIsAddingHelp}
            editing={editingHelp}
            setEditing={setEditingHelp}
          />
        )}
      </div>
    </div>
  );
};

// Компонент для редактирования важных номеров
const NumbersTab = ({ numbers, onAdd, onUpdate, onDelete, isAdding, setIsAdding, editing, setEditing }: any) => {
  const [formData, setFormData] = useState({ name: '', person: '', phone: '', icon: 'Phone' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      const index = numbers.findIndex((n: any) => n === editing);
      onUpdate(index, formData);
    } else {
      onAdd(formData);
    }
    setFormData({ name: '', person: '', phone: '', icon: 'Phone' });
  };

  const startEdit = (number: any) => {
    setEditing(number);
    setFormData(number);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Важные номера ({numbers.length})</span>
            <Button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditing(null);
                setFormData({ name: '', person: '', phone: '', icon: 'Phone' });
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Icon name="Plus" size={18} />
              Добавить номер
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <form onSubmit={handleSubmit} className="p-4 bg-purple-50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Название (например: ФАП Горхон)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Имя/Описание (например: Аяна Анатольевна)"
                value={formData.person}
                onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Телефон (например: 89244563184)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Phone">Телефон</option>
                <option value="Ambulance">Скорая</option>
                <option value="Shield">Полиция</option>
                <option value="Zap">Электричество</option>
                <option value="Building">Здание</option>
                <option value="Mail">Почта</option>
                <option value="Heart">Соц.защита</option>
                <option value="Truck">Транспорт</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                  {editing ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditing(null);
                    setFormData({ name: '', person: '', phone: '', icon: 'Phone' });
                  }}
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}

          {numbers.map((number: any, index: number) => (
            <div key={index} className="p-4 bg-white border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name={number.icon} size={20} className="text-purple-600" />
                <div>
                  <p className="font-semibold">{number.name}</p>
                  <p className="text-sm text-gray-600">{number.person}</p>
                  <p className="text-sm text-gray-500">{number.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(number)}>
                  <Icon name="Edit" size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(index)} className="text-red-600">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент для редактирования транспорта
const TransitTab = ({ transit, onAdd, onUpdate, onDelete, isAdding, setIsAdding, editing, setEditing }: any) => {
  const [formData, setFormData] = useState({ name: '', person: '', phone: '', icon: 'Bus' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      const index = transit.findIndex((t: any) => t === editing);
      onUpdate(index, formData);
    } else {
      onAdd(formData);
    }
    setFormData({ name: '', person: '', phone: '', icon: 'Bus' });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setFormData(item);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Расписание транспорта ({transit.length})</span>
            <Button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditing(null);
                setFormData({ name: '', person: '', phone: '', icon: 'Bus' });
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Icon name="Plus" size={18} />
              Добавить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <form onSubmit={handleSubmit} className="p-4 bg-purple-50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Название маршрута"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Описание"
                value={formData.person}
                onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Телефон диспетчера"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                  {editing ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditing(null);
                    setFormData({ name: '', person: '', phone: '', icon: 'Bus' });
                  }}
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}

          {transit.map((item: any, index: number) => (
            <div key={index} className="p-4 bg-white border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Bus" size={20} className="text-purple-600" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.person}</p>
                  <p className="text-sm text-gray-500">{item.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                  <Icon name="Edit" size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(index)} className="text-red-600">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент для редактирования помощи посёлку
const HelpTab = ({ items, onAdd, onUpdate, onDelete, isAdding, setIsAdding, editing, setEditing }: any) => {
  const [formData, setFormData] = useState({ title: '', description: '', contact: '', icon: 'Heart' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      const index = items.findIndex((i: any) => i === editing);
      onUpdate(index, formData);
    } else {
      onAdd(formData);
    }
    setFormData({ title: '', description: '', contact: '', icon: 'Heart' });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setFormData(item);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Помощь посёлку ({items.length})</span>
            <Button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditing(null);
                setFormData({ title: '', description: '', contact: '', icon: 'Heart' });
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Icon name="Plus" size={18} />
              Добавить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <form onSubmit={handleSubmit} className="p-4 bg-purple-50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Заголовок"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
              <input
                type="text"
                placeholder="Контакт"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Heart">Сердце</option>
                <option value="Users">Люди</option>
                <option value="HandHeart">Помощь</option>
                <option value="Gift">Подарок</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                  {editing ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditing(null);
                    setFormData({ title: '', description: '', contact: '', icon: 'Heart' });
                  }}
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}

          {items.map((item: any, index: number) => (
            <div key={index} className="p-4 bg-white border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name={item.icon} size={20} className="text-purple-600" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.contact}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                  <Icon name="Edit" size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(index)} className="text-red-600">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;

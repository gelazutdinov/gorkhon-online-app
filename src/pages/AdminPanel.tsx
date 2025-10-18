import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface ImportantNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

interface WorkScheduleItem {
  name: string;
  schedule: string;
  icon: string;
}

interface PvzItem {
  name: string;
  address: string;
  schedule: string;
  phone: string;
  hasFitting: boolean;
  photos: { url: string; caption: string; }[];
}

interface SystemMessage {
  id: string;
  text: string;
  timestamp: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'numbers' | 'transit' | 'help' | 'schedule' | 'pvz' | 'messages'>('numbers');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Важные номера
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  
  // Расписание транспорта
  const [transitNumbers, setTransitNumbers] = useState<ImportantNumber[]>([]);
  
  // Помощь посёлку
  const [helpItems, setHelpItems] = useState<any[]>([]);
  
  // Режим работы
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleItem[]>([]);
  
  // ПВЗ
  const [pvzItems, setPvzItems] = useState<PvzItem[]>([]);
  
  // Системные сообщения (офлайн)
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    loadAllData();
    
    // Отслеживание онлайн/офлайн статуса
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Подключение восстановлено!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Работаем офлайн. Данные сохраняются локально.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadAllData = () => {
    try {
      // Загрузка основного контента
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setImportantNumbers(content.importantNumbers || getDefaultNumbers());
        setTransitNumbers(content.transitNumbers || getDefaultTransit());
        setHelpItems(content.helpItems || getDefaultHelp());
        setWorkSchedule(content.workSchedule || getDefaultSchedule());
        setPvzItems(content.pvzItems || getDefaultPvz());
      } else {
        // Дефолтные данные
        setImportantNumbers(getDefaultNumbers());
        setTransitNumbers(getDefaultTransit());
        setHelpItems(getDefaultHelp());
        setWorkSchedule(getDefaultSchedule());
        setPvzItems(getDefaultPvz());
      }
      
      // Загрузка системных сообщений
      const savedMessages = localStorage.getItem('systemMessages');
      if (savedMessages) {
        setSystemMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка при загрузке данных');
    }
  };

  const getDefaultNumbers = (): ImportantNumber[] => [
    { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
    { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
    { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
    { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
    { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
    { name: "Почта Горхон", person: "Елена", phone: "8-914-843-45-93", icon: "Mail" }
  ];

  const getDefaultTransit = (): ImportantNumber[] => [
    { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
    { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
  ];

  const getDefaultHelp = () => [
    {
      title: "ФОНД поселка",
      description: "Ирина Н.П - Обязательно пишем 'ФОНД поселка'",
      contact: "408 178 109 091 606 626 11",
      icon: "Home"
    },
    {
      title: "Помощь церкви ⛪️",
      description: "Голофаева В. - Поддержка храма",
      contact: "89024562839",
      icon: "Heart"
    }
  ];

  const getDefaultSchedule = (): WorkScheduleItem[] => [
    { name: "ФАП", schedule: "Пн-Пт: 8:00-16:00", icon: "Hospital" },
    { name: "Почта", schedule: "Пн-Пт: 9:00-18:00, Сб: 9:00-14:00", icon: "Mail" }
  ];

  const getDefaultPvz = (): PvzItem[] => [
    {
      name: "Wildberries ПВЗ",
      address: "ул. Центральная, 1",
      schedule: "Пн-Вс: 10:00-20:00",
      phone: "89012345678",
      hasFitting: true,
      photos: []
    }
  ];

  const saveAllData = () => {
    try {
      const content = {
        importantNumbers,
        transitNumbers,
        helpItems,
        workSchedule,
        pvzItems
      };
      
      localStorage.setItem('homePageContent', JSON.stringify(content));
      localStorage.setItem('systemMessages', JSON.stringify(systemMessages));
      
      // Обновляем UI
      window.dispatchEvent(new Event('storage'));
      
      toast.success('✅ Все данные сохранены!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('❌ Ошибка при сохранении');
    }
  };

  const addSystemMessage = () => {
    if (!newMessageText.trim()) {
      toast.error('Введите текст сообщения');
      return;
    }

    const newMessage: SystemMessage = {
      id: Date.now().toString(),
      text: newMessageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [newMessage, ...systemMessages];
    setSystemMessages(updatedMessages);
    localStorage.setItem('systemMessages', JSON.stringify(updatedMessages));
    
    setNewMessageText('');
    toast.success('✅ Сообщение добавлено в системный чат!');
  };

  const deleteSystemMessage = (id: string) => {
    if (confirm('Удалить это сообщение?')) {
      const updated = systemMessages.filter(m => m.id !== id);
      setSystemMessages(updated);
      localStorage.setItem('systemMessages', JSON.stringify(updated));
      toast.success('Сообщение удалено');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Icon name="Settings" size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Админ-панель
              </h1>
              <p className="text-sm text-gray-600">Управление всем контентом Горхон.Online</p>
              {!isOnline && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-orange-600 font-medium">Офлайн-режим</span>
                </div>
              )}
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            onClick={() => setActiveTab('numbers')}
            className={`flex-shrink-0 ${
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
            className={`flex-shrink-0 ${
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
            className={`flex-shrink-0 ${
              activeTab === 'help'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Heart" size={18} />
            Помощь посёлку
          </Button>
          <Button
            onClick={() => setActiveTab('schedule')}
            className={`flex-shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Clock" size={18} />
            Режим работы
          </Button>
          <Button
            onClick={() => setActiveTab('pvz')}
            className={`flex-shrink-0 ${
              activeTab === 'pvz'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="Package" size={18} />
            ПВЗ
          </Button>
          <Button
            onClick={() => setActiveTab('messages')}
            className={`flex-shrink-0 ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon name="MessageSquare" size={18} />
            Системный чат
          </Button>
        </div>

        {/* Кнопка сохранения */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon name="Save" size={24} className="text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Сохраните изменения!</p>
                  <p className="text-sm text-gray-600">
                    {isOnline ? 'Все данные сохраняются локально' : 'Офлайн: данные доступны без интернета'}
                  </p>
                </div>
              </div>
              <Button
                onClick={saveAllData}
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
          <GenericEditor
            title="Важные номера"
            items={importantNumbers}
            setItems={setImportantNumbers}
            fields={[
              { name: 'name', label: 'Название', type: 'text', placeholder: 'ФАП Горхон' },
              { name: 'person', label: 'Имя/Описание', type: 'text', placeholder: 'Аяна Анатольевна' },
              { name: 'phone', label: 'Телефон', type: 'text', placeholder: '89244563184' },
              { name: 'icon', label: 'Иконка', type: 'select', options: ['Phone', 'Ambulance', 'Shield', 'Zap', 'Building', 'Mail', 'Heart', 'Truck', 'Car'] }
            ]}
            defaultItem={{ name: '', person: '', phone: '', icon: 'Phone' }}
          />
        )}

        {activeTab === 'transit' && (
          <GenericEditor
            title="Расписание транспорта"
            items={transitNumbers}
            setItems={setTransitNumbers}
            fields={[
              { name: 'name', label: 'Маршрут', type: 'text', placeholder: 'Диспетчер Город' },
              { name: 'person', label: 'Описание', type: 'text', placeholder: 'Заиграевский транзит' },
              { name: 'phone', label: 'Телефон', type: 'text', placeholder: '8-983-420-04-03' },
              { name: 'icon', label: 'Иконка', type: 'select', options: ['Bus', 'Car', 'Truck'] }
            ]}
            defaultItem={{ name: '', person: '', phone: '', icon: 'Bus' }}
          />
        )}

        {activeTab === 'help' && (
          <GenericEditor
            title="Помощь посёлку"
            items={helpItems}
            setItems={setHelpItems}
            fields={[
              { name: 'title', label: 'Заголовок', type: 'text', placeholder: 'ФОНД поселка' },
              { name: 'description', label: 'Описание', type: 'textarea', placeholder: 'Подробная информация' },
              { name: 'contact', label: 'Контакт', type: 'text', placeholder: 'Номер счета или телефон' },
              { name: 'icon', label: 'Иконка', type: 'select', options: ['Home', 'Heart', 'Shield', 'Gift', 'Users', 'HandHeart'] }
            ]}
            defaultItem={{ title: '', description: '', contact: '', icon: 'Heart' }}
          />
        )}

        {activeTab === 'schedule' && (
          <GenericEditor
            title="Режим работы организаций"
            items={workSchedule}
            setItems={setWorkSchedule}
            fields={[
              { name: 'name', label: 'Организация', type: 'text', placeholder: 'ФАП' },
              { name: 'schedule', label: 'Расписание', type: 'text', placeholder: 'Пн-Пт: 8:00-16:00' },
              { name: 'icon', label: 'Иконка', type: 'select', options: ['Hospital', 'Mail', 'Building', 'Phone', 'Users'] }
            ]}
            defaultItem={{ name: '', schedule: '', icon: 'Building' }}
          />
        )}

        {activeTab === 'pvz' && (
          <PvzEditor
            items={pvzItems}
            setItems={setPvzItems}
          />
        )}

        {activeTab === 'messages' && (
          <SystemMessagesEditor
            messages={systemMessages}
            newMessageText={newMessageText}
            setNewMessageText={setNewMessageText}
            onAddMessage={addSystemMessage}
            onDeleteMessage={deleteSystemMessage}
          />
        )}
      </div>
    </div>
  );
};

// Универсальный редактор для простых списков
const GenericEditor = ({ title, items, setItems, fields, defaultItem }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(defaultItem);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = formData;
      setItems(updated);
      toast.success('Запись обновлена');
    } else {
      setItems([...items, formData]);
      toast.success('Запись добавлена');
    }
    setFormData(defaultItem);
    setIsAdding(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(items[index]);
    setIsAdding(true);
  };

  const deleteItem = (index: number) => {
    if (confirm('Удалить эту запись?')) {
      setItems(items.filter((_: any, i: number) => i !== index));
      toast.success('Запись удалена');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title} ({items.length})</span>
          <Button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingIndex(null);
              setFormData(defaultItem);
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
            {fields.map((field: any) => (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                {editingIndex !== null ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                  setFormData(defaultItem);
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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon name={item.icon || 'Circle'} size={20} className="text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                {Object.keys(item).filter(k => k !== 'icon').map(key => (
                  <p key={key} className={`${key === Object.keys(item).filter(k => k !== 'icon')[0] ? 'font-semibold' : 'text-sm text-gray-600'} truncate`}>
                    {item[key]}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" onClick={() => startEdit(index)}>
                <Icon name="Edit" size={16} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteItem(index)} className="text-red-600">
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Редактор ПВЗ
const PvzEditor = ({ items, setItems }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    schedule: '',
    phone: '',
    hasFitting: false,
    photos: []
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = formData;
      setItems(updated);
      toast.success('ПВЗ обновлён');
    } else {
      setItems([...items, formData]);
      toast.success('ПВЗ добавлен');
    }
    setFormData({ name: '', address: '', schedule: '', phone: '', hasFitting: false, photos: [] });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(items[index]);
    setIsAdding(true);
  };

  const deleteItem = (index: number) => {
    if (confirm('Удалить этот ПВЗ?')) {
      setItems(items.filter((_: any, i: number) => i !== index));
      toast.success('ПВЗ удалён');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Пункты выдачи заказов ({items.length})</span>
          <Button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingIndex(null);
              setFormData({ name: '', address: '', schedule: '', phone: '', hasFitting: false, photos: [] });
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Icon name="Plus" size={18} />
            Добавить ПВЗ
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-4 bg-purple-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Название (Wildberries ПВЗ)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Адрес"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Режим работы"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasFitting}
                onChange={(e) => setFormData({ ...formData, hasFitting: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Есть примерочная</span>
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                {editingIndex !== null ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                  setFormData({ name: '', address: '', schedule: '', phone: '', hasFitting: false, photos: [] });
                }}
                variant="outline"
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        {items.map((item: any, index: number) => (
          <div key={index} className="p-4 bg-white border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Icon name="Package" size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  <p className="text-sm text-gray-500">{item.schedule}</p>
                  <p className="text-sm text-gray-500">{item.phone}</p>
                  {item.hasFitting && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Есть примерочная
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => startEdit(index)}>
                  <Icon name="Edit" size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteItem(index)} className="text-red-600">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Редактор системных сообщений
const SystemMessagesEditor = ({ messages, newMessageText, setNewMessageText, onAddMessage, onDeleteMessage }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon name="MessageSquare" size={24} className="text-purple-600" />
          <span>Системный чат ({messages.length} сообщений)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Форма добавления нового сообщения */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="Plus" size={18} />
            Новое сообщение в системный чат
          </h3>
          <textarea
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Напишите сообщение для пользователей...&#10;&#10;Например:&#10;🎉 Обновление платформы!&#10;✨ Добавлены новые функции"
            className="w-full px-4 py-3 border rounded-lg mb-3 min-h-[120px]"
          />
          <Button
            onClick={onAddMessage}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Icon name="Send" size={18} />
            Отправить сообщение
          </Button>
          <p className="text-xs text-gray-600 mt-2">
            💡 Сообщение сразу появится в системном чате на главной странице
          </p>
        </div>

        {/* Список сообщений */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Отправленные сообщения:</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Пока нет сообщений</p>
          ) : (
            messages.map((msg: SystemMessage) => (
              <div key={msg.id} className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 whitespace-pre-line">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(msg.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteMessage(msg.id)}
                    className="text-red-600 flex-shrink-0"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;

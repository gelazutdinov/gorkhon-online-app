import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  isFromAdmin?: boolean;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'numbers' | 'transit' | 'help' | 'schedule' | 'pvz' | 'messages'>('messages');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  const [transitNumbers, setTransitNumbers] = useState<ImportantNumber[]>([]);
  const [helpItems, setHelpItems] = useState<any[]>([]);
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleItem[]>([]);
  const [pvzItems, setPvzItems] = useState<PvzItem[]>([]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    loadAllData();
    
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
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setImportantNumbers(content.importantNumbers || getDefaultNumbers());
        setTransitNumbers(content.transitNumbers || getDefaultTransit());
        setHelpItems(content.helpItems || getDefaultHelp());
        setWorkSchedule(content.workSchedule || getDefaultSchedule());
        setPvzItems(content.pvzItems || getDefaultPvz());
      } else {
        setImportantNumbers(getDefaultNumbers());
        setTransitNumbers(getDefaultTransit());
        setHelpItems(getDefaultHelp());
        setWorkSchedule(getDefaultSchedule());
        setPvzItems(getDefaultPvz());
      }
      
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
    { name: "Скорая помощь (новый)", person: "Дополнительный номер", phone: "73013645103", icon: "Ambulance" },
    { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
    { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
    { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+73013641220", icon: "Heart" },
    { name: "Регистратура поликлиники", person: "Заиграево", phone: "+79245559003", icon: "Stethoscope" },
    { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+73013641614", icon: "FileText" },
    { name: "Судебные приставы", person: "Заиграевский район", phone: "83013641010", icon: "Scale" },
    { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+79834539902", icon: "Truck" },
    { name: "Почта Горхон", person: "Елена", phone: "8-914-843-45-93", icon: "Mail" },
    { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" }
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
    },
    {
      title: "Помощь бойцам 🪖",
      description: "Олеся Николаевна Н. - В теме: 'Помощь Бойцам'",
      contact: "89246210100",
      icon: "Shield"
    }
  ];

  const getDefaultSchedule = (): WorkScheduleItem[] => [
    { name: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
    { name: "Сбербанк", schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", icon: "CreditCard" },
    { name: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
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
      window.dispatchEvent(new Event('storage'));
      
      toast.success('✅ Все данные успешно сохранены!', {
        description: 'Изменения отображаются на главной странице'
      });
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
      timestamp: new Date().toISOString(),
      isFromAdmin: true
    };

    const updatedMessages = [newMessage, ...systemMessages];
    setSystemMessages(updatedMessages);
    localStorage.setItem('systemMessages', JSON.stringify(updatedMessages));
    window.dispatchEvent(new Event('storage'));
    
    setNewMessageText('');
    toast.success('✅ Сообщение опубликовано!', {
      description: 'Пользователи увидят его в чате с Линой'
    });
  };

  const deleteSystemMessage = (id: string) => {
    const updated = systemMessages.filter(m => m.id !== id);
    setSystemMessages(updated);
    localStorage.setItem('systemMessages', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    toast.success('Сообщение удалено');
  };

  const addItem = (type: string) => {
    if (type === 'numbers') {
      setImportantNumbers([...importantNumbers, { name: '', person: '', phone: '', icon: 'Phone' }]);
    } else if (type === 'transit') {
      setTransitNumbers([...transitNumbers, { name: '', person: '', phone: '', icon: 'Bus' }]);
    } else if (type === 'help') {
      setHelpItems([...helpItems, { title: '', description: '', contact: '', icon: 'Heart' }]);
    } else if (type === 'schedule') {
      setWorkSchedule([...workSchedule, { name: '', schedule: '', icon: 'Clock' }]);
    } else if (type === 'pvz') {
      setPvzItems([...pvzItems, { name: '', address: '', schedule: '', phone: '', hasFitting: false, photos: [] }]);
    }
  };

  const removeItem = (type: string, index: number) => {
    if (type === 'numbers') setImportantNumbers(importantNumbers.filter((_, i) => i !== index));
    else if (type === 'transit') setTransitNumbers(transitNumbers.filter((_, i) => i !== index));
    else if (type === 'help') setHelpItems(helpItems.filter((_, i) => i !== index));
    else if (type === 'schedule') setWorkSchedule(workSchedule.filter((_, i) => i !== index));
    else if (type === 'pvz') setPvzItems(pvzItems.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'messages', label: 'Системный чат', icon: 'MessageSquare', color: 'from-blue-500 to-cyan-500' },
    { id: 'numbers', label: 'Важные номера', icon: 'Phone', color: 'from-purple-500 to-pink-500' },
    { id: 'transit', label: 'Транспорт', icon: 'Bus', color: 'from-green-500 to-emerald-500' },
    { id: 'help', label: 'Помощь', icon: 'Heart', color: 'from-red-500 to-rose-500' },
    { id: 'schedule', label: 'Режим работы', icon: 'Clock', color: 'from-orange-500 to-amber-500' },
    { id: 'pvz', label: 'ПВЗ', icon: 'Package', color: 'from-indigo-500 to-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Современный хедер */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl">
                  <Icon name="Settings" size={32} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Админ-панель
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <span>Управление контентом Горхон.Online</span>
                  {!isOnline && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                      Офлайн
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2 hover:bg-purple-50 border-purple-200 hover:border-purple-400 transition-all"
            >
              <Icon name="Home" size={18} />
              На главную
            </Button>
          </div>
        </div>

        {/* Современные табы */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'scale-105 shadow-2xl'
                  : 'hover:scale-102 shadow-md hover:shadow-xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'
              } transition-opacity`}></div>
              <div className="relative flex flex-col items-center gap-2 text-white">
                <Icon name={tab.icon as any} size={24} />
                <span className="text-sm font-semibold text-center">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Контент табов */}
        <div className="space-y-6">
          
          {/* Системный чат */}
          {activeTab === 'messages' && (
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <Icon name="MessageSquare" size={24} />
                  <div>
                    <div>Системный чат (Офлайн)</div>
                    <p className="text-sm font-normal text-gray-600 mt-1">
                      Сообщения отображаются у пользователей в чате с Линой
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                
                {/* Форма нового сообщения */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📢 Новое сообщение для пользователей
                  </label>
                  <Textarea
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Введите текст объявления..."
                    className="mb-4 min-h-[100px] border-blue-300 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        addSystemMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={addSystemMessage}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                  >
                    <Icon name="Send" size={18} className="mr-2" />
                    Опубликовать (Ctrl+Enter)
                  </Button>
                </div>

                {/* Список сообщений */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Icon name="List" size={18} />
                    Опубликованные сообщения ({systemMessages.length})
                  </h3>
                  {systemMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Нет опубликованных сообщений</p>
                    </div>
                  ) : (
                    systemMessages.map(msg => (
                      <div key={msg.id} className="group bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                                Системное
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(msg.timestamp).toLocaleString('ru-RU')}
                              </span>
                            </div>
                            <p className="text-gray-800 leading-relaxed">{msg.text}</p>
                          </div>
                          <Button
                            onClick={() => deleteSystemMessage(msg.id)}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
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
          )}

          {/* Важные номера */}
          {activeTab === 'numbers' && (
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <Icon name="Phone" size={24} />
                  Важные номера телефонов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {importantNumbers.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-purple-300 transition-all space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Название"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...importantNumbers];
                          updated[idx].name = e.target.value;
                          setImportantNumbers(updated);
                        }}
                      />
                      <Input
                        placeholder="Контактное лицо"
                        value={item.person}
                        onChange={(e) => {
                          const updated = [...importantNumbers];
                          updated[idx].person = e.target.value;
                          setImportantNumbers(updated);
                        }}
                      />
                      <Input
                        placeholder="Телефон"
                        value={item.phone}
                        onChange={(e) => {
                          const updated = [...importantNumbers];
                          updated[idx].phone = e.target.value;
                          setImportantNumbers(updated);
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeItem('numbers', idx)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addItem('numbers')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить номер
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Транспорт */}
          {activeTab === 'transit' && (
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <Icon name="Bus" size={24} />
                  Расписание транспорта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {transitNumbers.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-300 transition-all space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Название"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...transitNumbers];
                          updated[idx].name = e.target.value;
                          setTransitNumbers(updated);
                        }}
                      />
                      <Input
                        placeholder="Описание"
                        value={item.person}
                        onChange={(e) => {
                          const updated = [...transitNumbers];
                          updated[idx].person = e.target.value;
                          setTransitNumbers(updated);
                        }}
                      />
                      <Input
                        placeholder="Телефон"
                        value={item.phone}
                        onChange={(e) => {
                          const updated = [...transitNumbers];
                          updated[idx].phone = e.target.value;
                          setTransitNumbers(updated);
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeItem('transit', idx)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addItem('transit')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить маршрут
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Помощь посёлку */}
          {activeTab === 'help' && (
            <Card className="border-2 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
                <CardTitle className="flex items-center gap-3 text-red-700">
                  <Icon name="Heart" size={24} />
                  Помощь посёлку
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {helpItems.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-red-300 transition-all space-y-3">
                    <Input
                      placeholder="Название"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...helpItems];
                        updated[idx].title = e.target.value;
                        setHelpItems(updated);
                      }}
                    />
                    <Textarea
                      placeholder="Описание"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...helpItems];
                        updated[idx].description = e.target.value;
                        setHelpItems(updated);
                      }}
                    />
                    <Input
                      placeholder="Контакт"
                      value={item.contact}
                      onChange={(e) => {
                        const updated = [...helpItems];
                        updated[idx].contact = e.target.value;
                        setHelpItems(updated);
                      }}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeItem('help', idx)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addItem('help')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-red-300 hover:border-red-500 hover:bg-red-50"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Режим работы */}
          {activeTab === 'schedule' && (
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="flex items-center gap-3 text-orange-700">
                  <Icon name="Clock" size={24} />
                  Режим работы организаций
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {workSchedule.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-orange-300 transition-all space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Название организации"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...workSchedule];
                          updated[idx].name = e.target.value;
                          setWorkSchedule(updated);
                        }}
                      />
                      <Input
                        placeholder="Расписание"
                        value={item.schedule}
                        onChange={(e) => {
                          const updated = [...workSchedule];
                          updated[idx].schedule = e.target.value;
                          setWorkSchedule(updated);
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeItem('schedule', idx)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addItem('schedule')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить расписание
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ПВЗ */}
          {activeTab === 'pvz' && (
            <Card className="border-2 border-indigo-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center gap-3 text-indigo-700">
                  <Icon name="Package" size={24} />
                  Пункты выдачи заказов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {pvzItems.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-indigo-300 transition-all space-y-3">
                    <Input
                      placeholder="Название ПВЗ"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...pvzItems];
                        updated[idx].name = e.target.value;
                        setPvzItems(updated);
                      }}
                    />
                    <Input
                      placeholder="Адрес"
                      value={item.address}
                      onChange={(e) => {
                        const updated = [...pvzItems];
                        updated[idx].address = e.target.value;
                        setPvzItems(updated);
                      }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Режим работы"
                        value={item.schedule}
                        onChange={(e) => {
                          const updated = [...pvzItems];
                          updated[idx].schedule = e.target.value;
                          setPvzItems(updated);
                        }}
                      />
                      <Input
                        placeholder="Телефон"
                        value={item.phone}
                        onChange={(e) => {
                          const updated = [...pvzItems];
                          updated[idx].phone = e.target.value;
                          setPvzItems(updated);
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeItem('pvz', idx)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => addItem('pvz')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить ПВЗ
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Кнопка сохранения */}
          {activeTab !== 'messages' && (
            <div className="sticky bottom-4 z-10">
              <Button
                onClick={saveAllData}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all"
              >
                <Icon name="Save" size={24} className="mr-2" />
                💾 Сохранить все изменения
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
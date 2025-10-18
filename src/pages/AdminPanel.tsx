import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ImportantNumber, WorkScheduleItem, PvzItem, SystemMessage, HelpItem } from '@/components/admin/types';
import { getDefaultNumbers, getDefaultTransit, getDefaultHelp, getDefaultSchedule, getDefaultPvz } from '@/components/admin/defaultData';
import SystemMessagesTab from '@/components/admin/SystemMessagesTab';
import ImportantNumbersTab from '@/components/admin/ImportantNumbersTab';
import TransitTab from '@/components/admin/TransitTab';
import HelpTab from '@/components/admin/HelpTab';
import ScheduleTab from '@/components/admin/ScheduleTab';
import PvzTab from '@/components/admin/PvzTab';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'numbers' | 'transit' | 'help' | 'schedule' | 'pvz' | 'messages'>('messages');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  const [transitNumbers, setTransitNumbers] = useState<ImportantNumber[]>([]);
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
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

        <div className="space-y-6">
          
          {activeTab === 'messages' && (
            <SystemMessagesTab
              systemMessages={systemMessages}
              newMessageText={newMessageText}
              setNewMessageText={setNewMessageText}
              addSystemMessage={addSystemMessage}
              deleteSystemMessage={deleteSystemMessage}
            />
          )}

          {activeTab === 'numbers' && (
            <ImportantNumbersTab
              importantNumbers={importantNumbers}
              setImportantNumbers={setImportantNumbers}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'transit' && (
            <TransitTab
              transitNumbers={transitNumbers}
              setTransitNumbers={setTransitNumbers}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'help' && (
            <HelpTab
              helpItems={helpItems}
              setHelpItems={setHelpItems}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab
              workSchedule={workSchedule}
              setWorkSchedule={setWorkSchedule}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'pvz' && (
            <PvzTab
              pvzItems={pvzItems}
              setPvzItems={setPvzItems}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

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

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import NumbersTab from './tabs/NumbersTab';
import SectionsTab from './tabs/SectionsTab';
import SettingsTab from './tabs/SettingsTab';
import PreviewTab from './tabs/PreviewTab';
import NumberModal from './modals/NumberModal';

interface ImportantNumber {
  id: string;
  name: string;
  person: string;
  phone: string;
  icon: string;
  category: 'important' | 'transit';
}

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description: string;
}

interface HomePageContent {
  importantNumbers: ImportantNumber[];
  transitNumbers: ImportantNumber[];
  siteTitle: string;
  siteDescription: string;
  lastUpdated: string;
  sections: SectionConfig[];
  donationText: string;
  donationGoal: number;
  donationCurrent: number;
}

const ContentEditor = () => {
  const [content, setContent] = useState<HomePageContent>({
    importantNumbers: [],
    transitNumbers: [],
    siteTitle: "Горхон.Online",
    siteDescription: "Цифровая платформа села Горхон",
    lastUpdated: "",
    sections: [
      { id: 'importantNumbers', name: 'Важные номера', enabled: true, order: 1, description: 'Контакты экстренных служб и организаций' },
      { id: 'schedule', name: 'Расписание транспорта', enabled: true, order: 2, description: 'Автобусы и транспорт' },
      { id: 'donation', name: 'Сбор средств', enabled: true, order: 3, description: 'Благотворительные сборы' },
      { id: 'workSchedule', name: 'Режим работы', enabled: true, order: 4, description: 'График работы организаций' },
      { id: 'weather', name: 'Погода', enabled: true, order: 5, description: 'Прогноз погоды' },
      { id: 'pvz', name: 'ПВЗ и фото', enabled: true, order: 6, description: 'Пункты выдачи заказов и фотогалерея' },
      { id: 'actionButtons', name: 'Быстрые действия', enabled: true, order: 7, description: 'Кнопки быстрого доступа' }
    ],
    donationText: "Помощь семье",
    donationGoal: 100000,
    donationCurrent: 45000
  });
  const [activeTab, setActiveTab] = useState<'numbers' | 'sections' | 'settings' | 'preview'>('numbers');
  const [editingNumber, setEditingNumber] = useState<ImportantNumber | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Загрузка контента при инициализации
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        setContent(JSON.parse(savedContent));
      } else {
        // Загружаем дефолтные данные
        setContent({
          importantNumbers: [
            { id: '1', name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone", category: 'important' },
            { id: '2', name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield", category: 'important' },
            { id: '3', name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance", category: 'important' },
            { id: '4', name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap", category: 'important' },
            { id: '5', name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building", category: 'important' },
            { id: '6', name: "Почта Горхон", person: "Юлия Паук", phone: "+89836307423", icon: "Mail", category: 'important' },
            { id: '7', name: "ЕДДС района", person: "Служба экстренного реагирования", phone: "83013641414", icon: "AlertTriangle", category: 'important' }
          ],
          transitNumbers: [
            { id: '8', name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus", category: 'transit' },
            { id: '9', name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus", category: 'transit' }
          ],
          siteTitle: "Горхон.Online",
          siteDescription: "Цифровая платформа села Горхон",
          lastUpdated: new Date().toISOString(),
          sections: [
            { id: 'importantNumbers', name: 'Важные номера', enabled: true, order: 1, description: 'Контакты экстренных служб и организаций' },
            { id: 'schedule', name: 'Расписание транспорта', enabled: true, order: 2, description: 'Автобусы и транспорт' },
            { id: 'donation', name: 'Сбор средств', enabled: true, order: 3, description: 'Благотворительные сборы' },
            { id: 'workSchedule', name: 'Режим работы', enabled: true, order: 4, description: 'График работы организаций' },
            { id: 'weather', name: 'Погода', enabled: true, order: 5, description: 'Прогноз погоды' },
            { id: 'pvz', name: 'ПВЗ и фото', enabled: true, order: 6, description: 'Пункты выдачи заказов и фотогалерея' },
            { id: 'actionButtons', name: 'Быстрые действия', enabled: true, order: 7, description: 'Кнопки быстрого доступа' }
          ],
          donationText: "Помощь семье",
          donationGoal: 100000,
          donationCurrent: 45000
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки контента:', error);
      showMessage('Ошибка загрузки данных', 'error');
    }
  };

  const saveContent = () => {
    setIsLoading(true);
    try {
      const updatedContent = {
        ...content,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('homePageContent', JSON.stringify(updatedContent));
      setContent(updatedContent);
      showMessage('Контент успешно сохранен!', 'success');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      showMessage('Ошибка сохранения данных', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const iconOptions = [
    'Phone', 'Shield', 'Ambulance', 'Zap', 'Building', 'Mail', 'AlertTriangle', 
    'Bus', 'Car', 'Truck', 'Heart', 'Home', 'MapPin', 'Users', 'Info', 'Bell'
  ];

  const addNumber = (numberData: Omit<ImportantNumber, 'id'>) => {
    const newNumber: ImportantNumber = {
      ...numberData,
      id: Date.now().toString()
    };

    setContent(prev => ({
      ...prev,
      [numberData.category === 'important' ? 'importantNumbers' : 'transitNumbers']: [
        ...prev[numberData.category === 'important' ? 'importantNumbers' : 'transitNumbers'],
        newNumber
      ]
    }));
    setShowAddModal(false);
  };

  const updateNumber = (updatedNumber: ImportantNumber) => {
    setContent(prev => ({
      ...prev,
      importantNumbers: prev.importantNumbers.map(num => 
        num.id === updatedNumber.id ? updatedNumber : num
      ),
      transitNumbers: prev.transitNumbers.map(num => 
        num.id === updatedNumber.id ? updatedNumber : num
      )
    }));
    setEditingNumber(null);
  };

  const deleteNumber = (id: string) => {
    if (!confirm('Удалить этот номер?')) return;
    
    setContent(prev => ({
      ...prev,
      importantNumbers: prev.importantNumbers.filter(num => num.id !== id),
      transitNumbers: prev.transitNumbers.filter(num => num.id !== id)
    }));
  };

  const updateTitle = (title: string) => {
    setContent(prev => ({ ...prev, siteTitle: title }));
  };

  const updateDescription = (description: string) => {
    setContent(prev => ({ ...prev, siteDescription: description }));
  };

  const updateSection = (sectionId: string, updates: Partial<SectionConfig>) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const reorderSections = (sections: SectionConfig[]) => {
    setContent(prev => ({ ...prev, sections }));
  };

  const updateDonationSettings = (settings: { text: string; goal: number; current: number }) => {
    setContent(prev => ({
      ...prev,
      donationText: settings.text,
      donationGoal: settings.goal,
      donationCurrent: settings.current
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Icon name="Edit" size={24} />
                Редактор главной страницы
              </h1>
              <p className="text-blue-100 mt-1">Управление контентом и важными номерами</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveContent}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={16} />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        {message && (
          <div className={`p-4 text-center font-medium ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-b border-green-200' 
              : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Табы */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'numbers', label: 'Важные номера', icon: 'Phone' },
              { key: 'sections', label: 'Управление лентой', icon: 'Layout' },
              { key: 'settings', label: 'Настройки сайта', icon: 'Settings' },
              { key: 'preview', label: 'Предпросмотр', icon: 'Eye' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon name={tab.icon as any} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Контент табов */}
        <div className="p-6">
          {activeTab === 'numbers' && (
            <NumbersTab
              importantNumbers={content.importantNumbers}
              transitNumbers={content.transitNumbers}
              onAddNumber={() => setShowAddModal(true)}
              onEditNumber={setEditingNumber}
              onDeleteNumber={deleteNumber}
            />
          )}

          {activeTab === 'sections' && (
            <SectionsTab
              sections={content.sections}
              donationSettings={{
                text: content.donationText,
                goal: content.donationGoal,
                current: content.donationCurrent
              }}
              onUpdateSection={updateSection}
              onReorderSections={reorderSections}
              onUpdateDonationSettings={updateDonationSettings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              siteTitle={content.siteTitle}
              siteDescription={content.siteDescription}
              lastUpdated={content.lastUpdated}
              onUpdateTitle={updateTitle}
              onUpdateDescription={updateDescription}
            />
          )}

          {activeTab === 'preview' && (
            <PreviewTab
              siteTitle={content.siteTitle}
              siteDescription={content.siteDescription}
              importantNumbers={content.importantNumbers}
              transitNumbers={content.transitNumbers}
            />
          )}
        </div>
      </div>

      {/* Модальное окно добавления номера */}
      {showAddModal && (
        <NumberModal
          onClose={() => setShowAddModal(false)}
          onSave={addNumber}
          iconOptions={iconOptions}
        />
      )}

      {/* Модальное окно редактирования номера */}
      {editingNumber && (
        <NumberModal
          number={editingNumber}
          onClose={() => setEditingNumber(null)}
          onSave={updateNumber}
          iconOptions={iconOptions}
          isEdit
        />
      )}
    </div>
  );
};

export default ContentEditor;
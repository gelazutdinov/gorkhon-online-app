import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface ImportantNumber {
  id: string;
  name: string;
  person: string;
  phone: string;
  icon: string;
  category: 'important' | 'transit';
}

interface HomePageContent {
  importantNumbers: ImportantNumber[];
  transitNumbers: ImportantNumber[];
  siteTitle: string;
  siteDescription: string;
  lastUpdated: string;
}

const ContentEditor = () => {
  const [content, setContent] = useState<HomePageContent>({
    importantNumbers: [],
    transitNumbers: [],
    siteTitle: "Горхон.Online",
    siteDescription: "Цифровая платформа села Горхон",
    lastUpdated: ""
  });
  const [activeTab, setActiveTab] = useState<'numbers' | 'settings' | 'preview'>('numbers');
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
          lastUpdated: new Date().toISOString()
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
            <div className="space-y-6">
              {/* Кнопка добавления */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Управление номерами</h3>
                <button
                  onClick={() => setShowAddModal(true)}
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
                  Важные номера ({content.importantNumbers.length})
                </h4>
                <div className="grid gap-3">
                  {content.importantNumbers.map((number) => (
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
                          onClick={() => setEditingNumber(number)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Icon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => deleteNumber(number.id)}
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
                  <Icon name="Bus" size={16} className="text-orange-500" />
                  Заиграевский транзит ({content.transitNumbers.length})
                </h4>
                <div className="grid gap-3">
                  {content.transitNumbers.map((number) => (
                    <div key={number.id} className="border border-orange-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-orange-50/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Icon name={number.icon as any} size={16} className="text-orange-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">{number.name}</h5>
                          <p className="text-sm text-gray-600">{number.person}</p>
                          <p className="text-sm font-mono text-orange-600">{number.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingNumber(number)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                        >
                          <Icon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => deleteNumber(number.id)}
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
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Настройки сайта</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    value={content.siteTitle}
                    onChange={(e) => setContent(prev => ({ ...prev, siteTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание сайта
                  </label>
                  <textarea
                    value={content.siteDescription}
                    onChange={(e) => setContent(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {content.lastUpdated && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Последнее обновление: {new Date(content.lastUpdated).toLocaleString('ru-RU')}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Предпросмотр контента</h3>
              
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">{content.siteTitle}</h1>
                    <p className="text-gray-600">{content.siteDescription}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Icon name="Phone" size={16} />
                        Важные номера
                      </h4>
                      <div className="space-y-2">
                        {content.importantNumbers.map((num) => (
                          <div key={num.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <Icon name={num.icon as any} size={16} className="text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">{num.name}</p>
                                <p className="text-xs text-gray-600">{num.person}</p>
                                <p className="text-xs font-mono text-blue-600">{num.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Icon name="Bus" size={16} />
                        Транзит
                      </h4>
                      <div className="space-y-2">
                        {content.transitNumbers.map((num) => (
                          <div key={num.id} className="bg-orange-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Icon name={num.icon as any} size={16} className="text-orange-600" />
                              <div>
                                <p className="font-medium text-sm">{num.name}</p>
                                <p className="text-xs text-gray-600">{num.person}</p>
                                <p className="text-xs font-mono text-orange-600">{num.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

// Компонент модального окна для добавления/редактирования номера
interface NumberModalProps {
  number?: ImportantNumber;
  onClose: () => void;
  onSave: (number: any) => void;
  iconOptions: string[];
  isEdit?: boolean;
}

const NumberModal = ({ number, onClose, onSave, iconOptions, isEdit = false }: NumberModalProps) => {
  const [formData, setFormData] = useState({
    name: number?.name || '',
    person: number?.person || '',
    phone: number?.phone || '',
    icon: number?.icon || 'Phone',
    category: number?.category || 'important'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && number) {
      onSave({ ...number, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEdit ? 'Редактировать номер' : 'Добавить новый номер'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название службы
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Контактное лицо / Описание
              </label>
              <input
                type="text"
                value={formData.person}
                onChange={(e) => setFormData(prev => ({ ...prev, person: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер телефона
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Иконка
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'important' | 'transit' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="important">Важные номера</option>
                <option value="transit">Заиграевский транзит</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEdit ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
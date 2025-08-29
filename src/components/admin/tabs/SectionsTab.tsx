import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description: string;
}

interface DonationSettings {
  text: string;
  goal: number;
  current: number;
}

interface SectionsTabProps {
  sections: SectionConfig[];
  donationSettings: DonationSettings;
  onUpdateSection: (sectionId: string, updates: Partial<SectionConfig>) => void;
  onReorderSections: (sections: SectionConfig[]) => void;
  onUpdateDonationSettings: (settings: DonationSettings) => void;
}

const SectionsTab = ({
  sections,
  donationSettings,
  onUpdateSection,
  onReorderSections,
  onUpdateDonationSettings
}: SectionsTabProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingDonation, setEditingDonation] = useState(false);
  const [donationForm, setDonationForm] = useState(donationSettings);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSections = [...sortedSections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);

    // Обновляем порядок
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));

    onReorderSections(reorderedSections);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleSection = (sectionId: string, enabled: boolean) => {
    onUpdateSection(sectionId, { enabled });
  };

  const saveDonationSettings = () => {
    onUpdateDonationSettings(donationForm);
    setEditingDonation(false);
  };

  const cancelDonationEdit = () => {
    setDonationForm(donationSettings);
    setEditingDonation(false);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Icon name="Layout" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Управление лентой</h2>
          <p className="text-gray-600">Настройте отображение и порядок секций на главной странице</p>
        </div>
      </div>

      {/* Секции */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="List" size={20} />
          Секции главной страницы
        </h3>
        <div className="space-y-3">
          {sortedSections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg p-4 border-2 transition-all cursor-move ${
                section.enabled 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-gray-200 bg-gray-50/50 opacity-60'
              } ${draggedIndex === index ? 'scale-105 shadow-lg' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Icon name="GripVertical" size={16} />
                    <span className="text-xs font-mono">{section.order}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{section.name}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => toggleSection(section.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Настройки пожертвований */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Icon name="Heart" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Настройки пожертвований</h3>
              <p className="text-gray-600">Управление блоком сбора средств</p>
            </div>
          </div>
          {!editingDonation && (
            <button
              onClick={() => setEditingDonation(true)}
              className="px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <Icon name="Edit" size={16} />
              Редактировать
            </button>
          )}
        </div>

        {editingDonation ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название сбора
              </label>
              <input
                type="text"
                value={donationForm.text}
                onChange={(e) => setDonationForm(prev => ({ ...prev, text: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Название благотворительного сбора"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цель сбора (₽)
                </label>
                <input
                  type="number"
                  value={donationForm.goal}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, goal: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="100000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Собрано (₽)
                </label>
                <input
                  type="number"
                  value={donationForm.current}
                  onChange={(e) => setDonationForm(prev => ({ ...prev, current: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="45000"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={saveDonationSettings}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all flex items-center gap-2"
              >
                <Icon name="Save" size={16} />
                Сохранить
              </button>
              <button
                onClick={cancelDonationEdit}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-sm text-gray-600">Название</div>
              <div className="font-medium text-gray-900">{donationSettings.text}</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-sm text-gray-600">Цель</div>
              <div className="font-medium text-gray-900">{donationSettings.goal.toLocaleString()} ₽</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-sm text-gray-600">Собрано</div>
              <div className="font-medium text-gray-900">{donationSettings.current.toLocaleString()} ₽</div>
            </div>
          </div>
        )}

        {!editingDonation && (
          <div className="mt-4 bg-white/70 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Прогресс</span>
              <span>{Math.round((donationSettings.current / donationSettings.goal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((donationSettings.current / donationSettings.goal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Подсказки */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name="Info" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Советы по управлению лентой</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Перетаскивайте секции для изменения их порядка</li>
              <li>• Отключайте ненужные секции переключателем</li>
              <li>• Важные номера всегда отображаются первыми</li>
              <li>• Изменения сохраняются автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsTab;
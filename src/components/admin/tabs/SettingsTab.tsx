interface SettingsTabProps {
  siteTitle: string;
  siteDescription: string;
  lastUpdated: string;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
}

const SettingsTab = ({
  siteTitle,
  siteDescription,
  lastUpdated,
  onUpdateTitle,
  onUpdateDescription
}: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Настройки сайта</h3>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название сайта
          </label>
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание сайта
          </label>
          <textarea
            value={siteDescription}
            onChange={(e) => onUpdateDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {lastUpdated && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Последнее обновление: {new Date(lastUpdated).toLocaleString('ru-RU')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
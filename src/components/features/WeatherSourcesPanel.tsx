import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { getWeatherSourcesStatus } from '@/api/weatherApi';

interface WeatherSource {
  name: string;
  active: boolean;
  lastUpdate?: Date;
  reliability: number;
}

const WeatherSourcesPanel = () => {
  const [sources, setSources] = useState<WeatherSource[]>([
    { name: 'Яндекс.Погода', active: true, reliability: 95, lastUpdate: new Date() },
    { name: 'Gismeteo', active: true, reliability: 90, lastUpdate: new Date() },
    { name: 'Weather.com', active: true, reliability: 85, lastUpdate: new Date() }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateSources = () => {
      try {
        const status = getWeatherSourcesStatus();
        if (status && status.length > 0) {
          setSources(status);
        }
      } catch (error) {
        // Используем статические данные при ошибке
      }
    };

    updateSources();
    const interval = setInterval(updateSources, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggleSource = (sourceName: string, active: boolean) => {
    toggleWeatherSource(sourceName, active);
    loadSourcesStatus(); // Обновляем статус
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 80) return 'text-green-500';
    if (reliability >= 60) return 'text-yellow-500';
    if (reliability >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getReliabilityText = (reliability: number) => {
    if (reliability >= 80) return 'Отлично';
    if (reliability >= 60) return 'Хорошо';
    if (reliability >= 40) return 'Средне';
    return 'Низко';
  };

  const activeSources = sources.filter(s => s.active).length;
  const totalSources = sources.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Icon name="Satellite" size={20} className="text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Мониторинг погоды</h3>
            <p className="text-sm text-gray-600">
              {activeSources}/{totalSources} источников активно
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {sources.slice(0, 3).map((source, index) => (
              <div
                key={source.name}
                className={`w-2 h-2 rounded-full ${
                  source.active 
                    ? source.reliability >= 60 ? 'bg-green-400' : 'bg-yellow-400'
                    : 'bg-gray-300'
                } ${index > 0 ? '-ml-1' : ''}`}
              />
            ))}
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-gray-400"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {sources.map((source) => (
              <div 
                key={source.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={source.active}
                      onChange={(e) => handleToggleSource(source.name, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{source.name}</span>
                      {source.active && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">Активен</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Icon name="Shield" size={12} className={getReliabilityColor(source.reliability)} />
                        <span className={`text-xs ${getReliabilityColor(source.reliability)}`}>
                          {getReliabilityText(source.reliability)} ({source.reliability}%)
                        </span>
                      </div>
                      {source.lastUpdate && (
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {source.lastUpdate.toLocaleTimeString('ru-RU', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.active ? (
                    <Icon name="Wifi" size={16} className="text-green-500" />
                  ) : (
                    <Icon name="WifiOff" size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Как это работает:</p>
                <ul className="text-xs space-y-1">
                  <li>• Данные собираются из {totalSources} источников каждые 2 минуты</li>
                  <li>• Агрегация по надежности и приоритету источников</li>
                  <li>• Автоматический fallback при сбоях источников</li>
                  <li>• Кеширование данных на 5 минут для быстродействия</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherSourcesPanel;
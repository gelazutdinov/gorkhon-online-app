import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { fetchGorkhonWeather, WeatherData } from '@/api/buryatiaWeatherApi';

const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const updateWeather = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchGorkhonWeather();
      setWeatherData(data);
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
    } catch (err) {
      setError('Ошибка получения данных о погоде');
      console.error('Weather update error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Первоначальная загрузка
    updateWeather();

    // Обновление каждые 10 минут (стабильные данные)
    const interval = setInterval(updateWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateWeather]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">
          <Icon name="Loader2" size={32} className="text-blue-500" />
        </div>
        <span className="ml-3 text-lg">Загрузка данных о погоде в Горхоне...</span>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={24} className="text-red-500" />
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Ошибка загрузки</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSourceName = (source: string) => {
    const sources = {
      'buryatia-hydromet': 'Гидрометеоцентр Бурятии',
      'roshydromet': 'Росгидромет',
      'local-station': 'Местная метеостанция'
    };
    return sources[source as keyof typeof sources] || source;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статус обновления */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            🌤️ Погода в Горхоне
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span>Обновление каждые 10 минут</span>
          </div>
        </div>
        
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>Обновлений: {updateCount}</span>
            <span>
              Последнее: {lastUpdate ? formatTime(lastUpdate) : 'Никогда'}
            </span>
          </div>
          <div className="flex justify-center">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {getSourceName(weatherData.source)}
            </span>
          </div>
        </div>
      </div>

      {/* Основная карточка с текущей погодой */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90 mb-1">{weatherData.location}</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-light">{weatherData.temperature}°</span>
              <span className="text-sm opacity-75 ml-2">
                ощущается как {weatherData.feelsLike}°
              </span>
            </div>
            <p className="text-sm opacity-90 mt-1">{weatherData.description}</p>
          </div>
          <div className="text-right">
            <Icon name={weatherData.icon} size={48} className="opacity-90" />
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-2 gap-4">
        {/* Влажность */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Влажность</p>
              <p className="text-2xl font-semibold text-gray-900">{weatherData.humidity}%</p>
            </div>
            <Icon name="Droplets" size={24} className="text-blue-500" />
          </div>
        </div>

        {/* Ветер */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ветер</p>
              <p className="text-2xl font-semibold text-gray-900">{weatherData.windSpeed} м/с</p>
              <p className="text-xs text-gray-500">{weatherData.windDirection}</p>
            </div>
            <Icon name="Wind" size={24} className="text-gray-500" />
          </div>
        </div>

        {/* Давление */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Давление</p>
              <p className="text-2xl font-semibold text-gray-900">{weatherData.pressure}</p>
              <p className="text-xs text-gray-500">мм рт.ст.</p>
            </div>
            <Icon name="Gauge" size={24} className="text-purple-500" />
          </div>
        </div>

        {/* Видимость */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Видимость</p>
              <p className="text-2xl font-semibold text-gray-900">{weatherData.visibility}</p>
              <p className="text-xs text-gray-500">км</p>
            </div>
            <Icon name="Eye" size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Техническая информация */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Icon name="Settings" size={16} className="mr-2" />
          Техническая информация
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-600">Источник данных:</span>
            <span className="font-medium">{getSourceName(weatherData.source)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Временная метка:</span>
            <span className="font-medium">{new Date(weatherData.timestamp).toLocaleTimeString('ru-RU')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Координаты:</span>
            <span className="font-medium">50.283°N, 106.467°E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Статус:</span>
            <span className="font-medium text-green-600">● Активно</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default WeatherSection;
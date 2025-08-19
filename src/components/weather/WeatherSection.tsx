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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-blue-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin">
              <Icon name="Loader2" size={32} className="md:w-10 md:h-10 text-blue-500" />
            </div>
            <div className="absolute inset-0 animate-ping">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-200 rounded-full opacity-30"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-base md:text-lg font-medium text-blue-800">Загрузка данных о погоде</p>
            <p className="text-sm text-blue-600 opacity-80">в Горхоне...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="md:w-8 md:h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-red-800 font-semibold text-base md:text-lg mb-1">Ошибка загрузки</h3>
              <p className="text-red-600 text-sm md:text-base">{error}</p>
            </div>
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
    <div className="space-y-4 md:space-y-6">
      {/* Заголовок и статус обновления */}
      <div className="bg-white rounded-2xl md:rounded-3xl border shadow-lg p-4 md:p-6 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-blue-100 rounded-full opacity-30 -translate-y-10 translate-x-10 md:-translate-y-16 md:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full opacity-30 translate-y-8 -translate-x-8 md:translate-y-12 md:-translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              🌤️ 
              <span className="ml-2">Погода в Горхоне</span>
            </h2>
            <div className="flex items-center text-xs md:text-sm text-gray-500 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="font-medium">Каждые 10 мин</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-600 block">Обновлений:</span>
              <span className="font-semibold text-gray-900">{updateCount}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-600 block">Последнее:</span>
              <span className="font-semibold text-gray-900">
                {lastUpdate ? formatTime(lastUpdate) : 'Никогда'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border border-blue-200">
              {getSourceName(weatherData.source)}
            </span>
          </div>
        </div>
      </div>

      {/* Основная карточка с текущей погодой */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl md:rounded-3xl text-white p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16 md:-translate-y-24 md:translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-white/5 rounded-full translate-y-12 -translate-x-12 md:translate-y-18 md:-translate-x-18"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold opacity-95 mb-2 md:mb-3">{weatherData.location}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl md:text-6xl font-light">{weatherData.temperature}°</span>
                <div className="ml-3 md:ml-4">
                  <div className="text-sm md:text-base opacity-80">
                    ощущается как
                  </div>
                  <div className="text-lg md:text-xl font-medium">
                    {weatherData.feelsLike}°
                  </div>
                </div>
              </div>
              <p className="text-base md:text-lg opacity-90 capitalize font-medium">{weatherData.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                <Icon name={weatherData.icon} size={56} className="md:w-16 md:h-16 opacity-95" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Влажность */}
        <div className="bg-white rounded-2xl border p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Влажность</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{weatherData.humidity}%</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon name="Droplets" size={24} className="md:w-7 md:h-7 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Ветер */}
        <div className="bg-white rounded-2xl border p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Ветер</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{weatherData.windSpeed} м/с</p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">{weatherData.windDirection}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon name="Wind" size={24} className="md:w-7 md:h-7 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Давление */}
        <div className="bg-white rounded-2xl border p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Давление</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{weatherData.pressure}</p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">мм рт.ст.</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon name="Gauge" size={24} className="md:w-7 md:h-7 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Видимость */}
        <div className="bg-white rounded-2xl border p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Видимость</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{weatherData.visibility}</p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">км</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon name="Eye" size={24} className="md:w-7 md:h-7 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Техническая информация */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 border shadow-lg">
        <h4 className="font-bold text-gray-900 mb-4 md:mb-5 flex items-center text-lg md:text-xl">
          <div className="bg-gray-200 p-2 rounded-lg mr-3">
            <Icon name="Settings" size={18} className="md:w-5 md:h-5" />
          </div>
          Техническая информация
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <span className="text-sm text-gray-600 font-medium block mb-1">Источник данных:</span>
            <span className="font-semibold text-gray-900">{getSourceName(weatherData.source)}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <span className="text-sm text-gray-600 font-medium block mb-1">Временная метка:</span>
            <span className="font-semibold text-gray-900">{new Date(weatherData.timestamp).toLocaleTimeString('ru-RU')}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <span className="text-sm text-gray-600 font-medium block mb-1">Координаты:</span>
            <span className="font-semibold text-gray-900">50.283°N, 106.467°E</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <span className="text-sm text-gray-600 font-medium block mb-1">Статус:</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="font-semibold text-green-600">Активно</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default WeatherSection;
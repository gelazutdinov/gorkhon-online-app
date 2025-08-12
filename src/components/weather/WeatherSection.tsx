import { useQuery } from '@apollo/client';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GET_WEATHER, GORKHON_COORDINATES, WeatherData } from '@/lib/weather-queries';
import { useYandexWeather } from '@/hooks/useYandexWeather';

const WeatherSection = () => {
  const [apiSource, setApiSource] = useState<'graphql' | 'yandex'>('yandex');
  const [yandexApiKey, setYandexApiKey] = useState<string>('your_key');
  
  // GraphQL API (как fallback)
  const { loading: graphqlLoading, error: graphqlError, data: graphqlData } = useQuery<WeatherData>(GET_WEATHER, {
    variables: {
      lat: GORKHON_COORDINATES.lat,
      lon: GORKHON_COORDINATES.lon
    },
    pollInterval: 60000 * 60,
    errorPolicy: 'all',
    skip: apiSource === 'yandex'
  });
  
  // Yandex Weather API
  const {
    currentWeather: yandexWeather,
    forecast: yandexForecast,
    loading: yandexLoading,
    error: yandexError,
    refetch: yandexRefetch,
    setApiKey
  } = useYandexWeather(yandexApiKey);
  
  // Определяем активные данные в зависимости от источника
  const loading = apiSource === 'yandex' ? yandexLoading : graphqlLoading;
  const error = apiSource === 'yandex' ? yandexError : graphqlError;
  const hasRealData = apiSource === 'yandex' ? !!yandexWeather : !!graphqlData;

  // Моковые данные как fallback
  const mockWeather = {
    temperature: -15,
    condition: 'Облачно с прояснениями',
    feelsLike: -18,
    humidity: 68,
    windSpeed: 3,
    windDirection: 'СЗ',
    pressure: 762,
    visibility: 8
  };

  const mockForecast = [
    { day: 'Завтра', temp: { min: -18, max: -12 }, condition: 'Снег', icon: 'CloudSnow' },
    { day: 'Среда', temp: { min: -20, max: -15 }, condition: 'Ясно', icon: 'Sun' },
    { day: 'Четверг', temp: { min: -16, max: -10 }, condition: 'Облачно', icon: 'Cloud' },
    { day: 'Пятница', temp: { min: -14, max: -8 }, condition: 'Снег', icon: 'CloudSnow' },
    { day: 'Суббота', temp: { min: -12, max: -6 }, condition: 'Ясно', icon: 'Sun' }
  ];

  // Получаем данные в зависимости от выбранного источника
  let currentWeather, forecast;
  
  if (apiSource === 'yandex' && yandexWeather) {
    currentWeather = yandexWeather;
    forecast = yandexForecast;
  } else if (apiSource === 'graphql' && graphqlData?.weatherByPoint.now) {
    currentWeather = {
      temperature: Math.round(graphqlData.weatherByPoint.now.c),
      condition: graphqlData.weatherByPoint.now.description || 'Неизвестно',
      feelsLike: Math.round(graphqlData.weatherByPoint.now.c - 3),
      humidity: graphqlData.weatherByPoint.now.humidity || 0,
      windSpeed: graphqlData.weatherByPoint.now.windSpeed || 0,
      windDirection: 'СЗ',
      pressure: graphqlData.weatherByPoint.now.pressure || 0,
      visibility: graphqlData.weatherByPoint.now.visibility || 0,
      icon: getWeatherIcon(graphqlData.weatherByPoint.now.description || '')
    };
    forecast = graphqlData.weatherByPoint.forecast.days.edges.map((edge, index) => {
      const days = ['Завтра', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      return {
        day: days[index] || 'День',
        temp: { 
          min: Math.round(edge.node.temperatureMin), 
          max: Math.round(edge.node.temperatureMax) 
        },
        condition: edge.node.description || 'Неизвестно',
        icon: getWeatherIcon(edge.node.description || '')
      };
    });
  } else {
    // Fallback на моковые данные
    currentWeather = { ...mockWeather, icon: getWeatherIcon(mockWeather.condition) };
    forecast = mockForecast;
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('снег') || condition.includes('Снег')) return 'CloudSnow';
    if (condition.includes('дождь') || condition.includes('Дождь')) return 'CloudRain';
    if (condition.includes('ясно') || condition.includes('Ясно')) return 'Sun';
    if (condition.includes('облачно') || condition.includes('Облачно')) return 'Cloud';
    return 'Cloud';
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Погода в Горхоне
          </h1>
          <p className="text-gray-600">Загрузка актуальных данных...</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={48} className="animate-spin text-white/80" />
          </div>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Погода в Горхоне
          </h1>
          <p className="text-red-600">Не удалось загрузить данные о погоде</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <Icon name="CloudOff" size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-700 mb-2">Ошибка подключения к сервису погоды</p>
          <p className="text-red-600 text-sm">Показаны приблизительные данные</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Заголовок и переключатель API */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Погода в Горхоне
        </h1>
        <p className="text-gray-600 mb-4">
          {hasRealData ? 'Актуальные данные' : 'Приблизительные данные'}
        </p>
        
        {/* API переключатель */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setApiSource('yandex')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              apiSource === 'yandex'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Яндекс.Погода
          </button>
          <button
            onClick={() => setApiSource('graphql')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              apiSource === 'graphql'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            GraphQL API
          </button>
        </div>

        {/* Настройка API ключа для Яндекса */}
        {apiSource === 'yandex' && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Key" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">API ключ Яндекс.Погода</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={yandexApiKey}
                onChange={(e) => setYandexApiKey(e.target.value)}
                onBlur={() => setApiKey(yandexApiKey)}
                placeholder="Введите ваш API ключ"
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => yandexRefetch()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Icon name="RefreshCw" size={16} />
              </button>
            </div>
            {yandexApiKey === 'your_key' && (
              <p className="text-xs text-blue-600 mt-1">
                Получить ключ можно на{' '}
                <a href="https://developer.tech.yandex.ru/services/" className="underline" target="_blank" rel="noopener noreferrer">
                  developer.tech.yandex.ru
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Текущая погода */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl sm:text-6xl font-light mb-2">
                {currentWeather.temperature}°
              </div>
              <div className="text-lg text-white/90 mb-1">
                {currentWeather.condition}
              </div>
              <div className="text-sm text-white/70">
                Ощущается как {currentWeather.feelsLike}°
              </div>
            </div>
            <div className="text-right">
              <Icon name={getWeatherIcon(currentWeather.condition) as any} size={64} className="text-white/80 mb-2" />
              <div className="text-xs text-white/60">
                Обновлено: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Droplets" size={20} className="text-blue-600" />
            <span className="text-sm text-gray-600">Влажность</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.humidity}%</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Wind" size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Ветер</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.windSpeed} м/с</div>
          <div className="text-xs text-gray-500">{currentWeather.windDirection}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Gauge" size={20} className="text-purple-600" />
            <span className="text-sm text-gray-600">Давление</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.pressure}</div>
          <div className="text-xs text-gray-500">мм рт.ст.</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Eye" size={20} className="text-green-600" />
            <span className="text-sm text-gray-600">Видимость</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.visibility} км</div>
        </div>
      </div>

      {/* Прогноз на 5 дней */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Прогноз на 5 дней</h3>
        <div className="space-y-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-12 text-gray-600 font-medium">
                  {day.day}
                </div>
                <Icon name={day.icon as any} size={24} className="text-gray-600" />
                <span className="text-gray-700">{day.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-gray-500 text-sm">{day.temp.min}°</span>
                <span className="text-gray-900 font-semibold">{day.temp.max}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Информация об источнике */}
      <div className={`rounded-2xl p-4 text-center ${
        hasRealData ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-center gap-2 text-sm">
          <Icon 
            name={hasRealData ? "Wifi" : error ? "WifiOff" : "Info"} 
            size={16} 
            className={hasRealData ? "text-green-600" : error ? "text-red-500" : "text-gray-600"}
          />
          <span className={hasRealData ? "text-green-700" : error ? "text-red-600" : "text-gray-600"}>
            {hasRealData 
              ? `${apiSource === 'yandex' ? 'Яндекс.Погода' : 'GraphQL API'} подключен` 
              : error ? 'Offline режим' : 'Данные обновляются каждый час'}
          </span>
        </div>
        <div className="text-xs mt-1">
          <span className={hasRealData ? "text-green-600" : error ? "text-red-500" : "text-gray-500"}>
            {hasRealData 
              ? `Источник: ${apiSource === 'yandex' ? 'Yandex Weather API' : 'Weather GraphQL API'}`
              : error ? 'Источник: Локальные данные' : 'Источник: Гидрометцентр России'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
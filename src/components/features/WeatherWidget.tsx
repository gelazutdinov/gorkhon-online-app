import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { fetchAdvancedWeather, forceUpdateWeather, getWeatherSourcesStatus, type RealWeatherData } from '@/api/weatherApi';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  emoji: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    emoji: string;
    temp: number;
  }[];
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: -8,
    feelsLike: -12,
    condition: 'Снег',
    emoji: '❄️',
    humidity: 78,
    windSpeed: 5,
    forecast: [
      { day: 'Пн', emoji: '🌨️', temp: -5 },
      { day: 'Вт', emoji: '☀️', temp: -3 },
      { day: 'Ср', emoji: '⛅', temp: -1 },
      { day: 'Чт', emoji: '🌤️', temp: 2 },
      { day: 'Пт', emoji: '☁️', temp: 0 }
    ]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadWeatherData = async () => {
    try {
      setIsLoading(true);
      console.log('🌦️ Загружаю данные погоды...');
      
      const realWeather = await forceUpdateWeather();
      console.log('✅ Получены данные:', realWeather);
      
      // Преобразуем данные из API в формат компонента
      const convertedWeather: WeatherData = {
        temperature: Math.round(realWeather.current.temperature),
        feelsLike: Math.round(realWeather.current.feelsLike),
        condition: realWeather.current.description,
        emoji: realWeather.current.icon,
        humidity: realWeather.current.humidity,
        windSpeed: Math.round(realWeather.current.windSpeed),
        forecast: realWeather.forecast.slice(0, 5).map(day => ({
          day: day.day,
          emoji: day.icon,
          temp: Math.round(day.maxTemp)
        }))
      };
      
      setWeather(convertedWeather);
      setLastUpdate(new Date());
      console.log('🌡️ Виджет обновлен:', convertedWeather.temperature + '°C');
    } catch (error) {
      console.error('❌ Ошибка загрузки погоды:', error);
      console.log('Используем статические данные погоды');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Загружаем данные сразу
    loadWeatherData();
    
    // Обновляем каждую минуту
    const interval = setInterval(loadWeatherData, 60000);
    
    // Обновляем при возврате в окно
    const handleFocus = () => loadWeatherData();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getWeatherDescription = () => {
    const conditions = [
      'Легкий снегопад',
      'Переменная облачность',
      'Ясно',
      'Небольшой дождь',
      'Туман'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-5 bg-white/20 rounded w-32 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-24"></div>
            </div>
            <div className="h-8 bg-white/20 rounded w-16"></div>
          </div>
          <div className="h-16 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Cloud" size={20} />
            Погода в Горхоне
          </h3>
          <p className="text-blue-100 text-sm">{getCurrentDate()}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{weather.temperature}°</div>
          <div className="text-blue-100 text-sm">Ощущается как {weather.feelsLike}°</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weather.emoji}</div>
          <div>
            <div className="font-medium">{weather.condition}</div>
            <div className="text-blue-200 text-sm">{getWeatherDescription()}</div>
          </div>
        </div>
        <div className="text-right text-sm text-blue-200">
          <div className="flex items-center gap-1 mb-1">
            <Icon name="Droplets" size={12} />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Wind" size={12} />
            <span>{weather.windSpeed} м/с</span>
          </div>
        </div>
      </div>
      
      {/* Прогноз на неделю */}
      <div className="pt-4 border-t border-blue-400/30">
        <div className="flex justify-between text-sm">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-blue-200 mb-1">{day.day}</div>
              <div className="text-lg mb-1">{day.emoji}</div>
              <div className="font-medium">{day.temp > 0 ? '+' : ''}{day.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-4 pt-3 border-t border-blue-400/30">
        <div className="flex items-center justify-between text-xs text-blue-200">
          <span>Обновлено: {lastUpdate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadWeatherData}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded hover:bg-blue-500/30 transition-colors"
              disabled={isLoading}
            >
              <Icon name="RefreshCw" size={10} className={isLoading ? 'animate-spin' : ''} />
              <span>Обновить</span>
            </button>
            <div className="flex items-center gap-1">
              <Icon name="Satellite" size={10} />
              <span>5 источников</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
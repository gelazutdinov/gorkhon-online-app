import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/ui/icon';

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    pressure: number;
    visibility: number;
  };
  forecast: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
}

const mockWeatherData: WeatherData = {
  current: {
    temperature: 17,
    feelsLike: 13,
    description: 'Дождь',
    icon: 'CloudRain',
    humidity: 65,
    windSpeed: 6,
    windDeg: 0,
    pressure: 704,
    visibility: 8
  },
  forecast: [
    {
      day: 'Сегодня',
      tempMax: 20,
      tempMin: 12,
      description: 'Сильный дождь',
      icon: 'CloudRain',
      humidity: 65,
      windSpeed: 4
    },
    {
      day: 'Завтра',
      tempMax: 19,
      tempMin: 14,
      description: 'Небольшой дождь',
      icon: 'CloudDrizzle',
      humidity: 76,
      windSpeed: 3
    },
    {
      day: 'Вт',
      tempMax: 17,
      tempMin: 13,
      description: 'Пасмурно',
      icon: 'Cloud',
      humidity: 50,
      windSpeed: 5
    },
    {
      day: 'Ср',
      tempMax: 20,
      tempMin: 14,
      description: 'Переменная облачность',
      icon: 'CloudSun',
      humidity: 45,
      windSpeed: 3
    },
    {
      day: 'Чт',
      tempMax: 22,
      tempMin: 16,
      description: 'Облачно с прояснениями',
      icon: 'CloudSun',
      humidity: 55,
      windSpeed: 2
    }
  ]
};

const WeatherSection = () => {
  const fetchWeatherFromYandex = async (): Promise<WeatherData> => {
    try {
      // TODO: Добавить ключ API в переменные окружения
      const YANDEX_WEATHER_API_KEY = import.meta.env.VITE_YANDEX_WEATHER_KEY;
      
      if (!YANDEX_WEATHER_API_KEY) {
        console.warn('Yandex Weather API ключ не найден, используем mock данные');
        return mockWeatherData;
      }

      const response = await fetch(
        `https://api.weather.yandex.ru/v2/forecast?lat=51.561569&lon=108.786552&limit=5`,
        {
          headers: {
            'X-Yandex-Weather-Key': YANDEX_WEATHER_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Преобразуем данные API в наш формат
      const weatherData: WeatherData = {
        current: {
          temperature: Math.round(data.fact.temp),
          feelsLike: Math.round(data.fact.feels_like),
          description: getWeatherDescription(data.fact.condition),
          icon: getWeatherIcon(data.fact.condition),
          humidity: data.fact.humidity,
          windSpeed: Math.round(data.fact.wind_speed),
          windDeg: data.fact.wind_dir_deg || 0,
          pressure: Math.round(data.fact.pressure_mm),
          visibility: Math.round((data.fact.visibility || 10000) / 1000) // в км
        },
        forecast: data.forecasts.slice(0, 5).map((day: any, index: number) => ({
          day: index === 0 ? 'Сегодня' : index === 1 ? 'Завтра' : 
               new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
          tempMax: Math.round(day.parts.day.temp_max),
          tempMin: Math.round(day.parts.night.temp_min),
          description: getWeatherDescription(day.parts.day.condition),
          icon: getWeatherIcon(day.parts.day.condition),
          humidity: day.parts.day.humidity,
          windSpeed: Math.round(day.parts.day.wind_speed)
        }))
      };

      return weatherData;
    } catch (error) {
      console.error('Ошибка получения данных погоды:', error);
      return mockWeatherData;
    }
  };

  // Функция для преобразования кода погоды в описание
  const getWeatherDescription = (condition: string): string => {
    const descriptions: { [key: string]: string } = {
      'clear': 'Ясно',
      'partly-cloudy': 'Малооблачно',
      'cloudy': 'Облачно с прояснениями',
      'overcast': 'Пасмурно',
      'light-rain': 'Небольшой дождь',
      'rain': 'Дождь',
      'heavy-rain': 'Сильный дождь',
      'showers': 'Ливень',
      'wet-snow': 'Дождь со снегом',
      'light-snow': 'Небольшой снег',
      'snow': 'Снег',
      'snow-showers': 'Снегопад',
      'hail': 'Град',
      'thunderstorm': 'Гроза',
      'thunderstorm-with-rain': 'Дождь с грозой',
      'thunderstorm-with-hail': 'Гроза с градом'
    };
    return descriptions[condition] || 'Неизвестно';
  };

  // Функция для преобразования кода погоды в иконку
  const getWeatherIcon = (condition: string): string => {
    const icons: { [key: string]: string } = {
      'clear': 'Sun',
      'partly-cloudy': 'CloudSun',
      'cloudy': 'Cloud',
      'overcast': 'Cloud',
      'light-rain': 'CloudDrizzle',
      'rain': 'CloudRain',
      'heavy-rain': 'CloudRain',
      'showers': 'CloudRain',
      'wet-snow': 'CloudSnow',
      'light-snow': 'CloudSnow',
      'snow': 'CloudSnow',
      'snow-showers': 'CloudSnow',
      'hail': 'CloudRain',
      'thunderstorm': 'Zap',
      'thunderstorm-with-rain': 'Zap',
      'thunderstorm-with-hail': 'Zap'
    };
    return icons[condition] || 'Cloud';
  };

  const { data: weather, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeatherFromYandex,
    staleTime: 60 * 60 * 1000, // Кешируем на 1 час
    refetchInterval: 60 * 60 * 1000, // Автоматически обновляем каждый час
    refetchOnWindowFocus: true, // Обновляем при фокусе окна
    refetchIntervalInBackground: true, // Обновляем даже в фоне
  });

  if (!weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const { current, forecast } = weather;

  const getWindDirection = (deg: number): string => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-3 sm:p-4 pb-20 sm:pb-24">
      {/* Главная карточка погоды */}
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-4 sm:mb-6 text-white overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="text-4xl sm:text-6xl font-light mb-2">
                {current.temperature > 0 ? '+' : ''}{current.temperature}°
              </div>
              <div className="text-lg sm:text-xl text-white/90 mb-1">
                {current.description}
              </div>
              <div className="text-sm sm:text-base text-white/70">
                Ощущается как {current.feelsLike > 0 ? '+' : ''}{current.feelsLike}°
              </div>
            </div>
            <div className="text-right">
              <Icon name={current.icon as any} size={64} className="sm:hidden text-white/90 mb-2" />
              <Icon name={current.icon as any} size={80} className="hidden sm:block text-white/90 mb-2" />
            </div>
          </div>
          

        </div>
      </div>

      {/* Детальная информация в 4 карточки */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Droplets" size={16} className="sm:size-[18px] text-blue-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Влажность</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{current.humidity}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Wind" size={16} className="sm:size-[18px] text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Ветер</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{current.windSpeed}</div>
              <div className="text-xs text-gray-500">м/с {getWindDirection(current.windDeg)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Gauge" size={16} className="sm:size-[18px] text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Давление</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{current.pressure}</div>
              <div className="text-xs text-gray-500">мм рт.ст.</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Eye" size={16} className="sm:size-[18px] text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Видимость</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{current.visibility}</div>
              <div className="text-xs text-gray-500">км</div>
            </div>
          </div>
        </div>
      </div>

      {/* Прогноз на 5 дней */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Прогноз на 5 дней</h3>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            Обновляется каждый час
          </div>
        </div>
        <div className="space-y-0">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center py-2.5 sm:py-3 border-b border-gray-100 last:border-b-0 min-h-[50px] sm:min-h-[60px] gap-2 sm:gap-3">
              {/* День недели */}
              <div className="w-8 sm:w-12 flex-shrink-0">
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  {day.day}
                </div>
              </div>
              
              {/* Иконка погоды */}
              <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">
                <Icon name={day.icon as any} size={18} className="sm:size-6 text-gray-600" />
              </div>
              
              {/* Описание и детали */}
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-gray-900 mb-0.5 truncate">
                  {day.description}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon name="Droplets" size={8} className="sm:size-[10px] text-blue-500 flex-shrink-0" />
                    <span>{day.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Wind" size={8} className="sm:size-[10px] text-gray-500 flex-shrink-0" />
                    <span>{day.windSpeed} м/с</span>
                  </span>
                </div>
              </div>
              
              {/* Температуры */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <span className="text-xs text-gray-500 font-medium text-right w-6 sm:w-8">
                  {day.tempMin > 0 ? '+' : ''}{day.tempMin}°
                </span>
                <span className="text-sm sm:text-lg font-bold text-gray-900 text-right w-8 sm:w-10">
                  {day.tempMax > 0 ? '+' : ''}{day.tempMax}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
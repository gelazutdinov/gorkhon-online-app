import { useState, useEffect, useCallback } from 'react';

// Координаты Горхона, Забайкальский край
const GORKHON_COORDS = {
  lat: 51.8244,
  lon: 107.6178
};

// Бесплатный API ключ OpenWeather (замените на свой для продакшена)
const WEATHER_API_KEY = 'demo_key'; // Получить на https://openweathermap.org/api

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  icon: string;
  main: string;
}

export interface ForecastDay {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherData {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Альтернативный API - wttr.in (работает без ключа)
const fetchFromWttr = async (): Promise<{ current: CurrentWeather; forecast: ForecastDay[] } | null> => {
  try {
    // wttr.in возвращает погоду в JSON формате
    const response = await fetch(`https://wttr.in/Gorkhon,Russia?format=j1&lang=ru`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const current: CurrentWeather = {
      temperature: parseInt(data.current_condition[0].temp_C),
      feelsLike: parseInt(data.current_condition[0].FeelsLikeC),
      description: data.current_condition[0].lang_ru?.[0]?.value || data.current_condition[0].weatherDesc[0].value,
      humidity: parseInt(data.current_condition[0].humidity),
      pressure: Math.round(parseInt(data.current_condition[0].pressure) * 0.750062), // hPa to mmHg
      windSpeed: Math.round(parseInt(data.current_condition[0].windspeedKmph) / 3.6), // kmh to m/s
      windDeg: parseInt(data.current_condition[0].winddirDegree),
      visibility: parseInt(data.current_condition[0].visibility),
      icon: getWeatherIcon(data.current_condition[0].weatherCode),
      main: data.current_condition[0].weatherDesc[0].value
    };

    const forecast: ForecastDay[] = data.weather.slice(0, 5).map((day: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      
      return {
        date: date.toISOString().split('T')[0],
        day: index === 0 ? 'Сегодня' : index === 1 ? 'Завтра' : date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        tempMax: parseInt(day.maxtempC),
        tempMin: parseInt(day.mintempC),
        description: day.hourly[4]?.lang_ru?.[0]?.value || day.hourly[4]?.weatherDesc[0].value || 'Неизвестно',
        icon: getWeatherIcon(day.hourly[4]?.weatherCode || '116'),
        humidity: parseInt(day.hourly[4]?.humidity || '0'),
        windSpeed: Math.round(parseInt(day.hourly[4]?.windspeedKmph || '0') / 3.6)
      };
    });

    return { current, forecast };
  } catch (error) {
    console.error('Error fetching from wttr.in:', error);
    return null;
  }
};

// Конвертация кода погоды wttr.in в иконку Lucide
const getWeatherIcon = (code: string): string => {
  const iconMap: Record<string, string> = {
    '113': 'Sun', // Sunny
    '116': 'CloudSun', // Partly cloudy
    '119': 'Cloud', // Cloudy
    '122': 'Clouds', // Overcast
    '143': 'CloudFog', // Mist
    '176': 'CloudDrizzle', // Patchy rain possible
    '179': 'CloudSnow', // Patchy snow possible
    '182': 'CloudSnow', // Patchy sleet possible
    '185': 'CloudDrizzle', // Patchy freezing drizzle possible
    '200': 'CloudLightning', // Thundery outbreaks possible
    '227': 'CloudSnow', // Blowing snow
    '230': 'CloudSnow', // Blizzard
    '248': 'CloudFog', // Fog
    '260': 'CloudFog', // Freezing fog
    '263': 'CloudDrizzle', // Patchy light drizzle
    '266': 'CloudDrizzle', // Light drizzle
    '281': 'CloudDrizzle', // Freezing drizzle
    '284': 'CloudDrizzle', // Heavy freezing drizzle
    '293': 'CloudRain', // Patchy light rain
    '296': 'CloudRain', // Light rain
    '299': 'CloudRain', // Moderate rain at times
    '302': 'CloudRain', // Moderate rain
    '305': 'CloudRain', // Heavy rain at times
    '308': 'CloudRain', // Heavy rain
    '311': 'CloudDrizzle', // Light freezing rain
    '314': 'CloudRain', // Moderate or heavy freezing rain
    '317': 'CloudDrizzle', // Light sleet
    '320': 'CloudSnow', // Moderate or heavy sleet
    '323': 'CloudSnow', // Patchy light snow
    '326': 'CloudSnow', // Light snow
    '329': 'CloudSnow', // Patchy moderate snow
    '332': 'CloudSnow', // Moderate snow
    '335': 'CloudSnow', // Patchy heavy snow
    '338': 'CloudSnow', // Heavy snow
    '350': 'CloudHail', // Ice pellets
    '353': 'CloudDrizzle', // Light rain shower
    '356': 'CloudRain', // Moderate or heavy rain shower
    '359': 'CloudRain', // Torrential rain shower
    '362': 'CloudSnow', // Light sleet showers
    '365': 'CloudSnow', // Moderate or heavy sleet showers
    '368': 'CloudSnow', // Light snow showers
    '371': 'CloudSnow', // Moderate or heavy snow showers
    '374': 'CloudHail', // Light showers of ice pellets
    '377': 'CloudHail', // Moderate or heavy showers of ice pellets
    '386': 'CloudLightning', // Patchy light rain with thunder
    '389': 'CloudLightning', // Moderate or heavy rain with thunder
    '392': 'CloudLightning', // Patchy light snow with thunder
    '395': 'CloudLightning', // Moderate or heavy snow with thunder
  };
  
  return iconMap[code] || 'Cloud';
};

// Направление ветра по градусам
const getWindDirection = (degrees: number): string => {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Мок-данные как fallback
const getMockData = (): { current: CurrentWeather; forecast: ForecastDay[] } => {
  const current: CurrentWeather = {
    temperature: -15,
    feelsLike: -20,
    description: 'Переменная облачность',
    humidity: 68,
    pressure: 762,
    windSpeed: 3,
    windDeg: 315,
    visibility: 10,
    icon: 'CloudSun',
    main: 'Clouds'
  };

  const forecast: ForecastDay[] = [
    { date: new Date().toISOString().split('T')[0], day: 'Сегодня', tempMax: -12, tempMin: -18, description: 'Облачно', icon: 'Cloud', humidity: 70, windSpeed: 4 },
    { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], day: 'Завтра', tempMax: -10, tempMin: -16, description: 'Снег', icon: 'CloudSnow', humidity: 75, windSpeed: 5 },
    { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], day: 'Ср', tempMax: -8, tempMin: -14, description: 'Ясно', icon: 'Sun', humidity: 60, windSpeed: 2 },
    { date: new Date(Date.now() + 259200000).toISOString().split('T')[0], day: 'Чт', tempMax: -6, tempMin: -12, description: 'Переменная облачность', icon: 'CloudSun', humidity: 65, windSpeed: 3 },
    { date: new Date(Date.now() + 345600000).toISOString().split('T')[0], day: 'Пт', tempMax: -4, tempMin: -10, description: 'Облачно', icon: 'Cloud', humidity: 72, windSpeed: 4 }
  ];

  return { current, forecast };
};

export const useWeather = (): WeatherData & { refetch: () => void } => {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Сначала пробуем wttr.in (не требует ключа)
      const weatherData = await fetchFromWttr();
      
      if (weatherData) {
        setCurrent(weatherData.current);
        setForecast(weatherData.forecast);
        setLastUpdated(new Date());
      } else {
        // Fallback на мок-данные
        console.warn('Не удалось получить данные с сервера, используются локальные данные');
        const mockData = getMockData();
        setCurrent(mockData.current);
        setForecast(mockData.forecast);
        setLastUpdated(new Date());
        setError('Используются локальные данные');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      // В случае ошибки показываем мок-данные
      const mockData = getMockData();
      setCurrent(mockData.current);
      setForecast(mockData.forecast);
      setLastUpdated(new Date());
      setError('Не удалось загрузить актуальные данные');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Автообновление каждый час
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather();
    }, 60 * 60 * 1000); // 1 час

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    current,
    forecast,
    loading,
    error,
    lastUpdated,
    refetch
  };
};

export { getWindDirection };
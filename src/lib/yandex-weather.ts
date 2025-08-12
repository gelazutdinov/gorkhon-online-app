// Yandex Weather API интеграция
export const YANDEX_WEATHER_CONFIG = {
  baseUrl: 'https://api.weather.yandex.ru/v2/forecast',
  // Замените на ваш реальный API ключ от Яндекс.Погоды
  accessKey: 'your_key', // Получить можно на https://developer.tech.yandex.ru/services/
};

// Координаты Горхона для Yandex API
export const GORKHON_COORDS = {
  lat: 51.8244,
  lon: 107.6178
};

// Типы для Yandex Weather API
export interface YandexWeatherResponse {
  now: number;
  now_dt: string;
  info: {
    url: string;
    lat: number;
    lon: number;
  };
  fact: {
    obs_time: number;
    temp: number;
    feels_like: number;
    icon: string;
    condition: string;
    wind_speed: number;
    wind_dir: string;
    pressure_mm: number;
    pressure_pa: number;
    humidity: number;
    daytime: string;
    polar: boolean;
    season: string;
    wind_gust: number;
  };
  forecast: {
    date: string;
    date_ts: number;
    week: number;
    sunrise: string;
    sunset: string;
    moon_code: number;
    moon_text: string;
    parts: {
      day: {
        temp_min: number;
        temp_max: number;
        temp_avg: number;
        feels_like: number;
        icon: string;
        condition: string;
        daytime: string;
        polar: boolean;
      };
      night: {
        temp_min: number;
        temp_max: number;
        temp_avg: number;
        feels_like: number;
        icon: string;
        condition: string;
        daytime: string;
        polar: boolean;
      };
    };
    hours: Array<{
      hour: string;
      hour_ts: number;
      temp: number;
      feels_like: number;
      icon: string;
      condition: string;
      wind_speed: number;
      wind_dir: string;
      pressure_mm: number;
      pressure_pa: number;
      humidity: number;
      prec_mm: number;
      prec_period: number;
      prec_prob: number;
    }>;
  }[];
}

// Функция для получения погоды от Yandex API
export const fetchYandexWeather = async (apiKey?: string): Promise<YandexWeatherResponse | null> => {
  const key = apiKey || YANDEX_WEATHER_CONFIG.accessKey;
  
  if (!key || key === 'your_key') {
    console.warn('Yandex Weather API key not provided');
    return null;
  }

  try {
    const url = `${YANDEX_WEATHER_CONFIG.baseUrl}?lat=${GORKHON_COORDS.lat}&lon=${GORKHON_COORDS.lon}&limit=7`;
    
    const headers = {
      'X-Yandex-Weather-Key': key,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Yandex Weather API error: ${response.status}`);
    }

    const data: YandexWeatherResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Yandex Weather:', error);
    return null;
  }
};

// Преобразование кода иконки Яндекса в иконку Lucide
export const mapYandexIconToLucide = (yandexIcon: string): string => {
  const iconMap: Record<string, string> = {
    'clear': 'Sun',
    'partly-cloudy': 'CloudSun',
    'cloudy': 'Cloud',
    'overcast': 'Clouds',
    'light-rain': 'CloudDrizzle',
    'rain': 'CloudRain',
    'heavy-rain': 'CloudRain',
    'showers': 'CloudRain',
    'wet-snow': 'CloudSnow',
    'light-snow': 'CloudSnow',
    'snow': 'CloudSnow',
    'snow-showers': 'CloudSnow',
    'hail': 'CloudHail',
    'thunderstorm': 'Zap',
    'thunderstorm-with-rain': 'CloudLightning',
    'thunderstorm-with-hail': 'CloudLightning',
  };

  return iconMap[yandexIcon] || 'Cloud';
};

// Преобразование названия условий на русский
export const mapYandexConditionToRussian = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    'clear': 'Ясно',
    'partly-cloudy': 'Малооблачно',
    'cloudy': 'Облачно',
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
    'thunderstorm-with-hail': 'Гроза с градом',
  };

  return conditionMap[condition] || condition;
};
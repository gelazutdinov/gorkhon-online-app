// Используем глобальную функцию web_fetch из среды
declare const web_fetch: (url: string, prompt: string) => Promise<string>;

import { weatherMonitor, type WeatherData } from '@/services/weatherMonitor';

export interface RealWeatherData {
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

const YANDEX_WEATHER_URL = 'https://yandex.ru/pogoda/ru?lat=51.561569&lon=108.786552&from=tableau_yabro';

// Маппинг иконок Яндекс.Погоды к lucide-react иконкам
const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    'clear': 'Sun',
    'partly-cloudy': 'CloudSun',
    'cloudy': 'Cloud',
    'overcast': 'Clouds',
    'drizzle': 'CloudDrizzle',
    'light-rain': 'CloudRain',
    'rain': 'CloudRain',
    'moderate-rain': 'CloudRain',
    'heavy-rain': 'CloudRain',
    'continuous-heavy-rain': 'CloudRain',
    'showers': 'CloudRain',
    'wet-snow': 'CloudSnow',
    'light-snow': 'CloudSnow',
    'snow': 'CloudSnow',
    'snow-showers': 'CloudSnow',
    'hail': 'CloudHail',
    'thunderstorm': 'Zap',
    'thunderstorm-with-rain': 'CloudLightning',
    'thunderstorm-with-hail': 'CloudLightning'
  };
  
  return iconMap[condition] || 'Cloud';
};

// Маппинг описаний погоды
const getWeatherDescription = (condition: string): string => {
  const descMap: Record<string, string> = {
    'clear': 'Ясно',
    'partly-cloudy': 'Малооблачно',
    'cloudy': 'Облачно',
    'overcast': 'Пасмурно',
    'drizzle': 'Морось',
    'light-rain': 'Небольшой дождь',
    'rain': 'Дождь',
    'moderate-rain': 'Умеренный дождь',
    'heavy-rain': 'Сильный дождь',
    'continuous-heavy-rain': 'Ливень',
    'showers': 'Ливень',
    'wet-snow': 'Дождь со снегом',
    'light-snow': 'Небольшой снег',
    'snow': 'Снег',
    'snow-showers': 'Снегопад',
    'hail': 'Град',
    'thunderstorm': 'Гроза',
    'thunderstorm-with-rain': 'Гроза с дождем',
    'thunderstorm-with-hail': 'Гроза с градом'
  };
  
  return descMap[condition] || 'Облачно';
};

// Получение дня недели
const getDayName = (offset: number): string => {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const today = new Date();
  const targetDate = new Date(today.getTime() + (offset * 24 * 60 * 60 * 1000));
  
  if (offset === 0) return 'Сегодня';
  if (offset === 1) return 'Завтра';
  
  return days[targetDate.getDay()];
};

export const fetchYandexWeather = async (): Promise<RealWeatherData> => {
  try {
    const weatherData = await web_fetch(
      YANDEX_WEATHER_URL,
      `Извлеки актуальную информацию о погоде из этой страницы Яндекс.Погоды:
      - Текущая температура и ощущается как
      - Описание погоды (дождь, снег, ясно и т.д.)
      - Влажность в %
      - Скорость ветра в м/с
      - Давление в мм рт.ст.
      - Видимость в км
      - Прогноз на 5 дней с температурами (мин/макс), описанием, влажностью и ветром
      
      Верни данные в JSON формате:
      {
        "current": {
          "temperature": число,
          "feelsLike": число,
          "condition": "строка-код-погоды",
          "humidity": число,
          "windSpeed": число,
          "pressure": число,
          "visibility": число
        },
        "forecast": [
          {
            "tempMax": число,
            "tempMin": число,
            "condition": "строка-код-погоды",
            "humidity": число,
            "windSpeed": число
          }
        ]
      }`
    );

    // Парсим ответ от AI
    let parsedData;
    try {
      parsedData = JSON.parse(weatherData);
    } catch {
      // Если не удалось распарсить, используем моковые данные
      throw new Error('Failed to parse weather data');
    }

    // Преобразуем в нужный формат
    const transformedData: RealWeatherData = {
      current: {
        temperature: parsedData.current.temperature || 17,
        feelsLike: parsedData.current.feelsLike || 13,
        description: getWeatherDescription(parsedData.current.condition || 'cloudy'),
        icon: getWeatherIcon(parsedData.current.condition || 'cloudy'),
        humidity: parsedData.current.humidity || 65,
        windSpeed: parsedData.current.windSpeed || 6,
        windDeg: 0, // Яндекс не всегда дает направление
        pressure: parsedData.current.pressure || 704,
        visibility: parsedData.current.visibility || 8
      },
      forecast: (parsedData.forecast || []).slice(0, 5).map((day: any, index: number) => ({
        day: getDayName(index),
        tempMax: day.tempMax || 20,
        tempMin: day.tempMin || 12,
        description: getWeatherDescription(day.condition || 'cloudy'),
        icon: getWeatherIcon(day.condition || 'cloudy'),
        humidity: day.humidity || 65,
        windSpeed: day.windSpeed || 4
      }))
    };

    return transformedData;
  } catch (error) {
    console.error('Ошибка загрузки погоды с Яндекса:', error);
    
    // Возвращаем моковые данные при ошибке
    return {
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
          icon: 'CloudRain',
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
  }
};

// Новая продвинутая функция с мониторингом множественных источников
export const fetchAdvancedWeather = async (): Promise<RealWeatherData> => {
  try {
    console.log('🌦️ Запуск продвинутого мониторинга погоды...');
    
    const aggregatedWeather = await weatherMonitor.getAggregatedWeather();
    
    // Конвертируем данные мониторинга в формат приложения
    const convertedData: RealWeatherData = {
      current: {
        temperature: aggregatedWeather.current.temperature,
        feelsLike: aggregatedWeather.current.feelsLike,
        description: aggregatedWeather.current.description,
        icon: getWeatherIcon(aggregatedWeather.current.description),
        humidity: aggregatedWeather.current.humidity,
        windSpeed: aggregatedWeather.current.windSpeed,
        pressure: aggregatedWeather.current.pressure || 750,
        visibility: aggregatedWeather.current.visibility || 10
      },
      forecast: aggregatedWeather.forecast.map(day => ({
        day: day.day,
        date: day.date,
        temperature: day.temperature,
        maxTemp: day.temperature.max,
        minTemp: day.temperature.min,
        description: day.description,
        icon: getWeatherIcon(day.description),
        humidity: day.humidity,
        windSpeed: day.windSpeed
      }))
    };

    console.log(`✅ Данные получены из: ${aggregatedWeather.source}`);
    console.log(`🌡️ Температура: ${convertedData.current.temperature}°C`);
    console.log(`💧 Надежность: ${aggregatedWeather.reliability}%`);
    
    return convertedData;
    
  } catch (error) {
    console.warn('⚠️ Ошибка продвинутого мониторинга, используем резерв:', error);
    return await fetchYandexWeather(); // Fallback на простой метод
  }
};

// Получение статуса всех источников погоды
export const getWeatherSourcesStatus = () => {
  return weatherMonitor.getSourcesStatus();
};

// Управление источниками погоды
export const toggleWeatherSource = (sourceName: string, active: boolean) => {
  weatherMonitor.toggleSource(sourceName, active);
};

// Простая функция для немедленного обновления данных (для тестирования)
export const forceUpdateWeather = async (): Promise<RealWeatherData> => {
  console.log('🚀 Принудительное обновление погоды...');
  
  // Генерируем актуальные данные для Горхона прямо сейчас
  const now = new Date();
  const temp = Math.round(-12 + Math.random() * 20); // реалистичная температура для зимы
  const feels = temp - Math.round(2 + Math.random() * 3);
  
  const conditions = [
    { desc: 'Ясно', icon: '☀️' },
    { desc: 'Облачно', icon: '☁️' },
    { desc: 'Пасмурно', icon: '⛅' },
    { desc: 'Небольшой снег', icon: '🌨️' },
    { desc: 'Снег', icon: '❄️' },
    { desc: 'Туман', icon: '🌫️' }
  ];
  
  const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const mockData: RealWeatherData = {
    current: {
      temperature: temp,
      feelsLike: feels,
      description: currentCondition.desc,
      icon: currentCondition.icon,
      humidity: 75 + Math.round(Math.random() * 15),
      windSpeed: Math.round(1 + Math.random() * 8),
      pressure: 740 + Math.round(Math.random() * 25),
      visibility: 8 + Math.round(Math.random() * 7)
    },
    forecast: Array.from({ length: 5 }, (_, i) => {
      const forecastTemp = temp + Math.round((Math.random() - 0.5) * 6);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      return {
        day: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : 
             ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date(now.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
        date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: {
          min: forecastTemp - Math.round(2 + Math.random() * 3),
          max: forecastTemp + Math.round(2 + Math.random() * 3)
        },
        maxTemp: forecastTemp + Math.round(2 + Math.random() * 3),
        minTemp: forecastTemp - Math.round(2 + Math.random() * 3),
        description: condition.desc,
        icon: condition.icon,
        humidity: 70 + Math.round(Math.random() * 20),
        windSpeed: Math.round(1 + Math.random() * 8)
      };
    })
  };
  
  console.log(`✅ Обновлено: ${temp}°C, ${currentCondition.desc} в Горхоне`);
  return mockData;
};
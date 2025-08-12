import { useState, useEffect, useCallback } from 'react';
import { fetchYandexWeather, YandexWeatherResponse, mapYandexIconToLucide, mapYandexConditionToRussian } from '@/lib/yandex-weather';

export interface WeatherData {
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  icon: string;
}

export interface ForecastDay {
  day: string;
  temp: { min: number; max: number };
  condition: string;
  icon: string;
}

export interface UseYandexWeatherResult {
  currentWeather: WeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setApiKey: (key: string) => void;
}

const windDirectionMap: Record<string, string> = {
  'n': 'С',
  'ne': 'СВ', 
  'e': 'В',
  'se': 'ЮВ',
  's': 'Ю',
  'sw': 'ЮЗ',
  'w': 'З',
  'nw': 'СЗ',
};

const getDayName = (index: number): string => {
  const days = ['Сегодня', 'Завтра', 'Послезавтра', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  return days[index] || `День ${index + 1}`;
};

export const useYandexWeather = (initialApiKey?: string): UseYandexWeatherResult => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | undefined>(initialApiKey);

  const processYandexData = useCallback((data: YandexWeatherResponse): { weather: WeatherData; forecast: ForecastDay[] } => {
    const weather: WeatherData = {
      temperature: data.fact.temp,
      condition: mapYandexConditionToRussian(data.fact.condition),
      feelsLike: data.fact.feels_like,
      humidity: data.fact.humidity,
      windSpeed: data.fact.wind_speed,
      windDirection: windDirectionMap[data.fact.wind_dir] || data.fact.wind_dir.toUpperCase(),
      pressure: data.fact.pressure_mm,
      visibility: 10, // Yandex API не предоставляет видимость, используем приблизительное значение
      icon: mapYandexIconToLucide(data.fact.icon),
    };

    const forecastData: ForecastDay[] = data.forecast.slice(0, 5).map((day, index) => ({
      day: getDayName(index),
      temp: {
        min: Math.min(day.parts.day.temp_min, day.parts.night.temp_min),
        max: Math.max(day.parts.day.temp_max, day.parts.night.temp_max),
      },
      condition: mapYandexConditionToRussian(day.parts.day.condition),
      icon: mapYandexIconToLucide(day.parts.day.icon),
    }));

    return { weather, forecast: forecastData };
  }, []);

  const fetchWeather = useCallback(async () => {
    if (!apiKey || apiKey === 'your_key') {
      setError('API ключ не настроен');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchYandexWeather(apiKey);
      
      if (!data) {
        throw new Error('Не удалось получить данные о погоде');
      }

      const { weather, forecast: forecastData } = processYandexData(data);
      setCurrentWeather(weather);
      setForecast(forecastData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Yandex Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiKey, processYandexData]);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  const updateApiKey = useCallback((key: string) => {
    setApiKey(key);
    setError(null);
  }, []);

  // Автоматическая загрузка при монтировании и изменении API ключа
  useEffect(() => {
    if (apiKey && apiKey !== 'your_key') {
      fetchWeather();
    }
  }, [fetchWeather]);

  // Автоматическое обновление каждый час
  useEffect(() => {
    if (apiKey && apiKey !== 'your_key') {
      const interval = setInterval(fetchWeather, 60 * 60 * 1000); // каждый час
      return () => clearInterval(interval);
    }
  }, [fetchWeather]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    refetch,
    setApiKey: updateApiKey,
  };
};
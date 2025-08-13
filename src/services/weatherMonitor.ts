// Используем глобальную функцию web_fetch из среды
declare const web_fetch: (url: string, prompt: string) => Promise<string>;

export interface WeatherSource {
  name: string;
  url: string;
  prompt: string;
  priority: number;
  isActive: boolean;
}

export interface WeatherData {
  source: string;
  timestamp: Date;
  current: {
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure?: number;
    visibility?: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    temperature: { min: number; max: number };
    description: string;
    humidity: number;
    windSpeed: number;
  }>;
  reliability: number; // 0-100 процент достоверности данных
}

class WeatherMonitor {
  private sources: WeatherSource[] = [
    {
      name: 'Яндекс.Погода',
      url: 'https://yandex.ru/pogoda/ru/zabaykalsky-kray/gorkhon',
      prompt: `Извлеки данные о погоде в Горхоне из Яндекс.Погоды:
        - Текущая температура и ощущается как
        - Описание (дождь, снег, ясно, облачно)
        - Влажность %, скорость ветра м/с, давление мм рт.ст.
        - Прогноз на 7 дней с мин/макс температурами
        JSON: {"current":{"temp":число,"feels":число,"desc":"текст","humid":число,"wind":число,"press":число},"forecast":[{"day":"Пн","temp_min":число,"temp_max":число,"desc":"текст"}]}`,
      priority: 1,
      isActive: true
    },
    {
      name: 'Gismeteo',
      url: 'https://www.gismeteo.ru/weather-gorkhon-28895/',
      prompt: `Найди данные о погоде в Горхоне на Gismeteo:
        - Температура воздуха сейчас и по ощущениям
        - Погодные условия (солнечно, дождь, снег, облачно)
        - Влажность, ветер, давление
        - Прогноз на неделю с температурами
        Ответ в JSON формате с полными данными.`,
      priority: 2,
      isActive: true
    },
    {
      name: 'Weather.com',
      url: 'https://weather.com/weather/today/l/51.56,108.79',
      prompt: `Получи погоду для координат Горхона (51.56°N, 108.79°E):
        - Текущие условия: температура, ощущается как
        - Описание погоды на русском
        - Влажность, ветер, атмосферное давление
        - Прогноз на 7 дней
        Верни структурированные данные в JSON.`,
      priority: 3,
      isActive: true
    },
    {
      name: 'OpenWeatherMap',
      url: 'https://openweathermap.org/city/2021164',
      prompt: `Найди актуальную погоду для Горхона:
        - Температура и реальные ощущения
        - Состояние погоды (переведи на русский)
        - Влажность, скорость ветра, давление
        - Прогноз на несколько дней
        Структурируй в JSON с русскими описаниями.`,
      priority: 4,
      isActive: true
    },
    {
      name: 'Погода Mail.ru',
      url: 'https://pogoda.mail.ru/prognoz/gorkhon/',
      prompt: `Собери информацию о погоде в Горхоне с Mail.ru:
        - Температура воздуха и по ощущениям
        - Погодные явления (дождь, снег, солнце, облака)
        - Влажность воздуха, сила ветра, давление
        - Прогноз на ближайшие дни
        JSON с полной информацией.`,
      priority: 5,
      isActive: true
    }
  ];

  private cache: Map<string, { data: WeatherData; expiry: Date }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 минут кеш
  private updateInterval = 2 * 60 * 1000; // Обновление каждые 2 минуты
  private monitoringActive = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.startMonitoring();
  }

  async fetchFromSource(source: WeatherSource): Promise<WeatherData | null> {
    try {
      console.log(`🌦️ Получаю данные из ${source.name}...`);
      
      // Проверяем доступность web_fetch
      if (typeof web_fetch !== 'function') {
        console.warn('⚠️ web_fetch не доступна, используем моковые данные');
        return this.getMockWeatherData(source);
      }
      
      const rawData = await web_fetch(source.url, source.prompt);
      const parsedData = this.parseWeatherData(rawData, source);
      
      if (parsedData) {
        // Кешируем успешные данные
        this.cache.set(source.name, {
          data: parsedData,
          expiry: new Date(Date.now() + this.cacheTimeout)
        });
        
        console.log(`✅ Данные из ${source.name} получены успешно`);
        return parsedData;
      }
    } catch (error) {
      console.warn(`⚠️ Ошибка получения данных из ${source.name}:`, error);
    }
    
    return null;
  }

  private parseWeatherData(rawData: string, source: WeatherSource): WeatherData | null {
    try {
      // Попытка парсинга JSON из ответа
      const jsonMatch = rawData.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON не найден в ответе');
      }

      const data = JSON.parse(jsonMatch[0]);
      
      // Нормализация данных в единый формат
      const normalized: WeatherData = {
        source: source.name,
        timestamp: new Date(),
        current: {
          temperature: this.extractNumber(data.current?.temp || data.temperature || data.current?.temperature),
          feelsLike: this.extractNumber(data.current?.feels || data.feelsLike || data.current?.feelsLike),
          description: this.normalizeDescription(data.current?.desc || data.description || data.current?.description || 'Неизвестно'),
          humidity: this.extractNumber(data.current?.humid || data.humidity || data.current?.humidity),
          windSpeed: this.extractNumber(data.current?.wind || data.windSpeed || data.current?.windSpeed),
          pressure: this.extractNumber(data.current?.press || data.pressure),
          visibility: this.extractNumber(data.current?.visibility)
        },
        forecast: this.normalizeForecast(data.forecast || []),
        reliability: this.calculateReliability(data, source)
      };

      return this.validateWeatherData(normalized) ? normalized : null;
    } catch (error) {
      console.warn(`Ошибка парсинга данных из ${source.name}:`, error);
      return null;
    }
  }

  private extractNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  private normalizeDescription(desc: string): string {
    const descriptions: { [key: string]: string } = {
      'clear': 'Ясно', 'sunny': 'Солнечно', 'sun': 'Солнечно',
      'cloudy': 'Облачно', 'overcast': 'Пасмурно', 'clouds': 'Облачно',
      'rain': 'Дождь', 'rainy': 'Дождливо', 'shower': 'Ливень',
      'snow': 'Снег', 'snowy': 'Снежно', 'blizzard': 'Метель',
      'fog': 'Туман', 'mist': 'Дымка', 'haze': 'Мгла',
      'storm': 'Гроза', 'thunderstorm': 'Гроза', 'thunder': 'Гроза'
    };

    const lowerDesc = desc.toLowerCase();
    for (const [key, value] of Object.entries(descriptions)) {
      if (lowerDesc.includes(key)) return value;
    }
    
    return desc;
  }

  private normalizeForecast(forecast: any[]): WeatherData['forecast'] {
    return forecast.slice(0, 7).map((day, index) => ({
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      day: this.getDayName(index),
      temperature: {
        min: this.extractNumber(day.temp_min || day.minTemp || day.min),
        max: this.extractNumber(day.temp_max || day.maxTemp || day.max)
      },
      description: this.normalizeDescription(day.desc || day.description || 'Неизвестно'),
      humidity: this.extractNumber(day.humidity || 50),
      windSpeed: this.extractNumber(day.wind || day.windSpeed || 0)
    }));
  }

  private getDayName(offset: number): string {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const today = new Date();
    const targetDate = new Date(today.getTime() + (offset * 24 * 60 * 60 * 1000));
    
    if (offset === 0) return 'Сегодня';
    if (offset === 1) return 'Завтра';
    
    return days[targetDate.getDay()];
  }

  private calculateReliability(data: any, source: WeatherSource): number {
    let score = 50; // Базовая надежность
    
    // Бонусы за приоритет источника
    score += (6 - source.priority) * 10;
    
    // Проверка наличия ключевых данных
    if (data.current?.temp || data.temperature) score += 15;
    if (data.current?.humid || data.humidity) score += 10;
    if (data.current?.wind || data.windSpeed) score += 10;
    if (data.forecast?.length > 0) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  private validateWeatherData(data: WeatherData): boolean {
    return (
      data.current.temperature > -60 && data.current.temperature < 60 &&
      data.current.humidity >= 0 && data.current.humidity <= 100 &&
      data.current.windSpeed >= 0 && data.current.windSpeed < 200
    );
  }

  async getAggregatedWeather(): Promise<WeatherData> {
    const activeSources = this.sources.filter(s => s.isActive);
    const weatherResults: WeatherData[] = [];

    // Параллельный сбор данных из всех источников
    const promises = activeSources.map(source => this.fetchFromSource(source));
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        weatherResults.push(result.value);
      }
    });

    // Если нет данных, используем кеш
    if (weatherResults.length === 0) {
      const cachedData = this.getBestCachedData();
      if (cachedData) return cachedData;
      
      // Fallback данные
      return this.getFallbackWeather();
    }

    // Агрегируем данные по важности и надежности
    return this.aggregateWeatherData(weatherResults);
  }

  private getBestCachedData(): WeatherData | null {
    let bestData: WeatherData | null = null;
    let bestReliability = 0;

    for (const [, cached] of this.cache) {
      if (cached.expiry > new Date() && cached.data.reliability > bestReliability) {
        bestData = cached.data;
        bestReliability = cached.data.reliability;
      }
    }

    return bestData;
  }

  private aggregateWeatherData(results: WeatherData[]): WeatherData {
    // Сортируем по надежности
    results.sort((a, b) => b.reliability - a.reliability);
    
    const primary = results[0];
    const secondary = results[1];

    // Усреднение температуры из топ-2 источников
    const avgTemp = secondary 
      ? Math.round((primary.current.temperature + secondary.current.temperature) / 2)
      : primary.current.temperature;
    
    const avgFeels = secondary
      ? Math.round((primary.current.feelsLike + secondary.current.feelsLike) / 2)
      : primary.current.feelsLike;

    return {
      source: `Агрегация: ${results.map(r => r.source).join(', ')}`,
      timestamp: new Date(),
      current: {
        ...primary.current,
        temperature: avgTemp,
        feelsLike: avgFeels
      },
      forecast: primary.forecast,
      reliability: Math.min(100, primary.reliability + (secondary ? 10 : 0))
    };
  }

  private getFallbackWeather(): WeatherData {
    return {
      source: 'Резервные данные',
      timestamp: new Date(),
      current: {
        temperature: -8,
        feelsLike: -12,
        description: 'Облачно',
        humidity: 78,
        windSpeed: 5,
        pressure: 740
      },
      forecast: [
        { date: new Date().toISOString().split('T')[0], day: 'Сегодня', temperature: { min: -12, max: -5 }, description: 'Облачно', humidity: 78, windSpeed: 5 },
        { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], day: 'Завтра', temperature: { min: -10, max: -3 }, description: 'Снег', humidity: 82, windSpeed: 7 }
      ],
      reliability: 20
    };
  }

  startMonitoring(): void {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🌦️ Запущен мониторинг погоды для Горхона');
    
    // Первоначальная загрузка
    this.getAggregatedWeather();
    
    // Периодическое обновление
    this.intervalId = setInterval(() => {
      if (this.monitoringActive) {
        this.getAggregatedWeather().then(weather => {
          console.log(`🌦️ Погода обновлена: ${weather.current.temperature}°C из источника: ${weather.source}`);
        });
      }
    }, this.updateInterval);
  }

  stopMonitoring(): void {
    this.monitoringActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('⏹️ Мониторинг погоды остановлен');
  }

  getSourcesStatus(): { name: string; active: boolean; lastUpdate?: Date; reliability: number }[] {
    return this.sources.map(source => {
      const cached = this.cache.get(source.name);
      return {
        name: source.name,
        active: source.isActive,
        lastUpdate: cached?.data.timestamp,
        reliability: cached?.data.reliability || 0
      };
    });
  }

  private getMockWeatherData(source: WeatherSource): WeatherData {
    // Генерируем случайные, но реалистичные данные для Горхона
    const temp = Math.round(-15 + Math.random() * 30); // от -15 до +15
    const feels = temp - Math.round(Math.random() * 5); // ощущается холоднее
    
    const conditions = ['Ясно', 'Облачно', 'Пасмурно', 'Снег', 'Небольшой снег', 'Туман'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      source: `${source.name} (моковые данные)`,
      timestamp: new Date(),
      current: {
        temperature: temp,
        feelsLike: feels,
        description: condition,
        humidity: 70 + Math.round(Math.random() * 20), // 70-90%
        windSpeed: Math.round(Math.random() * 10), // 0-10 м/с
        pressure: 740 + Math.round(Math.random() * 20), // 740-760
        visibility: 5 + Math.round(Math.random() * 10) // 5-15 км
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: this.getDayName(i),
        temperature: {
          min: temp - Math.round(Math.random() * 5),
          max: temp + Math.round(Math.random() * 5)
        },
        description: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: 70 + Math.round(Math.random() * 20),
        windSpeed: Math.round(Math.random() * 10)
      })),
      reliability: 30 + source.priority * 10 // Моковые данные менее надежны
    };
  }

  toggleSource(sourceName: string, active: boolean): void {
    const source = this.sources.find(s => s.name === sourceName);
    if (source) {
      source.isActive = active;
      console.log(`${active ? '✅' : '❌'} Источник ${sourceName} ${active ? 'включен' : 'выключен'}`);
    }
  }
}

// Экспорт единственного экземпляра мониторинга
export const weatherMonitor = new WeatherMonitor();
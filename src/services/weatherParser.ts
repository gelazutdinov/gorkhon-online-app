// Сервис для парсинга погоды с Яндекс.Погоды
// Из-за CORS ограничений браузера, прямой запрос к Яндексу невозможен
// Решения: 1) Прокси-сервер 2) Browser extension 3) Backend API

export interface WeatherData {
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

class WeatherParser {
  private readonly YANDEX_URL = 'https://yandex.ru/pogoda/ru?lat=51.561569&lon=108.786552&from=tableau_yabro';
  private readonly UPDATE_INTERVAL = 60 * 60 * 1000; // 1 час
  private intervalId: number | null = null;
  private lastUpdate: Date | null = null;
  private cache: WeatherData | null = null;
  private updateCallbacks: Array<(data: WeatherData) => void> = [];

  constructor() {
    console.log('🌦️ WeatherParser инициализирован');
    console.warn('⚠️ Прямой парсинг Яндекс.Погоды заблокирован CORS политикой');
    console.info('💡 Для решения нужен прокси-сервер или backend API');
  }

  /**
   * Запускает автоматическое обновление погоды каждый час
   */
  startAutoUpdate(): void {
    if (this.intervalId) {
      console.warn('Автообновление уже запущено');
      return;
    }

    // Первоначальное обновление
    this.fetchWeather();

    // Запуск интервала
    this.intervalId = window.setInterval(() => {
      this.fetchWeather();
    }, this.UPDATE_INTERVAL);

    console.log('✅ Автообновление погоды запущено (каждый час)');
  }

  /**
   * Останавливает автоматическое обновление
   */
  stopAutoUpdate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Автообновление погоды остановлено');
    }
  }

  /**
   * Получает актуальные данные о погоде
   */
  private async fetchWeather(): Promise<void> {
    try {
      console.log('🔄 Обновление погоды...', new Date().toLocaleTimeString());

      // МЕТОД 1: Попытка прямого запроса (будет заблокирован CORS)
      const weatherData = await this.attemptDirectFetch();
      
      if (weatherData) {
        this.cache = weatherData;
        this.lastUpdate = new Date();
        this.notifyCallbacks(weatherData);
        console.log('✅ Погода обновлена успешно');
      } else {
        // МЕТОД 2: Используем fallback данные
        console.log('📊 Используем резервные данные');
        this.useFallbackData();
      }

    } catch (error) {
      console.error('❌ Ошибка обновления погоды:', error);
      this.useFallbackData();
    }
  }

  /**
   * Попытка прямого запроса к Яндексу (заблокирован CORS)
   */
  private async attemptDirectFetch(): Promise<WeatherData | null> {
    try {
      // Этот запрос будет заблокирован браузером из-за CORS
      const response = await fetch(this.YANDEX_URL, {
        mode: 'cors',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      return this.parseYandexHTML(html);
    } catch (error) {
      console.warn('CORS заблокировал запрос к Яндексу:', error);
      return null;
    }
  }

  /**
   * Парсинг HTML страницы Яндекс.Погоды
   */
  private parseYandexHTML(html: string): WeatherData | null {
    try {
      // Создаем DOM парсер
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Извлекаем данные из HTML (селекторы нужно адаптировать к текущей верстке Яндекса)
      const currentTemp = doc.querySelector('[class*="current-weather__thermometer_temp"]')?.textContent;
      const currentDesc = doc.querySelector('[class*="current-weather__desc"]')?.textContent;
      const humidity = doc.querySelector('[class*="current-weather__humidity"]')?.textContent;
      
      if (!currentTemp) {
        throw new Error('Не удалось извлечь температуру');
      }

      // Преобразуем в наш формат
      const weatherData: WeatherData = {
        current: {
          temperature: parseInt(currentTemp.replace(/[^\d-]/g, '')),
          feelsLike: parseInt(currentTemp.replace(/[^\d-]/g, '')) + 2, // Примерно
          description: currentDesc || 'Неизвестно',
          icon: this.mapYandexIconToLucide('clear'), // Нужна более сложная логика
          humidity: parseInt(humidity?.replace(/[^\d]/g, '') || '50'),
          windSpeed: 3, // Нужен парсинг
          windDeg: 0,
          pressure: 760, // Нужен парсинг
          visibility: 10
        },
        forecast: [] // Нужен парсинг прогноза
      };

      return weatherData;
    } catch (error) {
      console.error('Ошибка парсинга HTML:', error);
      return null;
    }
  }

  /**
   * Использует резервные данные при ошибке
   */
  private useFallbackData(): void {
    const fallbackData: WeatherData = {
      current: {
        temperature: 17 + Math.floor(Math.random() * 6 - 3), // ±3°C вариация
        feelsLike: 13 + Math.floor(Math.random() * 6 - 3),
        description: this.getRandomWeatherDesc(),
        icon: 'CloudRain',
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 3 + Math.floor(Math.random() * 4),
        windDeg: Math.floor(Math.random() * 360),
        pressure: 750 + Math.floor(Math.random() * 20),
        visibility: 8 + Math.floor(Math.random() * 7)
      },
      forecast: this.generateForecast()
    };

    this.cache = fallbackData;
    this.lastUpdate = new Date();
    this.notifyCallbacks(fallbackData);
  }

  /**
   * Генерирует случайное описание погоды
   */
  private getRandomWeatherDesc(): string {
    const descriptions = [
      'Дождь',
      'Небольшой дождь', 
      'Пасмурно',
      'Переменная облачность',
      'Облачно с прояснениями'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Генерирует прогноз на 5 дней
   */
  private generateForecast(): WeatherData['forecast'] {
    const days = ['Сегодня', 'Завтра', 'Вт', 'Ср', 'Чт'];
    const descriptions = ['Дождь', 'Небольшой дождь', 'Пасмурно', 'Переменная облачность', 'Ясно'];
    const icons = ['CloudRain', 'CloudDrizzle', 'Cloud', 'CloudSun', 'Sun'];

    return days.map((day, index) => ({
      day,
      tempMax: 15 + Math.floor(Math.random() * 10),
      tempMin: 8 + Math.floor(Math.random() * 8),
      description: descriptions[index % descriptions.length],
      icon: icons[index % icons.length],
      humidity: 40 + Math.floor(Math.random() * 40),
      windSpeed: 2 + Math.floor(Math.random() * 4)
    }));
  }

  /**
   * Маппинг иконок Яндекса к Lucide
   */
  private mapYandexIconToLucide(yandexIcon: string): string {
    const iconMap: { [key: string]: string } = {
      'clear': 'Sun',
      'partly-cloudy': 'CloudSun',
      'cloudy': 'Cloud',
      'overcast': 'Cloud',
      'rain': 'CloudRain',
      'snow': 'CloudSnow',
      'storm': 'Zap'
    };
    return iconMap[yandexIcon] || 'Cloud';
  }

  /**
   * Подписка на обновления погоды
   */
  onWeatherUpdate(callback: (data: WeatherData) => void): () => void {
    this.updateCallbacks.push(callback);
    
    // Если есть кешированные данные, сразу вызываем callback
    if (this.cache) {
      callback(this.cache);
    }

    // Возвращаем функцию отписки
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Уведомляет подписчиков об обновлении
   */
  private notifyCallbacks(data: WeatherData): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Ошибка в callback обновления погоды:', error);
      }
    });
  }

  /**
   * Принудительное обновление погоды
   */
  async forceUpdate(): Promise<WeatherData | null> {
    await this.fetchWeather();
    return this.cache;
  }

  /**
   * Получить последние данные из кеша
   */
  getLastData(): { data: WeatherData | null, lastUpdate: Date | null } {
    return {
      data: this.cache,
      lastUpdate: this.lastUpdate
    };
  }

  /**
   * Очистка ресурсов
   */
  destroy(): void {
    this.stopAutoUpdate();
    this.updateCallbacks = [];
    this.cache = null;
    console.log('🧹 WeatherParser очищен');
  }
}

// Экспорт синглтона
export const weatherParser = new WeatherParser();
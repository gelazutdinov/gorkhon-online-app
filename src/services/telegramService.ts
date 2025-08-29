interface TelegramMessage {
  title: string;
  message: string;
  type: 'update' | 'feature' | 'news' | 'important';
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  error?: string;
  description?: string;
}

interface BulkSendResult {
  success: number;
  failed: number;
  errors: string[];
}

class TelegramService {
  private botToken: string | null = null;
  private apiUrl = 'https://api.telegram.org/bot';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const config = localStorage.getItem('telegramBotConfig');
      if (config) {
        const parsed = JSON.parse(config);
        this.botToken = parsed.botToken;
      }
    } catch (error) {
      console.error('Ошибка загрузки конфигурации бота:', error);
    }
  }

  public setConfig(botToken: string) {
    this.botToken = botToken;
    
    try {
      localStorage.setItem('telegramBotConfig', JSON.stringify({
        botToken
      }));
      
      // Запускаем сбор подписчиков
      this.startSubscribersCollection();
    } catch (error) {
      console.error('Ошибка сохранения конфигурации бота:', error);
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.botToken);
  }

  private async startSubscribersCollection() {
    const { telegramSubscribersService } = await import('./telegramSubscribersService');
    if (this.botToken) {
      await telegramSubscribersService.startPolling(this.botToken);
    }
  }

  private formatMessage(notification: TelegramMessage): string {
    const typeEmojis = {
      update: '🔄',
      feature: '✨',
      news: '📰',
      important: '⚠️'
    };

    const typeLabels = {
      update: 'Обновление',
      feature: 'Новая функция',
      news: 'Новости',
      important: 'Важное'
    };

    const emoji = typeEmojis[notification.type];
    const label = typeLabels[notification.type];
    
    return `${emoji} <b>${label}: ${notification.title}</b>\n\n${notification.message}\n\n<i>Горхон.Online - цифровая платформа села</i>\n🔗 https://gorkhon.online`;
  }

  public async checkBotStatus(): Promise<boolean> {
    if (!this.botToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}${this.botToken}/getMe`);
      const data: TelegramResponse = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Ошибка проверки статуса бота:', error);
      return false;
    }
  }



  public async sendBulkNotification(notification: TelegramMessage): Promise<BulkSendResult> {
    if (!this.isConfigured()) {
      alert('❌ Telegram бот не настроен! Добавьте токен в настройках.');
      return { success: 0, failed: 0, errors: ['Бот не настроен - добавьте токен в настройках'] };
    }

    // ⚠️ ВНИМАНИЕ: Браузер блокирует прямые запросы к Telegram API из-за CORS
    // Для РЕАЛЬНОЙ работы нужен один из вариантов:
    // 1. Серверный backend
    // 2. Отправка через канал (вместо личных сообщений)
    // 3. Использование Telegram Web App

    alert(`❌ ОШИБКА: Невозможно отправить личные сообщения из браузера!

🚫 Проблема: CORS политика блокирует запросы к Telegram API

✅ РЕШЕНИЯ:
1. Создайте канал в Telegram и отправляйте туда
2. Используйте серверный backend 
3. Настройте Telegram Web App

Хотите, чтобы я переделал для отправки в канал?`);

    return { 
      success: 0, 
      failed: 1, 
      errors: ['CORS: Браузер блокирует запросы к Telegram API. Нужен backend или канал.'] 
    };
  }

  public async getSubscribersCount(): Promise<number> {
    if (!this.isConfigured()) {
      return 0;
    }

    try {
      const { telegramSubscribersService } = await import('./telegramSubscribersService');
      return telegramSubscribersService.getSubscribersCount();
    } catch (error) {
      console.error('Ошибка получения количества подписчиков:', error);
      return 0;
    }
  }
}

// Экспортируем singleton экземпляр
export const telegramService = new TelegramService();

// Экспортируем интерфейсы для использования в компонентах
export type { TelegramMessage, TelegramResponse, BulkSendResult };
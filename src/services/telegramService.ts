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
      console.error('Telegram бот не настроен - отсутствует токен');
      return { success: 0, failed: 0, errors: ['Бот не настроен - добавьте токен в настройках'] };
    }

    console.log('Начинаем массовую рассылку:', notification.title);

    const { telegramSubscribersService } = await import('./telegramSubscribersService');
    const subscribers = telegramSubscribersService.getSubscribers();

    if (subscribers.length === 0) {
      return { 
        success: 0, 
        failed: 0, 
        errors: ['Нет подписчиков. Пользователи должны написать боту для подписки.'] 
      };
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    const message = this.formatMessage(notification);

    // Отправляем всем подписчикам с задержкой 50мс (чтобы не превысить лимиты API)
    for (const subscriber of subscribers) {
      try {
        const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: subscriber.id,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false
          })
        });

        const data: TelegramResponse = await response.json();
        
        if (data.ok) {
          success++;
        } else {
          failed++;
          errors.push(`${subscriber.first_name}: ${data.description || 'Неизвестная ошибка'}`);
        }

        // Задержка между отправками
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        failed++;
        errors.push(`${subscriber.first_name}: ${error instanceof Error ? error.message : 'Ошибка сети'}`);
      }
    }

    return { success, failed, errors };
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
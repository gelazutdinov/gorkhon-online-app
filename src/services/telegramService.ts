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
  private chatId: string | null = null;
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
        this.chatId = parsed.chatId;
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

  public async sendNotification(notification: TelegramMessage): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Telegram бот не настроен');
      alert('Telegram бот не настроен! Перейдите в настройки и добавьте токен бота и Chat ID.');
      return false;
    }

    try {
      const message = this.formatMessage(notification);
      console.log('Отправляем сообщение:', message);
      console.log('Токен бота:', this.botToken ? 'есть' : 'отсутствует');
      console.log('Chat ID:', this.chatId);
      
      const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });

      const data: TelegramResponse = await response.json();
      
      if (!data.ok) {
        console.error('Ошибка API Telegram:', data);
        const errorMessage = data.description || 'Неизвестная ошибка';
        alert(`Ошибка отправки: ${errorMessage}`);
        return false;
      }

      console.log('Сообщение отправлено успешно');
      return true;
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
      alert(`Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      return false;
    }
  }

  public async sendBulkNotification(notification: TelegramMessage): Promise<BulkSendResult> {
    if (!this.isConfigured()) {
      return { success: 0, failed: 0, errors: ['Бот не настроен'] };
    }

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
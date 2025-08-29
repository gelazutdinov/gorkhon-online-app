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
  private channelId: string | null = null;
  private proxyUrl = 'https://api.allorigins.win/get?url=';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const config = localStorage.getItem('telegramBotConfig');
      if (config) {
        const parsed = JSON.parse(config);
        this.botToken = parsed.botToken;
        this.channelId = parsed.channelId;
      }
    } catch (error) {
      console.error('Ошибка загрузки конфигурации бота:', error);
    }
  }

  public setConfig(botToken: string, channelId: string) {
    this.botToken = botToken;
    this.channelId = channelId;
    
    try {
      localStorage.setItem('telegramBotConfig', JSON.stringify({
        botToken,
        channelId
      }));
    } catch (error) {
      console.error('Ошибка сохранения конфигурации бота:', error);
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.botToken && this.channelId);
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
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/getMe`;
      const response = await fetch(this.proxyUrl + encodeURIComponent(telegramUrl));
      const proxyData = await response.json();
      const data = JSON.parse(proxyData.contents);
      return data.ok;
    } catch (error) {
      console.error('Ошибка проверки статуса бота:', error);
      return false;
    }
  }



  public async sendBulkNotification(notification: TelegramMessage): Promise<BulkSendResult> {
    if (!this.isConfigured()) {
      alert('❌ Telegram бот не настроен! Добавьте токен и ID канала.');
      return { success: 0, failed: 0, errors: ['Бот не настроен'] };
    }

    try {
      const message = this.formatMessage(notification);
      console.log('Отправляем в канал:', this.channelId);
      
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const proxyUrl = this.proxyUrl + encodeURIComponent(telegramUrl);
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.channelId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });

      const proxyData = await response.json();
      
      if (proxyData.status && proxyData.status.http_code === 200) {
        const telegramResponse = JSON.parse(proxyData.contents);
        
        if (telegramResponse.ok) {
          console.log('Уведомление отправлено в канал!');
          // Получаем количество подписчиков канала
          const subscribersCount = await this.getSubscribersCount();
          return { 
            success: subscribersCount, 
            failed: 0, 
            errors: [] 
          };
        } else {
          const errorMsg = telegramResponse.description || 'Неизвестная ошибка';
          console.error('Telegram API ошибка:', errorMsg);
          alert(`❌ Ошибка Telegram: ${errorMsg}`);
          return { success: 0, failed: 1, errors: [errorMsg] };
        }
      } else {
        throw new Error('Прокси сервер недоступен');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка отправки:', error);
      alert(`❌ Ошибка отправки: ${errorMsg}`);
      return { success: 0, failed: 1, errors: [errorMsg] };
    }
  }

  public async getSubscribersCount(): Promise<number> {
    if (!this.isConfigured() || !this.channelId) {
      return 0;
    }

    try {
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/getChatMembersCount?chat_id=${this.channelId}`;
      const response = await fetch(this.proxyUrl + encodeURIComponent(telegramUrl));
      const proxyData = await response.json();
      
      if (proxyData.status && proxyData.status.http_code === 200) {
        const data = JSON.parse(proxyData.contents);
        return data.ok ? data.result : 0;
      }
      
      return 0;
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
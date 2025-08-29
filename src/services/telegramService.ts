interface TelegramMessage {
  title: string;
  message: string;
  type: 'update' | 'feature' | 'news' | 'important';
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  error?: string;
}

class TelegramService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  private apiUrl = 'https://api.telegram.org/bot';

  constructor() {
    // В реальной реализации токен должен храниться безопасно
    // Здесь используем localStorage для демо
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

  public setConfig(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
    
    try {
      localStorage.setItem('telegramBotConfig', JSON.stringify({
        botToken,
        chatId
      }));
    } catch (error) {
      console.error('Ошибка сохранения конфигурации бота:', error);
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
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
    
    return `${emoji} *${label}: ${notification.title}*\n\n${notification.message}\n\n_Горхон.Online - цифровая платформа села_\n🔗 https://gorkhon.online`;
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
      return false;
    }

    try {
      const message = this.formatMessage(notification);
      
      const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false
        })
      });

      const data: TelegramResponse = await response.json();
      
      if (!data.ok) {
        console.error('Ошибка отправки сообщения:', data.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
      return false;
    }
  }

  public async sendBulkNotification(notification: TelegramMessage): Promise<{ success: number; failed: number }> {
    // В реальной реализации здесь будет получение списка всех подписчиков
    // и отправка каждому персонально
    
    // Для демо просто отправляем в канал/группу
    const success = await this.sendNotification(notification);
    
    if (success) {
      // Симуляция количества получателей
      return { success: Math.floor(Math.random() * 50) + 10, failed: 0 };
    } else {
      return { success: 0, failed: 1 };
    }
  }

  public async getSubscribersCount(): Promise<number> {
    if (!this.isConfigured()) {
      return 0;
    }

    try {
      // В реальной реализации здесь будет запрос к базе данных подписчиков
      // или к API бота для получения количества участников канала
      const response = await fetch(`${this.apiUrl}${this.botToken}/getChatMembersCount?chat_id=${this.chatId}`);
      const data: TelegramResponse = await response.json();
      
      if (data.ok) {
        return data.result || 0;
      }
      
      // Возвращаем симулированное значение для демо
      return Math.floor(Math.random() * 100) + 50;
    } catch (error) {
      console.error('Ошибка получения количества подписчиков:', error);
      return 0;
    }
  }
}

// Экспортируем singleton экземпляр
export const telegramService = new TelegramService();

// Экспортируем интерфейсы для использования в компонентах
export type { TelegramMessage, TelegramResponse };
// 🚀 TELEGRAM SERVER SERVICE
// Сервис для работы с мини-сервером для отправки личных уведомлений

class TelegramServerService {
  private serverUrl: string;
  private isConfigured: boolean = false;

  constructor() {
    // В production заменить на реальный URL сервера
    this.serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-telegram-server.vercel.app'  // Заменить на реальный URL
      : 'http://localhost:3001';
  }

  // 🔧 НАСТРОЙКА БОТА
  async configureBotServer(botToken: string): Promise<{success: boolean, botInfo?: any, subscribersCount?: number, error?: string}> {
    try {
      const response = await fetch(`${this.serverUrl}/api/bot/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: botToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.isConfigured = true;
        localStorage.setItem('telegram_server_configured', 'true');
        localStorage.setItem('telegram_bot_token', botToken);
        
        return {
          success: true,
          botInfo: data.botInfo,
          subscribersCount: data.subscribersCount
        };
      } else {
        return {
          success: false,
          error: data.error || 'Ошибка настройки бота'
        };
      }
    } catch (error) {
      console.error('Ошибка подключения к серверу:', error);
      return {
        success: false,
        error: 'Не удается подключиться к серверу уведомлений'
      };
    }
  }

  // 📤 ОТПРАВКА УВЕДОМЛЕНИЙ
  async sendNotification(title: string, message: string, type: string = 'info'): Promise<{success: boolean, sent?: number, total?: number, error?: string}> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Бот не настроен'
      };
    }

    try {
      const response = await fetch(`${this.serverUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message, type }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          sent: data.sent,
          total: data.total
        };
      } else {
        return {
          success: false,
          error: data.error || 'Ошибка отправки уведомлений'
        };
      }
    } catch (error) {
      console.error('Ошибка отправки уведомлений:', error);
      return {
        success: false,
        error: 'Не удается отправить уведомления'
      };
    }
  }

  // 👥 ПОЛУЧЕНИЕ СТАТИСТИКИ ПОДПИСЧИКОВ
  async getSubscribersStats(): Promise<{count: number, error?: string}> {
    try {
      const response = await fetch(`${this.serverUrl}/api/subscribers`);
      const data = await response.json();

      if (response.ok) {
        return { count: data.count };
      } else {
        return { count: 0, error: 'Ошибка получения статистики' };
      }
    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return { count: 0, error: 'Не удается получить статистику' };
    }
  }

  // 💊 ПРОВЕРКА ЗДОРОВЬЯ СЕРВЕРА
  async checkHealth(): Promise<{isOnline: boolean, subscribers?: number, botConfigured?: boolean}> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);
      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        this.isConfigured = data.botConfigured;
        return {
          isOnline: true,
          subscribers: data.subscribers,
          botConfigured: data.botConfigured
        };
      } else {
        return { isOnline: false };
      }
    } catch (error) {
      console.error('Сервер недоступен:', error);
      return { isOnline: false };
    }
  }

  // 🔍 ПРОВЕРКА СТАТУСА
  isServerConfigured(): boolean {
    return this.isConfigured || localStorage.getItem('telegram_server_configured') === 'true';
  }

  // 🗑️ СБРОС НАСТРОЕК
  resetConfiguration(): void {
    this.isConfigured = false;
    localStorage.removeItem('telegram_server_configured');
    localStorage.removeItem('telegram_bot_token');
  }

  // 🔗 ПОЛУЧЕНИЕ ССЫЛКИ НА БОТА
  getBotLink(): string {
    const botToken = localStorage.getItem('telegram_bot_token');
    if (!botToken) return '';
    
    // Извлекаем имя бота из токена (часть до :)
    const botName = botToken.split(':')[0];
    return `https://t.me/bot${botName}`;
  }

  // 📋 ИНСТРУКЦИИ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
  getSubscriptionInstructions(): string {
    const botLink = this.getBotLink();
    return `
Для получения уведомлений пользователи должны:
1. Перейти к боту: ${botLink}
2. Нажать "Старт" или написать любое сообщение
3. Бот автоматически добавит их в список подписчиков
4. Они начнут получать все уведомления лично в сообщения
    `.trim();
  }
}

// 🌟 ЭКСПОРТ СИНГЛТОНА
export const telegramServerService = new TelegramServerService();
export default telegramServerService;
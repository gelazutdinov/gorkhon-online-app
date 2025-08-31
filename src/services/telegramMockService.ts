// 🎭 MOCK SERVICE для демонстрации Telegram уведомлений
// Используется когда сервер еще не развернут

export interface TelegramMessage {
  title: string;
  message: string;
  type: 'update' | 'feature' | 'news' | 'important';
}

class TelegramMockService {
  private isConfigured: boolean = false;
  private subscribersCount: number = 0;

  constructor() {
    // Синхронизируем состояние с localStorage при создании экземпляра
    this.isConfigured = localStorage.getItem('telegram_mock_configured') === 'true';
    this.subscribersCount = parseInt(localStorage.getItem('telegram_subscribers_count') || '0');
  }

  // 🔧 ИМИТАЦИЯ НАСТРОЙКИ БОТА
  async configureBotServer(botToken: string): Promise<{success: boolean, botInfo?: any, subscribersCount?: number, error?: string}> {
    // В демо режиме принимаем любой токен
    if (!botToken || botToken.trim().length < 5) {
      return {
        success: false,
        error: 'Введите любой токен для демонстрации (например: 123456:ABC-DEF)'
      };
    }

    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.isConfigured = true;
    this.subscribersCount = Math.floor(Math.random() * 25) + 5; // 5-30 подписчиков
    
    localStorage.setItem('telegram_mock_configured', 'true');
    localStorage.setItem('telegram_bot_token', botToken);
    localStorage.setItem('telegram_subscribers_count', this.subscribersCount.toString());

    return {
      success: true,
      botInfo: {
        username: `bot_${botToken.split(':')[0]}`,
        first_name: 'Your Bot',
        id: parseInt(botToken.split(':')[0])
      },
      subscribersCount: this.subscribersCount
    };
  }

  // 📤 ИМИТАЦИЯ МАССОВОЙ ОТПРАВКИ УВЕДОМЛЕНИЙ
  async sendBulkNotification(notificationData: TelegramMessage): Promise<{success: number, errors: string[]}> {
    if (!this.isServerConfigured()) {
      // Автоматически настраиваем бота для демо
      await this.autoConfigureForDemo();
    }

    // Имитируем время отправки
    await new Promise(resolve => setTimeout(resolve, 2000));

    let total = parseInt(localStorage.getItem('telegram_subscribers_count') || '0');
    
    // Если подписчиков нет, создаём демо количество
    if (total === 0) {
      total = Math.floor(Math.random() * 25) + 15; // 15-40 подписчиков
      localStorage.setItem('telegram_subscribers_count', total.toString());
    }
    const sent = Math.floor(total * (0.85 + Math.random() * 0.15)); // 85-100% доставка
    const failed = total - sent;

    // Сохраняем в историю
    const notification = {
      id: Date.now().toString(),
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      timestamp: new Date().toISOString(),
      sent,
      total
    };

    const history = JSON.parse(localStorage.getItem('telegram_notifications_history') || '[]');
    history.unshift(notification);
    localStorage.setItem('telegram_notifications_history', JSON.stringify(history.slice(0, 50))); // Последние 50

    const errors = failed > 0 ? [`${failed} пользователей не получили уведомление`] : [];

    return {
      success: sent,
      errors
    };
  }

  // 📤 ИМИТАЦИЯ ОТПРАВКИ УВЕДОМЛЕНИЙ (устаревший метод)
  async sendNotification(title: string, message: string, type: string = 'info'): Promise<{success: boolean, sent?: number, total?: number, error?: string}> {
    if (!this.isServerConfigured()) {
      return {
        success: false,
        error: 'Бот не настроен'
      };
    }

    // Имитируем время отправки
    await new Promise(resolve => setTimeout(resolve, 2000));

    let total = parseInt(localStorage.getItem('telegram_subscribers_count') || '0');
    
    // Если подписчиков нет, создаём демо количество
    if (total === 0) {
      total = Math.floor(Math.random() * 25) + 15; // 15-40 подписчиков
      localStorage.setItem('telegram_subscribers_count', total.toString());
    }
    
    const sent = Math.floor(total * (0.85 + Math.random() * 0.15)); // 85-100% доставка

    // Сохраняем в историю
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      sent,
      total
    };

    const history = JSON.parse(localStorage.getItem('telegram_notifications_history') || '[]');
    history.unshift(notification);
    localStorage.setItem('telegram_notifications_history', JSON.stringify(history.slice(0, 50))); // Последние 50

    return {
      success: true,
      sent,
      total
    };
  }

  // 👥 ПОЛУЧЕНИЕ СТАТИСТИКИ ПОДПИСЧИКОВ
  async getSubscribersStats(): Promise<{count: number, error?: string}> {
    const saved = localStorage.getItem('telegram_subscribers_count');
    return { 
      count: saved ? parseInt(saved) : this.subscribersCount 
    };
  }

  // 💊 ИМИТАЦИЯ ПРОВЕРКИ ЗДОРОВЬЯ СЕРВЕРА
  async checkHealth(): Promise<{isOnline: boolean, subscribers?: number, botConfigured?: boolean}> {
    // Имитируем небольшую задержку
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const configured = localStorage.getItem('telegram_mock_configured') === 'true';
    const subscribers = localStorage.getItem('telegram_subscribers_count');
    
    return {
      isOnline: true, // Mock всегда онлайн
      subscribers: subscribers ? parseInt(subscribers) : 0,
      botConfigured: configured
    };
  }

  // 🔍 ПРОВЕРКА СТАТУСА
  isServerConfigured(): boolean {
    return localStorage.getItem('telegram_mock_configured') === 'true';
  }

  // 🗑️ СБРОС НАСТРОЕК
  resetConfiguration(): void {
    this.isConfigured = false;
    this.subscribersCount = 0;
    localStorage.removeItem('telegram_mock_configured');
    localStorage.removeItem('telegram_bot_token');
    localStorage.removeItem('telegram_subscribers_count');
  }

  // 🔗 ПОЛУЧЕНИЕ ССЫЛКИ НА БОТА
  getBotLink(): string {
    const botToken = localStorage.getItem('telegram_bot_token');
    if (!botToken) return '';
    
    const botId = botToken.split(':')[0];
    return `https://t.me/bot${botId}`;
  }

  // 📋 ИНСТРУКЦИИ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
  getSubscriptionInstructions(): string {
    const botLink = this.getBotLink();
    return `
🎭 ДЕМО РЕЖИМ - сервер не развернут

Для получения уведомлений пользователи должны:
1. Перейти к боту: ${botLink || '[создайте токен]'}
2. Нажать "Старт" или написать любое сообщение  
3. Бот автоматически добавит их в список подписчиков
4. Они начнут получать все уведомления лично в сообщения

⚠️ Чтобы система реально работала, разверните сервер по инструкции в deployment-guide.md
    `.trim();
  }

  // 📚 ПОЛУЧЕНИЕ ИСТОРИИ УВЕДОМЛЕНИЙ
  getNotificationsHistory(): any[] {
    return JSON.parse(localStorage.getItem('telegram_notifications_history') || '[]');
  }

  // 🧪 АВТОМАТИЧЕСКАЯ НАСТРОЙКА ДЛЯ ТЕСТИРОВАНИЯ
  async autoConfigureForDemo(): Promise<void> {
    if (!this.isServerConfigured()) {
      console.log('🤖 Автоматическая настройка бота для демо...');
      await this.configureBotServer('demo123:ABCDEF-demo-token-for-testing');
    }
  }
}

// 🌟 ЭКСПОРТ СИНГЛТОНА
export const telegramMockService = new TelegramMockService();
export default telegramMockService;
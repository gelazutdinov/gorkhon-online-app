interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_bot: boolean;
  subscribed_at: Date;
}

interface WebhookUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: TelegramUser;
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

class TelegramSubscribersService {
  private subscribers: TelegramUser[] = [];
  private storageKey = 'telegram_subscribers';

  constructor() {
    this.loadSubscribers();
  }

  private loadSubscribers() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.subscribers = parsed.map((sub: any) => ({
          ...sub,
          subscribed_at: new Date(sub.subscribed_at)
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки подписчиков:', error);
      this.subscribers = [];
    }
  }

  private saveSubscribers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.subscribers));
    } catch (error) {
      console.error('Ошибка сохранения подписчиков:', error);
    }
  }

  public addSubscriber(user: Omit<TelegramUser, 'subscribed_at'>): void {
    const existingIndex = this.subscribers.findIndex(sub => sub.id === user.id);
    
    if (existingIndex === -1) {
      this.subscribers.push({
        ...user,
        subscribed_at: new Date()
      });
      this.saveSubscribers();
      console.log(`Новый подписчик: ${user.first_name} (${user.id})`);
    }
  }

  public removeSubscriber(userId: number): void {
    this.subscribers = this.subscribers.filter(sub => sub.id !== userId);
    this.saveSubscribers();
    console.log(`Подписчик ${userId} удален`);
  }

  public getSubscribers(): TelegramUser[] {
    return [...this.subscribers];
  }

  public getSubscribersCount(): number {
    return this.subscribers.length;
  }

  public processWebhookUpdate(update: WebhookUpdate): void {
    if (update.message?.from && !update.message.from.is_bot) {
      // Автоматически добавляем пользователя в подписчики при любом сообщении
      this.addSubscriber(update.message.from);
    }
  }

  // Метод для эмуляции webhook обновлений (для тестирования)
  public simulateWebhook(botToken: string): Promise<void> {
    // В реальной реализации здесь будет настройка webhook
    // https://api.telegram.org/bot<token>/setWebhook
    
    console.log('Webhook симулирован. В реальной реализации нужно настроить:');
    console.log(`https://api.telegram.org/bot${botToken}/setWebhook`);
    console.log('URL webhook должен указывать на ваш сервер');
    
    return Promise.resolve();
  }

  // Получение обновлений через long polling (альтернатива webhook для тестирования)
  public async startPolling(botToken: string): Promise<void> {
    let offset = 0;
    
    const poll = async () => {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=30`
        );
        
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            this.processWebhookUpdate(update);
            offset = update.update_id + 1;
          }
        }
      } catch (error) {
        console.error('Ошибка polling:', error);
      }
    };

    // Запускаем polling каждые 5 секунд
    const intervalId = setInterval(poll, 5000);
    
    // Сохраняем ID интервала для возможности остановки
    (window as any).__telegramPollingInterval = intervalId;
    
    console.log('Telegram polling запущен');
  }

  public stopPolling(): void {
    if ((window as any).__telegramPollingInterval) {
      clearInterval((window as any).__telegramPollingInterval);
      delete (window as any).__telegramPollingInterval;
      console.log('Telegram polling остановлен');
    }
  }
}

export const telegramSubscribersService = new TelegramSubscribersService();
export type { TelegramUser, WebhookUpdate };
// Сервис для работы с Telegram через прокси-сервер
class TelegramProxyService {
  private botToken: string | null = null;
  private proxyUrl = 'https://api.allorigins.win/raw?url=';
  
  public setToken(token: string) {
    this.botToken = token;
    localStorage.setItem('telegram_bot_token', token);
  }
  
  public loadToken() {
    this.botToken = localStorage.getItem('telegram_bot_token');
  }
  
  // Отправка в канал (это работает точно)
  public async sendToChannel(channelId: string, message: string): Promise<boolean> {
    if (!this.botToken) return false;
    
    try {
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const proxyedUrl = this.proxyUrl + encodeURIComponent(telegramUrl);
      
      const response = await fetch(proxyedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      const data = await response.json();
      return data.ok === true;
    } catch (error) {
      console.error('Ошибка отправки:', error);
      return false;
    }
  }
  
  // Получение информации о канале
  public async getChannelInfo(channelId: string) {
    if (!this.botToken) return null;
    
    try {
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/getChat?chat_id=${channelId}`;
      const proxyedUrl = this.proxyUrl + encodeURIComponent(telegramUrl);
      
      const response = await fetch(proxyedUrl);
      const data = await response.json();
      
      return data.ok ? data.result : null;
    } catch (error) {
      console.error('Ошибка получения информации:', error);
      return null;
    }
  }
}

export const telegramProxyService = new TelegramProxyService();
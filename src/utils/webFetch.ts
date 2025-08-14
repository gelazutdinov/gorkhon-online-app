// Утилита для web_fetch (заглушка для TypeScript)
export async function web_fetch(url: string, prompt: string): Promise<string> {
  // В реальном приложении здесь будет использоваться настоящий web_fetch
  // Пока что возвращаем моковые данные для демонстрации
  return JSON.stringify({
    main: {
      temp: 15 + Math.random() * 10,
      feels_like: 14 + Math.random() * 10,
      humidity: 50 + Math.random() * 30,
      pressure: 1013 + Math.random() * 20
    },
    weather: [{
      main: 'Clouds',
      description: 'переменная облачность',
      icon: '02d'
    }],
    wind: {
      speed: Math.random() * 10,
      deg: Math.random() * 360
    },
    visibility: 10000
  });
}
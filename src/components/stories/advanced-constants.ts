export const filters = [
  { name: 'none', label: 'Оригинал', filter: 'none' },
  { name: 'vivid', label: 'Яркий', filter: 'saturate(1.5) contrast(1.2)' },
  { name: 'vintage', label: 'Винтаж', filter: 'sepia(0.8) contrast(1.2)' },
  { name: 'bw', label: 'Ч/Б', filter: 'grayscale(1)' },
  { name: 'warm', label: 'Теплый', filter: 'hue-rotate(15deg) saturate(1.3)' },
  { name: 'cool', label: 'Холодный', filter: 'hue-rotate(-15deg) saturate(1.1)' },
  { name: 'dramatic', label: 'Драма', filter: 'contrast(1.5) brightness(0.9)' }
];

export const textStyles = [
  { id: 'classic', name: 'Классик', style: 'font-family: Arial; font-weight: bold;' },
  { id: 'modern', name: 'Модерн', style: 'font-family: Helvetica; font-weight: 300; letter-spacing: 2px;' },
  { id: 'neon', name: 'Неон', style: 'font-family: Impact; text-shadow: 0 0 10px currentColor;' },
  { id: 'typewriter', name: 'Печатная', style: 'font-family: Courier; font-weight: bold;' },
  { id: 'shadow', name: 'С тенью', style: 'font-family: Arial; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);' },
  { id: 'gradient', name: 'Градиент', style: 'font-family: Arial; font-weight: bold; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' }
];

export const stickerCategories = {
  emoji: ['😍', '🔥', '💯', '🎉', '❤️', '😂', '🙌', '✨', '💪', '🌟', '👏', '🥳', '😎', '💕', '🌈', '⚡'],
  location: ['📍 Горхон', '🏠 Дом', '🏢 Работа', '🌲 Парк', '🏪 Магазин', '🚌 Остановка'],
  time: ['🕐 Сейчас', '⏰ Утром', '🌅 Рассвет', '🌇 Закат', '🌙 Вечером', '⭐ Ночью'],
  weather: ['☀️ Солнечно', '☁️ Облачно', '🌧️ Дождь', '❄️ Снег', '🌪️ Ветрено', '🌈 После дождя'],
  poll: ['📊 Да/Нет', '🗳️ Опрос', '❓ Вопрос', '📈 Рейтинг'],
  mention: ['@друг', '@admin', '@семья'],
  hashtag: ['#горхон', '#дом', '#семья', '#природа', '#отдых', '#работа']
};

export const musicTracks = [
  { id: '1', title: 'Летний день', artist: 'Местная группа', cover: '🎵', duration: 30 },
  { id: '2', title: 'Вечер в Горхоне', artist: 'Фольклор', cover: '🎶', duration: 45 },
  { id: '3', title: 'Природа зовет', artist: 'Инструментал', cover: '🎼', duration: 60 },
  { id: '4', title: 'Дружеские встречи', artist: 'Популярное', cover: '🎤', duration: 30 }
];

export const textColors = ['#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
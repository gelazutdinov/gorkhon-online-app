import { User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'current_user',
    username: 'Ваша история',
    avatar: 'https://cdn.poehali.dev/files/fd12f1e7-210f-419c-a05c-e739fb08162d.jpg',
    hasStory: false,
    isViewed: false,
  }
];

export const STICKER_CATEGORIES = {
  'Местоположение': [
    { id: 'loc_gorkhon', emoji: '📍', text: 'Горхон' },
    { id: 'loc_home', emoji: '🏠', text: 'Дом' },
    { id: 'loc_work', emoji: '🏢', text: 'Работа' },
    { id: 'loc_park', emoji: '🌲', text: 'Парк' },
    { id: 'loc_shop', emoji: '🏪', text: 'Магазин' },
    { id: 'loc_stop', emoji: '🚌', text: 'Остановка' }
  ],
  'Упоминание': [
    { id: 'mention_friend', emoji: '@', text: 'друг' },
    { id: 'mention_admin', emoji: '@', text: 'admin' },
    { id: 'mention_family', emoji: '@', text: 'семья' }
  ],
  'Музыка': [
    { id: 'music_note', emoji: '🎵', text: 'Музыка' },
    { id: 'music_dance', emoji: '💃', text: 'Танцы' },
    { id: 'music_party', emoji: '🎉', text: 'Вечеринка' }
  ],
  'Фото': [
    { id: 'photo_camera', emoji: '📷', text: 'Фото' },
    { id: 'photo_selfie', emoji: '🤳', text: 'Селфи' },
    { id: 'photo_memories', emoji: '📸', text: 'Воспоминания' }
  ],
  'GIF': [
    { id: 'gif_fire', emoji: '🔥', text: 'Fire' },
    { id: 'gif_heart', emoji: '❤️', text: 'Love' },
    { id: 'gif_laugh', emoji: '😂', text: 'LOL' }
  ],
  'Ваш ответ': [
    { id: 'response_yes', emoji: '✅', text: 'Да' },
    { id: 'response_no', emoji: '❌', text: 'Нет' },
    { id: 'response_maybe', emoji: '🤔', text: 'Может быть' }
  ],
  'Рамки': [
    { id: 'frame_1', emoji: '🖼️', text: 'Рамка 1', image: 'https://cdn.poehali.dev/files/b20af71f-0789-4747-8abb-7106428db9fe.jpg' },
    { id: 'frame_2', emoji: '🎨', text: 'Рамка 2' },
    { id: 'frame_3', emoji: '✨', text: 'Рамка 3' }
  ],
  'Размытие': [
    { id: 'blur_soft', emoji: '🌫️', text: 'Мягкое' },
    { id: 'blur_strong', emoji: '💨', text: 'Сильное' }
  ],
  'Вопросы': [
    { id: 'question_poll', emoji: '📊', text: 'Опрос' },
    { id: 'question_quiz', emoji: '❓', text: 'Викторина' },
    { id: 'question_ask', emoji: '💭', text: 'Задать вопрос' }
  ],
  'Вырезки': [
    { id: 'cut_heart', emoji: '💖', text: 'Сердце' },
    { id: 'cut_star', emoji: '⭐', text: 'Звезда' },
    { id: 'cut_circle', emoji: '⭕', text: 'Круг' }
  ],
  'Уведомить': [
    { id: 'notify_bell', emoji: '🔔', text: 'Напомнить' },
    { id: 'notify_alert', emoji: '⚠️', text: 'Важно' }
  ],
  'Шаблоны "Ваш ответ"': [
    { id: 'template_rate', emoji: '⭐', text: 'Оценить' },
    { id: 'template_choose', emoji: '🎯', text: 'Выбрать' }
  ],
  'Опрос': [
    { id: 'poll_ab', emoji: '🗳️', text: 'А или Б' },
    { id: 'poll_scale', emoji: '📊', text: 'Шкала' }
  ],
  'Ссылка': [
    { id: 'link_url', emoji: '🔗', text: 'Ссылка' },
    { id: 'link_site', emoji: '🌐', text: 'Сайт' }
  ],
  'Хэштег': [
    { id: 'hashtag_trend', emoji: '#', text: 'хэштег' },
    { id: 'hashtag_popular', emoji: '#', text: 'тренд' }
  ],
  'Обратный отсчет': [
    { id: 'countdown_timer', emoji: '⏰', text: 'Таймер' },
    { id: 'countdown_event', emoji: '📅', text: 'Событие' }
  ],
  'Текст': [
    { id: 'text_classic', emoji: 'Аа', text: 'Классический' },
    { id: 'text_modern', emoji: 'Аа', text: 'Современный' },
    { id: 'text_neon', emoji: 'Аа', text: 'Неоновый' }
  ],
  'Заказы еды': [
    { id: 'food_pizza', emoji: '🍕', text: 'Пицца' },
    { id: 'food_burger', emoji: '🍔', text: 'Бургер' },
    { id: 'food_sushi', emoji: '🍣', text: 'Суши' }
  ]
};

export const MUSIC_TRACKS = [
  {
    id: 'track_1',
    title: 'Летний день',
    artist: 'Местная группа',
    duration: 30,
    cover: '🎵'
  },
  {
    id: 'track_2', 
    title: 'Вечер в Горхоне',
    artist: 'Фольклор',
    duration: 45,
    cover: '🎶'
  },
  {
    id: 'track_3',
    title: 'Природа зовет',
    artist: 'Инструментал',
    duration: 60,
    cover: '🌲'
  },
  {
    id: 'track_4',
    title: 'Дружеские встречи',
    artist: 'Популярное',
    duration: 30,
    cover: '🎉'
  }
];

export const PHOTO_FILTERS = [
  { id: 'original', name: 'Оригинал', className: '' },
  { id: 'vivid', name: 'Яркий', className: 'filter-vivid' },
  { id: 'vintage', name: 'Винтаж', className: 'filter-vintage' },
  { id: 'bw', name: 'Ч/Б', className: 'filter-bw' },
  { id: 'warm', name: 'Теплый', className: 'filter-warm' },
  { id: 'cool', name: 'Холодный', className: 'filter-cool' },
  { id: 'dramatic', name: 'Драма', className: 'filter-dramatic' }
];

export const TEXT_STYLES = [
  { id: 'classic', name: 'Классик', style: { fontFamily: 'Arial, sans-serif', fontWeight: 'bold' } },
  { id: 'modern', name: 'Модерн', style: { fontFamily: 'Helvetica, sans-serif', fontWeight: '300', letterSpacing: '2px' } },
  { id: 'neon', name: 'Неон', style: { fontFamily: 'Impact, sans-serif', textShadow: '0 0 10px currentColor' } },
  { id: 'typewriter', name: 'Печатная', style: { fontFamily: 'Courier, monospace' } },
  { id: 'shadow', name: 'С тенью', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } },
  { id: 'gradient', name: 'Градиент', style: { background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }
];

export const TEXT_COLORS = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', 
  '#F9CA24', '#F0932B', '#EB4D4B', '#6C5CE7', '#A29BFE'
];

export const TEXT_ANIMATIONS = [
  { id: 'fade', name: 'Fade', className: 'animate-fade-in' },
  { id: 'slide', name: 'Slide', className: 'animate-slide-in' },
  { id: 'pulse', name: 'Pulse', className: 'animate-pulse' },
  { id: 'rotate', name: 'Rotate', className: 'animate-spin' },
  { id: 'zoom', name: 'Zoom', className: 'animate-zoom-in' }
];
// Иркутское время UTC+8
const IRKUTSK_TIMEZONE = 'Asia/Irkutsk';

export const formatTimeIrkutsk = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('ru-RU', {
    timeZone: IRKUTSK_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTimeIrkutsk = (date: Date = new Date()): string => {
  return date.toLocaleString('ru-RU', {
    timeZone: IRKUTSK_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateIrkutsk = (date: Date = new Date()): string => {
  return date.toLocaleDateString('ru-RU', {
    timeZone: IRKUTSK_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getCurrentTimeIrkutsk = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcTime + 8 * 60 * 60000);
};

export const getHourIrkutsk = (): number => {
  return parseInt(formatTimeIrkutsk().split(':')[0]);
};

export const getGreetingByTime = (): string => {
  const hour = getHourIrkutsk();
  
  if (hour >= 5 && hour < 12) {
    return 'Доброе утро';
  } else if (hour >= 12 && hour < 17) {
    return 'Добрый день';
  } else if (hour >= 17 && hour < 23) {
    return 'Добрый вечер';
  } else {
    return 'Доброй ночи';
  }
};

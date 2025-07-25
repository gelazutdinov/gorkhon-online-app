import { UserProfile } from '@/hooks/useUser';

export const mockUsers: UserProfile[] = [
  {
    id: 'user1',
    name: 'Анна Петрова',
    email: 'anna@example.com',
    phone: '+7 (999) 123-45-67',
    gender: 'female',
    birthDate: '1995-03-15',
    avatar: '👩‍💼',
    interests: ['Путешествия', 'Фотография', 'Книги', 'Кулинария'],
    status: 'Люблю исследовать новые места 🌍',
    registeredAt: Date.now() - 86400000 * 30,
    lastActiveAt: Date.now() - 3600000,
    stats: {
      totalSessions: 45,
      totalTimeSpent: 1200,
      sectionsVisited: { home: 20, news: 15, support: 5, profile: 8 },
      featuresUsed: { importantNumbers: 10, schedule: 8, donation: 2, workSchedule: 5, pvz: 7, notifications: 15 },
      daysActive: 25
    }
  },
  {
    id: 'user2',
    name: 'Михаил Сидоров',
    email: 'mikhail@example.com',
    phone: '+7 (999) 987-65-43',
    gender: 'male',
    birthDate: '1988-07-22',
    avatar: '👨‍💻',
    interests: ['Программирование', 'Спорт', 'Музыка', 'Технологии'],
    status: 'Код - это поэзия 💻',
    registeredAt: Date.now() - 86400000 * 60,
    lastActiveAt: Date.now() - 7200000,
    stats: {
      totalSessions: 80,
      totalTimeSpent: 2400,
      sectionsVisited: { home: 35, news: 25, support: 10, profile: 15 },
      featuresUsed: { importantNumbers: 20, schedule: 15, donation: 5, workSchedule: 12, pvz: 18, notifications: 30 },
      daysActive: 50
    }
  },
  {
    id: 'user3',
    name: 'Елена Коваленко',
    email: 'elena@example.com',
    phone: '+7 (999) 111-22-33',
    gender: 'female',
    birthDate: '1992-12-08',
    avatar: '🎨',
    interests: ['Искусство', 'Дизайн', 'Йога', 'Природа'],
    status: 'Творчество - моя страсть ✨',
    registeredAt: Date.now() - 86400000 * 15,
    lastActiveAt: Date.now() - 1800000,
    stats: {
      totalSessions: 25,
      totalTimeSpent: 800,
      sectionsVisited: { home: 12, news: 8, support: 3, profile: 5 },
      featuresUsed: { importantNumbers: 5, schedule: 4, donation: 1, workSchedule: 2, pvz: 6, notifications: 8 },
      daysActive: 12
    }
  },
  {
    id: 'user4',
    name: 'Дмитрий Волков',
    email: 'dmitry@example.com',
    phone: '+7 (999) 444-55-66',
    gender: 'male',
    birthDate: '1990-05-30',
    avatar: '🏃‍♂️',
    interests: ['Бег', 'Здоровье', 'Медитация', 'Путешествия'],
    status: 'В здоровом теле - здоровый дух 💪',
    registeredAt: Date.now() - 86400000 * 45,
    lastActiveAt: Date.now() - 5400000,
    stats: {
      totalSessions: 60,
      totalTimeSpent: 1800,
      sectionsVisited: { home: 28, news: 18, support: 7, profile: 12 },
      featuresUsed: { importantNumbers: 15, schedule: 12, donation: 3, workSchedule: 8, pvz: 14, notifications: 22 },
      daysActive: 35
    }
  }
];
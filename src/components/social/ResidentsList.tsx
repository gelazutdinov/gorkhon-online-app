import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import UserAvatar from '@/components/ui/UserAvatar';
import { UserProfile } from '@/hooks/useUser';

interface ResidentsListProps {
  currentUser: UserProfile;
  onUserSelect: (user: UserProfile) => void;
}

// Демо-данные жителей для примера
const generateMockResidents = (): UserProfile[] => {
  const names = [
    { first: 'Анна', last: 'Иванова', gender: 'female' as const },
    { first: 'Михаил', last: 'Петров', gender: 'male' as const },
    { first: 'Елена', last: 'Сидорова', gender: 'female' as const },
    { first: 'Александр', last: 'Козлов', gender: 'male' as const },
    { first: 'Мария', last: 'Волкова', gender: 'female' as const },
    { first: 'Дмитрий', last: 'Морозов', gender: 'male' as const },
    { first: 'Ольга', last: 'Новикова', gender: 'female' as const },
    { first: 'Сергей', last: 'Орлов', gender: 'male' as const },
    { first: 'Татьяна', last: 'Павлова', gender: 'female' as const },
    { first: 'Владимир', last: 'Кузнецов', gender: 'male' as const }
  ];

  const interests = [
    'Садоводство', 'Рыбалка', 'Кулинария', 'Чтение', 'Спорт', 
    'Музыка', 'Фотография', 'Путешествия', 'Рукоделие', 'Автомобили'
  ];

  const statuses = [
    'Люблю наш поселок!', 'Ветеран труда', 'Активный житель', 
    'Помогаю соседям', 'Организатор мероприятий', 'Просто хороший человек',
    'Пенсионер со стажем', 'Молодая мама', 'Студент', 'Работающий пенсионер'
  ];

  return names.map((name, index) => ({
    id: `resident_${index + 1}`,
    name: `${name.first} ${name.last}`,
    email: `${name.first.toLowerCase()}@gorkhon.ru`,
    phone: `+7 (999) ${String(123 + index).padStart(3, '0')}-${String(45 + index).padStart(2, '0')}-${String(67 + index).padStart(2, '0')}`,
    gender: name.gender,
    birthDate: new Date(1960 + Math.random() * 40, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    avatar: name.gender === 'female' ? '👩' : '👨',
    interests: interests.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 5) + 3),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    city: 'Горхон',
    about: `Живу в Горхоне уже ${Math.floor(Math.random() * 30) + 5} лет. ${name.gender === 'female' ? 'Люблю' : 'Люблю'} природу и общение с соседями.`,
    friends: [],
    isOnline: Math.random() > 0.6,
    registeredAt: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    lastActiveAt: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
    stats: {
      totalSessions: Math.floor(Math.random() * 100) + 10,
      totalTimeSpent: Math.floor(Math.random() * 500) + 50,
      sectionsVisited: {
        home: Math.floor(Math.random() * 50),
        news: Math.floor(Math.random() * 30),
        support: Math.floor(Math.random() * 20),
        profile: Math.floor(Math.random() * 40)
      },
      featuresUsed: {
        importantNumbers: Math.floor(Math.random() * 20),
        schedule: Math.floor(Math.random() * 15),
        donation: Math.floor(Math.random() * 5),
        workSchedule: Math.floor(Math.random() * 10),
        pvz: Math.floor(Math.random() * 8),
        notifications: Math.floor(Math.random() * 25)
      },
      daysActive: Math.floor(Math.random() * 180) + 30
    }
  }));
};

const ResidentsList = ({ currentUser, onUserSelect }: ResidentsListProps) => {
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'friends'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastActive' | 'age'>('name');

  useEffect(() => {
    // Загружаем жителей (в реальном приложении это будет API)
    const mockResidents = generateMockResidents();
    setResidents(mockResidents);
  }, []);

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getLastSeenText = (lastActiveAt: number, isOnline?: boolean) => {
    if (isOnline) return 'онлайн';
    
    const now = Date.now();
    const diff = now - lastActiveAt;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 5) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days === 1) return 'вчера';
    return `${days} дн назад`;
  };

  const filteredAndSortedResidents = residents
    .filter(resident => {
      // Исключаем текущего пользователя
      if (resident.id === currentUser.id) return false;
      
      // Фильтр по поиску
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return resident.name.toLowerCase().includes(query) ||
               resident.status?.toLowerCase().includes(query) ||
               resident.interests?.some(interest => interest.toLowerCase().includes(query));
      }
      
      // Фильтр по статусу
      switch (filter) {
        case 'online':
          return resident.isOnline;
        case 'friends':
          return currentUser.friends?.includes(resident.id) || false;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'lastActive':
          return (b.lastActiveAt || 0) - (a.lastActiveAt || 0);
        case 'age':
          return getAge(a.birthDate) - getAge(b.birthDate);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Icon name="Users" size={24} className="text-gorkhon-pink" />
          Жители Горхона
        </h2>
        <div className="text-sm text-gray-600">
          {filteredAndSortedResidents.length} человек
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по имени, статусу, интересам..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
        />
      </div>

      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Все', icon: 'Users' },
            { key: 'online', label: 'Онлайн', icon: 'Wifi' },
            { key: 'friends', label: 'Друзья', icon: 'Heart' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                filter === key
                  ? 'bg-gorkhon-pink text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon name={icon} size={14} />
              {label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="name">По имени</option>
          <option value="lastActive">По активности</option>
          <option value="age">По возрасту</option>
        </select>
      </div>

      {/* Список жителей */}
      <div className="space-y-3">
        {filteredAndSortedResidents.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="UserX" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Жители не найдены</p>
          </div>
        ) : (
          filteredAndSortedResidents.map((resident) => (
            <div
              key={resident.id}
              onClick={() => onUserSelect(resident)}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gorkhon-pink hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Аватар с индикатором онлайн */}
                <div className="relative">
                  <UserAvatar user={resident} size="md" />
                  {resident.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-800 group-hover:text-gorkhon-pink transition-colors">
                      {resident.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getAge(resident.birthDate)} лет
                    </span>
                  </div>

                  {resident.status && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {resident.status}
                    </p>
                  )}

                  {/* Интересы */}
                  {resident.interests && resident.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {resident.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {resident.interests.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                          +{resident.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Статус активности */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {getLastSeenText(resident.lastActiveAt, resident.isOnline)}
                    </span>
                    <div className="flex items-center gap-3">
                      {currentUser.friends?.includes(resident.id) && (
                        <span className="flex items-center gap-1 text-gorkhon-pink">
                          <Icon name="Heart" size={12} />
                          друг
                        </span>
                      )}
                      <Icon name="ChevronRight" size={14} className="text-gray-400 group-hover:text-gorkhon-pink transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Статистика */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="BarChart3" size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Статистика сообщества</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Всего жителей:</span>
            <span className="font-medium text-blue-800 ml-1">{residents.length + 1}</span>
          </div>
          <div>
            <span className="text-blue-600">Онлайн сейчас:</span>
            <span className="font-medium text-blue-800 ml-1">
              {residents.filter(r => r.isOnline).length + (currentUser.isOnline ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentsList;
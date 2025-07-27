import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface Resident {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age?: number;
  status?: string;
  interests: string[];
  lastActive: number;
  stats: {
    daysActive: number;
    totalSessions: number;
  };
}

interface ResidentsFeedProps {
  currentUser: UserProfile;
  onViewProfile: (resident: Resident) => void;
}

const ResidentsFeed = ({ currentUser, onViewProfile }: ResidentsFeedProps) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'new'>('all');

  useEffect(() => {
    // Генерируем примеры жителей
    const mockResidents: Resident[] = [
      {
        id: '1',
        name: 'Анна Петрова',
        gender: 'female',
        age: 28,
        status: 'Работаю в администрации поселка',
        interests: ['Садоводство', 'Чтение', 'Кулинария'],
        lastActive: Date.now() - 300000, // 5 минут назад
        stats: { daysActive: 45, totalSessions: 123 }
      },
      {
        id: '2',
        name: 'Михаил Иванов',
        gender: 'male',
        age: 35,
        status: 'Местный предприниматель',
        interests: ['Рыбалка', 'Спорт', 'Технологии'],
        lastActive: Date.now() - 3600000, // 1 час назад
        stats: { daysActive: 67, totalSessions: 234 }
      },
      {
        id: '3',
        name: 'Елена Сидорова',
        gender: 'female',
        age: 42,
        status: 'Учитель местной школы',
        interests: ['Искусство', 'Музыка', 'Путешествия'],
        lastActive: Date.now() - 7200000, // 2 часа назад
        stats: { daysActive: 89, totalSessions: 456 }
      },
      {
        id: '4',
        name: 'Дмитрий Козлов',
        gender: 'male',
        age: 25,
        status: 'Недавно переехал в Горхон',
        interests: ['Фотография', 'Спорт', 'Кино'],
        lastActive: Date.now() - 86400000, // 1 день назад
        stats: { daysActive: 3, totalSessions: 12 }
      },
      {
        id: '5',
        name: 'Ольга Морозова',
        gender: 'female',
        age: 38,
        status: 'Врач местной поликлиники',
        interests: ['Медицина', 'Природа', 'Рукоделие'],
        lastActive: Date.now() - 1800000, // 30 минут назад
        stats: { daysActive: 78, totalSessions: 345 }
      }
    ];

    setResidents(mockResidents);
  }, []);

  const getAvatarSilhouette = (gender: string) => {
    const isFemale = gender === 'female';
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center ${
        isFemale ? 'bg-gradient-to-br from-gorkhon-pink to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'
      }`}>
        <div className={`w-6 h-6 ${
          isFemale ? 'text-blue-100' : 'text-pink-100'
        } flex items-center justify-center`}>
          <svg width="24" height="24" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8c-6.627 0-12 5.373-12 12 0 4.411 2.387 8.257 5.926 10.361C21.724 32.768 18 37.187 18 42.5V56h28V42.5c0-5.313-3.724-9.732-7.926-12.139C41.613 28.257 44 24.411 44 20c0-6.627-5.373-12-12-12z"/>
            {isFemale && (
              <>
                <path d="M24 24c0 2 1 4 2 5s3 1 6 1 5 0 6-1 2-3 2-5" strokeWidth="1" stroke="currentColor" fill="none"/>
                <circle cx="28" cy="22" r="1"/>
                <circle cx="36" cy="22" r="1"/>
              </>
            )}
          </svg>
        </div>
      </div>
    );
  };

  const getActivityStatus = (lastActive: number) => {
    const now = Date.now();
    const diff = now - lastActive;
    
    if (diff < 600000) return { text: 'онлайн', color: 'bg-green-500' };
    if (diff < 3600000) return { text: 'недавно', color: 'bg-yellow-500' };
    if (diff < 86400000) return { text: 'сегодня', color: 'bg-orange-500' };
    return { text: 'давно', color: 'bg-gray-400' };
  };

  const getFilteredResidents = () => {
    let filtered = residents.filter(resident => 
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    switch (filterBy) {
      case 'active':
        filtered = filtered.filter(r => Date.now() - r.lastActive < 3600000);
        break;
      case 'new':
        filtered = filtered.filter(r => r.stats.daysActive < 7);
        break;
    }

    return filtered;
  };

  const filteredResidents = getFilteredResidents();

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Жители Горхона</h2>
        <p className="text-gray-600">Познакомьтесь с соседями и найдите единомышленников</p>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, статусу или интересам..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Все жители', icon: 'Users' },
            { key: 'active', label: 'Активные', icon: 'Zap' },
            { key: 'new', label: 'Новички', icon: 'UserPlus' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilterBy(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filterBy === key
                  ? 'bg-gorkhon-pink text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon name={icon} size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gorkhon-pink">{residents.length}</div>
          <div className="text-sm text-gray-600">всего жителей</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600">
            {residents.filter(r => Date.now() - r.lastActive < 3600000).length}
          </div>
          <div className="text-sm text-gray-600">онлайн</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {residents.filter(r => r.stats.daysActive < 7).length}
          </div>
          <div className="text-sm text-gray-600">новичков</div>
        </div>
      </div>

      {/* Список жителей */}
      <div className="space-y-4">
        {filteredResidents.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Жители не найдены</p>
            <p className="text-sm text-gray-400">Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          filteredResidents.map((resident) => {
            const activityStatus = getActivityStatus(resident.lastActive);
            
            return (
              <div
                key={resident.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onViewProfile(resident)}
              >
                <div className="flex items-start gap-4">
                  {/* Аватар */}
                  <div className="relative">
                    <div className="w-12 h-12 overflow-hidden">
                      {getAvatarSilhouette(resident.gender)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${activityStatus.color} rounded-full border-2 border-white`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {resident.name}
                        {resident.age && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            {resident.age} лет
                          </span>
                        )}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activityStatus.color === 'bg-green-500' ? 'bg-green-100 text-green-700' :
                        activityStatus.color === 'bg-yellow-500' ? 'bg-yellow-100 text-yellow-700' :
                        activityStatus.color === 'bg-orange-500' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activityStatus.text}
                      </span>
                    </div>

                    {resident.status && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {resident.status}
                      </p>
                    )}

                    {/* Интересы */}
                    {resident.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {resident.interests.slice(0, 3).map((interest, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gorkhon-pink/10 text-gorkhon-pink rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {resident.interests.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{resident.interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Статистика */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        <span>{resident.stats.daysActive} дн. активности</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MousePointer" size={12} />
                        <span>{resident.stats.totalSessions} посещений</span>
                      </div>
                    </div>
                  </div>

                  <Icon name="ChevronRight" size={20} className="text-gray-300" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResidentsFeed;
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { ResidentProfile } from '@/hooks/useSocialNetwork';

interface FriendsSearchProps {
  searchResults: ResidentProfile[];
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  getFriendshipStatus: (userId: string) => 'friends' | 'request_sent' | 'request_received' | 'none';
  onAcceptRequest: (userId: string) => void;
  onViewProfile: (user: ResidentProfile) => void;
}

const FriendsSearch = ({ 
  searchResults, 
  onSearch, 
  onSendRequest, 
  getFriendshipStatus,
  onAcceptRequest,
  onViewProfile
}: FriendsSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const getAvatarEmoji = (avatar: string): string => {
    const avatarMap: Record<string, string> = {
      default_male: '👨',
      default_female: '👩',
      businessman: '👨‍💼',
      businesswoman: '👩‍💼',
      worker: '👨‍🔧',
      worker_woman: '👩‍🔧',
      farmer: '👨‍🌾',
      farmer_woman: '👩‍🌾',
      teacher: '👨‍🏫',
      teacher_woman: '👩‍🏫',
      doctor: '👨‍⚕️',
      doctor_woman: '👩‍⚕️',
      artist: '👨‍🎨',
      artist_woman: '👩‍🎨',
      chef: '👨‍🍳',
      chef_woman: '👩‍🍳',
      oldman: '👴',
      oldwoman: '👵',
      boy: '👦',
      girl: '👧'
    };
    return avatarMap[avatar] || '👤';
  };

  const renderActionButton = (user: ResidentProfile) => {
    const status = getFriendshipStatus(user.id);
    
    switch (status) {
      case 'friends':
        return (
          <button
            disabled
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
          >
            <Icon name="UserCheck" size={14} />
            <span>В друзьях</span>
          </button>
        );
      case 'request_sent':
        return (
          <button
            disabled
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
          >
            <Icon name="Clock" size={14} />
            <span>Заявка отправлена</span>
          </button>
        );
      case 'request_received':
        return (
          <button
            onClick={() => onAcceptRequest(user.id)}
            className="px-3 py-1 bg-gorkhon-pink text-white rounded-full text-sm hover:bg-gorkhon-pink/90 transition-colors flex items-center gap-1"
          >
            <Icon name="UserPlus" size={14} />
            <span>Принять заявку</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => onSendRequest(user.id)}
            className="px-3 py-1 bg-gorkhon-blue text-white rounded-full text-sm hover:bg-gorkhon-blue/90 transition-colors flex items-center gap-1"
          >
            <Icon name="UserPlus" size={14} />
            <span>Добавить</span>
          </button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Поиск */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск жителей по имени или интересам..."
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gorkhon-pink text-white rounded-lg text-sm hover:bg-gorkhon-pink/90 transition-colors"
          >
            Найти
          </button>
        </div>
      </form>

      {/* Результаты поиска */}
      {isSearching ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gorkhon-pink"></div>
        </div>
      ) : searchQuery && searchResults.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">По запросу "{searchQuery}" никого не найдено</p>
          <p className="text-sm text-gray-400 mt-1">Попробуйте изменить запрос</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            Найдено жителей: {searchResults.length}
          </div>
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gorkhon-pink/30 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Аватар */}
                <button
                  onClick={() => onViewProfile(user)}
                  className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                >
                  {user.avatar.startsWith('data:') ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getAvatarEmoji(user.avatar)
                  )}
                </button>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onViewProfile(user)}
                    className="font-medium text-gray-800 hover:text-gorkhon-pink transition-colors text-left"
                  >
                    {user.name}
                  </button>
                  {user.status && (
                    <p className="text-sm text-gray-500 truncate">{user.status}</p>
                  )}
                  {user.interests && user.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.slice(0, 3).map((interest, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.interests.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{user.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Статус онлайн */}
                <div className="flex items-center gap-3">
                  {user.isOnline && (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-xs">онлайн</span>
                    </div>
                  )}
                  
                  {/* Кнопка действия */}
                  {renderActionButton(user)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Начните поиск, чтобы найти других жителей</p>
          <p className="text-sm text-gray-400 mt-1">Введите имя или интересы</p>
        </div>
      )}
    </div>
  );
};

export default FriendsSearch;
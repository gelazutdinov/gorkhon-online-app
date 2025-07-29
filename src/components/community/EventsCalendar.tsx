import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: 'cultural' | 'sport' | 'social' | 'official' | 'market';
  organizer: string;
  participants?: number;
  maxParticipants?: number;
  isUserEvent: boolean;
}

interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const EventsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'social' as Event['category']
  });

  const categories: EventCategory[] = [
    { id: 'all', name: 'Все события', icon: 'Calendar', color: 'bg-gray-100 text-gray-700' },
    { id: 'cultural', name: 'Культурные', icon: 'Music', color: 'bg-purple-100 text-purple-700' },
    { id: 'sport', name: 'Спортивные', icon: 'Trophy', color: 'bg-blue-100 text-blue-700' },
    { id: 'social', name: 'Социальные', icon: 'Users', color: 'bg-green-100 text-green-700' },
    { id: 'official', name: 'Официальные', icon: 'Building', color: 'bg-red-100 text-red-700' },
    { id: 'market', name: 'Ярмарки', icon: 'ShoppingBag', color: 'bg-orange-100 text-orange-700' }
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'День поселка Горхон',
      description: 'Праздничный концерт, выставка народных промыслов, спортивные соревнования и праздничная ярмарка',
      date: new Date('2024-08-15'),
      time: '10:00',
      location: 'Центральная площадь',
      category: 'cultural',
      organizer: 'Администрация поселка',
      participants: 150,
      maxParticipants: 300,
      isUserEvent: false
    },
    {
      id: '2',
      title: 'Турнир по волейболу',
      description: 'Открытый турнир среди команд жителей поселка. Регистрация до 10 августа',
      date: new Date('2024-08-12'),
      time: '14:00',
      location: 'Спортивная площадка',
      category: 'sport',
      organizer: 'Спортивный клуб "Горхон"',
      participants: 32,
      maxParticipants: 48,
      isUserEvent: false
    },
    {
      id: '3',
      title: 'Ярмарка выходного дня',
      description: 'Продажа свежих овощей, домашней выпечки и изделий местных мастеров',
      date: new Date('2024-08-03'),
      time: '09:00',
      location: 'Рынок, ул. Центральная',
      category: 'market',
      organizer: 'ИП Сидорова А.М.',
      isUserEvent: false
    },
    {
      id: '4',
      title: 'Субботник "Чистый Горхон"',
      description: 'Общественный субботник по уборке территории поселка. Приходите всей семьей!',
      date: new Date('2024-08-05'),
      time: '08:00',
      location: 'Сбор у администрации',
      category: 'social',
      organizer: 'Совет жителей',
      participants: 45,
      isUserEvent: false
    },
    {
      id: '5',
      title: 'Киновечер под звездами',
      description: 'Показ семейного фильма на открытом воздухе. Захватите пледы и попкорн!',
      date: new Date('2024-08-08'),
      time: '20:00',
      location: 'Парк у школы',
      category: 'cultural',
      organizer: 'Мария Петрова',
      participants: 25,
      maxParticipants: 100,
      isUserEvent: true
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      weekday: 'short'
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    
    // Здесь была бы логика сохранения события
    console.log('Новое событие:', newEvent);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'social'
    });
    setShowAddEvent(false);
  };

  const isEventToday = (eventDate: Date) => {
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  };

  const isEventUpcoming = (eventDate: Date) => {
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📅 События Горхона</h1>
            <p className="text-white/90">Календарь мероприятий и культурных событий</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name={viewMode === 'list' ? 'Calendar' : 'List'} size={20} />
              <span className="hidden sm:inline">
                {viewMode === 'list' ? 'Календарь' : 'Список'}
              </span>
            </button>
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name="Plus" size={20} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Фильтры категорий */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id 
                  ? category.color + ' scale-105 shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon name={category.icon as any} size={16} />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Список событий */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
            <Icon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">События не найдены</h3>
            <p className="text-gray-500">В выбранной категории пока нет запланированных событий</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const categoryInfo = getCategoryInfo(event.category);
            return (
              <div
                key={event.id}
                className={`bg-white rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl ${
                  isEventToday(event.date) 
                    ? 'border-gorkhon-pink bg-gradient-to-r from-pink-50 to-white' 
                    : isEventUpcoming(event.date)
                    ? 'border-gorkhon-green bg-gradient-to-r from-green-50 to-white'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Дата */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${categoryInfo.color}`}>
                      <span className="text-xs font-medium">
                        {event.date.toLocaleDateString('ru-RU', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="text-lg font-bold">
                        {event.date.getDate()}
                      </span>
                    </div>
                    {isEventToday(event.date) && (
                      <div className="mt-1 text-xs font-medium text-gorkhon-pink">
                        Сегодня!
                      </div>
                    )}
                  </div>

                  {/* Информация о событии */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={16} />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={16} />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={16} />
                            {event.organizer}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.name}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {event.participants !== undefined && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Icon name="Users" size={16} />
                            {event.participants}
                            {event.maxParticipants && ` / ${event.maxParticipants}`}
                            {' участников'}
                          </span>
                        )}
                        {event.isUserEvent && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            👤 Пользовательское
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-gorkhon-pink hover:text-gorkhon-green transition-colors">
                          <Icon name="Heart" size={16} />
                          Участвую
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                          <Icon name="Share2" size={16} />
                          Поделиться
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модальное окно добавления события */}
      {showAddEvent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddEvent(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">🎉 Добавить мероприятие</h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название мероприятия</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Например: Концерт местных талантов"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Дата</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Время</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Место проведения</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Например: Центральная площадь"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as Event['category'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent"
                  >
                    <option value="cultural">Культурное</option>
                    <option value="sport">Спортивное</option>
                    <option value="social">Социальное</option>
                    <option value="market">Ярмарка</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Подробно опишите мероприятие, что будет происходить..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gorkhon-pink focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                  className="flex-1 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Создать мероприятие
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCalendar;
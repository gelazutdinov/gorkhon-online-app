import { useState } from 'react';
import Icon from '@/components/ui/icon';
import UserAvatar from '@/components/ui/UserAvatar';
import { UserProfile } from '@/hooks/useUser';

interface ResidentProfileProps {
  resident: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onAddFriend?: (userId: string) => void;
  onRemoveFriend?: (userId: string) => void;
  onSendMessage?: (userId: string) => void;
}

const ResidentProfile = ({ 
  resident, 
  currentUser, 
  onClose, 
  onAddFriend, 
  onRemoveFriend, 
  onSendMessage 
}: ResidentProfileProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'activity'>('info');

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
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'только что';
    if (hours < 24) return `${hours} ч назад`;
    if (days === 1) return 'вчера';
    return `${days} дн назад`;
  };

  const getTimeWithUs = () => {
    const days = Math.floor((Date.now() - resident.registeredAt) / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} дней`;
    if (days < 365) return `${Math.floor(days / 30)} месяцев`;
    return `${Math.floor(days / 365)} лет`;
  };

  const isFriend = currentUser.friends?.includes(resident.id) || false;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-2xl">
        <h2 className="text-xl font-semibold text-gray-800">Профиль жителя</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Основная информация */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <UserAvatar user={resident} size="xl" className="shadow-lg" />
            {resident.isOnline && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-1">{resident.name}</h3>
          
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Icon name="MapPin" size={16} />
            <span>{resident.city || 'Горхон'}</span>
            <span>•</span>
            <span>{getAge(resident.birthDate)} лет</span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {getLastSeenText(resident.lastActiveAt, resident.isOnline)}
          </p>

          {resident.status && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-gray-700 italic">"{resident.status}"</p>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-3 justify-center">
            {onSendMessage && (
              <button
                onClick={() => onSendMessage(resident.id)}
                className="flex items-center gap-2 px-4 py-2 bg-gorkhon-pink text-white rounded-lg hover:bg-gorkhon-pink/90 transition-colors"
              >
                <Icon name="MessageCircle" size={16} />
                Написать
              </button>
            )}
            
            {isFriend ? (
              onRemoveFriend && (
                <button
                  onClick={() => onRemoveFriend(resident.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Icon name="UserMinus" size={16} />
                  Удалить из друзей
                </button>
              )
            ) : (
              onAddFriend && (
                <button
                  onClick={() => onAddFriend(resident.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gorkhon-green text-white rounded-lg hover:bg-gorkhon-green/90 transition-colors"
                >
                  <Icon name="UserPlus" size={16} />
                  Добавить в друзья
                </button>
              )
            )}
          </div>
        </div>

        {/* Вкладки */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {[
              { key: 'info', label: 'Информация', icon: 'User' },
              { key: 'stats', label: 'Статистика', icon: 'BarChart3' },
              { key: 'activity', label: 'Активность', icon: 'Activity' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === key
                    ? 'bg-gorkhon-pink text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon name={icon} size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* О себе */}
            {resident.about && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={16} className="text-gorkhon-pink" />
                  О себе
                </h4>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                  {resident.about}
                </p>
              </div>
            )}

            {/* Контактная информация */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Contact" size={16} className="text-gorkhon-pink" />
                Контакты
              </h4>
              <div className="space-y-2">
                {resident.email && (
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{resident.email}</span>
                  </div>
                )}
                {resident.phone && (
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={16} className="text-gray-400" />
                    <span className="text-gray-600">{resident.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(resident.birthDate).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Интересы */}
            {resident.interests && resident.interests.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Icon name="Heart" size={16} className="text-gorkhon-pink" />
                  Интересы
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resident.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gorkhon-pink/10 text-gorkhon-pink rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Основная статистика */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Icon name="Calendar" size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{getTimeWithUs()}</div>
                <div className="text-sm text-gray-600">с нами</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Icon name="Activity" size={24} className="text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{resident.stats?.daysActive || 0}</div>
                <div className="text-sm text-gray-600">активных дней</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Icon name="BarChart3" size={24} className="text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{resident.stats?.totalSessions || 0}</div>
                <div className="text-sm text-gray-600">сессий</div>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Icon name="Clock" size={24} className="text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {Math.floor((resident.stats?.totalTimeSpent || 0) / 60)}ч
                </div>
                <div className="text-sm text-gray-600">времени</div>
              </div>
            </div>

            {/* Использование функций */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Zap" size={16} className="text-gorkhon-pink" />
                Использование функций
              </h4>
              <div className="space-y-2">
                {Object.entries(resident.stats?.featuresUsed || {}).map(([feature, count]) => {
                  const featureNames: Record<string, string> = {
                    importantNumbers: 'Важные номера',
                    schedule: 'Расписание',
                    donation: 'Помощь поселку',
                    workSchedule: 'Режим работы',
                    pvz: 'Пункты выдачи',
                    notifications: 'Уведомления'
                  };
                  
                  const maxCount = Math.max(...Object.values(resident.stats?.featuresUsed || {}));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={feature} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{featureNames[feature]}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {/* Посещение разделов */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Navigation" size={16} className="text-gorkhon-pink" />
                Активность по разделам
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(resident.stats?.sectionsVisited || {}).map(([section, visits]) => {
                  const sectionNames: Record<string, string> = {
                    home: 'Главная',
                    news: 'Новости',
                    support: 'Поддержка',
                    profile: 'Профиль'
                  };
                  
                  const sectionIcons: Record<string, string> = {
                    home: 'Home',
                    news: 'Newspaper',
                    support: 'HelpCircle',
                    profile: 'User'
                  };
                  
                  return (
                    <div key={section} className="bg-gray-50 rounded-lg p-3 text-center">
                      <Icon name={sectionIcons[section]} size={20} className="text-gray-600 mx-auto mb-1" />
                      <div className="font-medium text-gray-800">{visits}</div>
                      <div className="text-xs text-gray-600">{sectionNames[section]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Информация о регистрации */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Icon name="Info" size={16} />
                Информация о регистрации
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Дата регистрации: {new Date(resident.registeredAt).toLocaleDateString('ru-RU')}</div>
                <div>Последняя активность: {new Date(resident.lastActiveAt).toLocaleDateString('ru-RU')}</div>
                <div>Статус: {resident.isOnline ? 'Онлайн' : 'Не в сети'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentProfile;
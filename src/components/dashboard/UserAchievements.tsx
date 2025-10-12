import Icon from '@/components/ui/icon';
import { UserProfile } from '@/types/user';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: UserProfile) => boolean;
  progress?: (user: UserProfile) => { current: number; target: number };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievementsProps {
  user: UserProfile;
  onClose: () => void;
}

const achievements: Achievement[] = [
  {
    id: 'first_steps',
    name: 'Первые шаги',
    description: 'Зарегистрировались на платформе',
    icon: 'UserPlus',
    condition: () => true,
    rarity: 'common'
  },
  {
    id: 'active_week',
    name: 'Активная неделя',
    description: 'Посещали платформу 7 дней подряд',
    icon: 'Calendar',
    condition: (user) => user.stats.daysActive >= 7,
    rarity: 'common'
  },
  {
    id: 'veteran',
    name: 'Ветеран',
    description: 'Месяц на платформе',
    icon: 'Clock',
    condition: (user) => {
      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      return user.registeredAt <= monthAgo;
    },
    rarity: 'rare'
  },
  {
    id: 'explorer',
    name: 'Исследователь',
    description: 'Посетили все разделы платформы',
    icon: 'Compass',
    condition: (user) => {
      const sections = user.stats.sectionsVisited || {};
      const requiredSections = ['home', 'news', 'support', 'profile'];
      return requiredSections.every(section => sections[section] > 0);
    },
    rarity: 'rare'
  },
  {
    id: 'power_user',
    name: 'Продвинутый пользователь',
    description: 'Совершили 100 действий',
    icon: 'Zap',
    condition: (user) => {
      const totalActions = Object.values(user.stats?.featuresUsed || {})
        .reduce((sum, count) => sum + count, 0);
      return totalActions >= 100;
    },
    progress: (user) => {
      const totalActions = Object.values(user.stats?.featuresUsed || {})
        .reduce((sum, count) => sum + count, 0);
      return { current: totalActions, target: 100 };
    },
    rarity: 'epic'
  },
  {
    id: 'social_butterfly',
    name: 'Общительный',
    description: 'Активно использовали уведомления',
    icon: 'MessageCircle',
    condition: (user) => (user.stats?.featuresUsed?.notifications || 0) >= 20,
    progress: (user) => ({
      current: user.stats?.featuresUsed?.notifications || 0,
      target: 20
    }),
    rarity: 'rare'
  },
  {
    id: 'master',
    name: 'Мастер платформы',
    description: 'Достигли максимального уровня активности',
    icon: 'Crown',
    condition: (user) => {
      const totalActions = Object.values(user.stats?.featuresUsed || {})
        .reduce((sum, count) => sum + count, 0);
      return totalActions >= 200 && user.stats.daysActive >= 30;
    },
    progress: (user) => {
      const totalActions = Object.values(user.stats?.featuresUsed || {})
        .reduce((sum, count) => sum + count, 0);
      const actionsProgress = Math.min(totalActions / 200, 1);
      const daysProgress = Math.min(user.stats.daysActive / 30, 1);
      return { 
        current: Math.floor((actionsProgress + daysProgress) * 50), 
        target: 100 
      };
    },
    rarity: 'legendary'
  },
  {
    id: 'data_conscious',
    name: 'Заботливый к данным',
    description: 'Экспортировали свои данные',
    icon: 'Download',
    condition: () => {
      const exportHistory = localStorage.getItem('gorkhon_export_history');
      return !!exportHistory;
    },
    rarity: 'rare'
  }
];

const UserAchievements = ({ user, onClose }: UserAchievementsProps) => {
  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'epic':
        return 'shadow-purple-200';
      case 'legendary':
        return 'shadow-orange-200';
      default:
        return '';
    }
  };

  const unlockedAchievements = achievements.filter(achievement => 
    achievement.condition(user)
  );
  
  const lockedAchievements = achievements.filter(achievement => 
    !achievement.condition(user)
  );

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.progress) return 0;
    const { current, target } = achievement.progress(user);
    return Math.min((current / target) * 100, 100);
  };

  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Достижения</h2>
          <p className="text-sm text-gray-600">
            Разблокировано {unlockedAchievements.length} из {achievements.length} ({completionRate}%)
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Прогресс-бар общего прогресса */}
      <div className="p-6 pb-4">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Общий прогресс</span>
          <span>{completionRate}%</span>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Разблокированные достижения */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Star" size={20} className="text-yellow-500" />
              Разблокированные ({unlockedAchievements.length})
            </h3>
            <div className="space-y-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 border-2 rounded-xl transition-all ${getRarityStyle(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.rarity === 'legendary' 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                        : 'bg-white/70'
                    }`}>
                      <Icon name={achievement.icon as any} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                      </div>
                      <p className="text-sm opacity-90">{achievement.description}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                          {achievement.rarity === 'common' && 'Обычное'}
                          {achievement.rarity === 'rare' && 'Редкое'}
                          {achievement.rarity === 'epic' && 'Эпическое'}
                          {achievement.rarity === 'legendary' && 'Легендарное'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Заблокированные достижения */}
        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Lock" size={20} className="text-gray-400" />
              В прогрессе ({lockedAchievements.length})
            </h3>
            <div className="space-y-3">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <Icon name={achievement.icon as any} size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-600">{achievement.name}</h4>
                        <Icon name="Lock" size={16} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      
                      {/* Прогресс-бар для достижений с прогрессом */}
                      {achievement.progress && (
                        <div className="mt-3">
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-gorkhon-pink to-gorkhon-green transition-all duration-500"
                              style={{ width: `${getProgressPercentage(achievement)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Прогресс</span>
                            <span>
                              {achievement.progress(user).current} / {achievement.progress(user).target}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                          {achievement.rarity === 'common' && 'Обычное'}
                          {achievement.rarity === 'rare' && 'Редкое'}
                          {achievement.rarity === 'epic' && 'Эпическое'}
                          {achievement.rarity === 'legendary' && 'Легендарное'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Мотивационное сообщение */}
        <div className="mt-6 bg-gradient-to-r from-gorkhon-pink to-gorkhon-green rounded-xl p-4 text-white">
          <div className="flex items-start gap-3">
            <Icon name="Trophy" size={24} className="mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Отличная работа!</h4>
              <p className="text-sm text-white/90">
                {completionRate === 100 
                  ? 'Поздравляем! Вы разблокировали все достижения!'
                  : `Продолжайте использовать платформу, чтобы разблокировать ${lockedAchievements.length} оставшихся достижений.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAchievements;
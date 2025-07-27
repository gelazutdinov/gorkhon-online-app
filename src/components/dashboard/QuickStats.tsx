import Icon from '@/components/ui/icon';
import { UserProfile } from '@/hooks/useUser';

interface QuickStatsProps {
  user: UserProfile;
  daysWithUs: number;
  formattedTimeSpent: string;
}

const QuickStats = ({ user, daysWithUs, formattedTimeSpent }: QuickStatsProps) => {
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = user.stats?.dailySessions?.[today] || 0;
    const todayTime = user.stats?.dailyTime?.[today] || 0;
    
    return {
      sessions: todaySessions,
      timeMinutes: Math.floor(todayTime / (1000 * 60))
    };
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let weeklyTime = 0;
    let weeklySessions = 0;
    
    for (let d = new Date(weekAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toDateString();
      weeklyTime += user.stats?.dailyTime?.[dateStr] || 0;
      weeklySessions += user.stats?.dailySessions?.[dateStr] || 0;
    }
    
    return {
      sessions: weeklySessions,
      timeMinutes: Math.floor(weeklyTime / (1000 * 60))
    };
  };

  const getMostActiveDay = () => {
    const dailyTime = user.stats?.dailyTime || {};
    const entries = Object.entries(dailyTime);
    
    if (entries.length === 0) return 'Нет данных';
    
    const [mostActiveDate] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    const date = new Date(mostActiveDate);
    
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  };

  const getActivityTrend = () => {
    const dailyTime = user.stats?.dailyTime || {};
    const dates = Object.keys(dailyTime).sort();
    
    if (dates.length < 2) return 'stable';
    
    const recentDates = dates.slice(-7); // Последние 7 дней
    const firstHalf = recentDates.slice(0, Math.ceil(recentDates.length / 2));
    const secondHalf = recentDates.slice(Math.ceil(recentDates.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, date) => sum + (dailyTime[date] || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, date) => sum + (dailyTime[date] || 0), 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) return 'up';
    if (secondAvg < firstAvg * 0.9) return 'down';
    return 'stable';
  };

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const trend = getActivityTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up': return 'Активность растет';
      case 'down': return 'Активность снижается';
      default: return 'Стабильная активность';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Быстрая статистика</h3>
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          <Icon name={getTrendIcon() as any} size={16} />
          <span>{getTrendText()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Сегодня */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Сегодня</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">{todayStats.sessions}</div>
            <div className="text-sm text-blue-600">
              {todayStats.sessions === 1 ? 'посещение' : 'посещений'}
            </div>
            <div className="text-xs text-blue-500">
              {todayStats.timeMinutes} мин. активности
            </div>
          </div>
        </div>

        {/* За неделю */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="BarChart3" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">За неделю</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{weeklyStats.sessions}</div>
            <div className="text-sm text-green-600">
              {weeklyStats.sessions === 1 ? 'посещение' : 'посещений'}
            </div>
            <div className="text-xs text-green-500">
              {Math.floor(weeklyStats.timeMinutes / 60)}ч {weeklyStats.timeMinutes % 60}м
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Icon name="Star" size={14} className="text-purple-600" />
          <div>
            <div className="font-medium text-gray-800">Активный день</div>
            <div className="text-gray-600">{getMostActiveDay()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Icon name="Clock" size={14} className="text-orange-600" />
          <div>
            <div className="font-medium text-gray-800">Всего времени</div>
            <div className="text-gray-600">{formattedTimeSpent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
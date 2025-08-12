import React from 'react';
import Icon from '@/components/ui/icon';

interface Stat {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  bgColor: string;
}

interface StatsOverviewProps {
  stats: Stat[];
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, className = '' }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <Icon name={stat.icon as any} size={16} className={`sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(stat.trend)}`}>
              <Icon name={getTrendIcon(stat.trend) as any} size={12} className="sm:w-4 sm:h-4" />
              <span className="text-xs">{stat.change}</span>
            </div>
          </div>
          
          <div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors truncate">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
              {stat.label}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-3 sm:mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${stat.color.replace('text-', 'bg-')} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: '75%', animationDelay: `${index * 200}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
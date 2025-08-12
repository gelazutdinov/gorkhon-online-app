import React from 'react';
import Icon from '@/components/ui/icon';

interface ActivityData {
  day: string;
  sessions: number;
  timeSpent: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  className?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, className = '' }) => {
  const maxSessions = Math.max(...data.map(d => d.sessions));
  const maxTime = Math.max(...data.map(d => d.timeSpent));
  
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Активность за неделю</h3>
          <p className="text-sm text-gray-600">Сессии и время использования</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon name="TrendingUp" size={20} className="text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const sessionHeight = (item.sessions / maxSessions) * 100;
          const timeHeight = (item.timeSpent / maxTime) * 100;
          
          return (
            <div key={item.day} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-gray-600">
                {item.day}
              </div>
              
              {/* Sessions bar */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Users" size={14} className="text-blue-500" />
                  <span className="text-xs text-gray-500">Сессии: {item.sessions}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${sessionHeight}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              </div>
              
              {/* Time bar */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={14} className="text-green-500" />
                  <span className="text-xs text-gray-500">Время: {item.timeSpent}ч</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${timeHeight}%`,
                      animationDelay: `${index * 150}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          <span className="text-xs text-gray-600">Сессии</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
          <span className="text-xs text-gray-600">Время</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;